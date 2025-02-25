const express = require('express');
const app = express();
const login = require('./system/fb-api');
const { logo, colors, fonts, bai } = require('./system/log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { spawn } = require('child_process');
const account = fs.readFileSync('account.txt', 'utf8');
const { version } = require('./package');
const gradient = require('gradient-string');
const { prefix, botName, admin, proxy, port, language: lang, maintenance, chatdm, notificationKey, aiKey, settings, timezone } = require('./config');
const { cooldown } = require('./system/cooldown');
const moment = require('moment-timezone');
const now = moment.tz(timezone);

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));

const proxyConfig = { host: proxy, port: port };
const banner = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.bai);
const currentDate = now.format('YYYY-MM-DD');
const currentTime = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;

global.BotConfig = { prefix, botName, admin, logo, aiKey, language: lang, web, maintenance, currentTime, currentDate };

async function notifyError(notification) { 
  try { 
    const errorMsg = `⚡ There is an error\n\nProject: ${botName}\nError: ${notification}`;
    const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notificationKey}&text=${encodeURIComponent(errorMsg)}`);
  } catch (error) {
    console.log(logo.error + 'Error in notification: ' + error);
  }
}

async function fetchStream(url, filename) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const filePath = path.join(__dirname, 'system', filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    throw error;
  }
}

let database = {};
if (fs.existsSync(path.join('system', 'database.db'))) {
  database = JSON.parse(fs.readFileSync(path.join('system', 'database.db'), 'utf-8'));
}

function addUser(id) {
  if (!database[id]) {
    database[id] = { "name": "New User", "currency": 0, "exp": 0, "level": 1, "daily": null };
    console.log(bai('database') + `${id} new user.`);
    saveDatabase();
  }
}

function updateUser(id, key, value) {
  if (["name", "daily"].includes(key)) {
    database[id][key] = value;
    saveDatabase();
    console.log(bai('database') + 'Update completed.');
  } else if (["currency", "exp", "level"].includes(key) && typeof value === 'number') {
    database[id][key] = value;
    saveDatabase();
    console.log(bai('database') + 'Update completed.');
  } else {
    console.log(bai('database') + 'Value for ' + key + ' must be a number.');
  }
}

function getUserData(id) {
  return database[id] || database;
}

function saveDatabase() {
  fs.writeFile(path.join('system', 'database.db'), JSON.stringify(database, null, 2), (err) => {
    if (err) {
      console.log(logo.error + "Error in database: ", err);
    }
  });
}

async function loadConfig() {
  fs.readFileSync('config.json');
}

console.log(banner);
setInterval(loadConfig, 1000);

cron.schedule('0 */4 * * *', () => {
  console.clear();
  process.exit();
  const child = spawn("refresh", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });
  child.on('error', (err) => {
    console.log(logo.error + 'Error in autorest: ', err);
  });
  child.on('exit', (code) => {
    if (code === 0) {
      console.log(bai('restart') + botName + ' restarted successfully.');
    } else {
      console.log(logo.error + botName + ' failed to restart: ', code);
    }
  });
});

console.log(bai('version') + `${version}.`);
console.log(bai('prefix') + `${prefix}`);
console.log(bai('language') + `${lang}.`);
console.log(bai('admin') + `${admin}.`);
console.log(bai('webview') + `${web}.`);

fs.readdir('./system/cmds', (err, files) => { 
  const commandList = files.map(file => path.parse(file).name);
  console.log(bai('cmds') + `${commandList}.`);
});

if (!account || account.length < 0 || !JSON.parse(account)) {
  console.log(logo.error + 'You have not entered the cookie.');
  process.exit();
}

login({ appState: JSON.parse(account, proxyConfig) }, settings, (err, api) => {
  if (err) { 
    notifyError(`Error during login: ${err.message || err.error}`);
    console.log(logo.error + `Error during login: ${err.message || err.error}`);
    process.exit();
  }
  
  api.listenMqtt((err, event) => {
    if (err) {
      notifyError(`${err.message || err.error}`);
      console.log(logo.error + `${err.message || err.error}`);
      process.exit();
    }

    const body = event.body;
    if (!body || global.BotConfig.maintenance === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup === false && !admin.includes(event.senderID)) return; 
    
    addUser(event.senderID);
    if (body.toLowerCase() === "prefix") return api.sendMessage(`Prefix ${botName}: ${prefix}`, event.threadID, event.messageID);
    if (!body.startsWith(prefix)) return console.log(logo.message + `${event.senderID} > ${body}`);
    
    const cmd = body.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();

    async function executeCommand(cmd, api, event) {
      const argsString = body?.replace(`${prefix}${cmd}`, "")?.trim();
      const args = argsString?.split(' ');

      try {
        const threadInfo = await new Promise((resolve, reject) => { 
          api.getThreadInfo(event.threadID, (err, info) => { 
            if (err) reject(err); else resolve(info); 
          }); 
        });
        const threadAdmins = threadInfo.adminIDs.map(admin => admin.id);
        const files = fs.readdirSync(path.join(__dirname, '/system/cmds'));
        for (const file of files) {
          if (file.endsWith('.js')) {
            const commandPath = path.join(path.join(__dirname, '/system/cmds'), file);
            const { commandInfo, execute, translations } = require(commandPath);

            if (commandInfo && commandInfo.name === cmd && typeof execute === 'function') {
              console.log(logo.cmds + `Executing command ${commandInfo.name}.`);
              const translate = function(key) { return translations[lang][key]; };	
              
              if (cooldown(event.senderID, commandInfo.name, commandInfo.cooldown) === 'ready') { 
                if (commandInfo.role === 0 || !commandInfo.role || (commandInfo.role === 2 || commandInfo.role === 1) && admin.includes(event.senderID) || commandInfo.role === 0 || (commandInfo.role === 1 && threadAdmins.join(', ').includes(event.senderID) || commandInfo.role === 0)) {
                  await execute({ api, event, args, translate, fetchStream, loadConfig, updateUser, getUserData });
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
        notifyError(`Command error: ${error.message}`);
        console.log(logo.error + 'Command error: ' + error.message);
      }
    }
    executeCommand(cmd, api, event);
  });
});

app.listen(port, () => { });
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'system', 'file', '#home.html'));
});
app.get('/report', (req, res) => { 
  res.sendFile(path.join(__dirname, 'system', 'file', '#report.html'));
});
app.get('/chatbot', async (req, res) => {
  const text = req.query.message || 'hello';

  try {
    const data = {
      contents: [{ parts: [{ text: text }] }]
    };
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${aiKey}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const chatbotResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ creator: "Bernando Gaming", chatbotResponse });
  } catch (error) {
    res.json({ error: 'Sorry, there was an error: ' + error.message });
  }
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'system', 'file', '#notfound.html'));
});
