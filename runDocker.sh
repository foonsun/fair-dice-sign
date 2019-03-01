#!/bin/bash

# 启动redis容器
sudo docker rm -f redis > /dev/null
echo -e "\nstart redis container..."
sudo docker run --net=host -d --name redis daocloud.io/library/redis:3.2.4 > /dev/null


# 启动MongoDB容器
sudo docker rm -f mongo > /dev/null
echo -e "\nstart mongodb container..."
sudo docker run --net=host -d --name mongo daocloud.io/library/mongo:3.2 --replSet "rs0" > /dev/null



# 构建镜像
echo -e "\nbuild fairdicegame/fairdice-sign image..."
sudo docker build -t fairdicegame/fairdice-sign .


# 运行容器
sudo docker rm -f fairdice-sign > /dev/null
echo -e "\nstart fairdice-sign container..."
sudo docker run -d \
                --restart=always \
                --net=host \
                --name=fairdice-sign \
                -e "NODE_ENV=development" \
                -e "MONGO_HOST=localhost" \
                fairdicegame/fairdice-sign > /dev/null

echo ""
