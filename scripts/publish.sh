#!/bin/bash

git push origin master
git push github --tags
npm publish

echo "Done."

