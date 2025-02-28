module.exports = { 
hady: { 
  nama: "kick",
  penulis: "Hady Zen", 
  kuldown: 10,
  peran: 1,
  tutor: "<id/reply/tag>"
}, 

bahasa: {
  id: { hadi: "Kamu belum memasukkan id nya." }, 
  en: { hadi: "You haven't given her id yet." }
}, 
  
Ayanokoji: async function ({ api, event, args, bhs }) {
if (event.messageReply) return api.removeUserFromGroup(event.messageReply.senderID, event.threadID);
if (args[0]) {
  const { mentions } = event;
	let hadi = ''; 
for (const id in mentions) { 
  hadi += `${mentions[id].replace("@", "")}: ${id}\n`;
}
  api.removeUserFromGroup(`${hadi || args[0]}`, event.threadID);
return;
} else { 
  api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
  }
 }
};
