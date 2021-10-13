
# Useful Kubernetes Commands

## Pods
$> kubectl get pods

## Config Maps
$> kubectl get configmaps
$> kubectl describe configmaps fuyuko-be-config

## Scaling 
$> kubectl scale --replicas=0 -f k8s-fuyuko-fe-deployment.yaml

## Apply yaml
$> kubectl apply -f k8s-fuyuko-fe-deployment.yaml

## Access Pod instance
$> kubectl exec -ti <pod-instance-name> -- bash 

