const { RichEmbed } = require('discord.js')

const logs = (client, guild) => {
  const logChannel = client.channels.get(client.config.logs_channels.guild)
  if (!logChannel) return
  const embed = new RichEmbed()
    .setColor(0x47ff47)
    .setFooter(client.embed.text(guild.ownerID), client.embed.logo(guild.ownerID))
    .setAuthor('Guild Created')
    .setDescription(`\`${guild.name}\``)
    .addField('Guild Owner', `\`${guild.owner.user.tag}\``, true)
    .addField('Member Count', `\`${guild.memberCount}\``, true)
    .setTimestamp()
  return logChannel.send(embed)
}

module.exports = (client, guild) => {
  guild.settings.set('antilink', 'off')
  guild.settings.set('antiswear', 'off')
  guild.settings.set('msglogs', 'on')
  guild.settings.set('rolelogs', 'on')
  guild.settings.set('modonly', 'off')
  return logs(client, guild)
}