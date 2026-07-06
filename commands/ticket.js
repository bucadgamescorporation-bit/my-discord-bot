const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const ticketPath = path.join(__dirname, '../data/tickets.json');

function loadTickets() {
  try {
    return JSON.parse(fs.readFileSync(ticketPath, 'utf8'));
  } catch {
    return {};
  }
}

function saveTickets(data) {
  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }
  fs.writeFileSync(ticketPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket system commands')
    .addSubcommand(sub =>
      sub.setName('create').setDescription('Create a support ticket')
    )
    .addSubcommand(sub =>
      sub.setName('close').setDescription('Close a ticket')
    ),
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      const tickets = loadTickets();
      const ticketNumber = Object.keys(tickets).length + 1;
      const channelName = `ticket-${ticketNumber}`;

      try {
        const channel = await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ['ViewChannel'],
            },
            {
              id: interaction.user.id,
              allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
            },
          ],
        });

        tickets[channel.id] = {
          creator: interaction.user.id,
          createdAt: new Date().toISOString(),
          closed: false,
        };
        saveTickets(tickets);

        const embed = new EmbedBuilder()
          .setTitle('🎫 Support Ticket Created')
          .setDescription(`Your ticket has been created: ${channel.mention}`)
          .setColor(0x00ff00);

        await interaction.reply({ embeds: [embed], ephemeral: true });

        const ticketEmbed = new EmbedBuilder()
          .setTitle('🎫 Support Ticket')
          .setDescription(`Ticket created by ${interaction.user.mention}`)
          .setColor(0x0099ff)
          .addField('Created At', new Date().toLocaleString());

        const closeButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [ticketEmbed], components: [closeButton] });
      } catch (error) {
        await interaction.reply({ content: `❌ Error creating ticket: ${error.message}`, ephemeral: true });
      }
    } else if (subcommand === 'close') {
      const tickets = loadTickets();

      if (!tickets[interaction.channelId]) {
        await interaction.reply({ content: '❌ This is not a ticket channel', ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🎫 Ticket Closed')
        .setDescription('This ticket has been closed and will be deleted in 5 seconds.')
        .setColor(0xff0000);

      await interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        interaction.channel.delete();
        delete tickets[interaction.channelId];
        saveTickets(tickets);
      }, 5000);
    }
  },
};
