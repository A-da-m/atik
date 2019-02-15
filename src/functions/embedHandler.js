const { RichEmbed } = require('discord.js')

class EmbedHandler {
  constructor (client) {
    this.client = client
    this.pro_users = client.config.pro_users
  }
  color (id) {
    if (this.pro_users.includes(id)) return this.client.config.pro_theme.color
    else return this.client.config.default_theme.color
  }
  text (id) {
    if (this.pro_users.includes(id)) return this.client.config.pro_theme.text
    else return this.client.config.default_theme.text
  }
  logo (id) {
    if (this.pro_users.includes(id)) return this.client.config.pro_theme.logo
    else return this.client.config.default_theme.logo
  }
  send (msg, message, del, color) {
    if (!msg) return
    if (!message) return
    const embed = new RichEmbed()
      .setDescription(message)
    if (color) embed.setColor(color)
    else embed.setColor(this.color(msg.author.id))
    if (del === true) {
      return msg.channel.send(embed).then((result) => {
        result.delete(3000)
      })
    } else {
      return msg.embed(embed)
    }
  }
}
module.exports = EmbedHandler