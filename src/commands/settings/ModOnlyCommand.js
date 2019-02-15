const { Command } = require('discord.js-commando')

module.exports = class ModOnlyCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'modonly',
      group: 'settings',
      memberName: 'modonly',
      description: 'Makes it so only Moderators can run bot commands.',
      examples: ['modonly on'],
      args: [
        {
          key: 'value',
          type: 'string',
          prompt: '',
          default: ''
        }
      ],
      userPermissions: ['ADMINISTRATOR'],
      guildOnly: true,
      guarded: true
    })
  }

  run (msg, args) {
    try {
      if (!args.value) return this.client.usage.send(msg, 'modonly')
      const state = args.value
      if (state.toLowerCase() === 'on') {
        msg.guild.settings.set('modonly', state)
        return this.client.embed.send(msg, `**\`Moderator Only\` has successfully been enabled.**\nTo disable you must run \`${msg.guild.commandPrefix}modonly off\``)
      } else if (state.toLowerCase() === 'off') {
        msg.guild.settings.set('modonly', state)
        return this.client.embed.send(msg, `**\`Moderator Only\` has successfully been disabled.**\nTo enable you must run \`${msg.guild.commandPrefix}modonly on\``)
      } else {
        return this.client.embed.send(msg, `${msg.author}, Invaid state! Use \`on\` or  \`off\`.`)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}