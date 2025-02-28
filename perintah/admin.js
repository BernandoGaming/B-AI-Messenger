const fs = require('fs');
const noah = JSON.parse(fs.readFileSync('kiyotaka.json', 'utf8'));

module.exports = {
  hady: {
    nama: "admin",
    penulis: "Hady Zen",
    kuldown: 6,
    peran: 2,
    tutor: "<list/add/del>"
  },
  
  bahasa: {
    id: { hadi: "Kamu belum memberikan id nya.",
          aya: "Berhasil menambahkan admin.", 
          nokoji: "Berhasil menghapus admin.",
          zen: "Id yang kamu berikan bukanlah admin.", 
          in: "Kamu salah penggunaan, gunakan list, add, del." }, 
    en: { hadi: "You haven't provided the id.",
          aya: "Added admin successfully.", 
          nokoji: "Successfully deleted admin.",
          zen: "The id you provided is not admin.", 
          in: "You are using it wrong, use list, add, del." }
  }, 
    
  Ayanokoji: async function({ api, event, args, bhs, loadC }) {
    switch (args[0]) {
      case 'list':
        api.sendMessage(noah.admin.join('\n'), event.threadID, event.messageID);
        break;
      case 'add':
        if (args.length < 2) return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
        noah.admin.push(args[1]);
        fs.writeFileSync('kiyotaka.json', JSON.stringify(noah, null, 2));
        api.sendMessage(bhs('aya'), event.threadID, event.messageID);
        await loadC();
        break;
      case 'del':
        if (args.length < 2) return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
        const index = noah.admin.indexOf(args[1]);
        if (index !== -1) {
          noah.admin.splice(index, 1);
          fs.writeFileSync('kiyotaka.json', JSON.stringify(noah, null, 2));
          api.sendMessage(bhs('nokoji'), event.threadID, event.messageID);
          await loadC();
        } else {
          api.sendMessage(bhs('zen'), event.threadID, event.messageID);
        }
        break;
      default:
        api.sendMessage(bhs('in'), event.threadID, event.messageID);
    }
  }
};
