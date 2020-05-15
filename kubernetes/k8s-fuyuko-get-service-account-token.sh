#!/bin/bash

kubectl apply -f ./k8s-fuyuko-create-service-account.yaml

TOKEN=$(kubectl get secret $(kubectl get secret | grep robot-token | awk '{print $1}') -o jsonpath='{.data.token}' | base64 --decode)

echo $TOKEN