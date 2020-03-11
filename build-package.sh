#!/bin/bash

VERSION="1.0.0-beta"
ZIP_FILE="fuyuko-${VERSION}.zip"

echo "VERSION: $VERSION"
echo "ZIP FILE: $ZIP_FILE"

if [ -f $ZIP_FILE ] ; then
  echo "DELETE EXISITING ${ZIP_FILE}"
  rm -fr $ZIP_FILE
fi

(echo "BUILD BE"; cd be; npm run build)

(echo "BUILD FE"; cd fe; npx ng build --prod)

echo "ZIP BUILD"
zip -r fuyuko-${VERSION}.zip \
    LICENSE \
    README.md \
    be/src \
    fe/dist/fuyuko
echo "DONE BUILD PACKAGE"

