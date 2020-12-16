#!/bin/bash

curl -u bob:jones http://192.168.1.7:3000/measurements/latest/ | json_pp
