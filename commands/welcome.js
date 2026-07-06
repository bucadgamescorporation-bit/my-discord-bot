const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const welcomePath = path.join(__dirname, '../data/welcome.json');

function loadWelcome() {
  try {
    return JSON.parse(fs.readFileSync(welcomePath, 'utf8'));
  } catch {
    return {};
  }
}

function saveWelcome(data) {
  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }
  fs.writeFileSync(welcomePath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Welcome system commands')
    .addSubcommand(sub =>
      sub
        .setName('set')
        .setDescription('Set the welcome channel')
        .addChannelOption(option => option.setName('channel').setDescription('Welcome channel').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('message')
        .setDescription('Set welcome message')
        .addStringOption(option => option.setName('message').setDescription('Message (use {user} and {server})').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const welcome = loadWelcome();
    const guildId = interaction.guildId;
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'set') {
      const channel = interaction.options.getChannel('channel');
      if (!welcome[guildId]) {
        welcome[guildId] = {};
      }
      welcome[guildId].channelId = channel.id;
      saveWelcome(welcome);

      const embed = new EmbedBuilder()
        .setTitle('✅ Welcome Channel Set')
        .setDescription(`Welcome channel set to ${channel.mention}`)
        .setColor(0x00ff00);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (subcommand === 'message') {
      const message = interaction.options.getString('message');
      if (!welcome[guildId]) {
        welcome[guildId] = {};
      }
      welcome[guildId].message = message;
      saveWelcome(welcome);

      const embed = new EmbedBuilder()
        .setTitle('✅ Welcome Message Set')
        .setDescription(`Welcome message updated!`)
        .setColor(0x00ff00);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
