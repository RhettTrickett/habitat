#!/bin/bash

# This is a simple script for updating Habitat on a VM.
# You can use the commands commented out below to
# sync your latest app files to a temp directory on your
# VM and then execute this  script which will install 
# dependencies and into and then swap out the current app 
#f iles for the new ones.

# Run the below commands from the project root in your shell
# or just put them into a shell script like this one.

# rsync -a "$(pwd)"/* <server_IP>:../var/www/habitat-new
# ssh root@<server_IP> "bash -s" < scripts/build.sh

cd ../var/www/habitat-new

# Install dependencies and build files
echo "Installing dependencies..."
npm install &> /dev/null

echo "Building production files..."
npm run build &> /dev/null

cd ../
pwd

# Switch out existing app files for new files
echo "Renaming current to old..."
mv habitat habitat-old
echo "Renaming new to current..."
mv habitat-new habitat

# Restart PM2 process manager
echo "Restarting..."
pm2 restart "Habitat" &> /dev/null

# Delete old app files
echo "Deleting old files..."
chmod -R 777 habitat-old
rm -r habitat-old

echo "Deployed."








