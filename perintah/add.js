module.exports = {
hady: { 
  nama: "add",
  penulis: "Hady Zen", 
  peran: 0,
  kuldown: 10,
  tutor: "<id>"
}, 
  
bahasa: {
  id: { hadi: "Kamu belum memberikan id nya." }, 
  en: { hadi: "You haven't given her id yet." }
}, 
  
Ayanokoji: async function ({ api, event, args, bhs }) { 
 if (!args[0]) return api.sendMessage(bhs("hadi"), event.threadID, event.messageID);
  
    try { 
  api.addUserToGroup(args[0], event.threadID);
  } catch (e) {
    console.log(e);
  }
 }
};