const { Command } = require('discord.js-commando')

module.exports = class LogsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'logs',
      aliases: ['modlogs', 'setlogs', 'setmodlogs'],
      group: 'settings',
      memberName: 'logs',
      description: 'Assigns a specified channel in which the bot logs are recorded.',
      examples: ['logs #modlogs'],
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
      if (!args.value) return this.client.usage.send(msg, 'logs')
      if (args.value === 'reset' || args.value === 'clear') {
        msg.guild.settings.remove('modlog')
        return this.client.embed.send(msg, `**\`Moderator Logs\` channel has successfully been removed.**\nTo assign a new channel you must run \`${msg.guild.commandPrefix}logs [channel]\``)
      } else {
        const rawChan = msg.mentions.channels.first()
        if (!rawChan) return this.client.embed.send(msg, `**${msg.author}, Please specify a channel to use for the \`Moderator Logs\`!**`)
        const chanToLog = rawChan.id
        msg.guild.settings.set('modlog', chanToLog)
        return this.client.embed.send(msg, `**\`Moderator Logs\` channel has successfully been set to <#${msg.guild.settings.get('modlog')}>.**\nTo remove you must run \`${msg.guild.commandPrefix}logs clear\``)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}