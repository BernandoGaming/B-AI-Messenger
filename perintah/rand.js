const font = require('fontstyles');
module.exports = {
  hady: {
   nama: "rand",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: "<pilihan>, <pilihan>"
  },

bahasa: {
  id: { hadi: "Berikan setidaknya dua rentang kata." }, 
  en: { hadi: "Please provide at least two words." }
}, 
  
  Ayanokoji: async function ({ api, event, args, bhs }) { 
   const hadi = args.join(" ");
   const itsuki = hadi.split(",");
 if (!hadi.includes(',')) {
   return api.sendMessage(bhs('hadi'), event.thteadID, event.messageID)
 }
const rand = Math.floor(Math.random() * itsuki.length);
const pilihan = font.bold(itsuki[rand]);
api.sendMessage(`Saya lebih memilih ${pilihan}`, event.threadID, event.messageID);
 }
};
