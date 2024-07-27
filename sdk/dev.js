const path = require('path');
const chokidar = require("chokidar");

const { runServer, compileCSS, compileJS } = require('./helpers/utils');
const serverPath = path.normalize(`${__dirname}/../server/index.js`);
const version = require(`${__dirname}/../package.json`).version;

runServer(`${__dirname}/../server/**/*.js`, `node ${serverPath}`);

const apps = [
  {
    css: {
      watch: `${__dirname}/../client/src/css/*.css`,
      inputCSS: `${__dirname}/../client/src/css/index.css`,
      outputCSS: `${__dirname}/../client/public/codeshow_${version}.css`
    },
    js: {
      watch: `${__dirname}/../client/src/js/**/*.*`,
      inputJS: `${__dirname}/../client/src/js/index.tsx`,
      outputJS: `${__dirname}/../client/public/codeshow_${version}.js`
    }
  },
  {
    css: {
      watch: `${__dirname}/../client/src_app/css/*.css`,
      inputCSS: `${__dirname}/../client/src_app/css/index.css`,
      outputCSS: `${__dirname}/../client/public/app_${version}.css`
    },
    js: {
      watch: `${__dirname}/../client/src_app/js/**/*.*`,
      inputJS: `${__dirname}/../client/src_app/js/index.tsx`,
      outputJS: `${__dirname}/../client/public/app_${version}.js`
    }
  }
]

apps.forEach(({ css, js }) => {
  chokidar.watch(css.watch).on("all", () => compileCSS(css.inputCSS, css.outputCSS));
  chokidar.watch(js.watch, { ignoreInitial: true }).on("all", () => compileJS(js.inputJS, js.outputJS));
  compileJS(js.inputJS, js.outputJS);
});