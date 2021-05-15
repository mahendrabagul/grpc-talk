const PROTO_PATH = __dirname + '/employee.proto';
let {employees} = require('./data.js');
const fs = require('fs');
const grpc = require('@grpc/grpc-js');
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
let EmployeeService = grpc.loadPackageDefinition(
    packageDefinition).employee.EmployeeService;

//let credentials = grpc.ServerCredentials.createSsl(
//    fs.readFileSync('/app/Certs/grpc-root-ca-and-grpc-server-ca-chain.crt'), [{
//    cert_chain: fs.readFileSync('/app/Certs/grpc-server.crt'),
//    private_key: fs.readFileSync('/app/Certs/grpc-server.key')
//}], false);

let credentials = grpc.ServerCredentials.createSsl(
    fs.readFileSync(
        '../certificates/certificatesChain/grpc-root-ca-and-grpc-server-ca-chain.crt'),
    [{
      cert_chain: fs.readFileSync(
          '../certificates/serverCertificates/grpc-server.crt'),
      private_key: fs.readFileSync(
          '../certificates/serverCertificates/grpc-server.key')
    }], true);

function getDetails(call, callback) {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(JSON.stringify(call));
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  callback(null, {message: _.find(employees, {id: call.request.id})});
}

const server = new grpc.Server();
server.addService(EmployeeService.service, {getDetails: getDetails});
if (process.env.IS_SECURED && JSON.parse(process.env.IS_SECURED)) {
  console.log("Secured Server")
  server.bindAsync(`0.0.0.0:${process.env.SERVER_PORT}`, credentials, () => {
    server.start();
  });
} else {
  console.log("InSecured Server")
  server.bindAsync(`0.0.0.0:${process.env.SERVER_PORT}`,
      grpc.ServerCredentials.createInsecure(), () => {
        server.start();
      });
}

console.info('----------------------------------------------');
console.info('isSecured: ', `${process.env.IS_SECURED}`);
console.info(`GRPC server started at port:`, `${process.env.SERVER_PORT}`);
console.info('----------------------------------------------');
