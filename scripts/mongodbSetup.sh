#!/bin/bash

cd ~
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt update
sudo apt-get install -y mongodb-org
sudo nano /etc/mongod.conf
### bindIp set bindIp: 127.0.0.1,192.168.0.100 # OR Enter 0.0.0.0,:: to bind to all interfaces
### bindIp: 0.0.0.0
sudo systemctl enable mongod.service
sudo service mongod start


# User Authentication
mongo --port 27017
: <<'COMMENT'
use admin
db.createUser(
  {
    user: "taboo-cms",
    pwd: "taboo-cms-password", // or passwordPrompt() for prompt
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
COMMENT

sudo service mongod stop
#sudo mongod --auth --port 27017 --dbpath /var/lib/mongodb

sudo nano /etc/mongod.conf
: <<'COMMENT'
security:
  authorization: enabled
COMMENT

sudo service mongod start
# If fails to start:
# sudo chown mongodb.mongodb -R /var/lib/mongodb



mongo -u "taboo-cms" -p

# Login from outside
mongo xx.xx.xx.xx:27017 -u "taboo-cms" -p --authenticationDatabase admin


### OPTIONAL
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

