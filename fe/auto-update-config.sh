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

./update-config-json.sh /usr/share/nginx/html/assets/config.json ".\"api_host_url\"=\"http://${INGRESS_IP}/api/v1\""

echo ""
echo "**** content of /usr/share/nginx/html/config.json ****"
cat /usr/share/nginx/html/asset/config.json
echo "**** "
echo ""

