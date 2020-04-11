#!/bin/bash

cd $(dirname $0)


docker container stop tmjee-fuyuko-db
docker container rm -f tmjee-fuyuko-db
#docker container run --name tmjee-fuyuko-db -d --network my-network tmjee/fuyuko-db
docker container run --name tmjee-fuyuko-db -d --network host tmjee/fuyuko-db




