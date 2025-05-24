const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Collection of slash commands for the bot
 */

// Define slash commands
const slashCommands = [
  {
    data: new SlashCommandBuilder()
      .setName('say')
      .setDescription('Makes the bot say something')
      .addStringOption(option => 
        option.setName('message')
          .setDescription('The message to say')
          .setRequired(true)),
    execute: async (interaction) => {
      const message = interaction.options.getString('message');
      await interaction.reply({
        content: message,
        ephemeral: false // Make it public
      });
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('random')
      .setDescription('Generates a random number')
      .addIntegerOption(option => 
        option.setName('min')
          .setDescription('Minimum value (default: 1)')
          .setRequired(false))
      .addIntegerOption(option => 
        option.setName('max')
          .setDescription('Maximum value (default: 100)')
          .setRequired(false)),
    execute: async (interaction) => {
      const min = interaction.options.getInteger('min') || 1;
      const max = interaction.options.getInteger('max') || 100;
      
      if (min >= max) {
        await interaction.reply({
          content: 'The minimum value must be less than the maximum value!',
          ephemeral: true
        });
        return;
      }
      
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      
      await interaction.reply({
        content: `🎲 Random number between ${min} and ${max}: **${randomNum}**`,
        ephemeral: false
      });
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('project')
      .setDescription('Shows information about our project')
      .addStringOption(option =>
        option.setName('details')
          .setDescription('Show specific details about the project')
          .setRequired(false)
          .addChoices(
            { name: 'Overview', value: 'overview' },
            { name: 'Goals', value: 'goals' },
            { name: 'Timeline', value: 'timeline' }
          )),
    execute: async (interaction) => {
      const details = interaction.options.getString('details') || 'overview';
      
      let response;
      switch (details) {
        case 'goals':
          response = 'Our project goals include improved communication, task tracking, and server management.';
          break;
        case 'timeline':
          response = 'Project timeline: Phase 1 (Setup) - Complete, Phase 2 (Development) - In progress, Phase 3 (Testing) - Upcoming';
          break;
        default: // overview
          response = 'This is our community management project. For more information, visit our website: https://example.com/project';
      }
      
      await interaction.reply({
        content: response,
        ephemeral: false
      });
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('userinfo')
      .setDescription('Shows information about a user')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('The user to show information about (default: yourself)')
          .setRequired(false)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const member = interaction.guild.members.cache.get(targetUser.id);
      
      const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`User Information: ${targetUser.tag}`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: 'User ID', value: targetUser.id, inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
          { name: 'Roles', value: member ? member.roles.cache.map(role => role.name).join(', ') : 'N/A' }
        )
        .setFooter({ text: 'User Information', iconURL: interaction.guild.iconURL() })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('serverinfo')
      .setDescription('Shows information about the server'),
    execute: async (interaction) => {
      const guild = interaction.guild;
      const memberCount = guild.memberCount;
      const channels = guild.channels.cache;
      const roles = guild.roles.cache;
      
      const embed = new EmbedBuilder()
        .setColor(0x2ECC71)
        .setTitle(`Server Information: ${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: 'Server ID', value: guild.id, inline: true },
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Members', value: memberCount.toString(), inline: true },
          { name: 'Text Channels', value: channels.filter(c => c.type === 0).size.toString(), inline: true },
          { name: 'Voice Channels', value: channels.filter(c => c.type === 2).size.toString(), inline: true },
          { name: 'Roles', value: roles.size.toString(), inline: true },
          { name: 'Boost Level', value: `Level ${guild.premiumTier}`, inline: true }
        )
        .setFooter({ text: 'Server Information', iconURL: interaction.guild.iconURL() })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('poll')
      .setDescription('Creates a simple poll')
      .addStringOption(option => 
        option.setName('question')
          .setDescription('The question for the poll')
          .setRequired(true))
      .addStringOption(option => 
        option.setName('options')
          .setDescription('Poll options separated by commas (max 10)')
          .setRequired(false)),
    execute: async (interaction) => {
      const question = interaction.options.getString('question');
      const optionsString = interaction.options.getString('options');
      
      if (!optionsString) {
        // Yes/No poll
        const embed = new EmbedBuilder()
          .setColor(0x9B59B6)
          .setTitle('📊 ' + question)
          .setDescription('React with 👍 for Yes or 👎 for No.')
          .setFooter({ text: `Poll created by ${interaction.user.tag}` })
          .setTimestamp();
        
        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        await message.react('👍');
        await message.react('👎');
      } else {
        // Multiple options poll
        const options = optionsString.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
        
        if (options.length > 10) {
          return interaction.reply({ content: 'You can only have up to 10 options!', ephemeral: true });
        }
        
        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        
        const optionsText = options.map((opt, i) => `${reactions[i]} ${opt}`).join('\n');
        
        const embed = new EmbedBuilder()
          .setColor(0x9B59B6)
          .setTitle('📊 ' + question)
          .setDescription(optionsText)
          .setFooter({ text: `Poll created by ${interaction.user.tag}` })
          .setTimestamp();
        
        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        
        // Add reactions
        for (let i = 0; i < options.length; i++) {
          await message.react(reactions[i]);
        }
      }
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('avatar')
      .setDescription('Shows a user\'s avatar')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('The user whose avatar to show (default: yourself)')
          .setRequired(false)),
    execute: async (interaction) => {
      const user = interaction.options.getUser('user') || interaction.user;
      
      const embed = new EmbedBuilder()
        .setColor(0xE74C3C)
        .setTitle(`${user.tag}'s Avatar`)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('reminder')
      .setDescription('Sets a reminder')
      .addStringOption(option => 
        option.setName('message')
          .setDescription('What to remind you about')
          .setRequired(true))
      .addIntegerOption(option => 
        option.setName('time')
          .setDescription('Time in minutes')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(60)),
    execute: async (interaction) => {
      const message = interaction.options.getString('message');
      const time = interaction.options.getInteger('time');
      
      // Actually implement the reminder functionality properly
      await interaction.reply(`I'll remind you about "${message}" in ${time} minute(s).`);
      
      setTimeout(() => {
        try {
          interaction.followUp({
            content: `⏰ **Reminder:** ${message}`,
            ephemeral: false
          });
        } catch (error) {
          console.error('Error sending reminder:', error);
        }
      }, time * 60 * 1000); // Actually wait the full time in minutes
    }
  },
  
  {
    data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Shows a list of available commands'),
    execute: async (interaction) => {
      const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle('Bot Commands')
        .setDescription('Here are all the commands you can use:')
        .addFields(
          { name: '/say', value: 'Makes the bot say something' },
          { name: '/random', value: 'Generates a random number' },
          { name: '/project', value: 'Shows information about our project' },
          { name: '/userinfo', value: 'Shows information about a user' },
          { name: '/serverinfo', value: 'Shows information about the server' },
          { name: '/poll', value: 'Creates a simple poll' },
          { name: '/avatar', value: 'Shows a user\'s avatar' },
          { name: '/reminder', value: 'Sets a reminder' },
          { name: '/help', value: 'Shows this list of commands' }
        )
        .setFooter({ text: 'Bot Help', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    }
  }
];

// Create a collection of slash commands
const commands = {};
slashCommands.forEach(cmd => {
  commands[cmd.data.name] = cmd;
});

module.exports = {
  commands,
  commandsData: slashCommands.map(cmd => cmd.data.toJSON())
}; 