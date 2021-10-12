#!/bin/bash

cd $(dirname $0)

export DEBUG=*

docker container stop tmjee-fuyuko-be
docker container rm -f tmjee-fuyuko-be

# docker run --name tmjee-fuyuko-be -d -p 8888:8888 --network my-network tmjee/fuyuko-be
# docker run --name tmjee-fuyuko-be -p 8888:8888 --network my-network tmjee/fuyuko-be

#dbPort=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tmjee-fuyuko-db)
#echo "dbPort ${dbPort}"
#docker container run --name tmjee-fuyuko-be -d -p 8888:8888 --network host tmjee/fuyuko-be "node src/app.js --db-port=\"${dbport}\""
docker container run -it --name tmjee-fuyuko-be -p 8888:8888 -p 3306:3306 tmjee/fuyuko-be "npm run start-mem -- --FFFdb-host=\"host.docker.internal\""
#docker container run --name tmjee-fuyuko-be -p 8888:8888 -p 3306:3306 --network host tmjee/fuyuko-be "tail -f /dev/null"
