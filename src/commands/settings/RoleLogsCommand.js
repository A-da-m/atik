const { Command } = require('discord.js-commando')

module.exports = class RoleLogsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rolelogs',
      group: 'settings',
      memberName: 'rolelogs',
      description: 'When enabled, logs will include information about server roles. These include, deleting, updating, or creating a role.',
      examples: ['rolelogs on'],
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'value',
          type: 'string',
          prompt: '',
          default: ''
        }
      ],
      guildOnly: true,
      guarded: true
    })
  }

  run (msg, args) {
    try {
      if (!args.value) return this.client.usage.send(msg.channel, 'rolelogs', msg.author)
      const state = args.value
      if (state.toLowerCase() === 'on') {
        msg.guild.settings.set('rolelogs', state)
        return this.client.embed.send(msg, `**\`Role Logs\` has successfully been enabled.**\nTo disable you must run \`${msg.guild.commandPrefix}rolelogs off\``)
      } else if (state.toLowerCase() === 'off') {
        msg.guild.settings.set('rolelogs', state)
        return this.client.embed.send(msg, `**\`Role Logs\` has successfully been disabled.**\nTo enable you must run \`${msg.guild.commandPrefix}rolelogs on\``)
      } else {
        return this.client.embed.send(msg, `${msg.author}, Invaid state! Use \`on\` or  \`off\`.`)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}