#!/bin/bash

sudo docker stop $(docker ps -a -q)
sudo docker rm $(docker ps -a -q)
sudo rm -rf ./db/mysql-data/*
sudo rm -rf ./node/videos/*
