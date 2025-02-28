module.exports = {
  hady: {
    nama: "setn",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: "<nama>"
  },

  bahasa: {
    id: { hady: "Harap masukkan nama yang kamu mau.", 
          hadi: "Nama kamu lebih dari 12 huruf.", 
          zen: "Kamu membutuhkan 2 yen untuk mengganti nama.",
          kiyopon: "Kamu berhasil mengganti nama jadi " }, 
    en: { hady: "Please enter the name you want.", 
          hadi: "Your name is more than 12 letters.", 
          zen: "You need 2 yen to change the name.", 
          kiyopon: "You managed to change the name to " }
  }, 
  
  Ayanokoji: async function ({ api, event, args, setUser, getData, bhs }) { 
    const nama = args.join(' ');
  if (!nama) { return api.sendMessage(bhs("hady"));
  } 
  if (nama.length > 12) {
    return api.sendMessage(bhs("hadi"));
  }
   const { yen } = getData(event.senderID);
 if (yen < 2) { return api.sendMessage(bhs("zen"));
}
  setUser(event.senderID, "nama", nama);
  setUser(event.senderID, "yen", yen - 2);
   api.sendMessage(bhs("kiyopon") + nama);
 }, 
};
