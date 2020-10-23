#!/bin/bash

sudo docker stop $(docker ps -a -q)
sudo docker rm $(docker ps -a -q)
sudo docker volume rm $(docker volume ls -q)

cd init-nodejs
sudo find . ! -name 'Dockerfile' ! -name '.' ! -name '..' -type d,f -exec rm -rf {} +
cd ..
echo "Node source files removed"

sudo rm -rf ./mysql-data/*
