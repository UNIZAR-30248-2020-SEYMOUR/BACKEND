#!/bin/bash

sudo docker stop $(sudo docker ps -a -q)
sudo docker rm $(sudo docker ps -a -q)
sudo docker volume rm $(sudo docker volume ls -q)

sudo rm -rf ./db/mysql-data/*
sudo rm -rf ./node/videos/*
