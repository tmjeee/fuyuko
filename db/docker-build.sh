#!/bin/bash

cd $(dirname $0)

docker container stop tmjee-fuyuko-db
docker container rm -f tmjee-fuyuko-db
docker image rmi -f tmjee/fuyuko-db
docker image build -t tmjee/fuyuko-db -f docker/dockerfile .


