module.exports = {
  hady: { 
    nama: "status", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: ""
  }, 
  
  Ayanokoji: async function ({ api, event, getData }) {
    const { nama, level, exp, yen } = getData(event.senderID);
    api.sendMessage(`🜲 𝗦𝘁𝗮𝘁𝘂𝘀\n\nNama: ${nama}\nId: ${event.senderID}\nYen: ${yen}¥\nLevel: ${level}`, event.threadID, event.messageID);
  }
};
