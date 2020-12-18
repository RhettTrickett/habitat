#!/bin/bash

curl -u bob:jones --header "Content-Type: application/json" --request POST --data '{"private_key":"1f9fc4f7b4f2739461881a9e429c22c011c2ab7b165781e8", "celcius":21.4, "humidity": 32.4}' http://192.168.1.7:3000/measurements/2/

