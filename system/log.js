const { waktu } = require("./waktu");

const font = {
  bold: `\x1b[1m`,
  italic: `\x1b[3m`
};

const colors = {
  reset: `\x1b[0m`, 
  black: `\x1b[38;5;240m`,
  red: `\x1b[31m`,
  green: `\x1b[32m`,
  yellow: `\x1b[33m`,
  blue: `\x1b[34m`,
  magenta: `\x1b[35m`,
  cyan: `\x1b[36m`,
  white: `\x1b[37m`
};

const logo = {
  error: `${colors.black}${waktu}${colors.reset} ${colors.red}${font.bold}🜲 ERROR: ${colors.reset}`, 
  login: `${colors.black}${waktu}${colors.reset} ${colors.green}${font.bold}🜲 LOGIN: ${colors.reset}`, 
  info: `${colors.black}${waktu}${colors.reset} ${colors.cyan}${font.bold}🜲 INFO: ${colors.reset}`, 
  cmds: `${colors.black}${waktu}${colors.reset} ${colors.magenta}${font.bold}🜲 CMDS: ${colors.reset}`, 
  message: `${colors.black}${waktu}${colors.reset} ${colors.blue}${font.bold}🜲 MESSAGE: ${colors.reset}`, 
  update: `${colors.black}${waktu}${colors.reset} ${colors.yellow}${font.bold}🜲 UPDATE: ${colors.reset}`, 
  bai: `█▀▄░▄▀▄ █\n█▀█░█▀█ █\n▀▀░░▀░▀ ▀`
};

function bai(label) {
  return `${colors.black}${waktu}${colors.reset} ${colors.blue}${font.bold}🜲 ${label.toUpperCase()}: ${colors.reset}`;
}

module.exports = { colors, font, logo, bai };
