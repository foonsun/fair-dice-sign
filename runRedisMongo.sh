#!/bin/bash

# 启动redis容器
sudo docker rm -f redis > /dev/null
echo -e "\nstart redis container..."
sudo docker run --net=host -d --name redis daocloud.io/library/redis:3.2.4 > /dev/null


# 启动MongoDB容器
sudo docker rm -f mongo > /dev/null
echo -e "\nstart mongodb container..."
sudo docker run --net=host -d --name mongo daocloud.io/library/mongo:3.2 --replSet "rs0" > /dev/null
