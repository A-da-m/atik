class PermissionHandler {
  constructor (client) {
    this.client = client
  }
  check (msg, mod, permission) {
    try {
      if (mod === false) {
        const modOnly = msg.guild.settings.get('modonly')
        const modRole = msg.guild.settings.get('modrole')
        if (modOnly !== 'on') return true
        if (msg.member.hasPermission('ADMINISTRATOR')) return true
        if (permission && msg.member.hasPermission(permission)) return true
        if (!modRole) return false
        if (msg.member.roles.has(modRole)) return true
        return false
      } else if (mod === true) {
        const modRole = msg.guild.settings.get('modrole')
        if (msg.member.hasPermission('ADMINISTRATOR')) return true
        if (permission && msg.member.hasPermission(permission)) return true
        if (!modRole) return false
        if (msg.member.roles.has(modRole)) return true
        return false
      }
    } catch (error) {
      return this.client.error.send(error)
    }
  }
}
module.exports = PermissionHandler