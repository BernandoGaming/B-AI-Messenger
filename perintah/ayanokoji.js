const axios = require('axios');
module.exports = {
hady: { 
  nama: "ayanokoji",
  penulis: "Hady Zen", 
  kuldown: 10,
  peran: 0,
  tutor: "<pertanyaan>"
}, 

bahasa: {
  id: { hadi: "Kamu belum memasukkan pertanyaan nya." }, 
  en: { hadi: "You haven't given her a question yet." }
}, 
  
Ayanokoji: async function ({ api, event, args, bhs }) { 
  if (!args.join(' ')) return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
  const hadi = `kamu harus role play menjadi Ayanokoji Kiyotaka. User input: ${args.join(' ')}`;
  const aya = await axios.get(`${global.Ayanokoji.web}/ayanokoji?pesan=${encodeURIComponent(hadi)}`);
    api.sendMessage(aya.data.ayanokoji, event.threadID, event.messageID);
 }
};
