const { Command } = require('discord.js-commando')

module.exports = class kickCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'purge',
      group: 'moderation',
      memberName: 'purge',
      aliases: ['clear', 'clean'],
      description: 'Deletes a specified number of messages in the channel the command is used in. The number of messages to purge must be provided with the command. Please note that specifying a number more then 100 will not work.',
      examples: ['purge 5', 'purge 56 @\\_Adam\\_#5850'],
      args: [
        {
          key: 'amount',
          prompt: 'How many messages?',
          default: 0,
          type: 'float'
        },
        {
          key: 'user',
          prompt: 'Who\'s messages do you wanna purge?',
          default: '',
          type: 'member'
        }
      ],
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

  async run (msg, args) {
    try {
      if (!args.amount || args.amount < 2 || args.amount > 100) return this.client.usage.send(msg, 'purge')
      let messages = await msg.channel.fetchMessages({ limit: args.amount })
      if (args.user) {
        const filterBy = args.user ? args.user.id : this.client.user.id
        messages = messages.filter(m => m.author.id === filterBy).array().slice(0, args.amount)

        this.client.emit('messageDeleteBulk', messages)
        for (const message of messages) message.channel.messages.delete(message.id)

        msg.channel.bulkDelete(messages, true)
          .then(() => {
            return this.client.audit.commandAction('purge', msg, args)
          })
          .catch(err => {
            this.client.error.send(err)
          })
      } else {
        this.client.emit('messageDeleteBulk', messages)
        for (const message of messages.values()) message.channel.messages.delete(message.id)

        msg.channel.bulkDelete(messages, true)
          .then(() => {
            return this.client.audit.commandAction('purge', msg, args)
          })
          .catch(err => {
            if (err.message === 'You can only bulk delete messages that are under 14 days old.') return msg.say(err.message)
            this.client.error.send(err)
          })
      }
    } catch (error) {
      return this.client.error.send(error, msg)
    }
  }
}