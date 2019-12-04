#!/bin/bash

set -e

terminator -e "./testCmsInstall.sh react 3001"
terminator -e "./testCmsInstall.sh classic 3002"
terminator -e "./testCmsInstall.sh headless 3003"
