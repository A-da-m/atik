const { Command } = require('discord.js-commando')

module.exports = class AntiLinkCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'antilink',
      memberName: 'antilink',
      aliases: ['setantilink'],
      group: 'settings',
      description: 'When enabled the bot will delete links and warn the member who sent them. This command ignores Moderations and Admins.',
      examples: ['antilink on'],
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
      if (!args.value) return this.client.usage.send(msg, 'antilink')
      const state = args.value
      if (state.toLowerCase() === 'on') {
        msg.guild.settings.set('antilink', state)
        return this.client.embed.send(msg, `**\`Anti Links\` has successfully been enabled.**\nTo disable you must run \`${msg.guild.commandPrefix}antilink off\``)
      } else if (state.toLowerCase() === 'off') {
        msg.guild.settings.set('antilink', state)
        return this.client.embed.send(msg, `**\`Anti Links\` has successfully been disabled.**\nTo enable you must run \`${msg.guild.commandPrefix}antilink on\``)
      } else {
        return this.client.embed.send(msg, `${msg.author}, Invaid state! Use \`on\` or  \`off\`.`)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}