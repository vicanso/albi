const fs = require('fs');
const util = require('util');
const path = require('path');
const pkg = require('../package.json');

const pkgFile = path.resolve(__dirname, '../package.json');


const writeFile = util.promisify(fs.writeFile);
const verions = ['major', 'minor', 'patch'];

const version = process.argv[2];

const foundIndex = verions.indexOf(version);
if (foundIndex === -1) {
  console.error('the update version type is wrong');
} else {
  const versionList = pkg.version.split('.');
  versionList[foundIndex] = Number.parseInt(versionList[foundIndex], 10) + 1;
  const newVersion = versionList.join('.');
  pkg.version = newVersion;
  writeFile(pkgFile, JSON.stringify(pkg, null, 2)).then(() => {
    console.info(`update version success, new version is:${newVersion}`);
  }).catch((err) => {
    console.error(`update version fail, ${err.message}`);
  });
}
