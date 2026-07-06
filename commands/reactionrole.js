const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('Create a reaction role message')
    .addStringOption(option =>
      option
        .setName('role')
        .setDescription('Role name or ID')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Button description')
        .setRequired(true)
    )
    .setDefaultMemberPermissions('Administrator'),
  async execute(interaction, client) {
    const roleInput = interaction.options.getString('role');
    const description = interaction.options.getString('description');

    let role = interaction.guild.roles.cache.get(roleInput);
    if (!role) {
      role = interaction.guild.roles.cache.find(r => r.name === roleInput);
    }

    if (!role) {
      await interaction.reply({ content: '❌ Role not found', ephemeral: true });
      return;
    }

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`role_${role.id}`)
        .setLabel(description)
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle('🎭 Reaction Role')
      .setDescription(`Click the button below to get the ${role.name} role!`)
      .setColor(0x0099ff);

    await interaction.channel.send({ embeds: [embed], components: [button] });
    await interaction.reply({ content: '✅ Reaction role message created!', ephemeral: true });
  },
};
