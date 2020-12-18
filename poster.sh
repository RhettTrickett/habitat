#!/bin/bash

curl -u bob:jones --header "Content-Type: application/json" --request POST --data '{"feed_id":1, "private_key":"e6bb22a624463de87a36a7bb167b0330e7ed533b5143d1ba", "celcius":21.4, "humidity": 32.4}' http://192.168.1.7:3000/measurements/

