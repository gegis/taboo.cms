#!/bin/bash

set -e
BACKUP_FILE='app.backup.tar'
BACKUP_FOLDER='app-backup'
RUNNING_APP_ORGANIZATION_PATH='/opt/taboo'
RUNNING_APP_MAIN_FOLDER='taboo-app'
PM2_APP_NAME='taboo-app'

RUNNING_APP_PATH=$RUNNING_APP_ORGANIZATION_PATH/$RUNNING_APP_MAIN_FOLDER

#printf "\n # Restoring from $BACKUP_FOLDER to  $RUNNING_APP_PATH\n\n"
#pm2 status
#pm2 stop $PM2_APP_NAME
#rm -rf RUNNING_APP_PATH
#mv ./$BACKUP_FOLDER $RUNNING_APP_PATH
#pm2 start $PM2_APP_NAME
#printf "\n # Copying restored app back to $BACKUP_FOLDER from $RUNNING_APP_PATH\n\n"
#cp -R $RUNNING_APP_PATH ./$BACKUP_FOLDER

# Extracting way
printf "\n # Restoring from $BACKUP_FILE to  $RUNNING_APP_PATH\n\n"
pm2 stop $PM2_APP_NAME
rm -rf RUNNING_APP_PATH
tar -xf $BACKUP_FILE -C /
pm2 start $PM2_APP_NAME

printf "\n # Restoring finished\n\n"

exit 0;
