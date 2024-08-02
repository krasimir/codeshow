const version = require(`${__dirname}/../package.json`).version;

module.exports = [
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
];