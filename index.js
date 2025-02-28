/* HADY ZEN'IN */

const { spawn } = require('child_process');

function hady() {
  const child = spawn("node Ayanokoji.js", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
});

  child.on("close", (code) => {
    if (code == 2) {
      hady(); 
  }
 });
};
hady();
