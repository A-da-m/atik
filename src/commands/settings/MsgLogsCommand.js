const { Command } = require('discord.js-commando')

module.exports = class MsgLogsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'msglogs',
      group: 'settings',
      memberName: 'msglogs',
      description: 'When enabled, logs will include information about members updating messages. These are actions such as, deleting messages and editing messages.',
      examples: ['msglogs on'],
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'value',
          label: 'value',
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
      if (!args.value) return this.client.usage.send(msg, 'msglogs')
      const state = args.value
      if (state.toLowerCase() === 'on') {
        msg.guild.settings.set('msglogs', state)
        return this.client.embed.send(msg, `**\`Message Logs\` has successfully been enabled.**\nTo disable you must run \`${msg.guild.commandPrefix}msglogs off\``)
      } else if (state.toLowerCase() === 'off') {
        msg.guild.settings.set('msglogs', state)
        return this.client.embed.send(msg, `**\`Message Logs\` has successfully been disabled.**\nTo enable you must run \`${msg.guild.commandPrefix}msglogs on\``)
      } else {
        return this.client.embed.send(msg, `${msg.author}, Invaid state! Use \`on\` or  \`off\`.`)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}