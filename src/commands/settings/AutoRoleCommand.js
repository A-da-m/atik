const { Command } = require('discord.js-commando')

module.exports = class AutoRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'autorole',
      memberName: 'autorole',
      aliases: ['setautorole'],
      group: 'settings',
      description: 'Automatically gives a member the specified role when they join the server.',
      examples: ['autorole Noobs'],
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
      if (!args.value) return this.client.usage.send(msg, 'autorole')
      if (args.value === 'reset' || args.value === 'clear') {
        msg.guild.settings.remove('autorole')
        return this.client.embed.send(msg, `**\`Auto Role\` has successfully been removed.**\nTo assign a new role you must run \`${msg.guild.commandPrefix}autorole [role]\``)
      } else {
        const rawRole = msg.mentions.roles.first()
        if (!rawRole || rawRole.name === '@everyone' || rawRole.name === '@here') return this.client.embed.send(msg, `**${msg.author}, That is not a role! Was your capatalization and spelling correct?**`)
        const roleToLog = rawRole.id
        msg.guild.settings.set('autorole', roleToLog)
        return this.client.embed.send(msg, `**\`Auto Role\` has successfully been set to <@&${msg.guild.settings.get('autorole')}>.**\nTo remove you must run \`${msg.guild.commandPrefix}autorole clear\``)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}