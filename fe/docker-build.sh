#!/bin/bash

cd $(dirname $0)

npx ng build

docker container stop tmjee-fuyuko-fe
docker container rm -f tmjee-fuyuko-fe
docker image rmi -f tmjee/fuyuko-fe
docker image build -t tmjee/fuyuko-fe -f ./docker/dockerfile .
