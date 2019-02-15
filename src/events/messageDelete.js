const { RichEmbed } = require('discord.js')

const logs = async (client, msg) => {
  if (msg.author.id === client.user.id) return
  if (msg.content.startsWith('_')) return
  const audit = await client.audit.fetchLastAudit(msg.guild, 'MESSAGE_DELETE')
  if (!audit || audit.action !== 'MESSAGE_DELETE') return

  let exec = audit.executor
  if ((audit.target.id === msg.author.id) && (audit.createdTimestamp > (Date.now() - 5000) && audit.extra.count >= 1)) {
    exec = audit.executor
  } else {
    exec = msg.author
  }
  if (exec.id === client.user.id) return
  try {
    const modlog = msg.guild.settings.get('modlog')
    const msglogs = msg.guild.settings.get('msglogs')
    if (!modlog) return
    if (msglogs === 'off') return
    if (!msg.content) return
    const logChannel = msg.guild.channels.get(modlog)

    let desc = ''
    let fieldcontent = 'Unable to display'
    if (msg.content.length > 1000) {
      if (msg.author.id !== exec.id) {
        desc = `The user <@${exec.id}> deleted a message by <@${msg.author.id}> in <#${msg.channel.id}>`
      } else {
        desc = `The user <@${exec.id}> deleted there message in <#${msg.channel.id}>`
      }
    } else if (msg.author.id !== exec.id) {
      desc = `The user <@${exec.id}> deleted a message by <@${msg.author.id}> in <#${msg.channel.id}>`
      fieldcontent = msg.content
    } else if (msg.author.id === exec.id) {
      desc = `The user <@${exec.id}> deleted there message in <#${msg.channel.id}>`
      fieldcontent = msg.content
    } else { return }
    if (!logChannel || !desc || !fieldcontent) return
    const embed = new RichEmbed()
      .setColor(client.config.event_colors.messageDelete)
      .setFooter(client.embed.text(msg.guild.ownerID), client.embed.logo(msg.guild.ownerID))
      .setAuthor('Message Deleted')
      .setDescription(desc)
      .addField('Content', fieldcontent)
      .setTimestamp()
    return logChannel.send(embed)
  } catch (err) {
    return client.error.send(err)
  }
}

module.exports = async (client, msg) => {
  if (!msg.guild) return
  if (!msg.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!msg.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  return logs(client, msg)
}