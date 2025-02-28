const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { custom, logo } = require('./handlers/log');

async function checkFile(file) {
  try {
    const response = await axios.get(`https://raw.githubusercontent.com/BernandoGaming/B-AI-Messenger/refs/heads/main/${file}`);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(logo.error + `File ${file} is not a part of the repository.`);
    } else {
      console.log(logo.error + `Error checking file ${file}: ${error.message}`);
    }
    return false; 
  }
}

async function updateFile(file) {
  const isValid = await checkFile(file);
  if (!isValid) return;

  const { data } = await axios.get(`https://raw.githubusercontent.com/BernandoGaming/B-AI-Messenger/refs/heads/main/${file}`, { responseType: 'arraybuffer' });
  fs.writeFile(path.join(__dirname, file), data, 'utf8', (err) => {
    if (err) {
      console.log(logo.error + `Failed to update file ${file}.`);
    } else {
      console.log(logo.update + `Successfully updated file ${file}.`);
    }
  });
}

async function updateAll() {
  const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const { version } = packageData;

  const { data } = await axios.get('https://raw.githubusercontent.com/BernandoGaming/B-AI-Messenger/refs/heads/main/package.json');

  if (!version) {
    console.log(logo.error + 'Version not found, update aborted.');
    return;
  } 
  if (version === data.version) {
    console.log(logo.update + 'You are already using the latest version.');
    return;
  }

  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.log(logo.error + `Failed to read directory: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      if (file !== 'config.json' && file !== 'account.txt') {
        fs.stat(path.join(__dirname, file), (err, stats) => {
          if (err) {
            console.log(logo.error + `Failed to check file status ${file}: ${err}`);
            return;
          }
          if (stats.isFile()) {
            updateFile(file);  
          }
        });
      }
    });
  });
}

updateAll();
