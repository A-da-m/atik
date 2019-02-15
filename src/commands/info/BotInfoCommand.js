const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const { version } = require('../../../package')

module.exports = class BotInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'botinfo',
      aliases: ['information', 'stats', 'about', 'info', 'bot', 'invite'],
      group: 'info',
      memberName: 'botinfo',
      description: 'Gives you the bots information.',
      guarded: true,
      examples: ['botinfo'],
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 5
      },
      clientPermissions: ['EMBED_LINKS']
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, false)
  }

  run (msg) {
    try {
      const botEmbed = new RichEmbed()
        .setDescription('Bot Information')
        .setThumbnail(this.client.user.displayAvatarURL)
        .addField('Author', '<@>')
        .addField('Servers', this.client.guilds.size, true)
        .addField('Commands', this.client.registry.commands.size, true)
        .addField('Home Server', this.client.options.invite ? `[Here](${this.client.options.invite})` : 'None', true)
        .addField('Version', `v${version}`, true)
        .addField('Invite', 'You can invite me to your server from my site [bot.atiktech.co](https://bot.atiktech.co)', false)
        .addField('Announcements', 'As you may know, both ATIK and Points are free, but keeping them online is not. Both ATIK and Points have premium tiers that cost money and add additional features. If you appreciate the work being done here and have the cash to spare we strongly hope you can help us by buying a premium tier at https://www.patreon.com/atiktech')
        .setColor(this.client.embed.color(msg.author.id))
        .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
      return msg.embed(botEmbed)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}