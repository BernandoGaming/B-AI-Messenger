const axios = require('axios');
const fs = require('fs');
module.exports = {
hady: { 
    nama: "meme",
    penulis: "Hady Zen", 
    peran: 0,
    kuldown: 26,
    tutor: ""
}, 
        
Ayanokoji: async function ({ api, event, getStream }) {
        try {
    const meme = await axios.get("https://raw.githubusercontent.com/HadyZen/hady-zen-api/refs/heads/main/meme.json");
    const itsuki = meme.data;
    const hadi = itsuki[Math.floor(Math.random() * itsuki.length)];
    const hady = await getStream(hadi, 'meme.png');
    api.sendMessage({ attachment: fs.createReadStream(hady) }, event.threadID, event.messageID);

    } catch (error) {
     api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
 }
};