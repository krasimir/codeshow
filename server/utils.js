const fs = require('fs');

const version = require('../package.json').version;

function ui() {
  return (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Assignment</title>
          <link href="/styles_${version}.css" rel="stylesheet">
        </head>
        <body>
          <div id="root"></div>
          <script src="/app_${version}.js"></script>
        </body>
      </html>
    `);
  }
}

module.exports = {
  ui
}