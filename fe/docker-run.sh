#!/bin/bash

docker stop tmjee-fuyuko-fe
docker rm tmjee-fuyuko-fe
docker rmi -f tmjee-fuyuko-fe
docker run --name tmjee-fuyuko-fe -d -p 9999:80 tmjee/fuyuko-fe
