const { InteractionType, EmbedBuilder } = require('discord.js');
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

function setLevel(userId, xp, level) {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(levelPath, 'utf8'));
  } catch {}

  data[userId] = { xp, level };

  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }

  fs.writeFileSync(levelPath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found`);
        return;
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: '❌ There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: '❌ There was an error while executing this command!', ephemeral: true });
        }
      }
    }

    // Handle button interactions
    if (interaction.type === InteractionType.MessageComponent) {
      if (interaction.customId.startsWith('role_')) {
        const roleId = interaction.customId.substring(5);
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
          await interaction.reply({ content: '❌ Role not found', ephemeral: true });
          return;
        }

        try {
          const member = await interaction.guild.members.fetch(interaction.user.id);
          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(role);
            const embed = new EmbedBuilder()
              .setTitle('✅ Role Removed')
              .setDescription(`You no longer have the ${role.name} role`)
              .setColor(0xff0000);
            await interaction.reply({ embeds: [embed], ephemeral: true });
          } else {
            await member.roles.add(role);
            const embed = new EmbedBuilder()
              .setTitle('✅ Role Added')
              .setDescription(`You now have the ${role.name} role`)
              .setColor(0x00ff00);
            await interaction.reply({ embeds: [embed], ephemeral: true });
          }
        } catch (error) {
          await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
        }
      } else if (interaction.customId === 'close_ticket') {
        // Handle ticket close
        const embed = new EmbedBuilder()
          .setTitle('🎫 Ticket Closed')
          .setDescription('This ticket has been closed and will be deleted in 5 seconds.')
          .setColor(0xff0000);

        await interaction.reply({ embeds: [embed] });

        setTimeout(() => {
          interaction.channel.delete();
        }, 5000);
      }
    }
  },
};
