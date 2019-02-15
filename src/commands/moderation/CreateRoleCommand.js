const { Command } = require('discord.js-commando')

module.exports = class CreateRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'createrole',
      group: 'moderation',
      memberName: 'createrole',
      description: 'Creates a new role for the server.',
      examples: ['createrole CoolBot'],
      args: [
        {
          key: 'role',
          label: 'role',
          prompt: 'What is the name of the role you want to create?',
          default: '',
          type: 'string'
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
      if (!args.role) return this.client.usage.send(msg, 'createrole')
      msg.guild.createRole({
        name: args.role
      })
        .then(role => {
          this.client.audit.commandAction('createrole', msg, args)
          return this.client.embed.send(msg, `✅ **The role ${role} was successfully created.**`, false)
        })
        .catch(error => {
          return this.client.error.send(error, msg)
        })
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}