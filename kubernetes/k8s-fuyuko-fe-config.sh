#!/bin/bash

kubectl create configmap fuyuko-fe-config --from-file ../fe/src/assets/config.json -o yaml --dry-run | kubectl apply -f -

