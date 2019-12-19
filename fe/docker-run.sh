#!/bin/bash

docker stop tmjee-fuyuko-fe
docker rm tmjee-fuyuko-fe
docker run --name tmjee-fuyuko-fe -d -p 9999:80 --network my-network tmjee/fuyuko-fe
# docker run --name tmjee-fuyuko-fe -p 9999:80 --network my-network tmjee/fuyuko-fe
