const { Command } = require('discord.js-commando')

module.exports = class RestartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'restart',
      group: 'control',
      aliases: ['reboot', 'startup', 'shutdown'],
      memberName: 'restart',
      description: 'N/A',
      guarded: true,
      ownerOnly: true,
      guildOnly: true
    })
  }

  async run (msg) {
    this.client.user.setActivity('restarting...', {
      type: 'WATCHING',
      url: 'https://www.twitch.tv/tailosivetech'
    })
    msg.say('Restarting...').then(m => {
      m.delete().then(() => {
        this.client.destroy().then(() => {
          process.exit(1)
        })
      })
    })
  }
}