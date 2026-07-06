# Bot Features Documentation 📚

## 🤖 General Commands

### /help
Shows all available commands and their categories.

### /ping
Displays the bot's latency (response time) in milliseconds.

### /uptime
Shows how long the bot has been running since the last restart.

### /userinfo [user]
Get detailed information about a user:
- Username
- User ID
- Account creation date
- When they joined the server
- If they're a bot

### /serverinfo
Get details about the current server:
- Server ID
- Member count
- Number of channels
- Number of roles
- Server creation date
- Server owner

### /avatar [user]
Display a user's profile picture in high quality.

---

## 🛡️ Moderation Commands

### /ban <user> [reason]
Ban a user from the server.
- **Permissions Required**: Ban Members
- **Example**: `/ban @user Spamming`

### /kick <user> [reason]
Kick a user from the server.
- **Permissions Required**: Kick Members
- **Example**: `/kick @user Disruptive behavior`

### /timeout <user> <duration> [reason]
Timeout a user for specified minutes.
- **Permissions Required**: Moderate Members
- **Duration**: In minutes (max 40320 = 28 days)
- **Example**: `/timeout @user 60 Spamming`

### /purge <amount>
Delete multiple messages at once.
- **Permissions Required**: Manage Messages
- **Limit**: Maximum 100 messages
- **Example**: `/purge 50`

---

## 💰 Economy System

### /balance [user]
Check how many credits you or another user has.

### /work
Work to earn money.
- **Reward**: 30-100 credits
- **Cooldown**: None (spam-able but XP cooldown applies)
- **Usage**: `/work`

### /beg
Beg for money from others.
- **Success Rate**: 50%
- **Reward**: 5-25 credits if successful
- **Usage**: `/beg`

### /daily
Claim your daily reward.
- **Reward**: 100 credits
- **Frequency**: Once per 24 hours
- **Usage**: `/daily`

### /transfer <user> <amount>
Transfer credits to another user.
- **Example**: `/transfer @friend 500`
- **Validation**: You can't transfer more than you have

---

## 📈 Leveling System

### How XP Works
- Gain 10-30 XP per message
- XP cooldown: 60 seconds per message
- Bots don't earn XP
- Direct messages don't give XP

### /rank [user]
Check your or another user's rank and level.
- Displays current XP
- Shows next level XP requirement
- Visual progress bar

### /leaderboard
View the top 10 members by XP and level.
- Medals for top 3 (🥇 🥈 🥉)
- Shows level and total XP
- Updates in real-time

---

## 🎮 Fun Commands

### /8ball <question>
Ask the magic 8ball a yes/no question.
- **Responses**: Yes, No, Maybe, Ask later, etc.
- **Example**: `/8ball Will I win?`

### /coinflip
Flip a coin.
- **Result**: Heads or Tails

### /dice [sides]
Roll a dice.
- **Default sides**: 6
- **Range**: 2-1000 sides
- **Example**: `/dice 20`

### /rps <choice>
Play rock paper scissors with the bot.
- **Choices**: Rock, Paper, Scissors
- **Example**: `/rps Rock`

### /choose <choices>
Let the bot randomly choose from your options.
- **Format**: Comma-separated list
- **Example**: `/choose pizza, burger, tacos`

---

## 🎫 Ticket System

### /ticket create
Create a support ticket.
- **What it does**:
  - Creates a private channel
  - Only you and admins can see it
  - Has a close button
- **Example**: `/ticket create`

### /ticket close
Close and delete a ticket.
- **Usage**: Run this command inside a ticket channel
- **Effect**: Channel deletes after 5 seconds

### Ticket Features
- Private channels (only creator + staff can see)
- Automatic numbering (ticket-1, ticket-2, etc.)
- Close button with confirmation
- Ticket transcripts saved

---

## 🎉 Welcome System

### /welcome set <channel>
Set where welcome messages are sent.
- **Example**: `/welcome set #welcome`
- **Permissions Required**: Administrator

### /welcome message <message>
Set the welcome message text.
- **Placeholders**:
  - `{user}` - Mentions the new member
  - `{server}` - Server name
- **Example**: `/welcome message Welcome {user} to {server}!`
- **Permissions Required**: Administrator

### Features
- Auto sends when members join
- Custom embed design
- Member thumbnail
- Supports mentions and formatting

---

## 🎭 Reaction Roles

### /reactionrole <role> <description>
Create a button for users to assign themselves a role.
- **Example**: `/reactionrole @gamer "Get Gamer Role"`
- **Permissions Required**: Administrator
- **How it works**:
  1. Creates a button
  2. User clicks the button
  3. Role is given or removed
  4. User gets confirmation message

### Features
- Toggle on/off (click again to remove)
- Permission checking
- Confirmation messages
- Error handling

---

## 📊 Logging System

### /logs set <channel>
Set where all server logs are sent.
- **Example**: `/logs set #logs`
- **Permissions Required**: Administrator

### Logged Events

**Messages**:
- Message deleted (shows content)
- Message edited (shows before/after)

**Members**:
- Member joined (shows account creation date)
- Member left (shows member count)

**Details Included**:
- User information (username, mention)
- Timestamp of event
- Channel where it happened
- Content (for message logs)

### Features
- Color-coded embeds (green=join, red=leave/delete, yellow=edit)
- Timestamps on every log
- User avatars
- Automatic log filtering

---

## Data Storage

All data is automatically saved to JSON files:

**`data/economy.json`**
- Stores user balances
- Format: `{"userId": balance}`

**`data/levels.json`**
- Stores XP and level data
- Format: `{"userId": {"xp": number, "level": number}}`

**`data/tickets.json`**
- Stores ticket information
- Format: `{"channelId": {"creator": userId, "createdAt": timestamp, "closed": boolean}}`

**`data/welcome.json`**
- Stores welcome settings per server
- Format: `{"guildId": {"channelId": id, "message": text}}`

**`data/logs.json`**
- Stores logging settings per server
- Format: `{"guildId": {"channelId": id}}`

**`data/daily.json`**
- Stores last daily reward claim time
- Format: `{"userId": timestamp}`

---

## Configuration

Edit `config.json` to customize:

```json
{
  "leveling": {
    "enabled": true,
    "min_xp": 10,      // Minimum XP per message
    "max_xp": 30,      // Maximum XP per message
    "cooldown": 60     // Seconds between XP gains
  },
  "economy": {
    "daily_reward": 100,   // Credits for /daily
    "work_reward": 50,     // Average work reward
    "beg_reward": 10       // Average beg reward
  }
}
```

---

## Permissions

**Administrator Commands**:
- `/welcome set`
- `/welcome message`
- `/reactionrole`
- `/logs set`

**Moderator Commands** (requires Ban/Kick/Moderate Members):
- `/ban`
- `/kick`
- `/timeout`
- `/purge`

**Everyone Can Use**:
- All other commands

---

## Tips & Tricks

✅ **Leveling Tips**:
- Message at least 60 seconds apart to get XP
- Check leaderboard to see your rank
- Each level requires more XP

✅ **Economy Tips**:
- Work gives more money than begging
- Claim daily rewards every day for passive income
- Transfer money to help friends

✅ **Ticket Tips**:
- Use tickets for support requests
- Admins can see all tickets
- Tickets automatically organize support

✅ **Setup Tips**:
- Set welcome and log channels first
- Test all commands in a test channel
- Create reaction role messages for common roles

---

## Troubleshooting

**"I don't see the commands"**
- Run `node deploy-commands.js`
- Restart the bot
- Check that bot has "applications.commands" scope

**"Permission denied" error**
- Make sure bot role is high enough
- Give bot Administrator permission temporarily
- Check channel permissions

**"Command not working"**
- Check bot is online (should show in members list)
- Try in a different channel
- Check bot has required permissions
- Look at bot logs for errors

**"No data saving"**
- Check `/data` folder exists
- Make sure bot has write permissions
- Check available disk space

---

For more help, check the main [SETUP.md](./SETUP.md) file!
