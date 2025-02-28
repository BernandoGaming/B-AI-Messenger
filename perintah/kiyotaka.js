const axios = require('axios');
module.exports = {
hady: { 
  nama: "kiyotaka",
  penulis: "Hady Zen", 
  kuldown: 10,
  peran: 0,
  tutor: "<tanyakan>"
}, 

bahasa: {
  id: { hadi: "Kamu belum memasukkan pertanyaan nya." }, 
  en: { hadi: "You haven't given her a question yet." }
}, 
  
Ayanokoji: async function ({ api, event, args, bhs }) { 
  if (!args.join(' ')) return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
  const aya = await axios.get(`${global.Ayanokoji.web}/ayanokoji?pesan=${encodeURIComponent(args.join(' '))}`);
    api.sendMessage(aya.data.ayanokoji, event.threadID, event.messageID);
 }
};
