// let fieldData = {};
let currentEvent = null;
let flowerCount = 0;
let currentMessagesIds = [];
let currentAmountOfMessages = 0;
let maxMessages;
let baseUrls = [
  {
    name: "coffee",
    // coffee
    urls: {
      1: "https://i.postimg.cc/rmb727j1/cafeee.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1184933979745419314/cafeee.png?ex=658dc6c3&is=657b51c3&hm=f5548e4d32654f16cc6a3913b784877d7b03ceee7aa096061f8e9bb1e058caac&=&format=webp&quality=lossless",
    },
  },
  {
    name: "mod",
    // mod
    urls: {
      1: "https://i.postimg.cc/fb86BV0g/cafe-mod.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1184933978239684768/cafe-mod.png?ex=658dc6c3&is=657b51c3&hm=6fd529a403fe19470e6c61d3bce1a4fb7fc955a0b7314711603e6dd3b7364346&=&format=webp&quality=lossless",
    },
  },
  {
    // vip
    name: "vip",
    urls: {
      1: "https://i.postimg.cc/c4YG01Vr/cafe-vip.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1184933979514744913/cafe-vip.png?ex=658dc6c3&is=657b51c3&hm=e7bacd2a0e159c776379b3e6042be46c7c1e29c4dea9a817cdbf251675cf30d7&=&format=webp&quality=lossless",
    },
  },
  {
    // sub
    name: "sub",
    urls: {
      1: "https://i.postimg.cc/jSb050bv/cafe-sub.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1184933978738786304/cafe-sub.png?ex=658dc6c3&is=657b51c3&hm=d2d030a73a9a173e55d2d35ed076fffabba5014265878921f3ca7e61a5830f3a&=&format=webp&quality=lossless",
    },
  },
  {
    // streamer
    name: "streamer",
    urls: {
      1: "https://i.postimg.cc/W1wRqWpV/cafe-streamer.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1184933978495529010/cafe-streamer.png?ex=658dc6c3&is=657b51c3&hm=c9ae7e9012eb74382fbc5e4b10ccd7924e59bbc2f8663d689995fbf242bddf93&=&format=webp&quality=lossless",
    },
  },
  {
    // viewer
    name: "viewer",
    urls: {
      1: "https://i.postimg.cc/q7JPssg3/cafe-viewer.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1184933979091128402/cafe-viewer.png?ex=658dc6c3&is=657b51c3&hm=cbf651c0d0d2ecbd316c37eb42619fd66621f889092c204bc02fa7f1e94b1d43&=&format=webp&quality=lossless",
    },
  },
  {
    // moon
    name: "moon",
    urls: {
      1: "https://i.postimg.cc/HLWd161G/lunamarron.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1193320993654054973/lunamarron.png?ex=65ac49c7&is=6599d4c7&hm=a4883d4202fd88a3aabdd69b1bf2b6ba4b677e09166c260851cbeff7bf0d599a&=&format=webp&quality=lossless&width=48&height=48",
    },
  },
  {
    // shiny
    name: "shiny",
    urls: {
      1: "https://i.postimg.cc/pd0xWKPm/brillomarron.png",
      2: "https://media.discordapp.net/attachments/1184922970498539520/1193320993335300226/brillomarron.png?ex=65ac49c7&is=6599d4c7&hm=874b2ecb117af8e8f2e18ac017707b13ce292822ea71fa71d7b97c81e86504f5&=&format=webp&quality=lossless&width=40&height=40",
    },
  },
];
let coffeeImages = {};
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
        userBackground: "#a35e46",
        textColor: "#a35e46",
        textBackground: "#ffefdb",
        lineColor: "#ba8f78",
        pronsColor: "#a35e46",
        dotsColor: "#d79a85",
        pronsBgColor: "#a35e46"
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
      inlineStyle = `display: inline; background-color: ${colors.coffee.username}; color: ${colors.coffee.pronsColor}`;
    }

    const isValidChocoUrl = await checkImgUrl(
      "https://i.postimg.cc/LXrQbL4v/chocoo.png"
    );
    let chocoUrl;
    if (!isValidChocoUrl) {
      // replace this
      chocoUrl =
        "https://media.discordapp.net/attachments/1184922970498539520/1184933979091128402/cafe-viewer.png?ex=658dc6c3&is=657b51c3&hm=cbf651c0d0d2ecbd316c37eb42619fd66621f889092c204bc02fa7f1e94b1d43&=&format=webp&quality=lossless";
    } else {
      chocoUrl = "https://i.postimg.cc/LXrQbL4v/chocoo.png";
    }

    let coffeeUrl = coffeeImages.coffee;

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
              <img src="${coffeeUrl}" class="coffee"/>
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
        lineColor: "#ba8f78",
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
  await checkAllUrls();
});

async function checkAllUrls() {
  for (item in baseUrls) {
    console.log(baseUrls[item].urls[1]);
    const isValidUrl = await checkImgUrl(baseUrls[item].urls[1]);
    const isValidUrl2 = await checkImgUrl(baseUrls[item].urls[2]);
    if (isValidUrl) {
      coffeeImages[baseUrls[item].name] = baseUrls[item].urls[1];
      console.log("coffee images", coffeeImages);
    } else if (isValidUrl2) {
      coffeeImages[baseUrls[item].name] = baseUrls[item].urls[2];
      console.log("coffee images 2", coffeeImages);
    } else {
      coffeeImages[baseUrls[item].name] = null;
      console.log("coffee images 3", coffeeImages);
    }
  }
}

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
      lineColor: "#ba8f78",
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

async function checkImgUrl(url) {
  return await fetch(url).then((res) => {
    return res.ok;
  });
}
