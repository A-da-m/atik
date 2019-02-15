const { Command } = require('discord.js-commando')

module.exports = class AddRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'addrole',
      group: 'moderation',
      aliases: ['giverole', 'role'],
      memberName: 'addrole',
      description: 'Adds the specified role to a specific member or group of members',
      examples: ['addrole  @\\_Adam\\_#5850 @Founder'],
      args: [
        {
          key: 'member',
          prompt: 'Which user do you want to add a role to?',
          type: 'member',
          default: ''
        },
        {
          key: 'role',
          prompt: 'What is the name of the role you want to add?',
          type: 'role',
          default: ''
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
      if (!args.member || !args.role) return this.client.usage.send(msg, 'addrole')
      if (args.member.manageable === false) return this.client.embed.send(msg, `**${msg.author}, I can't give this member that role!**`, false)
      if (args.member.roles.has(args.role.id)) return this.client.embed.send(msg, `**${msg.author}, That member already has that role!**`, false)
      await (args.member.addRole(args.role.id))
      this.client.audit.commandAction('addrole', msg, args)
      return this.client.embed.send(msg, `✅ **The role ${args.role} has been added to ${args.member}!**`, false)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}