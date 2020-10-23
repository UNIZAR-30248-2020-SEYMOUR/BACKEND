#!/bin/bash

# Eliminar artefactos previos
sudo bash down.sh

# Copiar fuentes de node
sudo cp -r ../node/* ./init-nodejs/

# Levantar los contenedores
sudo docker-compose up --build
