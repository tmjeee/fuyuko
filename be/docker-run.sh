#!/bin/bash

cd $(dirname $0)

docker stop tmjee-fuyuko-be
docker rm -f tmjee-fuyuko-be
docker run --name tmjee-fuyuko-be -d -p 8888:8888 --network my-network tmjee/fuyuko-be
# docker run --name tmjee-fuyuko-be -p 8888:8888 --network my-network tmjee/fuyuko-be
