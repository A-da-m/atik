const { Command } = require('discord.js-commando')

module.exports = class BanCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'unban',
      group: 'moderation',
      memberName: 'unban',
      description: 'Unbans a banned member from the server allowing the previously banned member to rejoin.',
      examples: ['ban @\\_Adam\\_#5850 Come back... We need you :('],
      args: [{
        key: 'user',
        label: 'user',
        prompt: 'Who would you like to ban? Please mention one only.',
        type: 'member',
        default: '',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being banned?',
        type: 'string',
        default: 'No reason given',
        infinite: false
      }],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      },
      clientPermissions: ['BAN_MEMBERS']
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, true, 'BAN_MEMBERS')
  }

  async run (msg, args) {
    try {
      if (!args.user || !args.reason) return this.client.usage.send(msg, 'unban')
      const guildBans = await msg.guild.fetchBans()
      if (!guildBans.has(args.user.id)) return this.client.embed.send(msg, `**${msg.author}, User not found...**`)
      msg.guild.unban(args.user, {
        reason: `${args.reason} - ${msg.author.tag}`
      })
        .then(member => {
          this.client.audit.commandAction('unban', msg, args)
          return this.client.embed.send(msg, `✅ **The user \`${member.user.tag}\` was successfully unbanned.**`)
        })
        .catch(error => {
          return this.client.error.send(error, msg)
        })
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}