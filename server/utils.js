const fs = require('fs');

const version = require('../package.json').version;

function codeshow() {
  return (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CodeShow 🎭</title>
          <link href="/codeshow_${version}.css" rel="stylesheet">
        </head>
        <body>
          <div id="root" class="h100 flex flex-column"></div>
          <script src="/codeshow_${version}.js"></script>
        </body>
      </html>
    `);
  }
}
function app() {
  return (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>App</title>
          <link href="/app_${version}.css" rel="stylesheet">
        </head>
        <body>
          <div id="root" class="h100 p1"></div>
          <script src="/app_${version}.js"></script>
        </body>
      </html>
    `);
  }
}

module.exports = {
  codeshow,
  app
}