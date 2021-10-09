#!/bin/bash

cd $(dirname $0)

# npm run build

docker container stop tmjee-fuyuko-be
docker container rm tmjee-fuyuko-be
docker image rmi -f tmjee/fuyuko-be
docker image build -t tmjee/fuyuko-be -f ./docker/dockerfile .


