const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const levelPath = path.join(__dirname, '../data/levels.json');

function getLeaderboard() {
  try {
    const data = JSON.parse(fs.readFileSync(levelPath, 'utf8'));
    return Object.entries(data)
      .sort((a, b) => b[1].xp - a[1].xp)
      .slice(0, 10);
  } catch {
    return [];
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the top 10 leveled members'),
  async execute(interaction, client) {
    const leaderboard = getLeaderboard();

    if (leaderboard.length === 0) {
      await interaction.reply({ content: '❌ No leaderboard data yet. Start chatting to earn XP!', ephemeral: true });
      return;
    }

    let description = '';
    for (let i = 0; i < leaderboard.length; i++) {
      const [userId, userData] = leaderboard[i];
      const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
      description += `${medal} <@${userId}> - Level ${userData.level} (${Math.floor(userData.xp)} XP)\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 Leaderboard')
      .setDescription(description)
      .setColor(0xffd700);

    await interaction.reply({ embeds: [embed] });
  },
};
