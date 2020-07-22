const PROTO_PATH = __dirname + '/employee.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
let channel_options = {
  // 'grpc.ssl_target_name_override' : 'localhost',
  // 'grpc.default_authority': 'localhost'
};
// const credentials = grpc.credentials.createSsl(
//   fs.readFileSync('../FinalConfigFiles/ca-and-services-ca-chain.hitachivantara.com.crt'),
//   fs.readFileSync('../FinalConfigFiles/hksclient.key'),
//   fs.readFileSync('../FinalConfigFiles/hksclient.crt')
// );
// const credentials = grpc.credentials.createSsl(
//   fs.readFileSync('./Certs/grpc-root-ca-and-cluster-id-ca-grpc-services-ca-chain.crt'),
//   fs.readFileSync('./Certs/client.key'),
//   fs.readFileSync('./Certs/client.crt')
// );
// const credentials = grpc.credentials.createSsl(
//   fs.readFileSync('/home/mahendrabagul/DevEnv/Hitachi/Mix/OpensslPoC/Secrets/FinalCerts/test/myCA.pem'),
//   fs.readFileSync('/home/mahendrabagul/DevEnv/Hitachi/Mix/OpensslPoC/Secrets/FinalCerts/test/client.key'),
//   fs.readFileSync('/home/mahendrabagul/DevEnv/Hitachi/Mix/OpensslPoC/Secrets/FinalCerts/test/client.crt')
// );
 let generateCredentials = () => {
  let credentials = grpc.credentials.createSsl(
    fs.readFileSync('./Certs/grpc-root-ca-and-cluster-id-ca-grpc-services-ca-chain.crt'),
    fs.readFileSync('./Certs/client.key'),
    fs.readFileSync('./Certs/client.crt')
  );
  const clusterInfoCreds = grpc.credentials.createFromMetadataGenerator((args, callback) => {
    const metadata = new grpc.Metadata();
    metadata.add('CLUSTER_ID_VALUE', '6fe12610-3d06-4f4f-944b-9be83a309e9e');
    callback(null, metadata);
  });
  credentials = grpc.credentials.combineChannelCredentials(credentials, clusterInfoCreds);
  return credentials;
}

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

function main() {
    // let client = new EmployeeService('rebrand-hec-proxygrpc.labgsd.com:443', credentials, channel_options);
    let client = new EmployeeService('localhost:50051', generateCredentials(), channel_options);

    let employeeId;
    if (process.argv.length >= 3) {
      employeeId = process.argv[2];
    } else {
      employeeId = 2;
    }
    client.getDetails({id: employeeId}, function(err, response) {
      console.log('Employee Details for Employee Id:',employeeId,'\n' ,response);
    });
}

main();