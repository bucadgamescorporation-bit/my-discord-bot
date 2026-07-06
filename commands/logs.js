const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

function saveLogs(data) {
  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }
  fs.writeFileSync(logsPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Logging system commands')
    .addSubcommand(sub =>
      sub
        .setName('set')
        .setDescription('Set the log channel')
        .addChannelOption(option => option.setName('channel').setDescription('Log channel').setRequired(true))
    )
    .setDefaultMemberPermissions('Administrator'),
  async execute(interaction, client) {
    const logs = loadLogs();
    const guildId = interaction.guildId;
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'set') {
      const channel = interaction.options.getChannel('channel');
      if (!logs[guildId]) {
        logs[guildId] = {};
      }
      logs[guildId].channelId = channel.id;
      saveLogs(logs);

      const embed = new EmbedBuilder()
        .setTitle('✅ Log Channel Set')
        .setDescription(`Log channel set to ${channel.mention}`)
        .setColor(0x00ff00);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
