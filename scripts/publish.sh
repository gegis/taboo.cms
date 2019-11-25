#!/bin/bash

git push origin master
git push github --tags
npm publish --access=public

echo "Done."

