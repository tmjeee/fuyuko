#!/bin/bash

cd $(dirname $0)

npm run build

docker stop tmjee-fuyuko-be
docker rm tmjee-fuyuko-be
docker rmi -f tmjee/fuyuko-be
docker build -t tmjee/fuyuko-be -f ./docker/dockerfile .


