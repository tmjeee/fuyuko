#!/bin/bash

cat > githash.js <<EOF
const fs = require('fs');
const git_hash = () => {
    const rev = fs.readFileSync('../.git/HEAD').toString().trim().split(/.*[: ]/).slice(-1)[0];
    if (rev.indexOf('/') === -1) {
        return rev;
    } else {
        return fs.readFileSync('../.git/' + rev).toString().trim();
    }
}
const replace = async (hash) => {
  await require('replace-in-file')({
    files: ['./dist/fuyuko/assets/config.json'],
    from: '__GIT_VERSION__',
    to: hash
  });
}
const hash = git_hash();
replace(hash);
console.log(hash);

EOF

node githash.js