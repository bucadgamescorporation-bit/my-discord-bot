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
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (newMessage.author?.bot) return;
    if (!newMessage.guild) return;
    if (oldMessage.content === newMessage.content) return;

    const logs = loadLogs();
    const guildId = newMessage.guild.id;

    if (logs[guildId] && logs[guildId].channelId) {
      try {
        const logChannel = newMessage.guild.channels.cache.get(logs[guildId].channelId);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('✏️ Message Edited')
            .setDescription(`A message was edited in ${newMessage.channel.mention}`)
            .addFields(
              { name: 'Author', value: newMessage.author?.tag || 'Unknown' },
              { name: 'Before', value: oldMessage.content || '[No content]', inline: false },
              { name: 'After', value: newMessage.content || '[No content]', inline: false }
            )
            .setColor(0xffff00)
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error sending log:', error);
      }
    }
  },
};
