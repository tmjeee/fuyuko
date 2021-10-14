#!/bin/bash

TAG=`git describe --tag --always`
FILES=( "./dist/fuyuko/assets/config.json" )

echo "Current tag $TAG"

for file in "${FILES[@]}"
do
  echo "Replacing __GIT_TAG__ in $file with $TAG"
  sed -i "s/__GIT_TAG__/$TAG/" $file
done
