const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class SettingsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'settings',
      aliases: ['set', 'setting'],
      group: 'settings',
      memberName: 'settings',
      description: 'See all the currently applied settings for the bot in one menu. Each option lists the command to change it.',
      examples: ['settings'],
      userPermissions: ['ADMINISTRATOR'],
      guildOnly: true,
      guarded: true
    })
  }

  run (msg) {
    // logs
    let modonly = msg.guild.settings.get('modonly')
    let modrole = msg.guild.roles.get(msg.guild.settings.get('modrole'))
    let modlog = msg.guild.channels.get(msg.guild.settings.get('modlog'))
    let msglogs = msg.guild.settings.get('msglogs')
    let rolelogs = msg.guild.settings.get('rolelogs')
    // Auto Role Settings
    let autoRole = msg.guild.roles.get(msg.guild.settings.get('autorole'))
    // Welcome Settings
    let greetChannel = msg.guild.channels.get(msg.guild.settings.get('greetchannel'))
    let greetmessage = msg.guild.settings.get('greetmessage')
    // Bye Settings
    let byeChannel = msg.guild.channels.get(msg.guild.settings.get('byechannel'))
    // ATIK_PROTECT
    let antiswear = msg.guild.settings.get('antiswear')
    let antilink = msg.guild.settings.get('antilink')
    // Ifs
    if (!modonly) modonly = 'not set'
    if (!modlog || !modlog.name) modlog = 'not set'
    else modlog = `<#${modlog.id}>`
    if (!msglogs) msglogs = 'not set'
    if (!rolelogs) rolelogs = 'not set'
    if (!modrole || !modrole.name) modrole = 'not set'
    else modrole = modrole.name
    if (!autoRole || !autoRole.name) autoRole = 'not set'
    else autoRole = autoRole.name
    if (!greetChannel || !greetChannel.name) greetChannel = 'not set'
    else greetChannel = `<#${greetChannel.id}>`
    if (!greetmessage) greetmessage = 'Say hello to {{mention}}, everyone! We all need a warm welcome sometimes :smile:'
    if (!byeChannel || !byeChannel.name) byeChannel = 'not set'
    else byeChannel = `<#${byeChannel.id}>`
    if (!antiswear) antiswear = 'not set'
    if (!antilink) antilink = 'not set'


    const pages = [`**AUTO-PROTECT**\n**antiswear:** "${antiswear}"\n**antilink**: "${antilink}"`, `**MODERATION**\n**modonly**: "${modonly}"\n**modrole**: "${modrole}"\n**modlogs**: "${modlog}"\n**msglogs**: "${msglogs}"\n**rolelogs**: "${rolelogs}"`, `**WELCOME/LEAVING**\n**welcoming:** "${greetChannel}"\n**message:** "${greetmessage}\n(\`{{mention}}\` will mention the user)\n\n**leaving:** "${byeChannel}"`, `**ROLE-MANGEMENT**\n**autorole**: "${autoRole}"`]
    let page = 1

    const listEmbed = new RichEmbed()
      .setAuthor(`${msg.guild}`, msg.guild.iconURL)
      .setColor(this.client.embed.color(msg.author.id))
      .setFooter(`${this.client.embed.text(msg.author.id)} | Page ${page} of ${pages.length}`, this.client.embed.logo(msg.author.id))
      .setDescription(pages[page - 1])

    msg.channel.send(listEmbed).then(reactmsg => {
      reactmsg.react('⏪').then(() => {
        reactmsg.react('⏩')
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id
        const backwords = reactmsg.createReactionCollector(backwardsFilter, { time: 60000 })
        const forwards = reactmsg.createReactionCollector(forwardsFilter, { time: 60000 })
        backwords.on('collect', () => {
          if (page === 1) return
          page--
          listEmbed.setDescription(pages[page - 1])
          listEmbed.setFooter(`${this.client.embed.text(msg.author.id)} | Page ${page} of ${pages.length}`, this.client.embed.logo(msg.author.id))
          reactmsg.edit(listEmbed)
        })
        forwards.on('collect', () => {
          if (page === pages.length) return
          page++
          listEmbed.setDescription(pages[page - 1])
          listEmbed.setFooter(`${this.client.embed.text(msg.author.id)} | Page ${page} of ${pages.length}`, this.client.embed.logo(msg.author.id))
          reactmsg.edit(listEmbed)
        })
      })
    })
  }
}