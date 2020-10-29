#!/bin/bash

sudo bash down.sh
sudo cp -r ../node/* ./init-nodejs/
sudo docker-compose up --build
