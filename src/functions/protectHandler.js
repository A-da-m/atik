const { RichEmbed } = require('discord.js')

class ProtectHandler {
  constructor (client) {
    this.client = client
  }
  antilink (msg) {
    try {
      const urls = ['http', '.co.uk', 'www.', '.com', '.net', '.co', '.desgin', '.gg', '.org', 'discord.gg', 'discord.me', 'discord.io/', 'discordapp.com/invite']
      const on = msg.guild.settings.get('antilink')
      const modlog = msg.guild.settings.get('modlog')
      if (on !== 'on') return
      if (urls.some(word => msg.content.includes(word))) {
        msg.delete()
        this.client.embed.send(msg, 'Links are not allowed in this server.', true)
        if (!modlog) return
        const warnEmbed = new RichEmbed()
          .setColor(0xe6b800)
          .setTitle('Member Warned')
          .addField('User', msg.author, true)
          .addField('Moderator', this.client.user, true)
          .addField('Channel', msg.channel, true)
          .addField('Reason', 'Posted a link', true)
          .addField('Message Content', msg.cleanContent)
          .setFooter(this.client.embed.text(msg.guild.ownerID), this.client.embed.logo(msg.guild.ownerID))
          .setTimestamp()
        const channel = msg.guild.channels.get(modlog)
        if (!channel) return
        return channel.send(warnEmbed)
      }
    } catch (error) {
      return this.client.error.send(error)
    }
  }

  antiswear (msg) {
    try {
      const badwords = ['fuck', 'fek', 'fck', 'shit', 'bitch', 'dick', 'pussy', 'xxx', 'porn', 'fuck', 'sex', '18+', 'anal', 'gay', 'lesbian', 'dick', 'cock', 'boobs', 'ass', 'nsfw', 'tits', 'nudes', 'hentai', 'nodes', 'vagina', 'pussy', 'penis']
      const on = msg.guild.settings.get('antiswear')
      const modlog = msg.guild.settings.get('modlog')
      if (on !== 'on') return
      if (badwords.some(word => msg.content.includes(word))) {
        msg.delete()
        this.client.embed.send(msg, 'Swearing is not allowed in this server.', true)
        if (!modlog) returnß
        const warnEmbed = new RichEmbed()
          .setColor(0xe6b800)
          .setTitle('Member Warned')
          .addField('User', msg.author, true)
          .addField('Moderator', this.client.user, true)
          .addField('Channel', msg.channel, true)
          .addField('Reason', 'Swearing', true)
          .addField('Message Content', msg.cleanContent)
          .setFooter(this.client.embed.text(msg.guild.ownerID), this.client.embed.logo(msg.guild.ownerID))
          .setTimestamp()
        const channel = msg.guild.channels.get(modlog)
        if (!channel) return
        return channel.send(warnEmbed)
      }
    } catch (error) {
      return this.client.error.send(error)
    }
  }
}
module.exports = ProtectHandler