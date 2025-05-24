# Discord Assistant Bot

A Discord bot with useful utility commands for server management and user interaction.

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the project root with the following content:
```
# Discord Bot Token
DISCORD_TOKEN=your_discord_bot_token_here
```
4. Replace `your_discord_bot_token_here` with your actual Discord bot token
5. Start the bot with `npm start` or use `npm run dev` for development with auto-restart

## Features

### Commands
All commands are available as slash commands (/)

- `/say [message]` - Makes the bot say something
- `/random [min] [max]` - Generates a random number between min and max
- `/project [details]` - Shows information about the project (with options for overview, goals, and timeline)
- `/userinfo [user]` - Shows detailed information about a user
- `/serverinfo` - Shows detailed information about the server
- `/poll [question] [options]` - Creates a poll with multiple options
- `/avatar [user]` - Shows a user's avatar in high resolution
- `/reminder [message] [time]` - Sets a reminder for later
- `/help` - Shows a list of available slash commands

## Creating a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Copy the bot token and add it to your `.env` file
5. Go to the "OAuth2" tab > "URL Generator"
6. Select scopes: `bot` and `applications.commands` (required for slash commands)
7. Select permissions: `Send Messages`, `Embed Links`, `Use Slash Commands`
8. Use the generated URL to invite the bot to your server

## Troubleshooting

- If slash commands don't appear, try reinviting the bot with the `applications.commands` scope
- Make sure your bot has the necessary permissions in the server 