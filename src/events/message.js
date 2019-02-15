module.exports = (client, msg) => {
  try {
    if (msg.author.bot) return
    if (msg.channel.type === 'dm') return
    if (msg.member.hasPermission('ADMINISTRATOR')) return
    if (client.permission.check(msg.member, msg.guild, true) === true) return
    if (msg.author.id === '392347814413467655') return
    if (!msg.guild.member(client.user).hasPermission('SEND_MESSAGES')) return
    if (!msg.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return
    if (!msg.guild.member(client.user).hasPermission('EMBED_LINKS')) return
    if (!msg.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return
    if (!msg.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return
    client.protect.antiswear(msg)
    client.protect.antilink(msg)
    return
  } catch (err) {
    if (err.message === 'Cannot read property \'hasPermission\' of null') return
    return client.error.send(err)
  }
}