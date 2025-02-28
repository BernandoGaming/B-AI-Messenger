/* HADY ZEN'IN */

let hady = new Date();

hady.setHours(hady.getHours() + 7);
const jam = hady.getHours();
const menit = hady.getMinutes();
const detik = hady.getSeconds();
const tahun = hady.getFullYear();
const tanggal = hady.getDate();
bulan = hady.getMonth() + 1;

let waktu = `${jam.toString().padStart(2, '0')}:${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')} ${tanggal.toString().padStart(2, '0')}/${bulan.toString().padStart(2, '0')}/${tahun}`;

module.exports = { waktu };
