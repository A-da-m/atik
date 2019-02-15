const { Command } = require('discord.js-commando')

module.exports = class ModRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'modrole',
      group: 'settings',
      memberName: 'modrole',
      description: 'Sets the role defined as Moderator that can use mod-only commands.',
      examples: ['modrole Guards'],
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
      if (!args.value) return this.client.usage.send(msg, 'modrole')
      if (args.value === 'reset' || args.value === 'clear') {
        msg.guild.settings.remove('modrole')
        return this.client.embed.send(msg, `**\`Moderator Role\` has successfully been removed.**\nTo assign a new role you must run \`${msg.guild.commandPrefix}modrole [role]\``)
      } else {
        const rawRole = msg.mentions.roles.first()
        if (!rawRole || rawRole.name === '@everyone' || rawRole.name === '@here') return this.client.embed.send(msg, `**${msg.author}, That is not a role! Was your capatalization and spelling correct?**`)
        const roleToLog = rawRole.id
        msg.guild.settings.set('modrole', roleToLog)
        return this.client.embed.send(msg, `**\`Moderator Role\` has successfully been set to <@&${msg.guild.settings.get('modrole')}>.**\nTo remove you must run \`${msg.guild.commandPrefix}modrole clear\``)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}