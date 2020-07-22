const PROTO_PATH = __dirname + '/employee.proto';
let {employees} = require('./data.js');
const fs = require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);
let EmployeeService = grpc.loadPackageDefinition(packageDefinition).employee.EmployeeService;

// let credentials = grpc.ServerCredentials.createSsl(
//     fs.readFileSync('/app/Certs/grpc-root-ca-and-grpc-services-ca-chain.crt'), [{
//     cert_chain: fs.readFileSync('/app/Certs/grpc-proxy-server.crt'),
//     private_key: fs.readFileSync('/app/Certs/grpc-proxy-server.key')
// }], false);

let credentials = grpc.ServerCredentials.createSsl(
    fs.readFileSync('./Certs/grpc-root-ca-and-grpc-services-ca-chain.crt'), [{
    cert_chain: fs.readFileSync('./Certs/grpc-proxy-server.crt'),
    private_key: fs.readFileSync('./Certs/grpc-proxy-server.key')
}], true);


function getDetails(call, callback) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(call.metadata._internal_repr.cluster_id.toString());
    console.log(JSON.stringify(call.metadata._internal_repr.cluster_id));
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    callback(null, {message: _.find(employees, {id: call.request.id})});
}

const server = new grpc.Server();
server.addService(EmployeeService.service, {getDetails: getDetails});
server.bind(`0.0.0.0:50051`, credentials);
// server.bind(`0.0.0.0:${process.env.SERVER_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();
console.info('GRPC server started at port', 50051);
