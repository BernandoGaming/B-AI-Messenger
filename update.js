/* HADY ZEN'IN */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { custom, logo } = require('./hady-zen/log');

async function kei(hady) {
  try {
    const response = await axios.get(`https://raw.githubusercontent.com/HadyZen/Ayanokoji-Kiyotaka/refs/heads/main/${hady}`);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(logo.error + `File ${hady} bukan file dari ayanokoji.`);
    } else {
      console.log(logo.error + `Terjadi kesalahan saat memeriksa file ${hady}: ${error.message}`);
    }
    return false; 
  }
};

async function ayanokoji(hady) {
  const hadi = await kei(hady);
  if (!hadi) return;
  
  const { data } = await axios.get(`https://raw.githubusercontent.com/HadyZen/Ayanokoji-Kiyotaka/refs/heads/main/${hady}`, { responseType: 'arraybuffer' });
  fs.writeFile(path.join(__dirname, hady), data, 'utf8', (err) => {
    if (err) {
      console.log(logo.error + `Gagal memperbarui file ${hady}.`);
    } else {
      console.log(logo.update + `Berhasil memperbarui file ${hady}.`);
    }
  });
};

async function kiyotaka() {
  const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const { version } = packageData;

  const { data } = await axios.get('https://raw.githubusercontent.com/HadyZen/Ayanokoji-Kiyotaka/refs/heads/main/package.json');

  if (!version) {
    console.log(logo.error + 'Versi tidak ditemukan, pembaruan dibatalkan.');
    return;
  } 
  if (version === data.version) {
    console.log(logo.update + 'Kamu sudah menggunakan versi terbaru.');
    return;
  }

  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.log(logo.error + `Gagal membaca direktori: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      if (file !== 'kiyotaka.json' && file !== 'akun.txt') {
        fs.stat(path.join(__dirname, file), (err, stats) => {
          if (err) {
            console.log(logo.error + `Gagal memeriksa status file ${file}: ${err}`);
            return;
          }
          if (stats.isFile()) {
            ayanokoji(file);  
          }
        });
      }
    });
  });
};

kiyotaka();
