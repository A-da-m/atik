const { RichEmbed } = require('discord.js')

const logs = async (client, channel) => {
  let moderator = 'Unknown'
  const audit = await client.audit.fetchLastAudit(channel.guild, 'CHANNEL_CREATE')
  if (!audit || audit.action !== 'CHANNEL_CREATE') return
  const exec = audit.executor
  if (exec.id) moderator = `<@${exec.id}>`
  if (exec.id === client.user.id) return
  try {
    const modlog = channel.guild.settings.get('modlog')
    if (!modlog) return
    const logChannel = channel.guild.channels.get(modlog)
    let desc = ''
    let author = ''
    if (channel.type === 'text') {
      if (!exec) return
      desc = `<#${channel.id}> \`${channel.name}\``
      author = 'Channel Created'
    } else if (channel.type === 'voice') {
      if (!exec) return
      desc = `\`${channel.name}\``
      author = 'Voice Channel Created'
    } else if (channel.type === 'category') {
      if (!exec) return
      desc = `\`${channel.name}\``
      author = 'Category Created'
    } else { return }
    if (!logChannel || !desc || !author) return

    const embed = new RichEmbed()
      .setColor(client.config.event_colors.channelCreate)
      .setFooter(client.embed.text(channel.guild.ownerID), client.embed.logo(channel.guild.ownerID))
      .setAuthor(author)
      .setDescription(desc)
      .addField('Moderator', moderator)
      .setTimestamp()
    return logChannel.send(embed)
  } catch (err) {
    return client.error.send(err)
  }
}

module.exports = async (client, channel) => {
  if (channel.type === 'dm') return
  if (!channel.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!channel.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  return logs(client, channel)
}