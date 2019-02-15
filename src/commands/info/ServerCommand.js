const { Command } = require('discord.js-commando')
const moment = require('moment')
const { RichEmbed } = require('discord.js')

module.exports = class ServerInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'serverinfo',
      group: 'info',
      memberName: 'serverinfo',
      description: 'Gives you the servers information.',
      examples: ['serverinfo'],
      aliases: ['serverstats', 'serverdetails'],
      guildOnly: true
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, false)
  }

  contentFilter (filter) {
    switch (filter) {
      case 0:
        return 'Content filter disabled'
      case 1:
        return 'Scan messages of members without a role'
      case 2:
        return 'Scan messages sent by all members'
      default:
        return 'Content Filter unknown'
    }
  }

  verificationFilter (filter) {
    switch (filter) {
      case 0:
        return 'None - unrestricted'
      case 1:
        return 'Low - must have verified email on account'
      case 2:
        return 'Medium - must be registered on Discord for longer than 5 minutes'
      case 3:
        return 'High - must be a member of the server for longer than 10 minutes'
      case 4:
        return 'Very High - must have a verified phone number'
      default:
        return 'Verification Filter unknown'
    }
  }

  run (msg) {
    try {
      const channels = msg.guild.channels.map(ty => ty.type)

      const presences = msg.guild.presences.map(st => st.status)

      const selfRoles = msg.guild.settings.get('selfroles', null)

      const serverEmbed = new RichEmbed()
      let guildChannels = 0

      let onlineMembers = 0
      for (const i in presences) {
        if (presences[i] !== 'offline') {
          onlineMembers += 1
        }
      }
      for (const i in channels) {
        if (channels[i] === 'text') {
          guildChannels += 1
        }
      }
      serverEmbed
        .setAuthor('Server Info')
        .setThumbnail(msg.guild.iconURL)
        .addField('Server Name', msg.guild.name, true)
        .addField('Owner', msg.guild.owner ? msg.guild.owner.user.tag : 'MIA', true)
        .addField('Members', msg.guild.memberCount, true)
        .addField('Currently Online', onlineMembers, true)
        .addField('Region', msg.guild.region, true)
        .addField('Highest Role', msg.guild.roles.sort((a, b) => a.position - b.position || a.id - b.id).last().name, true)
        .addField('Number of roles', msg.guild.roles.size, true)
        .addField('Number of channels', guildChannels, true)
        .addField('Created At', moment(msg.guild.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z'), false)
        .addField('Verification Level', this.verificationFilter(msg.guild.verificationLevel), false)
        .addField('Explicit Content Filter', this.contentFilter(msg.guild.explicitContentFilter), false)
        .setColor(this.client.embed.color(msg.author.id))
        .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
      if (selfRoles) {
        const roleNames = []
        selfRoles.forEach(r => roleNames.push(msg.guild.roles.get(r).name))
        serverEmbed.addField('Self-Assignable Roles', `${roleNames.map(val => `\`${val}\``).join(', ')}`, false)
      }
      if (msg.guild.id === '470785019405795349') {
        serverEmbed.setDescription('This is the official ATIK server!')
      }
      if (msg.guild.id === '264445053596991498') {
        serverEmbed.setDescription('This is the official Discord Bot List server!')
      }
      if (msg.guild.id === '500357138917359616') {
        serverEmbed.setColor(0x7289DA)
        serverEmbed.setDescription('The home of the sheep')
      }
      return msg.embed(serverEmbed)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}