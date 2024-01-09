const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var todoService = protoDescriptor.TodoService;

// const todosProto = grpc.load('todo.proto');

const server = new grpc.Server();

const todos = [
    {
        id: '1', title: 'Todo1', content: 'Content of Todo 1'
    },
    {
        id: '2', title: 'Todo2', content: 'Content of Todo 2'
    }
];

server.addService(todoService.service, {
    listTodos: (call, callback) => {
        callback (null, {
            todos: todos
        });
    },
    createTodo: (call, callback) => {
        let incomingNewTodo = call.request
        todos.push(incomingNewTodo);
        console.log(todos);
        callback (null, incomingNewTodo);  // null is the error
    },
    getTodo: (call, callback) => {
        let incomingId = call.request;
        let todoId = incomingId.id;
        const response = todos.filter((todos) => todos.id = todoId)
        if(response.length > 0){
            callback(null, response);
        } else {
            callback({
                message: 'Todo Not Found'
            })
        }
    }
});


server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server Started');
    server.start();
});