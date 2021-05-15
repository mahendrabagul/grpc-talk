kubectl delete namespace infranauts-meetup
kubectl create namespace infranauts-meetup
kubectl -n infranauts-meetup create secret generic grpc-client-certificates \
  --from-file=./clientCertificates/grpc-client.crt \
  --from-file=./clientCertificates/grpc-client.key \
  --from-file=./certificatesChain/grpc-root-ca-and-grpc-server-ca-and-grpc-client-ca-chain.crt

kubectl -n infranauts-meetup create secret generic grpc-root-ca-and-grpc-server-ca-certificates \
  --from-file=./rootCA/grpc-root-ca.crt \
  --from-file=./rootCA/grpc-root-ca.key \
  --from-file=./serverCA/grpc-server-ca.crt \
  --from-file=./serverCA/grpc-server-ca.key

kubectl -n infranauts-meetup create secret generic grpc-server-certificates \
  --from-file=./serverCertificates/grpc-server.crt \
  --from-file=./serverCertificates/grpc-server.key \
  --from-file=./certificatesChain/grpc-root-ca-and-grpc-server-ca-chain.crt

kubectl -n infranauts-meetup create secret generic grpc-ingress-server-certificates \
  --from-file=tls.crt=./serverCertificates/grpc-server.crt \
  --from-file=tls.key=./serverCertificates/grpc-server.key \
  --from-file=ca.crt=./certificatesChain/grpc-root-ca-and-grpc-server-ca-chain.crt
