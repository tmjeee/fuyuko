#!/bin/bash

echo "**************** Fuyuko BE *************************"
echo "****************************************************"

# node "dist/be/src/app.js"

export DEBUG=*
node -r module-alias/register -r source-map-support/register --max-old-space-size=8192 -- dist/be/src/app.js
