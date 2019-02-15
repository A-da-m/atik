const { RichEmbed } = require('discord.js')

module.exports = (client) => {
  try {
    console.log(`Logged in as: ${client.user.tag}`)
    if (client.config.production === false) return
    const channel = client.channels.get(client.config.logs_channels.ready)
    if (!channel) return
    const embed = new RichEmbed()
      .setColor(client.config.default_theme.color)
      .setFooter('ATIK CONSOLE', client.config.default_theme.logo)
      .setTitle('Ready')
      .addField('Guilds', client.guilds.size, true)
      .addField('Users', client.users.size, true)
    return channel.send(embed)
  } catch (error) {
    return console.error(`Unable to start:\n${error.message}\n${error.stack}`)
  }
}