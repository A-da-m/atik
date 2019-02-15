const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class BansCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'bans',
      group: 'info',
      aliases: ['listbans', 'getbans'],
      memberName: 'bans',
      description: 'Provides a list of all banned members.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      }
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, true, 'BAN_MEMBERS')
  }

  async run (msg) {
    try {
      const embed = new RichEmbed()
        .setTitle('Ban List')
        .setColor(this.client.embed.color(msg.author.id))
        .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
      msg.guild.fetchBans().then((bans) => {
        let outStr = ''
        bans.forEach((user) => {
          outStr += `**${user.tag}**\n`
        })
        if (!outStr) outStr = 'No bans found!'
        embed.setDescription(outStr)
        return msg.embed(embed)
      })
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}