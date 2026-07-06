const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const logsPath = path.join(__dirname, '../data/logs.json');

function loadLogs() {
  try {
    return JSON.parse(fs.readFileSync(logsPath, 'utf8'));
  } catch {
    return {};
  }
}

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    const logs = loadLogs();
    const guildId = member.guild.id;

    // Log member leave
    if (logs[guildId] && logs[guildId].channelId) {
      try {
        const logChannel = member.guild.channels.cache.get(logs[guildId].channelId);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('👤 Member Left')
            .setDescription(`${member.user.mention} left the server`)
            .addFields(
              { name: 'User', value: member.user.tag },
              { name: 'Member Count', value: `${member.guild.memberCount}` }
            )
            .setColor(0xff0000)
            .setThumbnail(member.user.avatarURL())
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error sending log:', error);
      }
    }
  },
};
