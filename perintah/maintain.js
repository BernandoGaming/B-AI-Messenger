module.exports = {
  hady: {
    nama: "maintain",
    penulis: "Hady Zen",
    kuldown: 6,
    peran: 2,
    tutor: "<on/off>"
  },
  
  bahasa: {
    id: { hadi: "Harap gunakan on atau off.",
          aya: "Berhasil mengaktifkan mode admin.", 
          nokoji: "Berhasil menonaktifkan mode admin."
    }, 
    en: { hadi: " Please use on or off.",
          aya: " Successfully activated admin mode.", 
          nokoji: " Successfully disable admin mode."
    }
  }, 
    
  Ayanokoji: async function({ api, event, args, bhs }) {
    if (!args.join(' ')) return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);

    if (args[0] == 'on') {
      global.Ayanokoji.maintain = true;
      api.sendMessage(bhs('aya'), event.threadID, event.messageID);

   } else if (args[0] == 'off') {
      global.Ayanokoji.maintain = false;
      api.sendMessage(bhs('nokoji'), event.threadID, event.messageID);
   }
  }
};
