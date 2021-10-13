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
npm run build
chmod +x ./update-files-with-git-hash.sh
chmod +x ./update-files-with-git-tag.sh
./update-files-with-git-hash.sh
./update-files-with-git-tag.sh
)


echo "BUILD FE"
(
cd fe
npm install
npm install 'replace-in-file'
npm run build-prod
chmod +x ./update-files-with-git-hash.sh
chmod +x ./update-files-with-git-tag.sh
./update-files-with-git-hash.sh
./update-files-with-git-tag.sh
)

echo "DONE BUILD SOURCE"
