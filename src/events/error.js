module.exports = (client, err) => {
  if (err.message == 'Missing Permissions') {

  } else if (err.message == 'Unknown Message') {

  } else if (err.message == 'read ECONNRESET') {
    return console.error('Lost connection to discord.')
  } else {
    return client.error.send(err)
  }
}