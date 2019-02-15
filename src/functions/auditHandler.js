const { RichEmbed } = require('discord.js')

class AuditHandler {
  constructor (client) {
    this.client = client
  }
  fetchLastAudit (guild, type) {
    const getInfo = new Promise((resolve) => {
      setTimeout(function () {
        if (type) {
          guild.fetchAuditLogs({
            limit: 1,
            type: type
          }).then(item => {
            resolve(item.entries.first())
          }).catch(() => {
            console.log(`Invalid permissions in ${guild.name}`)
            return false
          })
        } else {
          guild.fetchAuditLogs({
            limit: 1
          }).then(item => {
            resolve(item.entries.first())
          }).catch(() => {
            console.log(`Invalid permissions in ${guild.name}`)
            return false
          })
        }
      }, 500)
    })
    return getInfo
  }
  commandAction (action, msg, args) {
    const modlog = msg.guild.settings.get('modlog')
    if (!modlog) return
    const channel = msg.guild.channels.get(modlog)
    if (!channel) return
    const embed = new RichEmbed()
    if (action === 'kick') {
      embed.setAuthor('Member Kicked')
      embed.setColor(this.client.config.event_colors.guildMemberRemove)
    } else if (action === 'ban') {
      embed.setAuthor('Member Banned')
      embed.setColor(this.client.config.event_colors.guildBanAdd)
    } else if (action === 'unban') {
      embed.setAuthor('Member Unbanned')
      embed.setColor(this.client.config.event_colors.guildBanRemove)
    } else if (action === 'delrole') {
      embed.setAuthor('Role Deleted')
      embed.setColor(this.client.config.event_colors.roleDelete)
    } else if (action === 'createrole') {
      embed.setAuthor('Role Created')
      embed.setColor(this.client.config.event_colors.roleCreate)
    } else if (action === 'addrole') {
      embed.setAuthor('Role Added')
      embed.setColor(this.client.config.event_colors.roleAdd)
    } else if (action === 'removerole') {
      embed.setAuthor('Role Removed')
      embed.setColor(this.client.config.event_colors.roleRemove)
    } else if (action === 'purge') {
      embed.setAuthor('Channel Purged')
    } else if (action === 'mute') {
      embed.setAuthor('Member Muted')
    } else if (action === 'unmute') {
      embed.setAuthor('Member Unmuted')
    } else if (action === 'warn') {
      embed.setAuthor('Member Warned')
      embed.setColor(0xe6b800)
    }
    if (args.user) {
      embed.addField('User', `\`${args.user.user.tag}\``, true)
    }
    if (args.member) {
      embed.addField('Member', `${args.member}`, true)
    }
    if (msg.author) {
      embed.addField('Moderator', msg.author, true)
    }
    if (args.amount) {
      embed.addField('Amount', args.amount, true)
    }
    if (msg.channel) {
      embed.addField('Channel', msg.channel, true)
    }
    if (args.reason) {
      embed.addField('Reason', args.reason, true)
    }
    embed.setTimestamp()
    embed.setFooter(this.client.embed.text(msg.guild.ownerID), this.client.embed.logo(msg.guild.ownerID))
    return channel.send(embed)
  }
}
module.exports = AuditHandler