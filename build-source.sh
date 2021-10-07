#!/bin/bash


echo "BUILD COMMON"
(
cd common-code
npm install
)

echo "BUILD WF"
(
cd wf
npm install
npm run build
)

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

echo "DONE BUILD SOURCE"
