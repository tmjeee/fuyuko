#!/bin/bash

echo "**************** Fuyuko FE *************************"
echo "*  random_id: ${random_id}"
echo "*  ingress_ip_file: ${ingress_ip_file}"
echo "*  db_ip_file: ${db_ip_file}"
echo "****************************************************"

./auto-update-config.sh "$ingress_ip_file" "$db_ip_file";

nginx -g "daemon off;"
