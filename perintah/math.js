const axios = require('axios');
module.exports = {
  hady: { 
    nama: "math", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: "<soal>"
  }, 

  bahasa: {
    id: { hadi: "Kamu belum memberikan soal nya." }, 
    en: { hadi: "You haven't given her soal yet." }
  }, 
  
  Ayanokoji: async function ({ api, event, args, bhs }) {
   try { 
  if (!args.join(' ')) api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
      
    const jumlah = await axios.get(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(args.join(' '))}`);
  api.sendMessage(args.join(' ') + " = " + jumlah.data, event.threadID, event.messageID);
     
} catch (error) {
  api.sendMessage('Error: ' + error.message, event.threadID, event.messageID)
}
 }
};