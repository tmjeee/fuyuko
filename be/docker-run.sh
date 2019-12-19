#!/bin/bash

docker rm -f tmjee-fuyuko-be
docker run --name tmjee-fuyuko-be -d -p 8888:8888 tmjee/fuyuko-be
