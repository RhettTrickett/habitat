#!/bin/bash

curl -u bob:jones --header "Content-Type: application/json" --request POST --data '{"feed_id":1, "private_key":10001, "celcius":21.4, "humidity": 32.4}' http://192.168.1.7:3000/measurements/
