const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class ListRolesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'listroles',
      group: 'info',
      aliases: ['roles'],
      memberName: 'listroles',
      description: 'Lists all server roles',
      examples: ['listroles'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      }
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, false)
  }

  async run (msg) {
    try {
      const embed = new RichEmbed()
        .setTitle('Roles')
        .setDescription(msg.guild.roles
          .sort((role1, role2) => role2.position - role1.position)
          .array()
          .join(', '))
        .setColor(this.client.embed.color(msg.author.id))
        .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
      return msg.embed(embed)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}