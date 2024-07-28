const fs = require('fs');
const path = require('path');

const version = require('../package.json').version;
const config = require('../config');

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

const FileExplorer = {
  getFiles(req, res) {
    res.json(config.dirs.map(dir => {
      const item = getDirectoryTree(dir.path);
      item.name = dir.name;
      return item;
    }));
  },
  getFileContent(req, res) {
    const { path } = req.query;
    console.log(path);
    try {
      const content = fs.readFileSync(path, 'utf-8');
      res.json({ content });
    } catch(err) {
      res.json({ error: err.message });
    }
  },
  saveFileContent(req, res) {
    const { path, content } = req.body;
    console.log(path, content);
    try {
      fs.writeFileSync(path, content);
      res.json({ success: true });
    } catch(err) {
      res.json({ error: err.message });
    }
  }
}

module.exports = {
  codeshow,
  app,
  FileExplorer
}

function getDirectoryTree(dirPath) {
  const stats = fs.statSync(dirPath);
  const info = {
    path: dirPath,
    name: path.basename(dirPath)
  };
  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(dirPath).map(child => getDirectoryTree(path.join(dirPath, child)));
  } else {
    info.type = "file";
  }
  return info;
}