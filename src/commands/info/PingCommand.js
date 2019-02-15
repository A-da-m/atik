const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      group: 'info',
      memberName: 'ping',
      description: 'Returns the ping.',
      guarded: true,
      examples: ['ping'],
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 5
      }
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, false)
  }

  async run (msg) {
    try {
      const message = await msg.say('Ping?')
      const pingEmbed = new RichEmbed()
        .setDescription(`**Latency:** \`${Math.round(this.client.ping)}ms\``)
        .setColor(this.client.embed.color(msg.author.id))
      return await message.edit(pingEmbed)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}