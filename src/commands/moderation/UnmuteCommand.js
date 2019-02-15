const { Command } = require('discord.js-commando')

module.exports = class UnMuteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'unmute',
      group: 'moderation',
      memberName: 'unmute',
      description: 'Unmutes a muted member allowing them to speak in the server again. Useful if no time was specified for a mute or if for some reason a mute was sent for too long.',
      details: 'Unmute someone.',
      examples: ['unmute @Bob being a good apple'],
      args: [{
        key: 'member',
        label: 'member',
        prompt: 'What user would you like to mute? Please specify one only.',
        type: 'member',
        default: '',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being muted?',
        type: 'string',
        default: 'No reason given',
        infinite: false
      }],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      },
      clientPermissions: ['MANAGE_CHANNELS']
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, true, 'MANAGE_CHANNELS')
  }

  async run (msg, args) {
    try {
      if (!args.member || !args.reason) return this.client.usage.send(msg, 'unmute')
      const muteRole = msg.guild.roles.find('name', 'Muted')
      if (!muteRole) return this.client.embed.send(msg, `✅ **${msg.author}, Unable to find the mute role...**`)
      if (!args.member.roles.has(muteRole.id)) return this.client.embed.send(msg, `**${msg.author}, Member not muted...**`)
      await (args.member.removeRole(muteRole.id))
      this.client.audit.commandAction('unmute', msg, args)
      return this.client.embed.send(msg, `✅ **The member ${args.member} was successfully unmuted.**`)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}