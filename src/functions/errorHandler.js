const { RichEmbed } = require('discord.js')

class ErrorHandler {
  constructor (client) {
    this.client = client
  }
  send (error, msg) {
    const embed = new RichEmbed()
      .setColor(this.client.config.error_theme.color)
      .setFooter(this.client.config.error_theme.text, this.client.config.error_theme.logo)
    if (msg) this.client.embed.send(msg, `${msg.author}, I have encountered an error. I have automatically sent a error report to my developers.`, false, 0xff4747)
    embed.setTitle('Error Report')
    if (msg) embed.setDescription(`User: \`${msg.author.tag}\`\nGuild: \`${msg.guild.name || 'N/A'}\`.`)
    embed.addField('```' + error.message + '```', '```' + error.stack.substring(0, 1018) + '```')
    const channel = this.client.channels.get(this.client.config.logs_channels.error)
    if (!channel) return
    return channel.send(embed)
  }
}
module.exports = ErrorHandler