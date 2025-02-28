module.exports = {
  hady: { 
    nama: "hapus", 
    penulis: "Hady Zen", 
    kuldown: 6,
    peran: 0,
    tutor: "<reply>"
  }, 
  
  Ayanokoji: async function ({ api, event }) {
    api.unsendMessage(event.messageReply.messageID);
  }
};
