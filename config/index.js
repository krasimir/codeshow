const path = require('path');

module.exports = {
  dirs: [
    { path: path.normalize(__dirname + '/../client/src_app'), name: 'client' },
    { path: path.normalize(__dirname + '/../server/app'), name: 'server' },
  ],
}