#!/bin/bash

cd $(dirname $0)

docker container stop tmjee-fuyuko-fe
docker container rm tmjee-fuyuko-fe
#docker run --name tmjee-fuyuko-fe -d -p 9999:80 --network my-network tmjee/fuyuko-fe
# docker run --name tmjee-fuyuko-fe -p 9999:80 --network my-network tmjee/fuyuko-fe
docker container run --name tmjee-fuyuko-fe -d -p 9999:80 --network host tmjee/fuyuko-fe
