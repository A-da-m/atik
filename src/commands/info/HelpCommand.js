const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class HelpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'command-list'],
      group: 'info',
      memberName: 'help',
      clientPermissions: ['SEND_MESSAGES'],
      description: 'Displays a list of available commands, or detailed information for a specific command.',
      args: [{
        key: 'command',
        prompt: 'Which command would you like to view the help for?',
        type: 'command',
        default: ''
      }],
      guarded: true,
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 5
      }
    })
  }

  hasPermission (msg) {
    return msg.client.permission.check(msg, false)
  }

  async run (msg, args) {
    try {
      const command = args.command
      if (!command) {
        const helpEmbed = new RichEmbed()
          .setColor(this.client.embed.color(msg.author.id))
          .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
        const settings = this.client.registry.groups.find(g => g.id === 'settings')
        const info = this.client.registry.groups.find(g => g.id === 'info')
        const moderation = this.client.registry.groups.find(g => g.id === 'moderation')
        if (this.client.permission.check(msg, false) === true) {
          helpEmbed.setTitle('Commands')
          helpEmbed.setDescription('You can get more info on the commands below by running `_help [command]` or `@ATIK#2902 help command`')
          helpEmbed.addField('Information', info.commands.filter(cmd => !cmd.hidden).map(cmd => `\`${cmd.name}\``).join(', '))
        } else {
          helpEmbed.setDescription('Commands are Moderator Only')
        }
        if (msg.member.hasPermission('ADMINISTRATOR')) {
          helpEmbed.addField('Admin', '`groups`, `enable`, `disable`')
          helpEmbed.addField('Settings', settings.commands.filter(cmd => !cmd.hidden).map(cmd => `\`${cmd.name}\``).join(', '))
        }
        if (this.client.permission.check(msg, true) === true) {
          helpEmbed.addField('Moderation', moderation.commands.filter(cmd => !cmd.hidden).map(cmd => `\`${cmd.name}\``).join(', '))
        }
        helpEmbed.addField('Still need help?', 'You can check the [support docs](https://docs.atiktech.co) or you can [join the support server](https://atiktech.co/discord).')
        try {
          const msgs = []
          msgs.push(await msg.direct(helpEmbed))
          const dmMsg = new RichEmbed()
            .setDescription(`**${msg.author}, I sent you a message for help!**\nYou can also visit the [documentation](https://docs.atiktech.co) for information!`)
            .setColor(this.client.embed.color(msg.author.id))
            .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
          if (msg.channel.type !== 'dm') msgs.push(await msg.channel.send(dmMsg))
          return msgs
        } catch (error) {
          return msg.reply('Failed to send DM. You probably have DMs disabled.')
        }
      }
      const commandEmbed = new RichEmbed()
        .setTitle(`Command **${command.name}**${command.guildOnly ? ' (Usable only in servers)' : ''}`)
        .setDescription(`${command.description}${command.details ? `\n_${command.details}_` : ''}`)
        .addField('Format', `${msg.anyUsage(`${command.name} ${command.format || ''}`)}`)
        .addField('Aliases', `${command.aliases.join(', ') || 'None'}`)
        .addField('Group', `${command.group.name}`)
        .setColor(this.client.embed.color(msg.author.id))
        .setFooter(this.client.embed.text(msg.author.id), this.client.embed.logo(msg.author.id))
      return msg.embed(commandEmbed)
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}