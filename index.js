const { spawn } = require('child_process');

function bernando() {
  const child = spawn("node bot.js", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
});

  child.on("close", (code) => {
    if (code == 2) {
      bernando(); 
  }
 });
};
bernando();
