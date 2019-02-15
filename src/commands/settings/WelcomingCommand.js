const { Command } = require('discord.js-commando')

module.exports = class WelcomingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'welcoming',
      aliases: ['greeting'],
      group: 'settings',
      memberName: 'welcoming',
      description: 'Assigns a specified channel in which a message will be sent when a member joins the server.',
      examples: ['welcoming #hello'],
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
      if (!args.value) return this.client.usage.send(msg, 'welcoming')
      if (args.value === 'reset' || args.value === 'clear') {
        msg.guild.settings.remove('greatchannel')
        return this.client.embed.send(msg, `**\`Welcoming Channel\` channel has successfully been removed.**\nTo assign a new channel you must run \`${msg.guild.commandPrefix}welcoming [channel]\``)
      } else {
        const rawChan = msg.mentions.channels.first()
        if (!rawChan) return this.client.embed.send(msg, `**${msg.author}, Please specify a channel to use for the welcoming message!**`)
        const chanToLog = rawChan.id
        msg.guild.settings.set('greatchannel', chanToLog)
        return this.client.embed.send(msg, `**\`Welcoming Channel\` channel has successfully been set to <#${msg.guild.settings.get('greatchannel')}>.**\nTo remove you must run \`${msg.guild.commandPrefix}welcoming clear\``)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}