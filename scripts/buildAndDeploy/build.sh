#!/bin/bash

set -e
SETUP_PATH='/home/ubuntu/scripts'
BUILD_FOLDER='app-build'
REPO='TODO'
BRANCH='master'

printf "\n # Remove current build folder $BUILD_FOLDER\n\n"
cd $SETUP_PATH
rm -rf $BUILD_FOLDER

printf "\n # Clone repo $REPO\n\n"
git clone $REPO $BUILD_FOLDER

printf "\n # Checkout branch $BRANCH\n\n"
cd $BUILD_FOLDER
git checkout $BRANCH
git pull origin $BRANCH

printf "\n # Copy local config\n\n"
cp ../config/local.js ./config

printf "\n # Run npm install\n\n"
npm install

printf "\n # Build app\n\n"
npm run build

cd $SETUP_PATH

printf '\n # Build has finished\n\n'

exit 0;
