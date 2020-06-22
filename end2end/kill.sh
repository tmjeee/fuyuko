#!/bin/bash

PID1=$(lsof -ti tcp:8888)
PID2=$(lsof -ti tcp:4200)

echo $PID1
echo $PID2

if [ -z "$PID1" ]
then
	echo "no PID1 (port 8888) to kill"
else
	kill -9 $PID1
	echo "kill PID1 (port 8888)"
fi

if [ -z "$PID2" ]
then
	echo "no PID2 (port 4200) to kill"
else
	kill -9 $PID2
	echo "kill PID2 (port 4200)"
fi
