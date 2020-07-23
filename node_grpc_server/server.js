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

let credentials = grpc.ServerCredentials.createSsl(
    fs.readFileSync('../certificates/certificatesChain/grpc-root-ca-and-grpc-server-ca-chain.crt'), [{
        cert_chain: fs.readFileSync('../certificates/serverCertificates/grpc-server.crt'),
        private_key: fs.readFileSync('../certificates/serverCertificates/grpc-server.key')
    }], true);


function getDetails(call, callback) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(JSON.stringify(call.metadata._internal_repr.cluster_id_value));
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    callback(null, {message: _.find(employees, {id: call.request.id})});
}

const server = new grpc.Server();
server.addService(EmployeeService.service, {getDetails: getDetails});
server.bind(`0.0.0.0:50051`, credentials);
// server.bind(`0.0.0.0:${process.env.SERVER_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();
console.info('GRPC server started at port', 50051);
