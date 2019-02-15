const { RichEmbed } = require('discord.js')

const logs = async (client, role) => {
  let moderator = 'Unknown'
  const audit = await client.audit.fetchLastAudit(role.guild, 'ROLE_CREATE')
  if (!audit || audit.action !== 'ROLE_CREATE') return

  const exec = audit.executor
  if (exec.id) moderator = `<@${exec.id}>`
  try {
    if (!exec) return
    if (exec.id === client.user.id) return
    const modlog = role.guild.settings.get('modlog')
    const rolelogs = role.guild.settings.get('rolelogs')
    if (!modlog) return
    if (rolelogs === 'off') return
    const logChannel = role.guild.channels.get(modlog)
    if (!logChannel) return
    const embed = new RichEmbed()
      .setColor(client.config.event_colors.roleCreate)
      .setFooter(client.embed.text(role.guild.ownerID), client.embed.logo(role.guild.ownerID))
      .setAuthor('Role Created')
      .setDescription(`<@&${role.id}> \`${role.name}\``)
      .addField('Moderator', moderator)
      .setTimestamp()
    return logChannel.send(embed)
  } catch (err) {
    return client.error.send(err)
  }
}

module.exports = async (client, role) => {
  if (!role.guild) return
  if (!role.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!role.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  return logs(client, role)
}