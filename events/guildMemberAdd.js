const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const welcomePath = path.join(__dirname, '../data/welcome.json');
const logsPath = path.join(__dirname, '../data/logs.json');

function loadWelcome() {
  try {
    return JSON.parse(fs.readFileSync(welcomePath, 'utf8'));
  } catch {
    return {};
  }
}

function loadLogs() {
  try {
    return JSON.parse(fs.readFileSync(logsPath, 'utf8'));
  } catch {
    return {};
  }
}

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const welcome = loadWelcome();
    const logs = loadLogs();
    const guildId = member.guild.id;

    // Welcome message
    if (welcome[guildId] && welcome[guildId].channelId) {
      try {
        const channel = member.guild.channels.cache.get(welcome[guildId].channelId);
        if (channel) {
          const message = welcome[guildId].message
            .replace('{user}', member.user.mention)
            .replace('{server}', member.guild.name);

          const embed = new EmbedBuilder()
            .setTitle('👋 Welcome!')
            .setDescription(message)
            .setColor(0x00ff00)
            .setThumbnail(member.user.avatarURL());

          await channel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error sending welcome message:', error);
      }
    }

    // Log member join
    if (logs[guildId] && logs[guildId].channelId) {
      try {
        const logChannel = member.guild.channels.cache.get(logs[guildId].channelId);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('👤 Member Joined')
            .setDescription(`${member.user.mention} joined the server`)
            .addFields(
              { name: 'User', value: member.user.tag },
              { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>` },
              { name: 'Member Count', value: `${member.guild.memberCount}` }
            )
            .setColor(0x00ff00)
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
