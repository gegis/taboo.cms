#!/bin/bash

set -e

ORG_NAME=$1
APP_NAME=$2

if test -z "$ORG_NAME"
then
  read -p 'Enter ORG_NAME:' ORG_NAME
fi

if test -z "$APP_NAME"
then
  read -p 'Enter APP_NAME:' APP_NAME
fi

PM2_APP_NAME=${APP-NAME}

ENVIRONMENT='production'
SETUP_PATH='/home/ubuntu/scripts'
BUILD_FOLDER='first-time-deploy'
DEPLOY_FOLDER='app-deploy'
BACKUP_FILE='app.backup.tar'
RUNNING_APP_ORGANIZATION_PATH='/opt/'${ORG_NAME}
RUNNING_APP_MAIN_FOLDER=${APP_NAME}
APP_BACKUP_FOLDER='app-backup'


RUNNING_APP_PATH=$RUNNING_APP_ORGANIZATION_PATH/$RUNNING_APP_MAIN_FOLDER

printf "\n # Setup working app path\n\n"
sudo mkdir $RUNNING_APP_ORGANIZATION_PATH
sudo chown ubuntu:ubuntu $RUNNING_APP_ORGANIZATION_PATH

printf "\n # Setup fake $BACKUP_FILE and $APP_BACKUP_FOLDER\n\n"
touch $BACKUP_FILE
mkdir $APP_BACKUP_FOLDER

# Build app
printf "\n # Build app in $BUILD_FOLDER \n\n"
cd $BUILD_FOLDER;
npm install
npm run build
cd $SETUP_PATH

# Deploy app
printf "\n # Copying $BUILD_FOLDER to $DEPLOY_FOLDER\n\n"
rm -rf $DEPLOY_FOLDER
#mkdir $DEPLOY_FOLDER
cp -R ./$BUILD_FOLDER ./$DEPLOY_FOLDER
cd $DEPLOY_FOLDER
rm -rf .git
cd ..

printf "\n # Move $DEPLOY_FOLDER to $RUNNING_APP_PATH\n\n"
mv $DEPLOY_FOLDER $RUNNING_APP_PATH


printf "\n # Setup pm2 $PM2_APP_NAME";
cd $RUNNING_APP_PATH
pm2 start pm2.json --env $ENVIRONMENT
pm2 save
pm2 startup

printf "\n # Clean first time deploy $BUILD_FOLDER";
cd $SETUP_PATH
rm -rf $BUILD_FOLDER

printf "\n # Please execute the PM2 generated auto startup command above manually!!!\n\n"
exit 0;
