const { Command } = require('discord.js-commando')

module.exports = class WarnCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'warn',
      group: 'moderation',
      memberName: 'warn',
      description: 'Warns a specified member of something they did wrong. The reason for the warn should be placed after the command and will be logged by the bot.',
      examples: ['warn @\\_Adam\\_#5850 being a bad apple'],
      args: [{
        key: 'member',
        label: 'member',
        prompt: 'Who would you like to warn? Please mention one only.',
        type: 'member',
        default: '',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being warned?',
        type: 'string',
        default: '',
        infinite: false
      }],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 6
      },
      clientPermissions: ['MANAGE_MESSAGES']
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, true, 'MANAGE_MESSAGES')
  }

  run (msg, args) {
    try {
      if (!args.member || !args.reason) return this.client.usage.send(msg, 'warn')
      args.member.send({
        embed: {
          color: 0xe6b800,
          description: `**You have been warned on the server \`${msg.guild}\`**\n**Moderator**: \`${msg.author.tag}\`\n**Reason**: ${args.reason}`,
          footer: {
            icon_url: this.client.embed.logo(args.member.id),
            text: this.client.embed.text(args.member.id)
          }
        }
      })
      this.client.audit.commandAction('warn', msg, args)
      return this.client.embed.send(msg, `✅ **The member ${args.member} was successfully warned**`)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}