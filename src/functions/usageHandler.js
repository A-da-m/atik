const { RichEmbed } = require('discord.js')

class UsageHandler {
  constructor (client) {
    this.client = client
  }
  send (msg, commandName) {
    try {
      const command = this.client.registry.commands.find(c => c.memberName === commandName)
      const examples = command.examples.map(example => `\`${msg.channel.guild.commandPrefix}${example}\``)
      if (!examples) examples.push('None')
      const embed = new RichEmbed()
      if (command.name) {
        embed.setTitle(`Command: **${command.name}**`)
      }
      if (command.description) {
        embed.setDescription(command.description)
      }
      embed.addField('Usage', `\`${msg.channel.guild.commandPrefix}${command.name} ${command.format || ''}\``)
      embed.addField('Example', examples.join('\n'))
      embed.setColor(this.client.embed.color(msg.author.id))
      embed.setFooter(this.client.embed.text(msg.author.id), msg.client.embed.logo(msg.author.id))
      return msg.embed(embed)
    } catch (error) {
      return this.client.error.send(error)
    }
  }
}
module.exports = UsageHandler