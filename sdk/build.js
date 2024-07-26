const { compileCSS, compileJS } = require('./helpers/utils');

compileCSS();
compileJS(() => {
  // ...
});