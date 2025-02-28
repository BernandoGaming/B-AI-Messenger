const wiki = require('wikijs');
module.exports = {
  hady: { 
    nama: "wiki", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: "<cari>"
  }, 

  bahasa: {
    id: { hadi: "Tidak ada hasil ditemukan.",
          kiyopon: "Masukkan yang ingin kamu cari." }, 
    en: { hadi: "No results found.",
          kiyopon: "Enter the one you want to search" }
  }, 
  
  Ayanokoji: async function ({ api, event, args, bhs }) {
    const input = args.join(' ');
    if (!input) return api.sendMessage(bhs('kiyopon'), event.threadID, event.messageID);
    
    wiki.default({ apiUrl: `https://${global.Ayanokoji.bahasa}.wikipedia.org/w/api.php` })
        .find(input)
        .then(async (page) => {
            try {
                const summary = await page.summary();

                await api.sendMessage(summary, event.threadID, event.messageID);
            } catch (error) {
                return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
            }
        })
        .catch((err) => {
            api.sendMessage('Error: ' + err, event.threadID, event.messageID);
        });
  }
};
