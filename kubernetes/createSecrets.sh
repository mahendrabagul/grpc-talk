kubectl create namespace infranauts-meetup
kubectl -n infranauts-meetup create secret generic grpc-client-certificates --from-file=../certificates/clientCertificates/grpc-client.crt --from-file=../certificates/clientCertificates/grpc-client.key --from-file=../certificates/certificatesChain/grpc-root-ca-and-grpc-client-ca-and-grpc-server-ca-chain.crt
kubectl -n infranauts-meetup create secret generic grpc-root-ca-and-grpc-server-ca-certificates --from-file=../certificates/rootCA/grpc-root-ca.crt --from-file=../certificates/rootCA/grpc-root-ca.key --from-file=../certificates/serverCA/grpc-server-ca.crt --from-file=../certificates/serverCA/grpc-server-ca.key
kubectl -n infranauts-meetup create secret generic grpc-server-certificates --from-file=../certificates/serverCertificates/grpc-server.crt --from-file=../certificates/serverCertificates/grpc-server.key --from-file=../certificates/certificatesChain/grpc-root-ca-and-grpc-server-ca-chain.crt