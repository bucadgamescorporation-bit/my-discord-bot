const { ActivityType } = require('discord.js');

// Helper function to format uptime
function formatUptime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}

let activityIndex = 0;
const activities = [
  { type: ActivityType.Playing, name: 'with commands' },
  { type: ActivityType.Watching, name: 'Discord' },
];

function updateActivity(client) {
  const uptime = formatUptime(Date.now() - client.startTime);
  const uptimeActivity = { type: ActivityType.Watching, name: `Uptime: ${uptime}` };
  
  const currentActivities = [...activities, uptimeActivity];
  const activity = currentActivities[activityIndex % currentActivities.length];
  
  client.user.setActivity(activity.name, { type: activity.type });
  activityIndex++;
}

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Bot logged in as: ${client.user.username}#${client.user.discriminator}`);
    console.log(`✅ Bot ID: ${client.user.id}`);
    console.log(`✅ Total Guilds: ${client.guilds.cache.size}`);
    console.log(`${'='.repeat(60)}\n`);

    // Set initial activity
    updateActivity(client);

    // Update activity every 30 seconds
    setInterval(() => updateActivity(client), 30000);

    // Log all connected servers
    console.log('📋 Connected to the following servers:');
    client.guilds.cache.forEach((guild, index) => {
      console.log(`   ${index + 1}. ${guild.name} (ID: ${guild.id}) - ${guild.memberCount} members`);
    });
    console.log('');
  },
};
