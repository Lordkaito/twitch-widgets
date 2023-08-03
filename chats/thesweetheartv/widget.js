// let fieldData = {};
let currentEvent = null;
// let startingColor = "red";

const SE_API_BASE = "https://api.streamelements.com/kappa/v2";

const PRONOUNS_API_BASE = "https://pronouns.alejo.io/api";
const PRONOUNS_API = {
  user: (username) => `${PRONOUNS_API_BASE}/users/${username}`,
  pronouns: `${PRONOUNS_API_BASE}/pronouns`,
};

const colors = {
  streamer: {
    user: {
      background: "#feedbe",
      text: "#a28363",
      border: "",
    },
    prons: {
      background: "feedbe",
      text: "#a28363",
      border: "",
    },
  },
  mod: {
    user: {
      background: "#fabad0",
      text: "#fef9fd",
      border: "",
    },
    prons: {
      background: "#fabad0",
      text: "#fef9fd",
      border: "",
    },
  },
  vip: {
    user: {
      background: "#fc93c0",
      text: "#fef9fd",
      border: "",
    },
    prons: {
      background: "#fc93c0",
      text: "#fef9fd",
      border: "",
    },
  },
  subscriber: {
    user: {
      background: "#fb9784",
      text: "#fef9fd",
      border: "",
    },
    prons: {
      background: "#fb9784",
      text: "#fef9fd",
      border: "",
    },
  },
  viewer: {
    user: {
      background: "#f6be93",
      text: "#fef9fd",
      border: "",
    },
    prons: {
      background: "#f6be93",
      text: "#fef9fd",
      border: "",
    },
  },
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

    if (priorityRole.length === 0 && this.isStreamer) {
      priorityRole.push({ role: "streamer", priority: priorities["streamer"] });
      return priorityRole[0];
    }

    if (priorityRole.length === 0) {
      priorityRole.push({ role: "viewer", priority: priorities["viewer"] });
      return priorityRole[0];
    }
    priorityRole.sort((a, b) => a.priority - b.priority);
    return priorityRole[0];
    return priorityRole;
  }

  eventType() {
    if (this.listener === "message") {
      return this.buildMessageCont();
    } else {
      return this.buildEvent();
    }
  }

  get flower() {
    const flower = document.createElement("img");
    flower.src = "https://i.postimg.cc/W12nD9TL/arco-iris-4.png";
    flower.classList.add("flower");

    return flower;
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

  get userColor() {
    console.log(this.event.data.displayColor);
    return this.event.data.displayColor;
  }

  get origami() {
    const origami = document.createElement("div");
    const circle = document.createElement("div");
    circle.innerHTML = `
      <svg class="circulo" viewBox="0 0 100 100">
        <circle class="circulo-animado" cx="50" cy="50" r="45">
        </circle>
      </svg>
    `;
    circle.classList.add("circle");
    const dots = document.createElement("div");
    dots.classList.add("ori-dots");
    const oriContainer = document.createElement("div");
    oriContainer.classList.add("ori-container");
    const ori = document.createElement("img");
    const flower = document.createElement("img");
    origami.classList.add("origami");
    // flower.classList.add("ori-flower");
    if (this.isStreamer) {
      flower.src = "https://i.postimg.cc/cLMTW5t8/cuernos-ire.png";
      flower.classList.add("streamer");
      flower.classList.remove("ori-flower");
    } else if (this.isMod) {
      flower.src = "https://i.postimg.cc/HL6rTpk7/rosatallo-ire.png";
      flower.classList.add("mod");
      flower.classList.remove("ori-flower");
    } else if (this.isVip) {
      flower.src = "https://i.postimg.cc/MT4XjdR6/lirios-ire.png";
      flower.classList.add("vip");
      flower.classList.remove("ori-flower");
    } else {
      flower.classList.add("subscriber");
      flower.src = "https://i.postimg.cc/LXhnXrJQ/rosa-ire.png";
    }
    ori.src = "https://i.postimg.cc/WbSBnxQH/origami.png";

    const container = document.createElement("div");
    container.classList.add("container");

    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      dot.classList.add(`dot-${i + 1}`);
      dots.appendChild(dot);
    }

    circle.appendChild(flower);
    // oriContainer.appendChild(ori);

    container.appendChild(circle);
    container.appendChild(dots);
    container.appendChild(oriContainer);

    // origami.appendChild(container);
    return origami;
  }

  async createMainContainerElement() {
    let role = this.roles;
    const mainContainer = document.createElement("div");
    const superMainContainer = document.createElement("div");
    const animation = fieldData.animation;
    const origami = this.origami;

    superMainContainer.classList.add("super-main-container");
    // superMainContainer.appendChild(this.origami);
    mainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("main-container");
    mainContainer.appendChild(this.roleImages)
    // mainContainer.style.backgroundColor = this.userColor;

    // mainContainer.appendChild(this.flower);

    mainContainer.appendChild(await this.createUsernameInfoElement());
    mainContainer.appendChild(await this.createMessageContainerElement());
    // mainContainer.appendChild(await this.createPronounsContainer());
    superMainContainer.appendChild(mainContainer);

    return superMainContainer;
  }

  get butterfly() {
    const img = document.createElement("img");
    const imgContainer = document.createElement("div");
    img.src = "https://i.postimg.cc/RVSHXtvv/mariposita.png";
    img.classList.add("butterfly");
    imgContainer.classList.add("butterfly-container");
    // imgContainer.appendChild(img);

    return imgContainer;
  }

  async createUsernameInfoElement() {
    const role = this.roles;
    const usernameInfo = document.createElement("div");
    const usernameInfoContainer = document.createElement("div");
    const hyphen = document.createElement("span");
    hyphen.classList.add("hyphen");
    // hyphen.innerHTML = " -- ";
    usernameInfoContainer.classList.add("username-info-container");
    usernameInfo.classList.add("username-info");
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    // if(this.isSub || this.isStreamer) {
    //   usernameInfoContainer.appendChild(this.createRoleContainer());
    // }
    // usernameInfoContainer.appendChild(await this.createPronounsContainer());
    usernameInfoContainer.appendChild(usernameInfo);
    // usernameInfoContainer.appendChild(hyphen);
    // usernameInfo.style.backgroundColor = `${colors[role.role].user.background}`;
    return usernameInfoContainer;
  }

  async createMessageContainerElement() {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");
    messageContainer.appendChild(
      await this.createMessageIconContainerElement()
    );
    return messageContainer;
  }

  createUsernameBadgesElement() {
    const usernameBadges = document.createElement("span");
    usernameBadges.classList.add("username-badges");
    this.badges.forEach((badge) => {
      let badgeImg = document.createElement("img");
      badgeImg.classList.add("badges-img");
      badgeImg.src = badge.url;
      usernameBadges.appendChild(badgeImg);
    });

    if (fieldData.displayBadges == "false") {
      usernameBadges.style.display = "none";
    }
    return usernameBadges;
  }

  createCapitalizeUserElement() {
    let colors = {
      red: "#fb6183",
      orange: "#ff8d4e",
      yellow: "#feca76",
      green: "#68be5c",
      blue: "#3fbeb5",
      darkblue: "#587ec4",
      purple: "#a679de",
    };
    let role = this.roles;
    const capitalizeUser = document.createElement("span");
    capitalizeUser.classList.add("capitalize-user");
    // capitalizeUser.style.color = colors[startingColor];
    capitalizeUser.innerText = this.user;
    // capitalizeUser.style.color = this.userColor;
    return capitalizeUser;
  }

  createRoleContainer() {
    const roleContainer = document.createElement("span");
    roleContainer.classList.add("role-container");
    // roleContainer.appendChild(this.roleImages);
    return roleContainer;
  }

  async createPronounsContainer() {
    let colors = {
      red: "#fb6183",
      orange: "#ff8d4e",
      yellow: "#feca76",
      green: "#68be5c",
      blue: "#3fbeb5",
      darkblue: "#587ec4",
      purple: "#a679de",
    };
    let role = this.roles;
    const pronounsContainer = document.createElement("div");
    const pronouns = document.createElement("span");
    pronouns.classList.add("prons");
    pronounsContainer.classList.add("pronouns");
    pronouns.innerText = await this.getUserPronoun();
    pronouns.innerText == ""
      ? (pronounsContainer.style.display = "none")
      : (pronounsContainer.style.display = "block");
    if (fieldData.allowPronouns == "false") {
      pronounsContainer.style.display = "none";
    }
    // pronouns.style.color = colors[startingColor];

    // pronouns.style.color = this.userColor;

    pronounsContainer.appendChild(pronouns);
    return pronounsContainer;
  }

  async createMessageIconContainerElement() {
    const messageIconContainer = document.createElement("div");
    messageIconContainer.classList.add("message-icon-container");
    messageIconContainer.appendChild(await this.createRenderedTextElement());
    return messageIconContainer;
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

    let colors = {
      red: "#fb6183",
      orange: "#ff8d4e",
      yellow: "#feca76",
      green: "#68be5c",
      blue: "#3fbeb5",
      darkblue: "#587ec4",
      purple: "#a679de",
    };

    // console.log(colors[startingColor]);
    switch (minPriorityRole.role) {
      case "streamer":
        roleImage.classList.add("sombrero")
        roleImage.src = `https://i.postimg.cc/bwJVxM82/sombrero.png`;
        break;
      case "mod":
        roleImage.classList.add("maquina")
        roleImage.src = `https://i.postimg.cc/DzGg53Nm/maquina.png`;
        break;
      case "vip":
        roleImage.classList.add("flores")
        roleImage.src = `https://i.postimg.cc/6pmjY05b/ramo.png`;
        break;
      case "sub":
        roleImage.classList.add("pulsera")
        roleImage.src = `https://i.postimg.cc/ZRrwYzPX/pulsera.png`;
        break;
      case "viewer":
        roleImage.classList.add("tarta")
        roleImage.src = `https://i.postimg.cc/nhg2vh06/pastel.png`;
        break;
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

  async createRenderedTextElement() {
    const renderedText = document.createElement("div");
    renderedText.classList.add("rendered-text");
    renderedText.classList.add(`${this.roles.role}-text`);
    renderedText.appendChild(await this.buildMessage());
    return renderedText;
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
    if (this.themeColor() == "purple") {
      textContainer.classList.add("white-text");
    }
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

  themeColor() {
    let color = fieldData.theme;

    return color;
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

  async createMainEventContainer() {
    const mainContainer = document.createElement("div");

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
    console.log(this.event);

    // const eventDictionary = {
    //   follower: "HI",
    //   subscriber: this.event.gifted ? "GIFT" : "SUB",
    //   cheer: "CHEER",
    //   subscriber: "SUB",
    //   tip: "TIP",
    //   raid: "RAID",
    //   bulkgift: "GIFT",
    // };

    console.log(this.event);

    const amount = this.amount;
    let sender = this.event.sender;
    let eventText = dictionary[this.event.type];
    console.log(dictionary[this.event.type]);
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
      sender = this.event.sender || this.event.name;
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
    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    const fungi = document.createElement("img");

    fungi.src = "https://i.postimg.cc/Kc65MynM/corazon-ire.png";

    fungi.classList.add("fungi");
    const fungiDivContainer = document.createElement("div");

    fungiDivContainer.classList.add(`event-leafs-container`);
    // fungiDivContainer.appendChild(fungi);
    fungiContainer.classList.add("fungi-container");
    const cesta = document.createElement("img");
    const bunny = document.createElement("img");
    cesta.src = "https://i.postimg.cc/6qMLTW8b/cesta.png"
    bunny.src = "https://i.postimg.cc/bJHRcHph/conejo.png"
    cesta.classList.add("cesta");
    bunny.classList.add("bunny");
    const moon = document.createElement("img");
    moon.src = "https://i.postimg.cc/zfPDcV64/luna.png";
    moon.classList.add("moon");
    // fungiContainer.appendChild(moon);
    // fungiContainer.appendChild(fungiDivContainer);
    nameContainer.classList.add("event-name");
    nameContainer.innerText = this.event.gifted ? name + " gifted" : name;
    console.log(name)
    const eventTextExtra = document.createElement("p");
    eventTextExtra.classList.add("event-text-extra");
    eventTextExtra.innerText = text;

    const eventAndNameContainer = document.createElement("div");
    eventAndNameContainer.classList.add("event-and-name-container");
    // const eventDictionaryText = document.createElement("p");
    // eventDictionaryText.classList.add("event-text");
    // eventDictionaryText.innerText = eventDictionary[this.event.type];
    // eventAndNameContainer.appendChild(fungiDivContainer);
    // eventAndNameContainer.appendChild(eventDictionaryText);
    eventAndNameContainer.appendChild(nameContainer);
    eventAndNameContainer.appendChild(eventTextExtra);
    fungiContainer.appendChild(eventAndNameContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(fungiContainer);
    mainContainer.appendChild(cesta);
    mainContainer.appendChild(bunny);

    return mainContainer;
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
  let main = document.querySelector("main");

  // if (fieldData.transparency == "false") {
  //   main.style.maskImage = "none";
  //   main.style.webkitMaskImage = "none";
  // }
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
    elem.style.animationName = "removeMessage";
    elem.style.animationDuration = "0.7s";
    setTimeout(() => {
      elem.remove();
    }, 1000);
  }
};

const removeEvent = (mainContainer, event) => {
  const elem = mainContainer;
  elem.querySelector(".event-leafs-container-2").style.animationName =
    "hideRightStar";
  elem.querySelector(".event-leafs-container-2").style.animationDuration =
    "0.7s";
  elem.querySelector(".event-leafs-container-2").style.animationFillMode =
    "forwards";

  elem.querySelector(".event-leafs-container-1").style.animationName =
    "hideLeftStar";
  elem.querySelector(".event-leafs-container-1").style.animationDuration =
    "0.7s";
  elem.querySelector(".event-leafs-container-1").style.animationFillMode =
    "forwards";

  elem.querySelector(`.${event}`).style.animationName = "hideNames";
  setTimeout(() => {
    elem.remove();
  }, 1000);
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

  // if (listener !== "subscriber-latest" && listener !== "message") {
  //   return;
  // }

  if (listener === "subscriber-latest") {
    holdedEvent(event);
    return;
  }

  if (listener === "message") {
    let isBlackListed = blacklisted(event.data.displayName);
    if (isBlackListed) return;
    let specialSymbols = ignoreMessagesStartingWith(event.data.text);
    if (specialSymbols) return;
  }

  const mainCont = document.querySelector("main");

  if (isBulk && repeatedEvents < maxEvents) {
    repeatedEvents++;
    return;
  }

  repeatedEvents = 0;
  isBulk = false;
  maxEvents = 0;

  const events = new mainEvent(event, listener);
  if (event.bulkGifted) {
    isBulk = true;
    maxEvents = event.count;
    listener = "bulk";
  }
  events.init.then((mainContainer) => {
    if (fieldData.allowDeleteMessages === "true") {
      if (listener === "message") {
        setTimeout(() => {
          removeMessage(mainContainer);
        }, fieldData.deleteMessages * 1000);
      } else {
        setTimeout(() => {
          removeEvent(mainContainer, "event-name");
        }, fieldData.deleteMessages * 1000);
      }
    }
    mainCont.appendChild(mainContainer);
  });
});

let storedEvents = [];
let eventCounter = 0;
let eventTimer = null;
let firstEvent = true;
let previousEvent = "";
let previousSender = "";
let currentSender = "";
let sameEventsAmount = 0;

const dispatchNewEvent = (event) => {
  if (
    previousSender === currentSender ||
    firstEvent === true ||
    previousSender === ""
  ) {
    storedEvents.push(event);
  } else {
    window.dispatchEvent(
      new CustomEvent("onEventReceived", {
        detail: {
          listener: "subscriber",
          event: event,
        },
      })
    );
    previousSender = "";
  }

  if (eventTimer) {
    clearTimeout(eventTimer);
  }

  eventTimer = setTimeout(() => {
    if (storedEvents.length > 1) {
      window.dispatchEvent(
        new CustomEvent("onEventReceived", {
          detail: {
            listener: "bulk",
            event: {
              amount: storedEvents.length,
              avatar: event.avatar,
              displayName: event.displayName,
              gifted: event.gifted,
              sender: storedEvents[0].sender,
              type: "bulkgift",
              bulkGifted: true,
              tier: event.tier,
              message: event.message,
              name: event.name,
              quantity: event.quantity,
              sessionTop: event.sessionTop,
              providerId: event.providerId,
              originalEventName: event.originalEventName,
            },
          },
        })
      );
      eventCounter += storedEvents.length;
      previousSender = "";
    } else if (storedEvents.length === 1) {
      window.dispatchEvent(
        new CustomEvent("onEventReceived", {
          detail: {
            listener: "subscriber",
            event: {
              amount: storedEvents.length,
              avatar: event.avatar,
              displayName: event.displayName,
              gifted: event.gifted,
              sender: storedEvents[0].sender,
              type: event.type,
              tier: event.tier,
              message: event.message,
              name: event.name,
              quantity: event.quantity,
              sessionTop: event.sessionTop,
              providerId: event.providerId,
              originalEventName: event.originalEventName,
            },
          },
        })
      );
      previousSender = "";
    }
    storedEvents = [];
    eventTimer = null;
    eventCounter = 0;
  }, 500);
  firstEvent = false;
  previousSender = event.sender;
};

const holdedEvent = async (event) => {
  if (event.gifted) {
    currentSender = event.sender;
    dispatchNewEvent(event);
  } else {
    window.dispatchEvent(
      new CustomEvent("onEventReceived", {
        detail: {
          listener: "subscriber",
          event: event,
        },
      })
    );
  }
};
