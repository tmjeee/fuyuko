#!/bin/bash

cd "$(dirname $0)"

# delete previous work (if exists)
kubectl delete ingress --all
kubectl delete all --all

# apply kubernetes artifacts (deployments, services, ingress etc. from docker images) to google cloud engine
kubectl apply -f ./kubernetes/kubernetes-simple.yaml

sleep 10s;

# wait for ingress ip to be ready
INGRESS_IP=$(kubectl get ingress kubernetes-ingress-fuyuko-simple --output jsonpath='{.status.loadBalancer.ingress[0].ip}')

while [ -z "$INGRESS_IP" ]; do
  INGRESS_IP=$(kubectl get ingress kubernetes-ingress-fuyuko-simple --output jsonpath='{.status.loadBalancer.ingress[0].ip}')
  sleep 5s
done;
echo "Ingress IP found to be ${INGRESS_IP}"

# wait db load balancer (service) ip to be ready
DB_IP=$(kubectl get service kubernetes-service-fuyuko-simple-db --output jsonpath='{.status.loadBalancer.ingress[0].ip}')
while [ -z "$DB_IP" ]; do
  DB_IP=$(kubectl get service kubernetes-service-fuyuko-simple-db --output jsonpath='{.status.loadBalancer.ingress[0].ip}')
  sleep 5s
done;
echo "DB Load Balancer IP found to be ${DB_IP}"

#  get currently deployed FE POD instance name
FUYUKO_FE_POD_NAME=$(kubectl get pod -l app=kubernetes-pod-fuyuko-simple-fe --output jsonpath='{.items[0].metadata.name}')
echo "Found fuyuko-fe pod instance name as ${FUYUKO_FE_POD_NAME}"
if [ -z "$FUYUKO_FE_POD_NAME" ]; then
  echo "Unable to find fuyuko-fe pod instance name"
  exit 1
fi

#  get currently deployed BE POD instance name
FUYUKO_BE_POD_NAME=$(kubectl get pod -l app=kubernetes-pod-fuyuko-simple-be --output jsonpath='{.items[0].metadata.name}')
echo "Found fuyuko-be pod instance name as ${FUYUKO_BE_POD_NAME}"
if [ -z "$FUYUKO_BE_POD_NAME" ]; then
    echo "Unable to find fuyuko-be pod instance name"
    exit 1
fi

# Update FE with Ingress IP
kubectl exec "$FUYUKO_FE_POD_NAME" -- /usr/share/nginx/update-config-json.sh /usr/share/nginx/html/assets/config.json ".\"api_host_url\"=\"http://${INGRESS_IP}/api/v1\""
echo "Altered fuyuko-fe ingress ip ${INGRESS_IP} in /usr/share/nginx/html/assets/config.json"

# Update BE with Ingress IP
kubectl exec "$FUYUKO_BE_POD_NAME" -- ./update-config-json.sh src/config/config.json ".\"fe-url-base\"=\"http://${INGRESS_IP}/\""
echo "Altered fuyuko-be ingress ip ${INGRESS_IP} in /src/config/config.json"

# Update BE with DB's IP
kubectl exec "$FUYUKO_BE_POD_NAME" -- ./update-config-json.sh src/config/config.json ".\"db-host\"=\"${DB_IP}\""
echo "Altered fuyuko-be db-host ${DB_IP} in /src/config/config.json"

# Run db update
kubectl exec "$FUYUKO_BE_POD_NAME" -- npm run runUpdater

echo "Content of fuyuko-be /src/config/config.json"
kubectl exec "$FUYUKO_BE_POD_NAME" -- cat ./src/config/config.json

echo "Content of fuyuko-fe /usr/share/nginx/html/assets/config.json"
kubectl exec "$FUYUKO_FE_POD_NAME" -- cat /usr/share/nginx/html/assets/config.json


