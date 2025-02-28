const fs = require('fs');  
const path = require('path');
module.exports = {
  hady: { 
    nama: "file", 
    penulis: "Hady Zen", 
    peran: 2,
    kuldown: 6,
    tutor: "<nama file>"
  }, 
  
  bahasa: {
    id: { hadi: "Kamu belum memasukkan nama file nya.", 
          hady: "File yang kamu minta tidak ada." }, 
    en: { hadi: "You haven't given her a file name yet.", 
          hady: "The file you asked for does not exist." }
  }, 
  
  Ayanokoji: async function ({ api, event, args, bhs }) {
    if (!args.join(' ')) return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
    const hadi = path.join('perintah', `${args[0]}.js`);
    const file = fs.readFileSync(hadi, 'utf8');
    if (!file || file.length < 0) { 
return api.sendMessage(bhs('hady'), event.threadID, event.messageID);
    } else { 
       api.sendMessage(file, event.threadID, event.messageID);  
  }
 }
};