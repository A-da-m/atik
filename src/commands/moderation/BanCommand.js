const { Command } = require('discord.js-commando')

module.exports = class BanCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ban',
      group: 'moderation',
      aliases: ['banish', 'begone'],
      memberName: 'ban',
      description: 'Bans the specified member from the server and does not allow that member to rejoin. You also will be presented with a field to add in a reason for the ban.',
      examples: ['ban @\\_Adam\\_#5850 Should not be here'],
      args: [{
        key: 'member',
        label: 'member',
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
      if (!args.member) return this.client.usage.send(msg, 'ban')
      if (args.member.id === msg.guild.ownerID) return this.client.embed.send(msg, `**${msg.author}, You can't ban the server owner!**`, false)
      if (args.member.bannable === false) return this.client.embed.send(msg, `**${msg.author}, I can't ban this member!**`, msg.author, false)
      msg.guild.ban(args.member, {
        reason: `${args.reason} - ${msg.author.tag}`
      })
        .then(member => {
          this.client.audit.commandAction('ban', msg, args)
          return this.client.embed.send(msg, `✅ **The user \`${member.user.tag}\` was successfully banned.**`)
        })
        .catch(error => {
          return this.client.error.send(error, msg)
        })
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}