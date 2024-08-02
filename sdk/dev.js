const path = require('path');
const chokidar = require("chokidar");

const { runServer, compileCSS, compileJS } = require('./helpers/utils');
const serverPath = path.normalize(`${__dirname}/../server/index.js`);

runServer(`${__dirname}/../server/**/*.js`, `node ${serverPath}`);

const apps = require('./config');

apps.forEach(({ css, js }) => {
  chokidar.watch(css.watch).on("all", () => compileCSS(css.inputCSS, css.outputCSS));
  chokidar.watch(js.watch, { ignoreInitial: true }).on("all", () => compileJS(js.inputJS, js.outputJS));
  compileJS(js.inputJS, js.outputJS);
});