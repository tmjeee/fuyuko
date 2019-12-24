#!/bin/bash

cd $(dirname $0)

npx ng build

docker stop tmjee-fuyuko-fe
docker rm -f tmjee-fuyuko-fe
docker rmi -f tmjee/fuyuko-fe
docker build -t tmjee/fuyuko-fe -f ./docker/dockerfile .
