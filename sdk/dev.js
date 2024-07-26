const path = require('path');
const chokidar = require("chokidar");

const { runServer, compileCSS, compileJS } = require('./helpers/utils');
const serverPath = path.normalize(`${__dirname}/../server/index.js`);

runServer(`${__dirname}/../server/**/*.js`, `node ${serverPath}`);

chokidar.watch(`${__dirname}/../client/src/css/*.css`).on("all", compileCSS);
chokidar.watch(`${__dirname}/../client/src/js/**/*.*`, { ignoreInitial: true }).on("all", () => {
  compileJS();
});

compileJS();