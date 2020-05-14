#!/bin/bash

set -e

mongodump --out /home/ubuntu/backups/mongodb-`date +"%m-%d-%y"`

# From external server
# It's setup so it runs every hour and replaces the previous day same hour backup
#mongodump --host 3.248.70.149 --port 27017 --db playaware --username playaware --password YOUR-PASS --authenticationDatabase admin --forceTableScan --out /home/ubuntu/backups/db/`date +"%H"`_00

### Other variations
#mongodump --host 127.0.0.1 --port 27017 -d playaware --username playaware --password YOUR-PASS --out /opt/backup/mongodump-2013-10-07-1
#mongodump --host 3.248.70.149 --port 27017 --db playaware --username playaware --password YOUR-PASS --authenticationDatabase admin --forceTableScan --out /home/ubuntu/backups/db/`date +"%Y-%m-%d_%H_%M_%S"`



# CRON
# Every hour
#0 * * * * mongodb-backup.sh

# Every six hours
#0 */6 * * * mongodb-backup.sh


# Restoring
#sudo mongorestore --db newdb --drop /var/backups/mongobackups/01-20-16/newdb/



# Install mongo tools
#sudo apt-get install mongo-tools
#or
#sudo apt install mongodb-clients
