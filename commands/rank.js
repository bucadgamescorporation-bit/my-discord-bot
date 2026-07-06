const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const levelPath = path.join(__dirname, '../data/levels.json');

function getLevel(userId) {
  try {
    const data = JSON.parse(fs.readFileSync(levelPath, 'utf8'));
    return data[userId] || { xp: 0, level: 1 };
  } catch {
    return { xp: 0, level: 1 };
  }
}

function xpNeeded(level) {
  return 100 * Math.pow(1.5, level - 1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your rank/level')
    .addUserOption(option => option.setName('user').setDescription('The user to check rank for')),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;
    const userData = getLevel(user.id);
    const currentXpNeeded = xpNeeded(userData.level);
    const nextXpNeeded = xpNeeded(userData.level + 1);
    const progressPercent = Math.round((userData.xp / nextXpNeeded) * 100);

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${user.username}'s Rank`)
      .setColor(0x0099ff)
      .setThumbnail(user.avatarURL())
      .addFields(
        { name: 'Level', value: `${userData.level}`, inline: true },
        { name: 'XP', value: `${Math.floor(userData.xp)}/${Math.floor(nextXpNeeded)}`, inline: true },
        { name: 'Progress', value: `${'█'.repeat(Math.floor(progressPercent / 5))}${'░'.repeat(20 - Math.floor(progressPercent / 5))} ${progressPercent}%`, inline: false }
      )
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() });

    await interaction.reply({ embeds: [embed] });
  },
};
