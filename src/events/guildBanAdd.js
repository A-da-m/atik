const { RichEmbed } = require('discord.js')

const logs = async (client, guild) => {
  let reason = 'No reason given'
  let moderator = 'Unknown'
  const audit = await client.audit.fetchLastAudit(guild, 'MEMBER_BAN_ADD')
  if (!audit || audit.action !== 'MEMBER_BAN_ADD') return
  const target = audit.target
  const exec = audit.executor
  if (audit.reason) reason = audit.reason
  if (exec.id) moderator = `<@${exec.id}>`
  if (exec.id === client.user.id) return
  try {
    const modlog = guild.settings.get('modlog')
    if (!modlog) return
    const logChannel = guild.channels.get(modlog)
    if (!logChannel) return
    const embed = new RichEmbed()
      .setColor(client.config.event_colors.guildBanAdd)
      .setFooter(client.embed.text(guild.ownerID), client.embed.logo(guild.ownerID))
      .setAuthor('Member Banned')
      .setDescription(`\`${target.tag}\``)
      .addField('Moderator', moderator, true)
      .addField('Reason', reason, true)
      .setTimestamp()
    return logChannel.send(embed)
  } catch (err) {
    return client.error.send(err)
  }
}

module.exports = async (client, guild) => {
  if (!guild) return
  if (!guild.me.hasPermission('SEND_MESSAGES')) return
  if (!guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  return logs(client, guild)
}