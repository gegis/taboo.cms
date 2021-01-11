#!/bin/bash

set -e
ENVIRONMENT='production'
BUILD_FOLDER='app-build'
DEPLOY_FOLDER='app-deploy'
BACKUP_FILE='app.backup.tar'
RUNNING_APP_ORGANIZATION_PATH='/opt/taboo'
RUNNING_APP_MAIN_FOLDER='taboo-cms'
APP_BACKUP_FOLDER='app-backup'
PM2_APP_NAME='taboo-cms'

RUNNING_APP_PATH=$RUNNING_APP_ORGANIZATION_PATH/$RUNNING_APP_MAIN_FOLDER

printf "\n # Copying $BUILD_FOLDER to $DEPLOY_FOLDER\n\n"
rm -rf $DEPLOY_FOLDER
#mkdir $DEPLOY_FOLDER
cp -R ./$BUILD_FOLDER ./$DEPLOY_FOLDER
# Backup current uploads
#cp -R $RUNNING_APP_PATH/public/uploads ./$DEPLOY_FOLDER/public

printf "\n # Removing .git folder from $DEPLOY_FOLDER app\n\n"
cd $DEPLOY_FOLDER
rm -rf .git
cd ..

printf "\n # Removing old backup $BACKUP_FILE\n\n"
rm $BACKUP_FILE

printf "\n # Archiving current working app from $RUNNING_APP_PATH into $BACKUP_FILE\n\n"
tar -cf $BACKUP_FILE $RUNNING_APP_PATH

printf "\n # Stopping pm2 $PM2_APP_NAME\n\n";
pm2 status
pm2 stop $PM2_APP_NAME
printf "\n # Moving current working app to $APP_BACKUP_FOLDER\n\n"
rm -rf ./$APP_BACKUP_FOLDER
mv $RUNNING_APP_PATH ./$APP_BACKUP_FOLDER

printf "\n # Moving $DEPLOY_FOLDER into current working dir $RUNNING_APP_PATH\n\n"
mv ./$DEPLOY_FOLDER $RUNNING_APP_PATH

printf "\n # Start pm2 $PM2_APP_NAME";
pm2 start $PM2_APP_NAME

if [ $ENVIRONMENT != "production" ]
then
  printf "\n # Generating API Docs\n\n"
  cd $RUNNING_APP_PATH
  npm run generate-api-docs
fi

printf "\n # Deployment finished\n\n"
exit 0;
