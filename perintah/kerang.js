module.exports = {
 hady: {
 nama: 'kerang',
 peran: 0,
 penulis: "Hady Zen", 
 kuldown: 20,
 tutor: "<tanya>"
},

bahasa: {
  id: { hadi: "Tolong masukkan pertanyaan mu." }, 
  en: { hadi: "Please include your question." }
}, 
  
Ayanokoji: async function ({ api, event, args, bhs }) {
  if (!args.join(' ')) return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
  
const raffa = [
"Tidak", 
"Tanyakan pada orang lain", 
"Mungkin suatu saat nanti", 
"Ya", 
"Tentu tidak", 
"Pake nanya", 
"Coba tanyakan lagi", 
"Mungkin ya", 
"Mungkin tidak", 
"Saya rasa tidak"
];
const hadi = raffa[Math.floor(Math.random() * raffa.length)];
api.sendMessage(`🐚 𝗞𝗲𝗿𝗮𝗻𝗴 𝗔𝗷𝗮𝗶𝗯\n\nPertanyaan: ${args.join(' ')}\nJawaban: ${hadi}`, event.threadID, event.messageID);
 }
};
