function getCurrentTime(offsetHours = 0) {
  let currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + offsetHours);
  
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const year = currentTime.getFullYear();
  const date = currentTime.getDate();
  const month = currentTime.getMonth() + 1;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${date.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

const time = getCurrentTime(7); // Adjust the offset as needed

module.exports = { time, getCurrentTime };
