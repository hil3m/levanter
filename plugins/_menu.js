const bot = require('../lib/events')
const {
  addSpace,
  textToStylist,
  getUptime,
  getRam,
  getDate,
  getPlatform,
} = require('../lib/')
bot.addCommand(
  {
    pattern: 'help ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    const sorted = ctx.commands.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
    const [date, time] = getDate()
    let CMD_HELP = `╭────────────────╮
						𝖍𝖎𝖑𝖊𝖒
╰────────────────╯

╭────────────────
│ Prefix : ${ctx.PREFIX}
│ Kullanıcı : ${message.pushName}
│ Süre : ${time}
│ Gün : ${date.toLocaleString('tr', { weekday: 'long' })}
│ Tarih : ${date.toLocaleDateString('hi')}
│ Versiyon : ${ctx.VERSION}
│ Plugins : ${ctx.pluginsCount}
│ Ram : ${getRam()}
│ Zaman : ${getUptime('t')}
│ OS : ${getPlatform()}
╰────────────────
╭────────────────
`
    sorted.map(async (command, i) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        CMD_HELP += `│ ${i + 1} ${addSpace(i + 1, sorted.length)}${textToStylist(
          command.name.toUpperCase(),
          'mono'
        )}\n`
      }
    })

    CMD_HELP += `╰────────────────`
    return await message.send('```' + CMD_HELP + '```')
  }
)

bot.addCommand(
  {
    pattern: 'list ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    let msg = ''
    const sorted = ctx.commands.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
    sorted.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        msg += `${index + 1} ${command.name}\n${command.desc}\n\n`
      }
    })
    await message.send('```' + msg.trim() + '```')
  }
)
bot.addCommand(
  {
    pattern: 'hilem ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    const commands = {}
    ctx.commands.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        let cmdType = command.type.toLowerCase()
        if (!commands[cmdType]) commands[cmdType] = []
        let isDiabled = command.active === false
        let cmd = command.name.trim()
        commands[cmdType].push(isDiabled ? cmd + ' [disabled]' : cmd)
      }
    })
    const [date, time] = getDate()
    let msg = `\`\`\`╭═══ 𝖍𝖎𝖑𝖊𝖒 ═══⊷
┃❃╭──────────────
┃❃│ Prefix : ${ctx.PREFIX}
┃❃│ Kullanıcı : ${message.pushName}
┃❃│ Süre : ${time}
┃❃│ Gün : ${date.toLocaleString('en', { weekday: 'long' })}
┃❃│ Tarih : ${date.toLocaleDateString('hi')}
┃❃│ Versiyon : ${ctx.VERSION}
┃❃│ Plugins : ${ctx.pluginsCount}
┃❃│ Ram : ${getRam()}
┃❃│ Zaman : ${getUptime('t')}
┃❃│ OS : ${getPlatform()}
┃❃╰───────────────
╰═════════════════⊷\`\`\`\n`

    if (match && commands[match]) {
      msg += ` ╭─❏ ${textToStylist(match.toLowerCase(), 'smallcaps')} ❏\n`
      for (const plugin of commands[match])
        msg += ` │ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`
      msg += ` ╰─────────────────`

      return await message.send(msg)
    }
    for (const command in commands) {
      msg += ` ╭─❏ ${textToStylist(command.toLowerCase(), 'smallcaps')} ❏\n`
      for (const plugin of commands[command])
        msg += ` │ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`
      msg += ` ╰─────────────────\n`
    }
    await message.send(msg.trim())
  }
)
