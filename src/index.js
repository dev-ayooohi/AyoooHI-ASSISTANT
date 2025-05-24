require('dotenv').config();
const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js');
const { commands: slashCommands, commandsData } = require('./slashCommands');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// Configuration
const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!';

// When the client is ready
client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // Register slash commands
  try {
    console.log('Started refreshing application (/) commands.');
    
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commandsData },
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

// Handle slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;
  
  const command = slashCommands[interaction.commandName];
  
  if (!command) return;
  
  try {
    // Log the slash command usage
    const userTag = interaction.user.tag;
    const commandName = interaction.commandName;
    const options = interaction.options.data.map(o => `${o.name}=${o.value}`).join(', ');
    
    console.log(`[SLASH CMD] ${userTag} used /${commandName}${options ? ` with options: ${options}` : ''}`);
    
    // Execute the command
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing slash command ${interaction.commandName}:`, error);
    
    // Reply with an error message if we haven't replied yet
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ 
        content: 'There was an error while executing this command!', 
        ephemeral: true 
      });
    }
  }
});

// Handle unhandled errors
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login to Discord with your client's token
client.login(TOKEN).catch(err => {
  console.error('Failed to login:', err);
  process.exit(1);
}); 