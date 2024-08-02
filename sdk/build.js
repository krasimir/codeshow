const { compileCSS, compileJS } = require('./helpers/utils');

const apps = require('./config');

apps.forEach(({ css, js }) => {
  compileCSS(css.inputCSS, css.outputCSS)
  compileJS(js.inputJS, js.outputJS);
});