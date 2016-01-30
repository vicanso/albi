docker build -t albi .

docker run -d --restart=always -e="LOG=timtam://192.168.31.2:7001" -e="NODE_ENV=production" -e="ETCD=http://192.168.31.2:2379" albi