# Discord Bot Setup Guide 🤖

## Prerequisites
- Node.js 16.6.0 or higher
- npm (comes with Node.js)
- A Discord server for testing
- A Discord bot token

## Step 1: Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "My Discord Bot")
4. Go to "Bot" section → Click "Add Bot"
5. Under TOKEN, click "Copy" to copy your bot token
6. Paste it in `.env` file:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   ```

## Step 2: Get Client ID

1. In Developer Portal, go to "General Information"
2. Copy the "Application ID" (this is your CLIENT_ID)
3. Paste it in `.env` file:
   ```env
   CLIENT_ID=your_client_id_here
   ```

## Step 3: Setup Bot Permissions

1. In Developer Portal, go to "Bot" section
2. Under "TOKEN" section, find "Privileged Gateway Intents"
3. Enable these intents:
   - ✅ Message Content Intent
   - ✅ Server Members Intent
   - ✅ Guild Members Intent

## Step 4: Invite Bot to Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ bot
   - ✅ applications.commands
3. Select permissions:
   - ✅ Administrator (for all features)
   - OR manually select:
     - Send Messages
     - Embed Links
     - Manage Messages
     - Manage Roles
     - Manage Channels
     - Kick Members
     - Ban Members
     - Moderate Members
     - Read Message History

4. Copy the generated URL and open it in your browser
5. Select your test server and authorize

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Deploy Commands

Before running the bot for the first time, deploy slash commands:

```bash
node deploy-commands.js
```

You should see:
```
Started refreshing X application (/) commands.
Successfully reloaded X application (/) commands.
```

## Step 7: Run the Bot

```bash
node index.js
```

You should see:
```
✅ Bot logged in as YourBot#0000
✅ Bot is in X guilds
```

## For Development (Auto-restart)

First install nodemon:
```bash
npm install --save-dev nodemon
```

Then run:
```bash
npm run dev
```

## Available Commands

### 🤖 General Commands
- `/help` - Show all available commands
- `/ping` - Check bot latency
- `/uptime` - Check how long bot has been online
- `/userinfo` - Get user information
- `/serverinfo` - Get server information
- `/avatar` - Get user's avatar

### 🛡️ Moderation
- `/ban` - Ban a user
- `/kick` - Kick a user
- `/timeout` - Timeout a user
- `/purge` - Delete multiple messages

### 💰 Economy
- `/balance` - Check balance
- `/work` - Work to earn money
- `/beg` - Beg for money
- `/daily` - Claim daily reward
- `/transfer` - Transfer money to another user

### 📈 Leveling
- `/rank` - Check your rank and level
- `/leaderboard` - View top 10 members

### 🎮 Fun
- `/8ball` - Ask the magic 8ball
- `/coinflip` - Flip a coin
- `/dice` - Roll a dice
- `/rps` - Play rock paper scissors
- `/choose` - Random choice selector

### 🎫 Tickets
- `/ticket create` - Create a support ticket
- `/ticket close` - Close a ticket

### 🎉 Systems
- `/welcome set` - Set welcome channel
- `/welcome message` - Set welcome message
- `/reactionrole` - Create reaction roles
- `/logs set` - Set logging channel

## Troubleshooting

### Bot doesn't respond to commands
1. Make sure you ran `node deploy-commands.js`
2. Check that bot has "applications.commands" scope
3. Make sure bot has proper permissions in the channel
4. Restart the bot: `Ctrl+C` then run `node index.js` again

### "Bot is not responding"
- Check if bot is running in terminal
- Check if token is correct in `.env`
- Make sure intents are enabled in Developer Portal

### Permission denied errors
- Make sure bot role is higher than the target user's role
- Give bot "Administrator" permission temporarily

### Can't create channels/roles
- Bot needs proper permissions in the server
- Make sure bot role has "Manage Channels" and "Manage Roles"

## File Structure

```
my-discord-bot/
├── index.js                 # Main bot file
├── deploy-commands.js       # Command deployment
├── package.json            # Dependencies
├── config.json             # Configuration
├── .env                    # Environment variables
├── .env.example            # Example env file
├── SETUP.md                # This file
├── commands/               # All slash commands
│   ├── general.js
│   ├── ping.js
│   ├── balance.js
│   ├── rank.js
│   └── ... (more commands)
├── events/                 # Event handlers
│   ├── ready.js
│   ├── messageCreate.js
│   ├── interactionCreate.js
│   └── ... (more events)
└── data/                   # Data storage (auto-created)
    ├── economy.json
    ├── levels.json
    ├── tickets.json
    └── ... (more data files)
```

## Support

If you need help:
1. Check the error message in terminal
2. Review the SETUP.md (this file)
3. Make sure all steps are completed correctly
4. Check Discord.js documentation: https://discord.js.org

Happy coding! 🚀
