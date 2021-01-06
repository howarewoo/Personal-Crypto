#!/usr/bin/env bash
npm run build --prefix src/popup

if [ -d dist/popup ]; then rm -r dist/popup; fi

mkdir dist/popup

cp -R src/popup/build/. dist/popup/ 
