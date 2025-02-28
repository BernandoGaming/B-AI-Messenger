module.exports = {
  hady: { 
    nama: "uid", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: "<kosong/reply/tag>"
  }, 
  
  Ayanokoji: async function ({ api, event, args }) {
if (event.messageReply) return api.sendMessage(event.messageReply.senderID, event.threadID, event.messageID);
if (!args[0]) return api.sendMessage(event.senderID, event.threadID, event.messageID);
if (args[0]) {
  const { mentions } = event;
	let hadi = ''; 
for (const id in mentions) { 
  hadi += `${mentions[id].replace("@", "")}: ${id}\n`;
}
  api.sendMessage(hadi, event.threadID, event.messageID);
return;
}
 }
};
