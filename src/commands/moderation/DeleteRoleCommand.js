const { Command } = require('discord.js-commando')

module.exports = class DeleteRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'deleterole',
      group: 'moderation',
      memberName: 'deleterole',
      description: 'Deletes a specified role from the server.',
      examples: ['deleterole CoolBot'],
      args: [
        {
          key: 'role',
          label: 'role',
          prompt: 'What is the name of the role you want to delete?',
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
      if (!args.role) return this.client.usage.send(msg, 'deleterole')
      args.role.delete()
      this.client.audit.commandAction('delrole', msg, args)
      return this.client.embed.send(msg, `✅ **The role \`${args.role.name}\` was successfully deleted.**`, false)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}