#!/bin/bash
# Program:
# renew docker contaner
# History:
# 02/11/2017
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export=PATH

# check if amqp container exist
# development; gogistics_rabbit
app_container='gogistics_rabbit'
inspect_result=$(docker inspect $app_container)
if [ "[]" == "$inspect_result" ]; then
  echo "amqp container without password does not exist and a new one will be created..."
  docker run -d --hostname gogistics-rabbit --name gogistics_rabbit -p 127.0.0.1:5672:5672 rabbitmq:3-management
else
  echo "amqp container without password setting already exists"
fi
