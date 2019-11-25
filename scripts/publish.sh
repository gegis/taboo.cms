#!/bin/bash

git push origin master
git push origin --tags
npm publish --access=public

echo "Done."

