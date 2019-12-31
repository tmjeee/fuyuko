#!/bin/bash

cd "$(dirname $0)"

# build fuyuko-db
./db/docker-build.sh
docker push tmjee/fuyuko-db
while [ "$?" -ge "1" ]; do
  sleep 5s
  docker push tmjee/fuyuko-db
done;

# build fuyuko-be
./be/docker-build.sh
docker push tmjee/fuyuko-be
while [ "$?" -ge "1" ]; do
  sleep 5s
  docker push tmjee/fuyuko-be
done;


# build fuyuko-fe
./fe/docker-build.sh
docker push tmjee/fuyuko-fe
while [ "$?" -ge "1" ]; do
  sleep 5s
  docker push tmjee/fuyuko-fe
done;

