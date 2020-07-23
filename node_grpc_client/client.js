const PROTO_PATH = __dirname + '/employee.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
let channel_options = {
    // 'grpc.ssl_target_name_override' : 'localhost',
    // 'grpc.default_authority': 'localhost'
};
let generateCredentials = () => {
    let credentials = grpc.credentials.createSsl(
        fs.readFileSync('../certificates/certificatesChain/grpc-root-ca-and-grpc-client-ca-and-grpc-server-ca-chain.crt'),
        fs.readFileSync('../certificates/clientCertificates/grpc-client.key'),
        fs.readFileSync('../certificates/clientCertificates/grpc-client.crt')
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
    // let client = new EmployeeService('rebrand-hec-proxygrpc.labgsd.com:443', generateCredentials(), channel_options);
    let client = new EmployeeService('localhost:50051', generateCredentials(), channel_options);

    let employeeId;
    if (process.argv.length >= 3) {
        employeeId = process.argv[2];
    } else {
        employeeId = 2;
    }
    client.getDetails({id: employeeId}, function (err, response) {
        console.log('Employee Details for Employee Id:', employeeId, '\n', response);
    });
}

main();