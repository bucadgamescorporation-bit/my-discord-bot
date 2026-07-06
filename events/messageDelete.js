const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logsPath = path.join(__dirname, '../data/logs.json');

function loadLogs() {
  try {
    return JSON.parse(fs.readFileSync(logsPath, 'utf8'));
  } catch {
    return {};
  }
}

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    if (message.author?.bot) return;
    if (!message.guild) return;

    const logs = loadLogs();
    const guildId = message.guild.id;

    if (logs[guildId] && logs[guildId].channelId) {
      try {
        const logChannel = message.guild.channels.cache.get(logs[guildId].channelId);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🗑️ Message Deleted')
            .setDescription(`A message was deleted in ${message.channel.mention}`)
            .addFields(
              { name: 'Author', value: message.author?.tag || 'Unknown' },
              { name: 'Content', value: message.content || '[No content]', inline: false }
            )
            .setColor(0xff0000)
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error sending log:', error);
      }
    }
  },
};
