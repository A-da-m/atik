const commando = require('discord.js-commando')
const path = require('path')
const sqlite = require('sqlite')
const fs = require('fs')

const AuditHandler = require('./functions/auditHandler')
const EmbedHandler = require('./functions/embedHandler')
const ErrorHandler = require('./functions/errorHandler')
const PermissionHandler = require('./functions/permissionHandler')
const ProtectHandler = require('./functions/protectHandler')
const UsageHandler = require('./functions/usageHandler')

const client = new commando.Client({
  commandPrefix: '_',
  owner: ['ownerid'],
  disableEveryone: false,
  unknownCommandResponse: false,
  disabledEvents: ['TYPING_START'],
  invite: 'INVITELINK',
  nonCommandEditable: false
})

client.config = require(`${path.join(__dirname, 'config')}/config.js`)

fs.readdir(path.join(__dirname, 'events'), (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    const event = require(`${path.join(__dirname, 'events')}/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, event.bind(null, client))
    delete require.cache[require.resolve(`${path.join(__dirname, 'events')}/${file}`)]
  })
})

client.wait = ms => new Promise((resolve) => setTimeout(resolve, ms))
client.embed = new EmbedHandler(client)
client.error = new ErrorHandler(client)
client.permission = new PermissionHandler(client)
client.audit = new AuditHandler(client)
client.protect = new ProtectHandler(client)
client.usage = new UsageHandler(client)

// Database Setup
client.setProvider(sqlite.open(path.join(__dirname, '../database/settings.sqlite')).then(
  db => new commando.SQLiteProvider(db))).catch(console.error)

// Registry
client.registry.registerDefaultTypes()
client.registry.registerGroups([
  ['info', 'Information'],
  ['moderation', 'Moderation'],
  ['settings', 'Settings'],
  ['control', 'Bot Owner']
])
client.registry.registerDefaultGroups()
client.registry.registerDefaultCommands({
  help: false,
  ping: false,
  eval_: false,
  prefix: true,
  commandState: true
})
client.registry.registerCommandsIn(path.join(__dirname, 'commands'))

if (client.config.production === true) {
  client.login(process.env.TOKEN).catch(error => {
    console.error(`Unable to login:\n${error.message}`)
  })
} else {
  client.login(client.config.dev_token).catch(error => {
    console.error(`Unable to login:\n${error.message}`)
  })
}

process.on('uncaughtException', error => {
  console.error(`Unable to login:\n${error.message}\n${error.stack}`)
  process.exit(1)
})

process.on('unhandledRejection', error => {
  console.error(`Unable to login:\n${error.message}\n${error.stack}`)
  process.exit(1)
})