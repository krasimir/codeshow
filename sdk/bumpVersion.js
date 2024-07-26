const fs = require('fs');

const PKG_FILE = __dirname + '/../package.json';

const pkg = require(PKG_FILE);
const version = pkg.version.split('.').map(n => Number(n));
version[2] += 1;
pkg.version = version.join('.');

fs.writeFileSync(PKG_FILE, JSON.stringify(pkg, null, 2));
console.log('Version bumped to ' + pkg.version);