/* HADY ZEN'IN */

 const express = require('express');
 const app = express();
 const login = require('./hady-zen/ayanokoji');
 const { logo, warna, font, ayanokoji } = require('./hady-zen/log');
 const fs = require('fs');
 const path = require('path');
 const axios = require('axios');
 const cron = require('node-cron');
 const { spawn } = require('child_process');
 const akun = fs.readFileSync('akun.txt', 'utf8');
 const { version } = require('./package');
 const gradient = require('gradient-string');
 const { awalan, nama, admin, proxy, port, bahasa: nakano, maintain, chatdm, notifkey, aikey, setting, zonawaktu } = require('./kiyotaka');
 const { kuldown } = require('./hady-zen/kuldown');
 const moment = require('moment-timezone');
 const now = moment.tz(zonawaktu);

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
const zen = { host: proxy, port: port };
const kiyopon = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.ayanokoji);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
global.Ayanokoji = { awalan: awalan, nama: nama, admin: admin, logo: logo, aikey: aikey, bahasa: nakano, web: web, maintain: maintain, waktu: waktu, tanggal: tanggal };

async function notiferr(notif) { 
  try { 
 const oreki = `⚡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝗄: ${nama}\n𝖤𝗋𝗋𝗈𝗋: ${notif}`;
 const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
  } catch (futaro) {
   console.log(logo.error + 'Terjadi kesalahan pada notif' + futaro);
  }
};
async function getStream(hadi, isekai) {
    try {
  const kiyotaka = await axios.get(hadi, { responseType: 'arraybuffer' });
  const otaku = Buffer.from(kiyotaka.data, 'binary');
  const wibu = path.join(__dirname, 'hady-zen', isekai);
    fs.writeFileSync(wibu, otaku);
      return wibu;
  } catch (error) {
    throw error;
 }
};

let data = {};
if (fs.existsSync(path.join('hady-zen', 'kiyopon.db'))) {
    data = JSON.parse(fs.readFileSync(path.join('hady-zen', 'kiyopon.db'), 'utf-8'));
}

function addData(id) {
    if (data[id]) {
    } else {
        data[id] = { "nama": "Kiyopon User", "yen": 0, "exp": 0, "level": 1, "daily": null };
        console.log(ayanokoji('database') + `${id} pengguna baru.`);
    }
    simpan();
};

function setUser(id, item, baru) {
  if (item == "nama" || item == "daily") {
    data[id][item] = baru;
    simpan();
    console.log(ayanokoji('database') + 'Pembaruan berhasil.');
  } else if (item == "yen" || item == "exp" || item == "level") {
    if (typeof baru === 'number') {
      data[id][item] = baru;
      simpan();    
      console.log(ayanokoji('database') + 'Pembaruan berhasil.');
    } else {
      console.log(ayanokoji('database') + 'Nilai untuk ' + item + ' harus berupa angka.');
    }
  }
};

function getData(id) {
  return data[id] || data;
};

function simpan() {
    fs.writeFile(path.join('hady-zen', 'kiyopon.db'), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(logo.error + "Terjadi kesalahan pada db: ", err);
        } else { }
 });
};

async function loadC() {
  fs.readFileSync('kiyotaka.json')
};

console.log(kiyopon);
setInterval(function() { loadC(); }, 1000);
cron.schedule('0 */4 * * *', () => {
  console.clear();
  process.exit();
  const child = spawn("refresh", {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
});
    child.on('error', (err) => {
    console.log(logo.error + 'Ada error pada autorest: ', err);
});
    child.on('exit', (code) => {
      if (code === 0) {
    console.log(ayanokoji('restar') + nama + ' berhasil dimulai ulang.');
       } else {
    console.log(logo.error + nama + ' gagal dimulai ulang: ', code);
  }
 });
});
console.log(ayanokoji('versi') + `${version}.`);
console.log(ayanokoji('awalan') + `${awalan}`);
console.log(ayanokoji('bahasa') + `${nakano}.`);
console.log(ayanokoji('admin') + `${admin}.`);
console.log(ayanokoji('webview') + `${web}.`);
fs.readdir('./perintah', (err, files) => { 
 const shadow = files.map(file => path.parse(file).name);
console.log(ayanokoji('perintah') + `${shadow}.`);
});

if (!akun || akun.length < 0 || !JSON.parse(akun)) {
 console.log(logo.error + 'Kamu belum memasukkan cookie.');
 process.exit();
}

login({appState: JSON.parse(akun, zen)}, setting, (err, api) => {
if (err) { 
  notiferr(`Terjadi kesalahan saat login: ${err.message || err.error}`);
  console.log(logo.error + `Terjadi kesalahan saat login: ${err.message || err.error}`);
  process.exit();
 }
      
   api.listenMqtt((err, event) => {
if (err) {
  notiferr(`${err.message || err.error}`);
  console.log(logo.error + `${err.message || err.error}`);
  process.exit();
}
const body = event.body;
if (!body || global.Ayanokoji.maintain === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup == false && !admin.includes(event.senderID)) return; 
  addData(event.senderID);
if (body.toLowerCase() == "prefix") return api.sendMessage(`⚡ Awalan ${nama}: ${awalan}`, event.threadID, event.messageID);
if (!body.startsWith(awalan)) return console.log(logo.pesan + `${event.senderID} > ${body}`);
   const cmd = body.slice(awalan.length).trim().split(/ +/g).shift().toLowerCase();
	   
 async function hady_cmd(cmd, api, event) {
    const pipi = body?.replace(`${awalan}${cmd}`, "")?.trim();
    const args = pipi?.split(' ');

	 try {
    const skibidi = await new Promise((resolve, reject) => { api.getThreadInfo(event.threadID, (err, info) => { if (err) reject(err); else resolve(info); }); });
    const fitri = skibidi.adminIDs.map(admin => admin.id);
    const files = fs.readdirSync(path.join(__dirname, '/perintah'));
       for (const file of files) {
   if (file.endsWith('.js')) {
    const anime = path.join(path.join(__dirname, '/perintah'), file);
    const { hady, Ayanokoji, bahasa } = require(anime);

   if (hady && hady.nama === cmd && typeof Ayanokoji === 'function') {
  console.log(logo.cmds + `Menjalankan perintah ${hady.nama}.`);
 const bhs = function(veng) { return bahasa[nakano][veng]; };	
   
   if (kuldown(event.senderID, hady.nama, hady.kuldown) == 'hadi') { 
	   
if (hady.peran == 0 || !hady.peran) {
    await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
    return;
}
if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
    await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
    return;
} else if (hady.peran == 1 && fitri.join(', ').includes(event.senderID) || hady.peran == 0) {
    await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
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
   notiferr(`Perintah error: ${error.message}`);
   console.log(logo.error + 'Perintah error: ' + error.message);
 }
}
 hady_cmd(cmd, api, event);
 });
});

app.listen(port, () => { });
app.get('/', (req, res) => { 
 res.sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#ayanokoji.html'));
});
app.get('/laporan', (req, res) => { 
 res.sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#kiyopon.html'));
});
app.get('/ayanokoji', async (req, res) => {
  const text = req.query.pesan || 'hai';

  try {
    const data = {
      contents: [{ parts: [{ text: text }] }]
    };
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${aikey}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const ayanokoji = response.data.candidates[0].content.parts[0].text;
    res.json({ pembuat: "Hady Zen", ayanokoji });
  } catch (error) {
    res.json({ error: 'Maaf ada kesalahan: ' + error.message });
  }
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#kiyotaka.html'));
});
