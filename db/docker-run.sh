#!/bin/bash


docker stop tmjee-fuyuko-db
docker rm -f tmjee-fuyuko-db
docker run --name tmjee-fuyuko-db -d --network my-network tmjee/fuyuko-db
# docker run --name tmjee-fuyuko-db --network my-network tmjee/fuyuko-db




