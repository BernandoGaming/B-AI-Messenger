const express = require('express');
const app = express();
const login = require('./handlers/login');
const { logo, color, font, logger } = require('./handlers/log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { spawn } = require('child_process');
const accountData = fs.readFileSync('account.txt', 'utf8');
const { version } = require('./package');
const gradient = require('gradient-string');
const { prefix, name, admin, proxy, port, language: lang, maintenance, chatdm, notifkey, aikey, settings, timezone } = require('./config');
const { cooldown } = require('./handlers/cooldown');
const moment = require('moment-timezone');
const now = moment.tz(timezone);

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
const proxySettings = { host: proxy, port: port };
const banner = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.banner);
const date = now.format('YYYY-MM-DD');
const time = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
global.BotSettings = { prefix: prefix, name: name, admin: admin, logo: logo, aikey: aikey, language: lang, web: web, maintenance: maintenance, time: time, date: date };

async function sendErrorNotification(notification) { 
  try { 
    const message = `⚡ 𝗘𝗿𝗿𝗼𝗿 𝗢𝗰𝗰𝘂𝗿𝗿𝗲𝗱\n\n𝖯𝗋𝗈𝗃𝖾𝖼𝗍: ${name}\n𝖤𝗋𝗋𝗈𝗋: ${notification}`;
    const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(message)}`);
  } catch (error) {
    console.log(logo.error + 'Error sending notification: ' + error);
  }
}

async function downloadStream(url, filename) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const filePath = path.join(__dirname, 'handlers', filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    throw error;
  }
}

let data = {};
if (fs.existsSync(path.join('handlers', 'database.db'))) {
  data = JSON.parse(fs.readFileSync(path.join('handlers', 'database.db'), 'utf-8'));
}

function addUser(id) {
  if (data[id]) {
    // User already exists
  } else {
    data[id] = { "name": "New User", "yen": 0, "exp": 0, "level": 1, "daily": null };
    console.log(logger('database') + `${id} is a new user.`);
  }
  saveData();
}

function updateUser(id, item, value) {
  if (item === "name" || item === "daily") {
    data[id][item] = value;
    saveData();
    console.log(logger('database') + 'Update successful.');
  } else if (item === "yen" || item === "exp" || item === "level") {
    if (typeof value === 'number') {
      data[id][item] = value;
      saveData();    
      console.log(logger('database') + 'Update successful.');
    } else {
      console.log(logger('database') + `Value for ${item} must be a number.`);
    }
  }
}

function getUserData(id) {
  return data[id] || data;
}

function saveData() {
  fs.writeFile(path.join('handlers', 'database.db'), JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log(logo.error + "Error saving database: ", err);
    }
  });
}

async function loadConfig() {
  fs.readFileSync('config.json');
}

console.log(banner);
setInterval(function() { loadConfig(); }, 1000);
cron.schedule('0 */4 * * *', () => {
  console.clear();
  process.exit();
  const child = spawn("refresh", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });
  child.on('error', (err) => {
    console.log(logo.error + 'Error during auto-restart: ', err);
  });
  child.on('exit', (code) => {
    if (code === 0) {
      console.log(logger('restart') + name + ' restarted successfully.');
    } else {
      console.log(logo.error + name + ' failed to restart: ', code);
    }
  });
});
console.log(logger('version') + `${version}.`);
console.log(logger('prefix') + `${prefix}`);
console.log(logger('language') + `${lang}.`);
console.log(logger('admin') + `${admin}.`);
console.log(logger('webview') + `${web}.`);
fs.readdir('./commands', (err, files) => { 
  const commandList = files.map(file => path.parse(file).name);
  console.log(logger('commands') + `${commandList}.`);
});

if (!accountData || accountData.length < 0 || !JSON.parse(accountData)) {
  console.log(logo.error + 'No account data found.');
  process.exit();
}

login({appState: JSON.parse(accountData, proxySettings)}, settings, (err, api) => {
  if (err) { 
    sendErrorNotification(`Login error: ${err.message || err.error}`);
    console.log(logo.error + `Login error: ${err.message || err.error}`);
    process.exit();
  }
      
  api.listenMqtt((err, event) => {
    if (err) {
      sendErrorNotification(`${err.message || err.error}`);
      console.log(logo.error + `${err.message || err.error}`);
      process.exit();
    }
    const body = event.body;
    if (!body || global.BotSettings.maintenance === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup == false && !admin.includes(event.senderID)) return; 
    addUser(event.senderID);
    if (body.toLowerCase() == "prefix") return api.sendMessage(`⚡ Prefix ${name}: ${prefix}`, event.threadID, event.messageID);
    if (!body.startsWith(prefix)) return console.log(logo.message + `${event.senderID} > ${body}`);
    const cmd = body.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();
	   
    async function executeCommand(cmd, api, event) {
      const args = body?.replace(`${prefix}${cmd}`, "")?.trim().split(' ');

      try {
        const threadInfo = await new Promise((resolve, reject) => { api.getThreadInfo(event.threadID, (err, info) => { if (err) reject(err); else resolve(info); }); });
        const threadAdmins = threadInfo.adminIDs.map(admin => admin.id);
        const commandFiles = fs.readdirSync(path.join(__dirname, '/commands'));
        for (const file of commandFiles) {
          if (file.endsWith('.js')) {
            const commandFile = path.join(path.join(__dirname, '/commands'), file);
            const { command, execute, language } = require(commandFile);

            if (command && command.name === cmd && typeof execute === 'function') {
              console.log(logo.command + `Executing command ${command.name}.`);
              const translate = function(key) { return language[lang][key]; };	
   
              if (cooldown(event.senderID, command.name, command.cooldown) == 'ready') { 
                if (command.role == 0 || !command.role) {
                  await execute({ api, event, args, translate, downloadStream, loadConfig, updateUser, getUserData });
                  return;
                }
                if ((command.role == 2 || command.role == 1) && admin.includes(event.senderID) || command.role == 0) {
                  await execute({ api, event, args, translate, downloadStream, loadConfig, updateUser, getUserData });
                  return;
                } else if (command.role == 1 && threadAdmins.join(', ').includes(event.senderID) || command.role == 0) {
                  await execute({ api, event, args, translate, downloadStream, loadConfig, updateUser, getUserData });
                  return;
                } else { 
                  api.setMessageReaction("❗", event.messageID);
                }
              } else {
                api.setMessageReaction('⌛', event.messageID);
              }
            } 
          }
        }
      } catch (error) {
        sendErrorNotification(`Command error: ${error.message}`);
        console.log(logo.error + 'Command error: ' + error.message);
      }
    }
    executeCommand(cmd, api, event);
  });
});

app.listen(port, () => { });
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'handlers', 'config', 'index.html'));
});
app.get('/report', (req, res) => { 
  res.sendFile(path.join(__dirname, 'handlers', 'config', 'report.html'));
});
app.get('/generate', async (req, res) => {
  const text = req.query.message || 'hello';

  try {
    const data = {
      contents: [{ parts: [{ text: text }] }]
    };
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${aikey}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const generated = response.data.candidates[0].content.parts[0].text;
    res.json({ creator: "Bot Creator", generated });
  } catch (error) {
    res.json({ error: 'Sorry, an error occurred: ' + error.message });
  }
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'handlers', 'config', '404.html'));
});