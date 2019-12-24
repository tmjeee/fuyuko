#!/bin/bash

cd $(dirname $0)

docker stop tmjee-fuyuko-db
docker rm -f tmjee-fuyuko-db
docker rmi -f tmjee/fuyuko-db
docker build -t tmjee/fuyuko-db -f docker/dockerfile .


