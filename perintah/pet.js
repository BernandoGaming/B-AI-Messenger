const fs = require("fs");
const petDataFile = "peliharaan.json";
const userPets = loadPetData();

function loadPetData() {
  try {
    const data = fs.readFileSync(petDataFile);
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function savePetData() {
  fs.writeFileSync(petDataFile, JSON.stringify(userPets, null, 2));
}

function createPet(petName) {
  return {
    name: petName,
    happiness: 50,
    hunger: 50,
    energy: 90,
    coins: 10,
    lastRestTime: null,
    daily: null, 
    foods: ["🍒", "🍎", "🍉", "🍑", "🍊", "🥭", "🍍", "🌶", "🍋", "🍈", "🍏", "🍐", "🥝", "🍇", "🥥", "🍅", "🥕", "🍠", "🌽", "🥦", "🥒", "🥬", "🥑", "🍆", "🥔", "🌰", "🥜", "🍞", "🥐", "🥖", "🥯", "🥞", "🍳", "🥚", "🧀", "🥓", "🥩", "🍗", "🍖", "🍔", "🌭", "🥪", "🥨", "🍟", "🍕", "🌮", "🌯", "🥙", "🥘", "🍝", "🥫", "🥣", "🥗", "🍲", "🍛", "🍜", "🦞", "🍣", "🍤", "🥡", "🍚", "🥟", "🥟", "🍢", "🍙", "🍘", "🍥", "🍡", "🥠", "🥮", "🍧", "🍨", "🍦", "🥧", "🍰", "🍮", "🎂", "🧁", "🍭", "🍫", "🍫", "🍩", "🍪", "🍯", "🧂", "🍿", "🥤", "🥛", "🍵", "☕", "🍹", "🍶"],
  };
}

function daily(pet) {
  if (pet.daily == null || pet.daily !== global.Ayanokoji.tanggal) {
    pet.daily = global.Ayanokoji.tanggal;
    pet.coins += 6;
    return "Kamu berhasil mengklaim hadiah harian 6 uang.";
  } else {
    return "Kamu sudah mengklaim hadiah hari ini.";
  }
}

function feed(pet) {
  if (pet.hunger >= 10) {
    const randomFood = pet.foods[Math.floor(Math.random() * pet.foods.length)];
    const hadi = Math.floor(Math.random() * 10);
    pet.hunger += hadi;
    pet.happiness += 1;
    pet.energy += 5;
    pet.coins -= 6;
    return `${pet.name} senang makan ${randomFood}.\nSekarang peliharaan kamu memiliki ${pet.energy}% energi, ${pet.happiness}% kebahagiaan, dan ${pet.hunger}% kelaparan.\nUang peliharaanmu dikurangi 6 untuk memberi makan ${pet.name}.`;
  } else {
    return `${pet.name} sudah kenyang!`;
  }
}

function play(pet) {
  if (pet.energy >= 10) {
    pet.happiness += 1;
    pet.hunger -= 4;
    pet.energy -= 4;
    const kiyopon = Math.floor(Math.random() * 10);
    pet.coins += kiyopon;
    return `${pet.name} senang bermain denganmu.\nSekarang peliharaanmu memiliki ${pet.happiness}% kebagian, ${pet.energy}% energi, dan ${pet.coins} uang.`;
  } else {
    return `${pet.name} kamu terlalu lelah untuk main sekarang.`;
  }
}

function rest(pet) {
  const currentTime = Date.now();
  if (!pet.lastRestTime || (currentTime - pet.lastRestTime) >= 7200000) {
    pet.energy += 50;
    pet.happiness -= 4;
    pet.lastRestTime = currentTime;
    return `${pet.name} mendapatkan ${pet.energy} energi dan ${pet.happiness} kebagian.`;
  } else {
    const remainingTime = Math.floor((7200000 - (currentTime - pet.lastRestTime)) / 60000);
    return `${pet.name} sedang tidur, dibutuhkan ${remainingTime} menit untuk beristirahat penuh.`;
  }
}

function getStatus(pet) {
  return `🜲 𝗦𝘁𝗮𝘁𝘂𝘀 𝗽𝗲𝗹𝗶𝗵𝗮𝗿𝗮𝗮𝗻\n\nNama: ${pet.name}.\nEnergi: ${pet.energy}%.\nKebahagiaan: ${pet.happiness}%.\nKelaparan: ${pet.hunger}%.\nUang: ${pet.coins}.`;
}

module.exports = {
  hady: {
    nama: "pet",
    peran: 0,
    kuldown: 10,
    penulis: "Hady Zen", 
    tutor: "<aksi> <nama pet>"
  },

  Ayanokoji: async function ({ api, event, args }) {
    const action = args[0];
    const petName = args[1];
    const hady = global.Ayanokoji.awalan;

    if (!action) {
      return api.sendMessage(`🜲 𝗣𝗲𝗹𝗶𝗵𝗮𝗿𝗮𝗮𝗻\n\n${hady}pet buat\n${hady}pet daily\n${hady}pet makan\n${hady}pet main\n${hady}pet tidur\n${hady}pet status\n${hady}pet reset`, event.threadID, event.messageID);
    }

    if (action === "buat") {
      if (userPets[event.senderID]) {
        return api.sendMessage(`Kamu sudah memiliki peliharaan bernama ${userPets[event.senderID].name}, kamu tidak dapat membuat yang lain.`, event.threadID, event.messageID);
      }

      if (!petName) {
        return api.sendMessage("Harap tentukan nama untuk peliharaan kamu.", event.threadID, event.messageID);
      }

      userPets[event.senderID] = createPet(petName);
      savePetData();
      return api.sendMessage(`Kamu telah membuat peliharaan bernama ${petName}.`, event.threadID, event.messageID);
    }

    if (!userPets[event.senderID]) {
      return api.sendMessage(`Kamu harus membuat peliharaan terlebih dahulu, gunakan ${hady}pet buat <nama>.`, event.threadID, event.messageID);
    }

    const pet = userPets[event.senderID];
    let result = "";

    switch (action) {
      case "buat":
        result = `Kamu telah membuat peliharaan bernama ${pet.name}.`;
        break;
      case "makan":
        result = feed(pet);
        break;
      case "main":
        result = play(pet);
        break;
      case "tidur":
        result = rest(pet);
        break;
      case "status":
        result = getStatus(pet);
        break;
      case "daily":
        result = daily(pet);
        break;
      case "reset":
        if (!petName) {
          return api.sendMessage("Harap masukan nama peliharaan untuk mengatur ulang.", event.threadID, event.messageID);
        }
        if (pet.name !== petName) {
          return api.sendMessage(`Kamu hanya dapat mengatur ulang hewan peliharaamu sendiri, peliharaan kamu diberi nama ${pet.name}.`, event.threadID, event.messageID);
        }
        delete userPets[event.senderID];
        savePetData();
        return api.sendMessage(`Peliharaan ${petName} telah diatur ulang, gunakan ${hady}pet buat <nama> untuk membuat peliharaan baru.`, event.threadID, event.messageID);
      default:
        result = `🜲 𝗣𝗲𝗹𝗶𝗵𝗮𝗿𝗮𝗮𝗻\n\n${hady}pet buat\n${hady}pet daily\n${hady}pet makan\n${hady}pet mulai\n${hady}pet tidur\n${hady}pet status\n${hady}pet reset`;
    }

    savePetData();
    return api.sendMessage(result, event.threadID, event.messageID);
  }
};
