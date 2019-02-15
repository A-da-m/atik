const { Command } = require('discord.js-commando')

module.exports = class AntiSwearCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'antiswear',
      memberName: 'antiswear',
      aliases: ['setantiswear'],
      group: 'settings',
      description: 'When enabled the bot will delete swears and warn the member who sent them. This command ignores Moderations and Admins.',
      examples: ['antiswear on'],
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
      if (!args.value) return this.client.usage.send(msg, 'antiswear')
      const state = args.value
      if (state.toLowerCase() === 'on') {
        msg.guild.settings.set('antiswear', state)
        return this.client.respond(msg, `**\`Anti Swear\` has successfully been enabled.**\nTo disable you must run \`${msg.guild.commandPrefix}antiswear off\``)
      } else if (state.toLowerCase() === 'off') {
        msg.guild.settings.set('antiswear', state)
        return this.client.embed.send(msg, `**\`Anti Swear\` has successfully been disabled.**\nTo enable you must run \`${msg.guild.commandPrefix}antiswear on\``)
      } else {
        return this.client.embed.send(msg, `${msg.author}, Invaid state! Use \`on\` or  \`off\`.`)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}