const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const axios = require('axios')

module.exports = class SlowModeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'slowmode',
      group: 'moderation',
      memberName: 'slowmode',
      description: 'Provides information about the server like the number of members, the region, the number of roles, the owner, and more.',
      examples: ['slowmode 100'],
      args: [{
        key: 'time',
        label: 'time',
        prompt: 'How much of a delay do you wan\'t?',
        default: '',
        type: 'string',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Reason why you wanna slow the chat down?',
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

  run (msg, args) {
    if (!args.time || !args.reason) return this.client.usage(msg, 'slowmode')
    const modlog = msg.guild.settings.get('modlog')
    const slowEmbed = new RichEmbed()
      .setTitle('**Slow Mode Set**')
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setTimestamp()
      .setColor(this.client.embed.color(msg.author.id))
      .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
    function slowmode (s, m) {
      slowEmbed.setDescription(`**Duration:** ${m} \n**Channel:** <#${msg.channel.id}>`)
      axios({
        method: 'patch',
        url: `https://discordapp.com/api/v6/channels/${msg.channel.id}`,
        headers: {
          'Authorization': `Bot ${process.env.TOKEN}`
        },
        data: {
          rate_limit_per_user: s,
          reason: args.reason
        }
      }).then(() => {
        if (modlog) {
          const channel = msg.guild.channels.get(modlog)
          if (!channel) return
          return channel.send(slowEmbed)
        }
      }).catch((error) => {
        return this.client.error.send(error, msg)
      })
    }

    if (args.time === 'off') {
      msg.say('Slow Mode Disabled')
      slowmode(0, 'Disabled')
    } else if (isNaN(args.time) || parseInt(args.time) > 120 || parseInt(args.time) < 1) {
      msg.say('Please use a number between 1 and 120')
    } else {
      msg.say(`Slow Mode set to ${args.time} seconds`)
      slowmode(args.time, `${args.time} seconds`)
    }
  }
}