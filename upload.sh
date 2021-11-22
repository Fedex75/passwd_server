#!/bin/bash
HOST=bolsa.zaifo.com.ar
FOLDER="~/server/gpass/node/src"
SERVICE_NAME="gpass_node"
ssh root@$HOST rm -rf $FOLDER/*
scp -r package* src root@$HOST:$FOLDER
read -p "Rebuild? [Y/n]" yn
    case $yn in
        [Yy]*|"") ssh root@$HOST "cd $FOLDER && docker-compose down && docker-compose build && docker-compose up -d && docker logs --follow $SERVICE_NAME";;
        [Nn]* ) exit;;
    esac
