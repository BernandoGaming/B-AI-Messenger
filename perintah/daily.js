module.exports = {
  hady: { 
    nama: "daily", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: ""
  }, 
  
  Ayanokoji: async function ({ api, event, getData, setUser }) {
  const { yen, exp, daily } = getData(event.senderID);
    
    if (daily == null || daily !== global.Ayanokoji.tanggal) { 
  const duit = Math.floor(Math.random() * 10);
  setUser(event.senderID, 'yen', yen + duit);
  setUser(event.senderID, 'exp', exp + 10);
  setUser(event.senderID, 'daily', global.Ayanokoji.tanggal);
    api.sendMessage(`Kamu berhasil mengklaim ${duit} yen dan 10 exp`, event.threadID, event.messageID);
    } else {
    api.sendMessage('Kamu sudah mengklaim hadiah harian.', event.threadID, event.messageID);
  }
 }
};
