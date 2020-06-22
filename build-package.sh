#!/bin/bash

if [ -z $VERSION ] ; then
  VERSION="1.0.0-beta"
fi
ZIP_FILE="fuyuko-${VERSION}.zip"

echo "VERSION: $VERSION"
echo "ZIP FILE: $ZIP_FILE"

if [ -f $ZIP_FILE ] ; then
  echo "DELETE EXISITING ${ZIP_FILE}"
  rm -fr $ZIP_FILE
fi


echo "BUILD BE" && \ 
cd be && \ 
npm install && \
npm run build 

cd ..

echo "BUILD FE" && \
cd fe && \
npm install && \ 
npx ng build --prod 

cd ..

echo "ZIP BUILD"
zip -9 -r fuyuko-${VERSION}.zip \
    LICENSE \
    README.md \
    be/src \
    fe/dist/fuyuko
echo "DONE BUILD PACKAGE"

