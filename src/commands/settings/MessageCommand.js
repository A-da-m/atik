const { Command } = require('discord.js-commando')

module.exports = class MessageCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'message',
      aliases: ['welcomemessage'],
      group: 'settings',
      memberName: 'message',
      description: 'Assigns a custom message for when members join the server.',
      examples: ['message Welcome {{mention}}..'],
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'value',
          type: 'string',
          prompt: '',
          default: '',
          infinite: false
        }
      ],
      guildOnly: true,
      guarded: true
    })
  }

  run (msg, args) {
    try {
      if (!args.value) return this.client.usage.send(msg, 'message')
      if (args.value === 'reset' || args.value === 'clear') {
        msg.guild.settings.remove('greetmessage')
        return this.client.embed.send(msg, `**\`Welcome Message\` has successfully been removed.**\nTo assign a new message you must run \`${msg.guild.commandPrefix}message [message]\``)
      } else {
        msg.guild.settings.set('greetmessage', args.value)
        return this.client.embed.send(msg, `**\`Welcome Message\` has successfully been set to:**\n\`\`\`${msg.guild.settings.get('greetmessage')}\`\`\`\nTo remove you must run \`${msg.guild.commandPrefix}message clear\``)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}