// let fieldData = {};
let currentEvent = null;
let flowerCount = 0;
let currentMessagesIds = [];
let currentAmountOfMessages = 0;
let maxMessages;
let coffeeImages = {
  choco:
    "https://media.discordapp.net/attachments/1184922970498539520/1186354892642725898/chocoo.png?ex=6592f217&is=65807d17&hm=2ee831b1a838f0381f672c39e866c9454d417b0dde7887ea87161b1244c1ab10&=&format=webp&quality=lossless",
  mod: "https://media.discordapp.net/attachments/1184922970498539520/1186354891308945510/choco-mod.png?ex=6592f217&is=65807d17&hm=c963fc3763e8925c237add145acc1c0bbd6bf913883004c6858f00addf4d8c13&=&format=webp&quality=lossless",
  vip: "https://media.discordapp.net/attachments/1184922970498539520/1186354892428808192/choco-vip.png?ex=6592f217&is=65807d17&hm=d3fa3f0096f0968d4f9c0b2ae8c16f42f9139c6af7ce3b74d46e6ec2c78d91a2&=&format=webp&quality=lossless",
  sub: "https://media.discordapp.net/attachments/1184922970498539520/1186354891870974166/choco-sub.png?ex=6592f217&is=65807d17&hm=9f0ede77def77c29d7e1ac5fa6c82ba148a5e88650d61f904fc233a99bf83243&=&format=webp&quality=lossless",
  streamer:
    "https://media.discordapp.net/attachments/1184922970498539520/1186354891573170236/choco-streamer.png?ex=6592f217&is=65807d17&hm=346268a20311ea3da90b8a67942c7fe5ea460a5588f7cada1707985bed2211de&=&format=webp&quality=lossless",
  viewer:
    "https://media.discordapp.net/attachments/1184922970498539520/1186354892206526604/choco-viewer.png?ex=6592f217&is=65807d17&hm=ec9909d117cf5a720b4d2e57d700a9dd42db6ff25b2091dd37130216e9601a82&=&format=webp&quality=lossless",
  moon: "https://media.discordapp.net/attachments/1184922970498539520/1186354892860838031/copo.png?ex=6592f217&is=65807d17&hm=19f0113638e21a9836946ebbfc6e662de73a29406cfe096fbbc4c555d48d0102&=&format=webp&quality=lossless",
  shiny:
    "https://media.discordapp.net/attachments/1184922970498539520/1186354891069862029/bastoncito.png?ex=6592f217&is=65807d17&hm=872cc2f65254c6e1356feda9d87c13273b6d34aefa422653f01cbb522e1ccc46&=&format=webp&quality=lossless",
};
const SE_API_BASE = "https://api.streamelements.com/kappa/v2";

const PRONOUNS_API_BASE = "https://pronouns.alejo.io/api";
const PRONOUNS_API = {
  user: (username) => `${PRONOUNS_API_BASE}/users/${username}`,
  pronouns: `${PRONOUNS_API_BASE}/pronouns`,
};

const roles = ["streamer", "mod", "vip", "subscriber", "viewer"];
const priorities = {
  streamer: 1,
  mod: 2,
  vip: 3,
  subscriber: 4,
  viewer: 5,
};

class mainEvent {
  constructor(event, listener) {
    this.event = event;
    this.listener = listener;
  }

  get init() {
    return this.eventType();
  }

  get isMod() {
    return this.event.data.tags.mod === "1";
  }

  get isStreamer() {
    return (
      this.event.data.displayName.toLowerCase() ==
      this.event.data.channel.toLowerCase()
    );
  }

  get isSub() {
    return this.event.data.tags.subscriber === "1";
  }

  get isVip() {
    return this.event.data.tags.vip === "1";
  }

  get isViewer() {
    return !this.isMod && !this.isStreamer && !this.isSub && !this.isVip;
  }

  get badges() {
    return this.event.data.badges;
  }

  get user() {
    return this.event.data.displayName;
  }

  get roles() {
    const priorityRole = [];
    const tags = this.event.data.tags;
    let keys = Object.keys(tags);
    keys.forEach((key) => {
      if (roles.includes(key) && tags[key] === "1") {
        priorityRole.push({ role: key, priority: priorities[key] });
      }
    });

    if (this.isStreamer) {
      priorityRole.push({ role: "streamer", priority: priorities["streamer"] });
    }

    if (priorityRole.length === 0) {
      priorityRole.push({ role: "viewer", priority: priorities["viewer"] });
    }
    priorityRole.sort((a, b) => a.priority - b.priority);
    return priorityRole[0];
  }

  eventType() {
    if (this.listener === "message") {
      return this.buildMessageCont();
    } else {
      return this.buildEvent();
    }
  }

  get emotes() {
    return this.event.data.emotes;
  }

  get text() {
    return this.event.data.text;
  }

  async buildMessageCont() {
    return await this.createMainContainerElement();
  }

  async createMainContainerElement() {
    const colors = {
      coffee: {
        username: "#ffefdb",
        userBackground: "#9b2d2c",
        textColor: "#9b2d2c",
        textBackground: "#ffefdb",
        lineColor: "#ffefdb",
        pronsColor: "#a35e46",
        dotsColor: "#9b2d2c",
      },
    };

    const theme = fieldData.theme;
    const superMainContainer = document.createElement("div");
    superMainContainer.classList.add("super-main-container");
    superMainContainer.setAttribute("id", `${this.id}`);
    const role = this.roles.role;
    let roleImageURL = coffeeImages[role];
    console.log(roleImageURL, "asdfasdfadsfasdfasdfasdf");
    let roleText = await this.getUserPronoun();

    function showBadges(thisObj) {
      return thisObj.badges
        .map((badge) => {
          return `<img src="${badge.url}" class="badges-img"/>`;
        })
        .join("");
    }
    let inlineStyle;
    if (fieldData.allowPronouns == "false" || roleText == "") {
      inlineStyle = `display: none;`;
    } else if (fieldData.allowPronouns == "true" && roleText != "") {
      inlineStyle = `display: inline; background-color: ${colors.coffee.lineColor}; color: ${colors.coffee.pronsColor}`;
    }

    let chocoUrl = coffeeImages.choco;

    superMainContainer.innerHTML = `
      <div class="main-container">
        <div class="message-container">
          <div class="username-info-container" style="background-color:${
            colors.coffee.userBackground
          }">
            <div class="username-info">
              <span class="username-badges" style="${
                fieldData.displayBadges == "false" ? "display: none;" : ""
              }">
                ${fieldData.displayBadges == "true" ? showBadges(this) : ""}
              </span>
              <span class="capitalize-user" style="color: ${
                colors.coffee.username
              }">${this.user}</span>
              <span class="dot" style='${inlineStyle}'></span>
              <span class="role-container" style='${inlineStyle}'>
                ${roleText}
              </span>
              <img src="${roleImageURL}" class="role"/>
              <img src="${chocoUrl}" class="coffee"/>
            </div>
            <div class="message-icon-container" style="background-color: ${
              colors.coffee.textBackground
            };">
              <div class="rendered-text">
              <p class="text" style="color: ${colors.coffee.textColor}">${
      (await this.buildMessage()).innerHTML
    }</p>
                <div class="dots-container">
                  <span class="dot" style="background-color: ${
                    colors.coffee.dotsColor
                  }"></span>
                  <span class="dot" style="background-color: ${
                    colors.coffee.dotsColor
                  }"></span>
                  <span class="dot" style="background-color: ${
                    colors.coffee.dotsColor
                  }"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>`;
    return superMainContainer;
  }

  get roleImages() {
    const roles = this.getRole();

    // Buscar el rol con la menor prioridad
    const minPriorityRole = roles.reduce(
      (minRole, currentRole) =>
        currentRole.priority < minRole.priority ? currentRole : minRole,
      roles[0] // Establecer el primer elemento como valor inicial
    );

    // Asignar la imagen correspondiente
    let roleImage = document.createElement("img");
    roleImage.classList.add("role");
    if (minPriorityRole.length == 0) {
      minPriorityRole.role = "viewer";
    }
    return roleImage;
  }

  async getUserPronoun() {
    let pronoun = null;
    let username = this.user.toLowerCase();

    const response = await fetch(`${PRONOUNS_API_BASE}/users/${username}`);
    const data = await response.json();
    if (data[0] == undefined) {
      return "";
    }
    pronoun = data[0].pronoun_id;

    // pronoun = await pronoun_api;
    switch (pronoun) {
      case "aeaer":
        pronoun = "ae/aer";
        break;
      case "eem":
        pronoun = "e/em";
        break;
      case "faefaer":
        pronoun = "fae/faer";
        break;
      case "hehim":
        pronoun = "he/him";
        break;
      case "heshe":
        pronoun = "he/she";
        break;
      case "hethem":
        pronoun = "he/they";
        break;
      case "itits":
        pronoun = "it/its";
        break;
      case "perper":
        pronoun = "per/per";
        break;
      case "sheher":
        pronoun = "she/her";
        break;
      case "shethem":
        pronoun = "she/they";
        break;
      case "theythem":
        pronoun = "they/them";
        break;
      case "vever":
        pronoun = "ve/ver";
        break;
      case "xexem":
        pronoun = "xe/xem";
        break;
      case "ziehir":
        pronoun = "zie/hir";
        break;
      default:
        break;
    }
    return pronoun;
  }

  getRole() {
    const roles = [];
    const rolesObj = {
      mod: { role: "mod", priority: 1 },
      vip: { role: "vip", priority: 2 },
      subscriber: { role: "sub", priority: 3 },
      turbo: { role: "turbo", priority: 4 },
    };

    Object.entries(this.event.data.tags).forEach(([key, value]) => {
      if (value === "1" && rolesObj[key]) {
        roles.push(rolesObj[key]);
      } else {
        const viewer = { role: "viewer", priority: 5 };
        if (roles.includes(viewer)) {
          return;
        } else {
          roles.push(viewer);
        }
      }
    });

    if (this.isStreamer) {
      const streamer = { role: "streamer", priority: 0 };
      roles.unshift(streamer);
    }
    return roles;
  }

  async buildMessage() {
    // get emotes if any
    let emoteNames = [];
    let customEmotesNames = [];
    let customEmotes = await this.customEmotes();
    if (customEmotes != undefined && customEmotes.status != "Not Found") {
      customEmotes.map((emote) => {
        customEmotesNames.push(emote.name);
      });
    }

    if (this.emotes.length > 0) {
      emoteNames = this.emotes.map((emote) => emote.name);
    }

    const rawMessage = this.text;
    const words = rawMessage.split(" ");

    words.map((word, index) => {
      if (emoteNames.includes(word)) {
        let url;
        if (!url)
          url = this.emotes.find((emote) => emote.name === word).urls[4];
        if (!url)
          url = this.emotes.find((emote) => emote.name === word).urls[1];
        words[index] = `<img src="${url}" class="emotes"/>`;
      } else if (customEmotesNames.includes(word)) {
        let url;
        if (!url)
          url = customEmotes.find((emote) => emote.name === word).urls[3][1];
        if (!url)
          url = customEmotes.find((emote) => emote.name === word).urls[0][1];
        words[index] = `<img src="${url}" class="emotes"/>`;
      }
    });
    let textContainer = document.createElement("p");
    textContainer.classList.add("text");
    textContainer.innerHTML = words.join(" ");
    return textContainer;
  }

  async customEmotes() {
    let id = fieldData.emotesId;
    let url;
    let customEmotesArr;
    if (id != "") {
      await fetch(`https://api.7tv.app/v2/users/${id}/emotes`)
        .then((response) => response.json())
        .then((data) => (customEmotesArr = data))
        .catch((error) => console.error(error));
    }
    return customEmotesArr;
  }

  buildEvent() {
    return this.createMainEvent();
  }

  createMainEvent() {
    return this.createMainEventContainer();
  }

  get name() {
    const name = this.event.name;
    const trimmed = this.trimName(name);

    return trimmed;
  }

  get amount() {
    return this.event.amount;
  }

  trimName(name) {
    const trimmed = name.slice(0, 20);
    return trimmed;
  }

  get id() {
    // generate random string
    const randomString = Math.random().toString(36).substring(2, 15);
    const startingLetter = "c";
    return `${startingLetter}${randomString}`;
  }

  async createMainEventContainer() {
    const { name } = this;

    let {
      followText,
      subText,
      cheerText,
      tipText,
      giftSubText,
      bulkGiftText,
      raidText,
    } = fieldData;

    const dictionary = {
      follower: followText,
      subscriber: subText,
      cheer: cheerText,
      tip: tipText,
      giftsub: giftSubText,
      bulkgift: bulkGiftText,
      raid: raidText,
    };

    const amount = this.amount;
    let sender = this.event.sender || this.event.name;
    let eventText = dictionary[this.event.type];
    if (this.event.gifted) {
      eventText = dictionary["giftsub"];
      let text = ` ha regalado ${amount} subs!`;
      if (eventText == "") {
        eventText = ` ha regalado ${amount} subs!`;
        text = name + eventText;
      } else {
        eventText = eventText.replace("(amount)", amount);
        eventText = eventText.replace("(sender)", sender);
        text = eventText;
      }
    }

    if (this.event.bulkGifted) {
      eventText = dictionary["bulkgift"];
      let text = ` ha regalado ${amount} subs!`;
      if (eventText == "") {
        eventText = ` ha regalado ${amount} subs!`;
        text = name + eventText;
      } else {
        eventText = eventText.replace("(amount)", amount);
        eventText = eventText.replace("(sender)", sender);
        text = eventText;
      }
    }

    let text = eventText != "" ? eventText : `Gracias ${name}!`;
    text = eventText != "" ? eventText : text;
    if (eventText != "") {
      eventText = eventText.replace("(user)", name);
      eventText = eventText.replace("(amount)", amount);
      eventText = eventText.replace("(sender)", sender);
      text = eventText;
    }

    const nameAndText = `${text}`;
    const newContainer = document.createElement("div");
    newContainer.classList.add("new-container");
    newContainer.setAttribute("id", `${this.id}`);
    const colors = {
      coffee: {
        username: "#ffefdb",
        userBackground: "#9b2d2c",
        textColor: "#9b2d2c",
        textBackground: "#ffefdb",
        lineColor: "#ffefdb",
        pronsColor: "#a35e46",
        dotsColor: "#9b2d2c",
        eventsColor: "#ffefdb",
      },
    };

    newContainer.innerHTML = `
      <div class="event-container">
        <div class="toggle">
          <div class="toggle-circle"></div>
        </div>
        <div class="event-and-name-container">
          <p class="event-name" style="color: ${colors.coffee.eventsColor}">${nameAndText}</p>
        </div>
      </div>
    `;
    return newContainer;
  }
}

const Widget = {
  width: 0,
  height: 0,
  pronouns: {},
  pronounsCache: {},
  channel: {},
  globalEmotes: {},
};

// I'm trash and forgot about this fn
async function get(URL) {
  return await fetch(URL)
    .then(async (res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .catch((error) => null);
}

const GLOBAL_EMOTES = {
  ffz: {
    api: "https://api2.frankerfacez.com/v1/set/global",
    transformer: (response) => {
      const { default_sets, sets } = response;
      const emoteNames = [];
      for (const set of default_sets) {
        const { emoticons } = sets[set];
        for (const emote of emoticons) {
          emoteNames.push(emote.name);
        }
      }
      return emoteNames;
    },
  },
  bttv: {
    api: "https://api.betterttv.net/3/cached/emotes/global",
    transformer: (response) => {
      return response.map((emote) => emote.code);
    },
  },
  "7tv": {
    api: "https://api.7tv.app/v2/emotes/global",
    transformer: (response) => {
      return response.map((emote) => emote.name);
    },
  },
};

window.addEventListener("onWidgetLoad", async (obj) => {
  Widget.channel = obj.detail.channel;
  fieldData = obj.detail.fieldData;
  maxMessages = fieldData.maxMessages;
});

function stringToArray(string = "", separator = ",") {
  return string.split(separator).reduce((acc, value) => {
    const trimmed = value.trim();
    if (trimmed !== "") acc.push(trimmed);
    return acc;
  }, []);
}

async function loadGlobalEmotes() {
  for (const [key, value] of Object.entries(GLOBAL_EMOTES)) {
    const { api, transformer } = value;
    const response = await get(api);
    if (response != null) {
      Widget.globalEmotes[key] = transformer(response);
    }
  }
}

const removeMessage = (mainContainer) => {
  const elem = mainContainer;
  if (elem) {
    elem.style.animation = "removeMessage 0.7s 1s ease-in-out";
    setTimeout(() => {
      elem.remove();
    }, 1500);
  }
};

let repeatedEvents = 0;
let maxEvents = 0;
let isBulk = false;

const blacklisted = (name) => {
  let username = name.toLowerCase().trim();
  let blacklist = [];
  let blackListFieldData = fieldData.usersBlackList.split(",");
  blackListFieldData.forEach((nick) => {
    blacklist.push(nick.toLowerCase().trim());
  });
  return blacklist.includes(username);
};

const ignoreMessagesStartingWith = (message) => {
  let ignoreList = [];
  let ignoreListFieldData = fieldData.specialCharsBlackList.split(",");
  if (ignoreListFieldData !== "") {
    ignoreListFieldData.forEach((symbol) => {
      ignoreList.push(symbol.trim());
    });
  }

  if (ignoreList.length === 1 && ignoreList[0] === "") {
    return false;
  }
  return ignoreList.some((symbol) => message.toLowerCase().startsWith(symbol));
};

window.addEventListener("onEventReceived", async (obj) => {
  let { listener, event } = obj.detail;
  if (event.isCommunityGift) return;

  if (listener === "message") {
    let isBlackListed = blacklisted(event.data.displayName);
    if (isBlackListed) return;
    let specialSymbols = ignoreMessagesStartingWith(event.data.text);
    if (specialSymbols) return;
  }

  const mainCont = document.querySelector("main");

  const events = new mainEvent(event, listener);

  events.init
    .then((mainContainer) => {
      if (fieldData.allowDeleteMessages === "true") {
        if (fieldData.deleteMessagesOption === "amount") {
          if (currentAmountOfMessages >= maxMessages) {
            let messageToRemove = currentMessagesIds.shift();
            removeMessage(document.querySelector(`#${messageToRemove}`));
            currentMessagesIds.push(mainContainer.id);
          } else {
            currentAmountOfMessages++;
            currentMessagesIds.push(mainContainer.id);
          }
        }
        if (fieldData.deleteMessagesOption === "timer") {
          setTimeout(() => {
            removeMessage(mainContainer);
          }, fieldData.deleteMessagesTimer * 1000);
        }
      }
      mainCont.appendChild(mainContainer);
      return mainContainer;
    })
    .then((mainContainer) => {
      addLines(mainContainer, listener, event);
    });
});

async function addLines(container, listener, event) {
  const colors = {
    coffee: {
      username: "#ffefdb",
      userBackground: "#a35e46",
      textColor: "#a35e46",
      textBackground: "#ffefdb",
      lineColor: "#ffefdb",
      pronsColor: "#a35e46",
      dotsColor: "#d79a85",
    },
  };

  let moonUrl = coffeeImages.moon;
  let shinyUrl = coffeeImages.shiny;

  let messageContainer, currentHeight;

  if (listener === "message") {
    messageContainer = container.querySelector(".message-icon-container");
    currentHeight = messageContainer.offsetHeight;
    messageContainer.style.height = "0px";
    messageContainer.style.transition = "height 0.5s ease-in-out";
    setTimeout(() => {
      messageContainer.style.height = `${currentHeight + 10}px`;
    }, 300);
  }

  const contHeight = container.offsetHeight + currentHeight;
  const linesContainer = document.createElement("div");
  linesContainer.classList.add("lines-container");
  if (listener === "message") {
    linesContainer.innerHTML = `
      <span class="dot" style="background-color: ${
        colors.coffee.lineColor
      }"></span>
      <img src="${shinyUrl}" class="shiny"/>
      <div class="line-container" style="${
        contHeight <= 140 ? "height: 65%" : "height: 75%"
      };" >
        <div class="line" style="background-color: ${
          colors.coffee.lineColor
        }"></div>
      </div>
      <span class="dot" style="background-color: ${
        colors.coffee.lineColor
      }"></span>
  `;
  }
  if (listener !== "message") {
    linesContainer.innerHTML = `
      <img src="${moonUrl}" class="moon"/>
  `;
  }

  container.appendChild(linesContainer);
}