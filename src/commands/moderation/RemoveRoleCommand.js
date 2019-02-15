const { Command } = require('discord.js-commando')

module.exports = class removeroleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'removerole',
      group: 'moderation',
      aliases: ['delrole', 'takerole'],
      memberName: 'removerole',
      description: 'Takes the specified role from a specific member or group of members.',
      examples: ['removerole  @\\_Adam\\_#5850 @Founder'],
      args: [
        {
          key: 'member',
          prompt: 'Which user do you want to remove a role from?',
          default: '',
          type: 'member'
        },
        {
          key: 'role',
          prompt: 'What is the name of the role you want to remove?',
          default: '',
          type: 'role'
        }
      ],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      },
      clientPermissions: ['MANAGE_ROLES']
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, true, 'MANAGE_ROLES')
  }

  async run (msg, args) {
    try {
      if (!args.member || !args.role) return this.client.usage.send(msg, 'removerole')
      if (args.member.manageable === false) return this.client.embed.send(msg, `**${msg.author}, I can't remove this member from that role!**`)
      if (!args.member.roles.has(args.role.id)) return this.client.embed.send(msg, `**${msg.author}, That member does not have that role!**`)
      await (args.member.removeRole(args.role.id))
      this.client.audit.commandAction('removerole', msg, args)
      return this.client.embed.send(msg, `✅ **The role ${args.role} has been removed from ${args.member}!**`)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}