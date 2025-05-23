const fs = require('fs');
const CleanCSS = require('clean-css');
const chalk = require('chalk');
const spawn = require("child_process").spawn;
const cssbun = require('cssbun')
const chokidar = require("chokidar");

const exitCallbacks = [];
const ROOT = process.cwd();
let serverProcess;
let restart = false;
let processes = [];

function compileCSS(inputCSS, outputCSS) {
  const minifiedCSS = new CleanCSS().minify(cssbun(inputCSS));
  fs.writeFileSync(outputCSS, minifiedCSS.styles);
  console.log(chalk.green('CSS saved'));
}
function compileJS(inputJS, outputJS, callback = () => {}) {
  command(
    `./node_modules/.bin/esbuild ${inputJS} --bundle --minify --outfile=${outputJS} --sourcemap`,
    ROOT,
    callback
  );
}

function command(cmd, cwd, onExit = () => {}) {
  const proc = spawn(cmd, {
    shell: true,
    cwd,
    stdio: "inherit",
  });

  proc.on("exit", (code) => onExit(code));
  proc.on("error", (error) => {
    console.error(
      `"${cmd}" errored with error = ${error.toString()}`
    );
  });
  processes.push(proc);
  return proc;
};

function runServer(folderToWatch, commandToExecute) {
  const run = () => {
    serverProcess = command(commandToExecute, ROOT, (code) => {
      serverProcess = null;
      if (code === null && restart) {
        run();
      }
    });
  }
  run();
  chokidar
    .watch(folderToWatch, { ignoreInitial: true })
    .on("all", () => {
      restart = true;
      if (serverProcess) {
        serverProcess.kill();
      } else {
        run();
      }
    });
}

onExit(() => {
  if (serverProcess) {
    restart = false;
    serverProcess.close ? serverProcess.close() : serverProcess.kill();
  }
  processes.forEach(p => p.close ? p.close() : p.kill());
  process.exit(0);
});

function onExit(callback) {
  exitCallbacks.push(callback);
}
function exitHandler(err) {
  if (err) {
    console.log(err);
  }
  exitCallbacks.forEach((c) => c());
}

// do something when app is closing
process.on("exit", exitHandler);
// catches ctrl+c event
process.on("SIGINT", exitHandler);
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
// catches uncaught exceptions
process.on("uncaughtException", exitHandler);

module.exports = {
  runServer,
  compileCSS,
  compileJS
}