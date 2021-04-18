#!/bin/bash

if [ -z $VERSION ] ; then
  VERSION="development-version"
fi
ZIP_FILE="fuyuko-${VERSION}.zip"

echo "VERSION: $VERSION"
echo "ZIP FILE: $ZIP_FILE"

if [ -f $ZIP_FILE ] ; then
  echo "DELETE EXISITING ${ZIP_FILE}"
  rm -fr $ZIP_FILE
fi


echo "BUILD BE"
(
cd be 
npm install
npm install 'replace-in-file'
chmod +x ./update-files-with-git-hash.sh
./update-files-with-git-hash.sh
npm run build
)


echo "BUILD FE"
(
cd fe 
npm install  
npm install 'replace-in-file'
chmod +x ./update-files-with-git-hash.sh
./update-files-with-git-hash.sh
npm run build-prod
)


echo "ZIP BUILD"
zip -9 -r fuyuko-${VERSION}.zip \
    LICENSE \
    README.md \
    db/docker \
    be/dist \
    be/docker \
    fe/dist/fuyuko \
    fe/docker \
    kubernetes \
    docker-compose
echo "DONE BUILD PACKAGE"

