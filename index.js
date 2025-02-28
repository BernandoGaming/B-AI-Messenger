const { spawn } = require('child_process');

function start() {
  const child = spawn("node bot.js", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
});

  child.on("close", (code) => {
    if (code == 2) {
      start(); 
  }
 });
};
start();
