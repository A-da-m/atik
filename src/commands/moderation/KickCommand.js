const { Command } = require('discord.js-commando')

module.exports = class KickCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'kick',
      group: 'moderation',
      memberName: 'kick',
      description: 'Kicks the specified member from the server but allows that member to rejoin. You also will be presented with a field to add in a reason for the kick.',
      examples: ['kick @\\_Adam\\_#5850 Stop talking...', 'kick \\_Adam\\_ Stop talking...'],
      args: [{
        key: 'member',
        label: 'member',
        prompt: 'Who would you like to kick? Please mention one only.',
        type: 'member',
        default: '',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the member being kicked?',
        type: 'string',
        default: 'No reason given',
        infinite: false
      }
      ],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      },
      clientPermissions: ['KICK_MEMBERS']
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, true, 'KICK_MEMBERS')
  }

  async run (msg, args) {
    try {
      if (!args.member) return this.client.usage.send(msg, 'kick')
      if (args.member.id === msg.guild.ownerID) return this.client.embed.send(msg, `**${msg.author}, You can't kick the server owner!**`)
      if (args.member.kickable === false) return this.client.embed.send(msg, `**${msg.author}, I can't kick this member!**`)
      args.member.kick(`${args.reason} - ${msg.author.tag}`)
        .then(member => {
          this.client.audit.commandAction('kick', msg, args)
          return this.client.embed.send(msg, `✅ **The user \`${member.user.tag}\` was successfully kicked.**`)
        })
        .catch(error => {
          return this.client.error.send(error, msg)
        })
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}