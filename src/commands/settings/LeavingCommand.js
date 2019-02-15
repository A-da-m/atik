const { Command } = require('discord.js-commando')

module.exports = class LeavingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'leaving',
      aliases: ['setleaving'],
      group: 'settings',
      memberName: 'leaving',
      description: 'Assigns a specified channel in which a message will be sent when a member leaves the server.',
      examples: ['leaving #bye'],
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
      if (!args.value) return this.client.usage(msg, 'leaving')
      if (args.value === 'reset' || args.value === 'clear') {
        msg.guild.settings.remove('byechannel')
        return this.client.embed.send(msg, `**\`Leaving Channel\` channel has successfully been removed.**\nTo assign a new channel you must run \`${msg.guild.commandPrefix}leaving [channel]\``)
      } else {
        const rawChan = msg.mentions.channels.first()
        if (!rawChan) return this.client.embed.send(msg, `**${msg.author}, Please specify a channel to use for the leaving message!**`)
        const chanToLog = rawChan.id
        msg.guild.settings.set('byechannel', chanToLog)
        return this.client.embed.send(msg, `**\`Leaving Channel\` channel has successfully been set to <#${msg.guild.settings.get('byechannel')}>.**\nTo remove you must run \`${msg.guild.commandPrefix}leaving clear\``)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}