#!/bin/bash

hash jq
if [ "$?" -ne "0" ]; then
  echo 'jq command is missing, apt -y install jq'
  exit 1
fi

hash sponge
if [ "$?" -ne "0" ]; then
  echo "sponge command is missing, apt -y install moreutils"
  exit 1;
fi

if [ -z "$1" ]; then
  echo 'input json file (1st argument) missing'
  exit 1
fi

if [ -z "$2" ]; then
  echo "jq Syntax missing (2nd argument)"
  exit 1;
fi

#
# $1 = json file to change
# $2 - jq command
#

cat "$1" | jq "$2" | sponge "$1"

