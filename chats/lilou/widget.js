// let fieldData = {};
let currentEvent = null
let flowerCount = 0
let currentMessagesIds = []
let currentAmountOfMessages = 0
let maxMessages

let imagesUrls = {
  mod: "https://i.ibb.co/KzLNHrS/lilou-mod.png",
  vip: "https://i.ibb.co/GJv2Vdj/lilou-vip.png",
  subscriber: "https://i.ibb.co/fY6JR2M/lilou-sub.png",
  viewer: "https://i.ibb.co/3hSycmt/lilou-viewer.png",
  streamer: "https://i.ibb.co/5841VWR/lilou-streamer.png",
  plant: "https://i.ibb.co/KbqLWQ5/lilou-planta.png",
  flower: "https://i.ibb.co/sCmb4Dp/enredaderaflor.png",
  heart: "https://i.ibb.co/crCnQH1/lilou-cora.png",
}
const SE_API_BASE = "https://api.streamelements.com/kappa/v2"

const PRONOUNS_API_BASE = "https://pronouns.alejo.io/api"
const PRONOUNS_API = {
  user: username => `${PRONOUNS_API_BASE}/users/${username}`,
  pronouns: `${PRONOUNS_API_BASE}/pronouns`,
}

const roles = ["streamer", "mod", "vip", "subscriber", "viewer"]
const priorities = {
  streamer: 1,
  mod: 2,
  vip: 3,
  subscriber: 4,
  viewer: 5,
}

class mainEvent {
  constructor(event, listener) {
    this.event = event
    this.listener = listener
  }

  get init() {
    return this.eventType()
  }

  get isMod() {
    return this.event.data.tags.mod === "1"
  }

  get isStreamer() {
    return this.event.data.displayName.toLowerCase() == this.event.data.channel.toLowerCase()
  }

  get isSub() {
    return this.event.data.tags.subscriber === "1"
  }

  get isVip() {
    return this.event.data.tags.vip === "1"
  }

  get isViewer() {
    return !this.isMod && !this.isStreamer && !this.isSub && !this.isVip
  }

  get badges() {
    return this.event.data.badges
  }

  get user() {
    return this.event.data.displayName
  }

  get roles() {
    const priorityRole = []
    const tags = this.event.data.tags
    let keys = Object.keys(tags)
    keys.forEach(key => {
      if (roles.includes(key) && tags[key] === "1") {
        priorityRole.push({ role: key, priority: priorities[key] })
      }
    })

    if (this.isStreamer) {
      priorityRole.push({ role: "streamer", priority: priorities["streamer"] })
    }

    if (priorityRole.length === 0) {
      priorityRole.push({ role: "viewer", priority: priorities["viewer"] })
    }
    priorityRole.sort((a, b) => a.priority - b.priority)
    return priorityRole[0]
  }

  eventType() {
    if (this.listener === "message") {
      return this.buildMessageCont()
    } else {
      return this.buildEvent()
    }
  }

  get emotes() {
    return this.event.data.emotes
  }

  get text() {
    return this.event.data.text
  }

  async buildMessageCont() {
    return await this.createMainContainerElement()
  }

  async createMainContainerElement() {
    const colors = {
      username: "#ffefdb",
      userBackground: "#ffafb1",
      textColor: "#af6366",
      textBackground: "#ffefdb",
      lineColor: "#ffefdb",
      pronsColor: "#af6366",
      dotsColor: "#b0cd6c",
    }

    const superMainContainer = document.createElement("div")
    superMainContainer.classList.add("super-main-container")
    superMainContainer.setAttribute("id", `${this.id}`)
    const role = this.roles.role
    let roleImageURL = imagesUrls[role]
    let roleText = await this.getUserPronoun()

    function showBadges(thisObj) {
      return thisObj.badges
        .map(badge => {
          return `<img src="${badge.url}" class="badges-img"/>`
        })
        .join("")
    }
    let inlineStyle
    if (fieldData.allowPronouns == "false" || roleText == "") {
      inlineStyle = `display: none;`
    } else if (fieldData.allowPronouns == "true" && roleText != "") {
      inlineStyle = `display: inline; background-color: ${colors.lineColor}; color: ${colors.pronsColor}`
    }

    let enredaderaUrl = imagesUrls.enredadera
    let campanasUrl = imagesUrls.campanas

    superMainContainer.innerHTML = `
      <div class="main-container">
        <div class="message-container">
          <div class="username-info-container" style="background-color:${colors.userBackground}">
          <img src="${imagesUrls.plant}" class="plant-user"/>
            <div class="username-info">
              <span class="username-badges" style="${fieldData.displayBadges == "false" ? "display: none;" : ""}">
                ${fieldData.displayBadges == "true" ? showBadges(this) : ""}
              </span>
              <span class="capitalize-user" style="color: ${colors.username}; max-width: ${
      fieldData.limitUsernames == "false" ? "none" : "13ch"
    }">${this.user}</span>
              <span class="dot" style='${inlineStyle}'></span>
              <span class="role-container" style='${inlineStyle}'>
                ${roleText}
              </span>
              <img src="${roleImageURL}" class="role"/>
            </div>
            <div class="message-icon-container" style="background-color: ${colors.textBackground};">
              <div class="rendered-text">
              <p class="text" style="color: ${colors.textColor}">${(await this.buildMessage()).innerHTML}</p>
              </div>
            </div>
          </div>
        </div>
    </div>`
    return superMainContainer
  }

  get roleImages() {
    const roles = this.getRole()

    // Buscar el rol con la menor prioridad
    const minPriorityRole = roles.reduce(
      (minRole, currentRole) => (currentRole.priority < minRole.priority ? currentRole : minRole),
      roles[0] // Establecer el primer elemento como valor inicial
    )

    // Asignar la imagen correspondiente
    let roleImage = document.createElement("img")
    roleImage.classList.add("role")
    if (minPriorityRole.length == 0) {
      minPriorityRole.role = "viewer"
    }
    return roleImage
  }

  async getUserPronoun() {
    let pronoun = null
    let username = this.user.toLowerCase()

    const response = await fetch(`${PRONOUNS_API_BASE}/users/${username}`)
    const data = await response.json()
    if (data[0] == undefined) {
      return ""
    }
    pronoun = data[0].pronoun_id

    // pronoun = await pronoun_api;
    switch (pronoun) {
      case "aeaer":
        pronoun = "ae/aer"
        break
      case "eem":
        pronoun = "e/em"
        break
      case "faefaer":
        pronoun = "fae/faer"
        break
      case "hehim":
        pronoun = "he/him"
        break
      case "heshe":
        pronoun = "he/she"
        break
      case "hethem":
        pronoun = "he/they"
        break
      case "itits":
        pronoun = "it/its"
        break
      case "perper":
        pronoun = "per/per"
        break
      case "sheher":
        pronoun = "she/her"
        break
      case "shethem":
        pronoun = "she/they"
        break
      case "theythem":
        pronoun = "they/them"
        break
      case "vever":
        pronoun = "ve/ver"
        break
      case "xexem":
        pronoun = "xe/xem"
        break
      case "ziehir":
        pronoun = "zie/hir"
        break
      default:
        break
    }
    return pronoun
  }

  getRole() {
    const roles = []
    const rolesObj = {
      mod: { role: "mod", priority: 1 },
      vip: { role: "vip", priority: 2 },
      subscriber: { role: "sub", priority: 3 },
      turbo: { role: "turbo", priority: 4 },
    }

    Object.entries(this.event.data.tags).forEach(([key, value]) => {
      if (value === "1" && rolesObj[key]) {
        roles.push(rolesObj[key])
      } else {
        const viewer = { role: "viewer", priority: 5 }
        if (roles.includes(viewer)) {
          return
        } else {
          roles.push(viewer)
        }
      }
    })

    if (this.isStreamer) {
      const streamer = { role: "streamer", priority: 0 }
      roles.unshift(streamer)
    }
    return roles
  }

  async buildMessage() {
    // get emotes if any
    let emoteNames = []
    let customEmotesNames = []
    let customEmotes = await this.customEmotes()
    if (customEmotes != undefined && customEmotes.status != "Not Found") {
      customEmotes.map(emote => {
        customEmotesNames.push(emote.name)
      })
    }

    if (this.emotes.length > 0) {
      emoteNames = this.emotes.map(emote => emote.name)
    }

    const rawMessage = this.text
    const words = rawMessage.split(" ")

    words.map((word, index) => {
      if (emoteNames.includes(word)) {
        let url
        if (!url) url = this.emotes.find(emote => emote.name === word).urls[4]
        if (!url) url = this.emotes.find(emote => emote.name === word).urls[1]
        words[index] = `<img src="${url}" class="emotes"/>`
      } else if (customEmotesNames.includes(word)) {
        let url
        if (!url) url = customEmotes.find(emote => emote.name === word).urls[3][1]
        if (!url) url = customEmotes.find(emote => emote.name === word).urls[0][1]
        words[index] = `<img src="${url}" class="emotes"/>`
      }
    })
    let textContainer = document.createElement("p")
    textContainer.classList.add("text")
    textContainer.innerHTML = words.join(" ")
    return textContainer
  }

  async customEmotes() {
    let id = fieldData.emotesId
    let url
    let customEmotesArr
    if (id != "") {
      await fetch(`https://api.7tv.app/v2/users/${id}/emotes`)
        .then(response => response.json())
        .then(data => (customEmotesArr = data))
        .catch(error => console.error(error))
    }
    return customEmotesArr
  }

  buildEvent() {
    return this.createMainEvent()
  }

  createMainEvent() {
    return this.createMainEventContainer()
  }

  get name() {
    const name = this.event.name
    const trimmed = this.trimName(name)

    return trimmed
  }

  get amount() {
    return this.event.amount
  }

  trimName(name) {
    const trimmed = name.slice(0, 20)
    return trimmed
  }

  get id() {
    // generate random string
    const randomString = Math.random().toString(36).substring(2, 15)
    const startingLetter = "f"
    return `${startingLetter}${randomString}`
  }

  async createMainEventContainer() {
    const { name } = this

    let { followText, subText, cheerText, tipText, giftSubText, bulkGiftText, raidText } = fieldData

    const dictionary = {
      follower: followText,
      subscriber: subText,
      cheer: cheerText,
      tip: tipText,
      giftsub: giftSubText,
      bulkgift: bulkGiftText,
      raid: raidText,
    }

    const amount = this.amount
    let sender = this.event.sender || this.event.name
    let eventText = dictionary[this.event.type]
    if (this.event.gifted) {
      eventText = dictionary["giftsub"]
      let text = ` ha regalado ${amount} subs!`
      if (eventText == "") {
        eventText = ` ha regalado ${amount} subs!`
        text = name + eventText
      } else {
        eventText = eventText.replace("(amount)", amount)
        eventText = eventText.replace("(sender)", sender)
        text = eventText
      }
    }

    if (this.event.bulkGifted) {
      eventText = dictionary["bulkgift"]
      let text = ` ha regalado ${amount} subs!`
      if (eventText == "") {
        eventText = ` ha regalado ${amount} subs!`
        text = name + eventText
      } else {
        eventText = eventText.replace("(amount)", amount)
        eventText = eventText.replace("(sender)", sender)
        text = eventText
      }
    }

    let text = eventText != "" ? eventText : `Gracias ${name}!`
    text = eventText != "" ? eventText : text
    if (eventText != "") {
      eventText = eventText.replace("(user)", name)
      eventText = eventText.replace("(amount)", amount)
      eventText = eventText.replace("(sender)", sender)
      text = eventText
    }

    const nameAndText = `${text}`
    const newContainer = document.createElement("div")
    newContainer.classList.add("new-container")
    newContainer.setAttribute("id", `${this.id}`)
    const theme = fieldData.theme
    let toggleClass = "toggle-circle"
    let toggleClass2 = "toggle"
    if (theme === "dark") {
      toggleClass = "toggle-circle-dark"
      toggleClass2 = "toggle-dark"
    }

    const colors = {
      dark: {
        username: "#5e8501",
        userBackground: "#b0cd6c",
        textColor: "#b0cd6c",
        textBackground: "#34440d",
        lineColor: "#34440d",
        dotsColor: "#ffefdb",
        eventsColor: "#34440d",
      },
      light: {
        username: "#b0cd6c",
        userBackground: "rgba(176, 205, 108, .2)",
        textColor: "#ffefdb",
        textBackground: "rgba(255, 239, 219, .5)",
        lineColor: "rgba(255, 239, 219, 1)",
        dotsColor: "#ddff91",
        eventsColor: "#ffefdb",
      },
      regular: {
        username: "#5e8501",
        userBackground: "#b0cd6c",
        textColor: "#72a101",
        textBackground: "#ffefdb",
        lineColor: "#ffefdb",
        dotsColor: "#ffefdb",
        eventsColor: "#ffefdb",
      },
    }

    newContainer.innerHTML = `
      <div class="event-container">
        <img class="plant-event-right" src="${imagesUrls.plant}" />
        <img class="plant-event-left" src="${imagesUrls.plant}" />
        <img class="heart" src="${imagesUrls.heart}" />
        <div class="event-and-name-container">
          <p class="event-name" style="color: ${colors.eventsColor}">${nameAndText}</p>
        </div>
        <img class="heart" src="${imagesUrls.heart}" />
      </div>
    `
    return newContainer
  }
}

const Widget = {
  width: 0,
  height: 0,
  pronouns: {},
  pronounsCache: {},
  channel: {},
  globalEmotes: {},
}

// I'm trash and forgot about this fn
async function get(URL) {
  return await fetch(URL)
    .then(async res => {
      if (!res.ok) return null
      return res.json()
    })
    .catch(error => null)
}

const GLOBAL_EMOTES = {
  ffz: {
    api: "https://api2.frankerfacez.com/v1/set/global",
    transformer: response => {
      const { default_sets, sets } = response
      const emoteNames = []
      for (const set of default_sets) {
        const { emoticons } = sets[set]
        for (const emote of emoticons) {
          emoteNames.push(emote.name)
        }
      }
      return emoteNames
    },
  },
  bttv: {
    api: "https://api.betterttv.net/3/cached/emotes/global",
    transformer: response => {
      return response.map(emote => emote.code)
    },
  },
  "7tv": {
    api: "https://api.7tv.app/v2/emotes/global",
    transformer: response => {
      return response.map(emote => emote.name)
    },
  },
}

window.addEventListener("onWidgetLoad", async obj => {
  Widget.channel = obj.detail.channel
  fieldData = obj.detail.fieldData
  maxMessages = fieldData.maxMessages
})

function stringToArray(string = "", separator = ",") {
  return string.split(separator).reduce((acc, value) => {
    const trimmed = value.trim()
    if (trimmed !== "") acc.push(trimmed)
    return acc
  }, [])
}

async function loadGlobalEmotes() {
  for (const [key, value] of Object.entries(GLOBAL_EMOTES)) {
    const { api, transformer } = value
    const response = await get(api)
    if (response != null) {
      Widget.globalEmotes[key] = transformer(response)
    }
  }
}

const removeMessage = mainContainer => {
  const elem = mainContainer
  if (elem) {
    elem.style.animation = "removeMessage 0.7s 1s ease-in-out"
    setTimeout(() => {
      elem.remove()
    }, 1500)
  }
}

let repeatedEvents = 0
let maxEvents = 0
let isBulk = false

const blacklisted = name => {
  let username = name.toLowerCase().trim()
  let blacklist = []
  let blackListFieldData = fieldData.usersBlackList.split(",")
  blackListFieldData.forEach(nick => {
    blacklist.push(nick.toLowerCase().trim())
  })
  return blacklist.includes(username)
}

const ignoreMessagesStartingWith = message => {
  let ignoreList = []
  let ignoreListFieldData = fieldData.specialCharsBlackList.split(",")
  if (ignoreListFieldData !== "") {
    ignoreListFieldData.forEach(symbol => {
      ignoreList.push(symbol.trim())
    })
  }

  if (ignoreList.length === 1 && ignoreList[0] === "") {
    return false
  }
  return ignoreList.some(symbol => message.toLowerCase().startsWith(symbol))
}

window.addEventListener("onEventReceived", async obj => {
  let { listener, event } = obj.detail
  if (event.isCommunityGift) return

  if (listener === "message") {
    let isBlackListed = blacklisted(event.data.displayName)
    if (isBlackListed) return
    let specialSymbols = ignoreMessagesStartingWith(event.data.text)
    if (specialSymbols) return
  }

  const mainCont = document.querySelector("main")

  const events = new mainEvent(event, listener)

  events.init
    .then(mainContainer => {
      if (fieldData.allowDeleteMessages === "true") {
        if (fieldData.deleteMessagesOption === "amount") {
          if (currentAmountOfMessages >= maxMessages) {
            let messageToRemove = currentMessagesIds.shift()
            removeMessage(document.querySelector(`#${messageToRemove}`))
            currentMessagesIds.push(mainContainer.id)
          } else {
            currentAmountOfMessages++
            currentMessagesIds.push(mainContainer.id)
          }
        }
        if (fieldData.deleteMessagesOption === "timer") {
          setTimeout(() => {
            removeMessage(mainContainer)
          }, fieldData.deleteMessagesTimer * 1000)
        }
      }
      mainCont.appendChild(mainContainer)
      return mainContainer
    })
    .then(async mainContainer => {
      await addLianas(mainContainer, listener, event)
    })
})

async function addLianas(container, listener, event) {
  const flowerSize = 66
  const lineContainer = document.createElement("div")
  lineContainer.classList.add("line-container")
  const containerHeight = container.offsetHeight
  const flowersAmount = roundFlowerAmount(containerHeight / flowerSize)
  // if (listener === "message") {
  const line = document.createElement("div")
  lineContainer.style.width = "40px"
  line.classList.add("line")
  lineContainer.appendChild(line)
  lineContainer.style.height = `${containerHeight + (listener === "message" ? 30 : 10)}px`
  const flowerContainer = document.createElement("div")
  flowerContainer.classList.add("flower-container")
  for (let i = 0; i < flowersAmount; i++) {
    const flower = document.createElement("img")
    flower.src = imagesUrls.flower
    flower.classList.add("flower")
    flowerContainer.appendChild(flower)
  }
  lineContainer.appendChild(flowerContainer)
  container.appendChild(lineContainer)
  return
}

function roundFlowerAmount(amount) {
  return Math.floor(amount) + (amount % 1 >= 0.7 ? 1 : 0)
}
