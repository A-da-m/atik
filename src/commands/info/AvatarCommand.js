const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class AvatarCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'avatar',
      group: 'info',
      memberName: 'avatar',
      description: 'Check avatars',
      examples: ['avatar @User'],
      args: [
        {
          key: 'user',
          prompt: 'Which user do you want to see the avatar if?',
          type: 'user',
          default: ''
        }
      ],
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

  async run (msg, args) {
    const user = args.user || msg.author
    const avatarEmbed = new RichEmbed()
      .setImage(user.displayAvatarURL)
      .setColor(this.client.embed.color(msg.author.id))
      .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
    return msg.embed(avatarEmbed)
  }
}