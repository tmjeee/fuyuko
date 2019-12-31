#!/bin/bash

cd "$(dirname $0)"

ingressfilename=$1
dbfilename=$2

if [[ -z "$ingressfilename" ]]; then
  echo "missing ingress ip file path"
  exit 1
fi

if [[ -z "$dbfilename" ]]; then
  echo "missing db ip file path"
  exit 1
fi

while [[ ! -f "${ingressfilename}" ]]; do
  echo "No file ${ingressfilename}"
  sleep 10s
done

INGRESS_IP=$(cat ${ingressfilename})
echo "Ingress IP ${INGRESS_IP} found in file ${ingressfilename}"

while [[ ! -f "${dbfilename}" ]]; do
  echo "No file ${dbfilename}"
  sleep 10s
done

DB_IP=$(cat ${dbfilename})
echo "Db IP ${DB_IP} found in file ${dbfilename}"

sleep 5s;

./update-config-json.sh ./src/config/config.json ".\"fe-url-base\"=\"http://${INGRESS_IP}/\""
./update-config-json.sh ./src/config/config.json ".\"db-host\"=\"${DB_IP}\""

echo ""
echo "**** content of ./src/config/config.json ****"
cat ./src/config/config.json
echo "**** "
echo ""



