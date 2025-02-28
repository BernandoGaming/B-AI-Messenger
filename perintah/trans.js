const axios = require('axios');
module.exports ={ 
hady: { 
  nama: "trans",
  penulis: "Hady Zen", 
  peran: 0,
  kuldown: 10,
  tutor: "<bahasa> <teks>"
}, 

bahasa: { 
  id: { hadi: "Kamu belum memasukkan code bahasa atau teksnya." }, 
  en: { hadi: "You haven't given her a code or text yet." }
}, 
  
Ayanokoji: async function ({ api, event, args, bhs }) { 
   if (args.join(' ')) { 
      const basa = args[0];
      const hady = args.slice(1).join(' ');
      const respon = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${basa}&dt=t&q=${encodeURIComponent(hady)}`);
     api.sendMessage(`🜲 𝗧𝗲𝗿𝗷𝗲𝗺𝗮𝗵𝗮𝗻\n\n${respon.data[0].map(item => item[0]).join('')}`, event.threadID, event.messageID);
  } else {
    return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
  }
 }
};