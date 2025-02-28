const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports = {
  commands: {
    name: "admin",
    author: "BernandoGaming",
    cooldown: 6,
    role: 2,
    usage: "<list/add/del>"
  },
  
  msg: {
    en: { no_id: "You haven't provided the id.",
          added: "Admin added successfully.", 
          deleted: "Admin deleted successfully.",
          not_admin: "The id you provided is not an admin.", 
          wrong_usage: "You are using it wrong, use list, add, del." }
  }, 
    
  adminCommand: async function({ api, event, args, msg, loadConfig }) {
    switch (args[0]) {
      case 'list':
        api.sendMessage(config.admin.join('\n'), event.threadID, event.messageID);
        break;
      case 'add':
        if (args.length < 2) return api.sendMessage(msg('no_id'), event.threadID, event.messageID);
        config.admin.push(args[1]);
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
        api.sendMessage(msg('added'), event.threadID, event.messageID);
        await loadConfig();
        break;
      case 'del':
        if (args.length < 2) return api.sendMessage(msg('no_id'), event.threadID, event.messageID);
        const index = config.admin.indexOf(args[1]);
        if (index !== -1) {
          config.admin.splice(index, 1);
          fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
          api.sendMessage(msg('deleted'), event.threadID, event.messageID);
          await loadConfig();
        } else {
          api.sendMessage(msg('not_admin'), event.threadID, event.messageID);
        }
        break;
      default:
        api.sendMessage(msg('wrong_usage'), event.threadID, event.messageID);
    }
  }
};
