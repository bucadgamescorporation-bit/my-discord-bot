module.exports = {
  name: 'guildDelete',
  async execute(guild, client) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`👋 Bot left a server!`);
    console.log(`📌 Server Name: ${guild.name}`);
    console.log(`📌 Server ID: ${guild.id}`);
    console.log(`📌 Total Servers: ${client.guilds.cache.size}`);
    console.log(`${'='.repeat(60)}\n`);
  },
};
