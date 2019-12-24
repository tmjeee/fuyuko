## Set  docker concurrent upload (docker pull) [Required]
```
# set/add the followings in /etc/docker/daemon.json

{
   "max-concurrent-uploads": 1
}
```
## Set minikube environment variables [Not Required]
```
# to add
$> eval $(minikube docker-env)

# to remove
$> eval $(minikube docker-env -u)
```

## Enable minikube's ingress addons [Required]
```
$> minikube addons enable ingress
```

## set docker's login credentials in kubernetes (required when accessing private repositories) [Required]
```
$> kubectl create secret generic regcred \
     --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
     --type=kubernetes.io/dockerconfigjson
```
in the pod yaml configurations
```
spec:
  imagePullSecrets:
    - name: regcred
  containers:
    - name: ... 
```

see [here for details](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

#
#
# $(kubectl get pod --selector="app=kubernetes-pod-fuyuko-simple" --output jsonpath='{.items[0].metadata.name}')
# kubernetes-deployment-fuyuko-simple-86b558dc9c-gr4zz
#
#