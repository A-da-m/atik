const { RichEmbed } = require('discord.js')

const logs = async (client, oldMember, newMember) => {
  try {
    const modlog = oldMember.guild.settings.get('modlog')
    if (!modlog) return
    const logChannel = oldMember.guild.channels.get(modlog)
    if (!logChannel) return
    if (oldMember.roles.size !== newMember.roles.size) {
      if (oldMember.roles.size > newMember.roles.size) {
        // Taken
        const rolelogs = oldMember.guild.settings.get('rolelogs')

        if (rolelogs === 'off') return
        const audit = await client.audit.fetchLastAudit(oldMember.guild, 'MEMBER_ROLE_UPDATE')
        if (!audit || audit.action !== 'MEMBER_ROLE_UPDATE') return
        const exec = audit.executor
        if (exec.id === client.user.id) return
        const dif = oldMember.roles.filter(r => !newMember.roles.has(r.id)).first()
        if (!dif) return
        const embed = new RichEmbed()
          .setColor(client.config.event_colors.roleRemove)
          .setFooter(client.embed.text(oldMember.guild.ownerID), client.embed.logo(oldMember.guild.ownerID))
          .setAuthor('Role Removed', newMember.user.avatarURL)
          .setDescription(`<@${newMember.user.id}> (\`${newMember.user.tag}\`) had the role \`${dif.name}\` taken from them by <@${exec.id}>.`)
          .setTimestamp()
        return logChannel.send(embed)
      } else if (oldMember.roles.size < newMember.roles.size) {
        // Given
        const rolelogs = oldMember.guild.settings.get('rolelogs')

        if (rolelogs === 'off') return
        const audit = await client.audit.fetchLastAudit(oldMember.guild, 'MEMBER_ROLE_UPDATE')
        if (!audit || audit.action !== 'MEMBER_ROLE_UPDATE') return
        const exec = audit.executor
        if (exec.id === client.user.id) return
        const dif = newMember.roles.filter(r => !oldMember.roles.has(r.id)).first()
        if (!dif) return
        const embed = new RichEmbed()
          .setColor(client.config.event_colors.roleAdd)
          .setFooter(client.embed.text(oldMember.guild.ownerID), client.embed.logo(oldMember.guild.ownerID))
          .setAuthor('Role Added', newMember.user.avatarURL)
          .setDescription(`<@${newMember.user.id}> (\`${newMember.user.tag}\`) had been given the \`${dif.name}\` role by <@${exec.id}>.`)
          .setTimestamp()
        return logChannel.send(embed)
      }
    } else if (oldMember.nickname !== newMember.nickname) {
      let nickname = ''
      if (newMember.nickname === null) {
        nickname = `<@${newMember.user.id}> (\`${newMember.user.tag}\`) had their nickname changed to \`${newMember.user.tag}\``
      } else {
        nickname = `<@${newMember.user.id}> (\`${newMember.user.tag}\`) had their nickname changed to \`${newMember.nickname}\``
      }
      const embed = new RichEmbed()
        .setColor(client.config.event_colors.nicknameChange)
        .setFooter(client.embed.text(oldMember.guild.ownerID), client.embed.logo(oldMember.guild.ownerID))
        .setAuthor('Nickname Changed', newMember.user.avatarURL)
        .setDescription(nickname)
        .setTimestamp()
      return logChannel.send(embed)
    } else { return }
  } catch (err) {
    return client.error(client, err)
  }
}

module.exports = async (client, oldMember, newMember) => {
  if (!oldMember.guild) return
  if (!oldMember.guild.me.hasPermission('SEND_MESSAGES')) return
  if (!oldMember.guild.me.hasPermission('VIEW_AUDIT_LOG')) return
  await client.wait(500)
  return logs(client, oldMember, newMember)
}