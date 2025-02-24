const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports = {
  commandInfo: {
    name: "admin",
    author: "Bernando Gaming",
    cooldown: 5,
    role: 2,
    usage: "<list/add/del>"
  },
  
  translations: {
    id: { 
      noId: "Kamu belum memberikan id nya.",
      addSuccess: "Berhasil menambahkan admin.", 
      delSuccess: "Berhasil menghapus admin.",
      notAdmin: "Id yang kamu berikan bukanlah admin.", 
      incorrectUsage: "Kamu salah penggunaan, gunakan list, add, del."
    }, 
    en: { 
      noId: "You haven't provided the id.",
      addSuccess: "Added admin successfully.", 
      delSuccess: "Successfully deleted admin.",
      notAdmin: "The id you provided is not admin.", 
      incorrectUsage: "You are using it wrong, use list, add, del."
    }
  }, 
    
  execute: async function({ api, event, args, translate, loadConfig }) {
    switch (args[0]) {
      case 'list':
        api.sendMessage(config.admin.join('\n'), event.threadID, event.messageID);
        break;
      case 'add':
        if (args.length < 2) return api.sendMessage(translate('noId'), event.threadID, event.messageID);
        config.admin.push(args[1]);
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
        api.sendMessage(translate('addSuccess'), event.threadID, event.messageID);
        await loadConfig();
        break;
      case 'del':
        if (args.length < 2) return api.sendMessage(translate('noId'), event.threadID, event.messageID);
        const index = config.admin.indexOf(args[1]);
        if (index !== -1) {
          config.admin.splice(index, 1);
          fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
          api.sendMessage(translate('delSuccess'), event.threadID, event.messageID);
          await loadConfig();
        } else {
          api.sendMessage(translate('notAdmin'), event.threadID, event.messageID);
        }
        break;
      default:
        api.sendMessage(translate('incorrectUsage'), event.threadID, event.messageID);
    }
  }
};
