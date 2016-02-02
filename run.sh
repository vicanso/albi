npm run init

npm run test

npm run build

docker build -t albi .

docker run -d --restart=always -e="LOG=timtam://192.168.2.1:7349" -e="NODE_ENV=production" -e="ETCD=http://192.168.2.1:2379" albi