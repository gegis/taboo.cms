#!/bin/bash

set -e

CMS_TYPE=$1
PORT=$2

if test -z "$CMS_TYPE"
then
  read -p 'Enter CMS_TYPE: ' CMS_TYPE
fi

if test -z "$CMS_TYPE"
then
  read -p 'Enter server PORT: ' PORT
fi

SRC_DIR=${CMS_TYPE}
DEST_DIR=${CMS_TYPE}'-test'


if [ -d "${DEST_DIR}" ]; then rm -rf ${DEST_DIR}; fi

if [ ! -d "${SRC_DIR}" ];
    then echo "${SRC_DIR} does not exist.";
    exit 1;
fi

cp -r ${SRC_DIR} ${DEST_DIR}
cd ${DEST_DIR}
npm i @taboo/cms
npx taboo-cms-cli install react egidijus.gegeckas@gmail.com
npm i
cp ./config/SAMPLE.local.js ./config/local.js
chromium-browser --auto-open-devtools-for-tabs http://localhost:${PORT}
PORT=${PORT} npm start
