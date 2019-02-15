const { Command } = require('discord.js-commando')

module.exports = class MuteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'mute',
      aliases: ['silence', 'turnoff', 'off', 'stfu'],
      group: 'moderation',
      memberName: 'mute',
      description: 'Mutes the specified member, not allowing them to talk in the server. If a time is specified the bot will automatically unmute the member after that period of time, but if no time is set the member will remain muted until someone unmutes them. You also should provide a reason for the mute after the time.',
      examples: ['mute @\\_Adam\\_#5850 Why :('],
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
      if (!args.member) return this.client.usage.send(msg, 'mute')
      let muteRole = msg.guild.roles.find('name', 'Muted')
      if (!muteRole) {
        try {
          muteRole = await msg.guild.createRole({
            name: 'Muted',
            permissions: []
          })
          msg.guild.channels.forEach(async (channel) => {
            await channel.overwritePermissions(muteRole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
              SPEAK: false
            })
          })
        } catch (error) {
          return this.client.error.send(error, msg)
        }
      }

      if (!msg.guild.member(args.member).roles.has(muteRole.id)) {
        msg.guild.member(args.member).addRole(muteRole)
          .then(() => {
            this.client.audit.commandAction('mute', msg, args)
            return this.client.embed.send(msg, `✅ **The member ${args.member} was successfully muted.**`)
          })
          .catch(error => {
            return this.client.error.send(error, msg)
          })
      } else {
        return this.client.embed.send(msg, `**${msg.author}, I was unable to mute that member!**`)
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}