const { RichEmbed } = require('discord.js')

const logs = async (client, channel) => {
  let moderator = 'Unknown'
  const audit = await client.audit.fetchLastAudit(channel.guild, 'CHANNEL_DELETE')
  if (!audit || audit.action !== 'CHANNEL_DELETE') return
  const exec = audit.executor
  if (exec.id) moderator = `<@${exec.id}>`
  if (exec.id === client.user.id) return
  try {
    const modlog = channel.guild.settings.get('modlog')
    if (!modlog) return
    const logChannel = channel.guild.channels.get(modlog)
    if (!logChannel) return
    let author = ''
    if (channel.type === 'text') {
      if (!exec) return
      author = 'Channel Deleted'
    } else if (channel.type === 'voice') {
      if (!exec) return
      author = 'Voice Channel Deleted'
    } else if (channel.type === 'category') {
      if (!exec) return
      author = 'Category Deleted'
    } else { return }
    const embed = new RichEmbed()
      .setColor(client.config.event_colors.channelDelete)
      .setFooter(client.embed.text(channel.guild.ownerID), client.embed.logo(channel.guild.ownerID))
      .setAuthor(author)
      .setDescription(`\`${channel.name}\``)
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