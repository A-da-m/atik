const { RichEmbed } = require('discord.js')

const byeing = (client, member) => {
  try {
    if (!member.guild) return
    const bye = `<@${member.user.id}> just left the server :frowning:`
    const link = member.guild.settings.get('byechannel')
    if (!bye) return
    const channel = member.guild.channels.get(link)
    if (!channel) return
    return channel.send(`${bye}`)
  } catch (err) {
    return client.error.send(err)
  }
}

const logs = (client, member) => {
  try {
    if (!member.guild) return
    const modlog = member.guild.settings.get('modlog')
    if (!modlog) return
    const logChannel = member.guild.channels.get(modlog)
    if (!logChannel) return
    const embed = new RichEmbed()
      .setColor(client.config.event_colors.guildBanRemove)
      .setFooter(client.embed.text(member.guild.ownerID), client.embed.logo(member.guild.ownerID))
      .setAuthor('Member Left')
      .setDescription(`\`${member.user.tag}\``)
      .setThumbnail(member.user.avatarURL)
      .setTimestamp()
    return logChannel.send(embed)
  } catch (err) {
    client.error.send(err)
  }
}

module.exports = async (client, member) => {
  if (!member.guild) return
  if (!member.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!member.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  logs(client, member)
  byeing(client, member)
}