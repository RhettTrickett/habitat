#!/bin/bash

curl --header "Content-Type: application/json" --request POST --data '{"feed_name":"test2"}' http://192.168.1.7:3000/feeds/
