const { FriendlyError } = require('discord.js-commando')

module.exports = (client, err) => {
  if (err instanceof FriendlyError) return
  return client.error.send(err)
}