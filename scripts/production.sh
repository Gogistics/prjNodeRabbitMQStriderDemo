#!/bin/bash
# Program:
# spin up node app
# History:
# 02/05/2017
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export=PATH
REDIS_PWD=''
REDIS_HOST=''

cd ./my_redis/
while IFS='=' read -r key value
do
  keys+=("$key")
  values+=("$value")
  if [ ${key} == 'REDIS_PWD' ]; then
    REDIS_PWD=${value}
  fi
  if [ ${key} == 'REDIS_HOSTNAME' ]; then
    REDIS_HOST=${value}
  fi
done < ./my_vars

cd ../
NODE_ENV=staging REDIS_PORT=6378 REDIS_HOST=${REDIS_HOST} REDIS_PASS=${REDIS_PWD} forever restart .
