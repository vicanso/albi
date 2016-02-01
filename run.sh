make init

make test

make build

docker build -t albi .

docker run -d --restart=always -e="LOG=timtam://192.168.2.1:7001" -e="NODE_ENV=production" -e="ETCD=http://192.168.2.1:2379" albi