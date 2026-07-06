const fs = require('fs');
const path = require('path');

const levelPath = path.join(__dirname, '../data/levels.json');
const config = require('../config.json');

function getLevel(userId) {
  try {
    const data = JSON.parse(fs.readFileSync(levelPath, 'utf8'));
    return data[userId] || { xp: 0, level: 1 };
  } catch {
    return { xp: 0, level: 1 };
  }
}

function setLevel(userId, xp, level) {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(levelPath, 'utf8'));
  } catch {}

  data[userId] = { xp, level };

  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }

  fs.writeFileSync(levelPath, JSON.stringify(data, null, 2));
}

function xpNeeded(level) {
  return 100 * Math.pow(1.5, level - 1);
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    // Leveling system
    if (config.leveling.enabled) {
      const userData = getLevel(message.author.id);
      const xpGain = Math.floor(Math.random() * (config.leveling.max_xp - config.leveling.min_xp + 1)) + config.leveling.min_xp;
      let newXp = userData.xp + xpGain;
      let newLevel = userData.level;

      while (newXp >= xpNeeded(newLevel)) {
        newXp -= xpNeeded(newLevel);
        newLevel++;
      }

      setLevel(message.author.id, newXp, newLevel);

      if (newLevel > userData.level) {
        message.reply(`🎉 Congratulations ${message.author}! You reached level **${newLevel}**!`);
      }
    }
  },
};
