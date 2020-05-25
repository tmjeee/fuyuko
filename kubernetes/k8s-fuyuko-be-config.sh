#!/bin/bash

kubectl create configmap fuyuko-be-config --from-file ../be/src/config/config.json -o yaml --dry-run | kubectl apply -f -
