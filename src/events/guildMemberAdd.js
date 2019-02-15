const moment = require('moment')
const { RichEmbed } = require('discord.js')

const autoRole = (client, member) => {
  try {
    if (!member.guild.me.hasPermission('MANAGE_ROLES')) return
    const role = member.guild.settings.get('autorole')
    if (!role) return
    if (role.name === '@everyone' || role.name === '@here') return
    if (member.bot) return
    return member.addRole(role, 'AUTOROLE').catch(() => {
      return member.guild.settings.remove('autorole')
    })
  } catch (err) {
    return client.error.send(err)
  }
}

const greeting = (client, member) => {
  try {
    const link = member.guild.settings.get('greetchannel')
    if (!link) return
    const channel = member.guild.channels.get(link)
    if (!channel) return
    let greetingmessage = member.guild.settings.get('greetmessage')
    if (!greetingmessage) greetingmessage = 'Say hello to {{mention}}, everyone! We all need a warm welcome sometimes :smile:'
    const tagmessage = greetingmessage.replace('{{mention}}', member.user)
    return channel.send(tagmessage)
  } catch (err) {
    return client.error.send(err)
  }
}

const logs = (client, member) => {
  try {
    const modlog = member.guild.settings.get('modlog')
    if (!modlog) return
    const logChannel = member.guild.channels.get(modlog)
    if (!logChannel) return
    const joinDiscord = moment(member.user.createdAt).format('lll')
    const embed = new RichEmbed()
      .setColor(client.config.event_colors.guildMemberAdd)
      .setFooter(client.embed.text(member.guild.ownerID), client.embed.logo(member.guild.ownerID))
      .setAuthor('Member Joined')
      .setDescription(`<@${member.id}> \`${member.user.tag}\``)
      .addField('Account Created', joinDiscord, true)
      .setThumbnail(member.user.avatarURL)
      .setTimestamp()
    return logChannel.send(embed)
  } catch (err) {
    return client.error.send(err)
  }
}

module.exports = async (client, member) => {
  if (!member.guild) return
  if (!member.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!member.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  logs(client, member)
  autoRole(client, member)
  greeting(client, member)
}