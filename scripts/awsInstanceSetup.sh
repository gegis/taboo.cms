#!/bin/bash

ORG_NAME='YOUR-ORGANISATION'
APP_NAME='YOUR-APP'

sudo apt update
sudo apt install -y git htop curl build-essential
#curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
#curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install -y nodejs nginx


### Consider creating SWAP for micro instance
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
#Double check it was created:
sudo swapon -s
#Or
free -m
#To make it run after reboot:
#sudo nano /etc/fstab
sudo sh -c "echo '/swapfile none swap sw 0 0' >> /etc/fstab"
#To check swapiness percentage:
cat /proc/sys/vm/swappiness
#It will be probably 60, it’s better to decrease to 10
sudo sysctl vm.swappiness=10
#To make it permanent:
#sudo nano /etc/sysctl.conf
sudo sh -c "echo 'vm.swappiness=10' >> /etc/sysctl.conf"



# configure nginx, in /etc/nginx/sites-available, create, ${APP_NAME}:
cd /etc/nginx/sites-available/
touch ${APP_NAME}
: <<'COMMENT'
# If needs redirecting from www. to without www
#server {
#    server_name www.mydomain.com;
#    return 301 $scheme://mydomain.com$request_uri;
#}

server {

    listen 80 default_server;
    listen [::]:80 default_server;

    # Check for 'https' and redirect if not
    if ($http_x_forwarded_proto != 'https') {
        rewrite ^ https://$host$request_uri? permanent;
    }

    server_name mydomain.com www.mydomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000/;
        # To avoid socket handshake error
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
COMMENT


# enable site
cd /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/${APP_NAME} ${APP_NAME}
sudo rm default
sudo nginx -t
sudo service nginx restart

# Create ssh key, update in git repo
ssh-keygen -t rsa

# Install pm2
sudo npm install -g pm2

# Clone repo for the first time, to retrieve the scripts, then delete it.
cd ~
mkdir scripts
cd scripts
git clone YOUR-REPO first-time-deploy
cp -r first-time-deploy/scripts/build-and-deploy/* ./
ls -la


# Run app with pm2
#sudo mkdir /opt/${ORG_NAME}
#sudo chown ubuntu:ubuntu /opt/${ORG_NAME}
#mv test /opt/${ORG_NAME}/${APP_NAME}
#cd /opt/${ORG_NAME}/${APP_NAME}
#npm i
#pm2 start pm2.json
#pm2 save
#pm2 startup
#sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Update local config file if needed
cd ~/scripts
cat ~/scripts/config/local.js

# Build
#./build.sh

# Deploy
#./deploy.sh
