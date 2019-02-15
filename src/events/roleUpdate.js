const { RichEmbed } = require('discord.js')

const logs = (client, oldRole, newRole) => {
  try {
    const guild = oldRole.guild
    const modlog = guild.settings.get('modlog')
    const rolelogs = guild.settings.get('rolelogs')
    if (!modlog) return
    if (rolelogs === 'off') return
    const logChannel = oldRole.guild.channels.get(modlog)
    if (!logChannel) return
    if (oldRole.name !== newRole.name) {
      const embed = new RichEmbed()
        .setColor(0xa3a3a3)
        .setFooter(client.embed.text(newRole.guild.ownerID), client.embed.logo(newRole.guild.ownerID))
        .setAuthor('Role Updated')
        .setDescription('Name Changed')
        .addField('Before', `\`${oldRole.name}\``, true)
        .addField('After', `\`${newRole.name}\``, true)
        .setTimestamp()
      return logChannel.send(embed)
    } else { return }
  } catch (err) {
    return client.error.send(err)
  }
}

module.exports = async (client, oldRole, newRole) => {
  if (!oldRole.guild) return
  if (!oldRole.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!oldRole.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  return logs(client, oldRole, newRole)
}