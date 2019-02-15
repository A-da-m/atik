const { RichEmbed } = require('discord.js')

const logs = (client, oldMsg, newMsg) => {
  try {
    if (oldMsg.author.id === client.user.id) return
    if (oldMsg.content === newMsg.content) return
    const guild = oldMsg.guild
    const modlog = guild.settings.get('modlog')
    const msglogs = guild.settings.get('msglogs')
    if (!modlog) return
    if (msglogs === 'off') return
    if (!oldMsg) return
    if (!newMsg) return
    if (!oldMsg.content) return
    if (!newMsg.content) return
    const logChannel = oldMsg.guild.channels.get(modlog)
    if (!logChannel) return
    const embed = new RichEmbed()
      .setColor(client.config.event_colors.messageUpdate)
      .setFooter(client.embed.text(oldMsg.guild.ownerID), client.embed.logo(oldMsg.guild.ownerID))
      .setAuthor('Message Updated')
      .setDescription(`A message by <@${oldMsg.author.id}> (\`${oldMsg.author.tag}\`) was edited in <#${oldMsg.channel.id}>`)
      .addField('Before', oldMsg.content)
      .addField('After', newMsg.content)
      .setTimestamp()
    return logChannel.send(embed)
  } catch (error) {
    return client.error.send(error)
  }
}

module.exports = async (client, oldMsg, newMsg) => {
  if (oldMsg.channel.type !== 'text') return
  if (!oldMsg.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!oldMsg.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  return logs(client, oldMsg, newMsg)
}