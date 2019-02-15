const config = {
  production: true,
  dev_token: process.env.DEVTOKEN,
  token: process.env.TOKEN,
  pro_users: ['USERID'],
  pro_theme: {
    color: 0xD09100,
    text: 'ATIK PRO',
    logo: 'https://bot.atiktech.co/assets/images/ATIKPRO.png'
  },
  default_theme: {
    color: 0x2943a0,
    text: 'ATIK',
    logo: 'https://bot.atiktech.co/assets/images/ATIK.png'
  },
  error_theme: {
    color: 0xff4747,
    text: 'ATIK ERROR',
    logo: 'https://bot.atiktech.co/assets/images/ATIK.png'
  },
  logs_channels: {
    ready: 'CHANNELID',
    error: 'CHANNELID',
    guild: 'CHANNELID'
  },
  event_colors: {
    channelCreate: 0xa3a3a3,
    channelDelete: 0x000000,
    guildMemberAdd: 0x47ff47,
    guildMemberRemove: 0xff7547,
    roleCreate: 0x496EFF,
    roleDelete: 0xa347ff,
    guildBanAdd: 0xff4747,
    guildBanRemove: 0xffa347,
    roleAdd: 0xa3ff47,
    roleRemove: 0xd1ff47,
    nicknameChange: 0x7547ff,
    messageUpdate: 0x001466,
    messageDelete: 0xd147ff
  }
}
module.exports = config