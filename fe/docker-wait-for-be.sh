#!/bin/bash

cmd="$@"

okhttpcode='200'
httpcode=$(curl --write-out '%{http_code}' --silent --output /dev/null localhost:8888/api/v1/heartbeat)

until [ "$httpcode" == "$okhttpcode" ]; do
  >&2 echo "BE heatbeat http code is ${httpcode} - waiting"
  sleep 1
  httpcode=$(curl --write-out '%{http_code}' --silent --output /dev/null localhost:8888/api/v1/heartbeat)
done

>&2 echo "BE is up - execute $cmd"
sh -c "$cmd"
