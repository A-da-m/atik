const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class ModsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'mods',
      group: 'info',
      aliases: ['admins', 'listmods', 'listadmins'],
      memberName: 'mods',
      description: 'This command will list all the user that can use the bot.',
      examples: ['mods'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      }
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, true)
  }

  async run (msg) {
    try {
      let role = ''
      let admin = ''
      const roleID = msg.guild.settings.get('modrole')
      const list = this.client.guilds.get(msg.guild.id)
      if (!roleID) {
        role = 'No mods found'
      } else {
        role = msg.guild.roles.get(roleID).members.map(m => m.user).join('\n')
      }
      list.members.forEach(member => {
        if (member.hasPermission('ADMINISTRATOR')) {
          admin += `<@${member.user.id}> \n`
        }
      })
      if (!admin) admin = 'No admins found'
      const ListEmbed = new RichEmbed()
        .addField('Admins', admin)
        .addField('Mods', role)
        .setColor(this.client.embed.color(msg.author.id))
        .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
      return msg.embed(ListEmbed)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}