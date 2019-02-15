const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const moment = require('moment')

module.exports = class UserInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'userinfo',
      group: 'info',
      memberName: 'userinfo',
      description: 'Provides information about the specified user such as their name, date their account was created, when they joined the sever, any roles they have, and more.',
      examples: ['userinfo @User'],
      aliases: ['whois'],
      guildOnly: true,
      args: [{
        key: 'member',
        label: 'user',
        prompt: 'What user would you like to retrieve info on?',
        type: 'member',
        default: ''
      }]
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, false)
  }

  async run (msg, args) {
    try {
      const member = args.member || msg.member
      const joinDiscord = moment(member.user.createdAt).format('lll')
      const joinServer = moment(member.joinedAt).format('lll')
      const r = member.roles.map(roles => roles).splice(1).join(', ').substr(0, 900)
      const infoEmbed = new RichEmbed()
      infoEmbed
        .setThumbnail(member.user.avatarURL)
        .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.avatarURL)
        .addField('Nickname', `${member.nickname ? member.nickname : member.user}`, true)
        .addField('Status', member.user.presence.status, true)
        .addField('Joined', joinServer, true)
        .addField('Registered', joinDiscord, true)
        .setColor(this.client.embed.color(msg.author.id))
        .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
      if (r) {
        infoEmbed.addField('Roles', r)
      }
      if (member.user.id === '392347814413467655') {
        infoEmbed.setDescription('My daddy!')
      }
      if (member.user.id === '470796967468072960') {
        infoEmbed.setDescription('You are looking at my info....')
      }
      if (member.user.id === '484395597508509697') {
        infoEmbed.setDescription('Best Points bot ever made...')
      }
      if (member.user.presence.game) {
        infoEmbed.addField('Game', member.user.presence.game)
      }
      return msg.embed(infoEmbed)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}