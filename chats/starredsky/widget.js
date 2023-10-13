// let fieldData = {};
let currentEvent = null;
let flowerCount = 0;
let currentMessagesIds = [];
let currentAmountOfMessages = 0;
let maxMessages;
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
    let theme = fieldData.theme;
    circle.innerHTML = `
      <svg class="circulo" viewBox="0 0 100 100">
        <circle class="circulo-animado" cx="50" cy="50" r="45">
        </circle>
      </svg>
    `;
    circle.classList.add("circle");
    theme === "purple" ? circle.classList.add("circle-purple") : null;
    const dots = document.createElement("div");
    dots.classList.add("ori-dots");
    const oriContainer = document.createElement("div");
    oriContainer.classList.add("ori-container");
    const ori = document.createElement("img");
    const flower = document.createElement("img");
    origami.classList.add("origami");
    if (this.isStreamer) {
      if (theme === "purple") {
        flower.src = "https://i.postimg.cc/TYQBTzGP/cuernos-ire.png";
      } else {
        flower.src = "https://i.postimg.cc/cLMTW5t8/cuernos-ire.png";
      }
      flower.classList.add("streamer");
      flower.classList.remove("ori-flower");
    } else if (this.isMod) {
      if (theme === "purple") {
        flower.src = "https://i.postimg.cc/kGqhmcp8/rosatallo-ire.png";
      } else {
        flower.src = "https://i.postimg.cc/HL6rTpk7/rosatallo-ire.png";
      }
      flower.classList.add("mod");
      flower.classList.remove("ori-flower");
    } else if (this.isVip) {
      if (theme === "purple") {
        flower.src = "https://i.postimg.cc/SKYP7j9X/lirios-ire.png";
      } else {
        flower.src = "https://i.postimg.cc/MT4XjdR6/lirios-ire.png";
      }
      flower.classList.add("vip");
      flower.classList.remove("ori-flower");
    } else {
      if (theme === "purple") {
        flower.src = "https://i.postimg.cc/B6WVhs5m/rosa-ire.png";
      } else {
        flower.src = "https://i.postimg.cc/LXhnXrJQ/rosa-ire.png";
      }
      flower.classList.add("subscriber");
    }

    const container = document.createElement("div");
    container.classList.add("container");

    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      theme === "purple" ? dot.classList.add("dot-purple") : null;
      dot.classList.add(`dot-${i + 1}`);
      dots.appendChild(dot);
    }

    circle.appendChild(flower);

    // container.appendChild(circle);
    container.appendChild(dots);
    container.appendChild(oriContainer);

    origami.appendChild(container);
    return origami;
  }

  async createMainContainerElement() {
    const mainContainer = document.createElement("div");
    const superMainContainer = document.createElement("div");

    superMainContainer.classList.add("super-main-container");
    // superMainContainer.appendChild(this.flowers);
    superMainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("main-container");
    const leftTopFlower = document.createElement("img");
    leftTopFlower.src = "https://i.postimg.cc/C5tP8bwM/flor-arriba-izq.png";
    leftTopFlower.classList.add("left-top-flower");
    // mainContainer.appendChild(leftTopFlower);

    mainContainer.appendChild(await this.createMessageContainerElement());
    superMainContainer.appendChild(mainContainer);

    return superMainContainer;
  }

  get butterfly() {
    const img = document.createElement("img");
    const imgContainer = document.createElement("div");
    img.src = "https://i.postimg.cc/RVSHXtvv/mariposita.png";
    img.classList.add("butterfly");
    imgContainer.classList.add("butterfly-container");

    return imgContainer;
  }

  async createUsernameInfoElement() {
    const usernameInfo = document.createElement("div");
    const usernameInfoContainer = document.createElement("div");
    const hyphen = document.createElement("span");
    hyphen.classList.add("hyphen");
    usernameInfoContainer.classList.add("username-info-container");
    // const circle = document.createElement("div");
    // circle.innerHTML = `
    //   <svg class="circulo" viewBox="0 0 100 100">
    //     <circle class="circulo-animado" cx="50" cy="50" r="45">
    //     </circle>
    //   </svg>
    // `;

    const role = this.roles.role;
    const roleCont = document.createElement("div");
    roleCont.classList.add("role-container");
    const contContainer = document.createElement("div");
    contContainer.classList.add("cont-container");
    contContainer.appendChild(roleCont)
    const roleText = document.createElement("span");
    roleText.classList.add("role-text");
    switch (role) {
      case "mod":
        roleText.innerText = "mod";
        break;
      case "vip":
        roleText.innerText = "vip";
        break;
      case "subscriber":
        roleText.innerText = "sub";
        break;
      case "streamer":
        roleText.innerText = "streamer";
        break;
      default:
        roleText.innerText = "";
        roleText.style.display = "none";
        break;
    }
    roleCont.appendChild(roleText);
    // heart.classList.add("heart");
    // circle.classList.add("circle");
    // circle.appendChild(heart);
    // usernameInfoContainer.appendChild(circle);
    usernameInfo.classList.add("username-info");
    // theme === "purple" ? usernameInfo.classList.add("username-purple") : null;
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    // if (this.isSub || this.isStreamer) {
    //   usernameInfoContainer.appendChild(this.createRoleContainer());
    // }
    // usernameInfoContainer.appendChild(await this.createPronounsContainer());
    const dot = document.createElement("div");
    dot.classList.add("dot");
    usernameInfoContainer.appendChild(usernameInfo);
    // usernameInfoContainer.appendChild(dot);
    // usernameInfoContainer.appendChild(roleCont);
    return usernameInfoContainer;
  }

  async createMessageContainerElement() {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    if(fieldData.showBorder == "false") {
      messageContainer.style.border = "none";
    }

    const role = this.roles.role;
    const roleCont = document.createElement("div");
    roleCont.classList.add("role-container");
    const roleText = document.createElement("span");
    roleText.classList.add("role-text");
    const { streamerText, modText, vipText, subscriberText, viewerText } = fieldData;
    switch (role) {
      case "mod":
        roleText.innerText = modText;
        break;
      case "vip":
        roleText.innerText = vipText;
        break;
      case "subscriber":
        roleText.innerText = subscriberText;
        break;
      case "streamer":
        roleText.innerText = streamerText;
        break;
      default:
        roleText.innerText = "";
        roleText.style.display = "none";
        roleCont.style.display = "none";
        break;
    }
    roleCont.appendChild(roleText);
    messageContainer.appendChild(roleCont);
    messageContainer.appendChild(await this.createUsernameInfoElement());
    messageContainer.appendChild(
      await this.createMessageIconContainerElement()
    );
    const rightTopFlower = document.createElement("img");
    rightTopFlower.src = "https://i.postimg.cc/5tCdFSgR/pluma.png";
    rightTopFlower.classList.add("right-top-flower");
    // if (this.isSub || this.isStreamer) {
    // }
    messageContainer.appendChild(rightTopFlower);
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
    const capitalizeUser = document.createElement("span");
    capitalizeUser.classList.add("capitalize-user");
    capitalizeUser.innerText = this.user;
    return capitalizeUser;
  }

  createRoleContainer() {
    const roleContainer = document.createElement("span");
    roleContainer.classList.add("role-container");
    roleContainer.appendChild(this.roleImages);
    return roleContainer;
  }

  async createPronounsContainer() {
    const pronounsContainer = document.createElement("div");
    const pronouns = document.createElement("span");
    let theme = fieldData.theme;
    pronouns.classList.add("prons");
    pronounsContainer.classList.add("pronouns");
    theme === "purple"
      ? pronounsContainer.classList.add("pronouns-purple")
      : null;
    pronouns.innerText = await this.getUserPronoun();
    pronouns.innerText == ""
      ? (pronounsContainer.style.display = "none")
      : (pronounsContainer.style.display = "block");
    if (fieldData.allowPronouns == "false") {
      pronounsContainer.style.display = "none";
    }

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

    let theme = fieldData.theme;
    if (theme === "purple") {
      roleImage.src = "https://i.postimg.cc/t4TwJBCN/hoja-ire.png";
    } else {
      roleImage.src = `https://i.postimg.cc/qRQg2VsS/hojitarosa.png`;
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
    let theme = fieldData.theme;
    renderedText.classList.add("rendered-text");
    theme === "purple"
      ? renderedText.classList.add("rendered-text-purple")
      : null;
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

    let textContainer = document.createElement("p");
    textContainer.classList.add("text");

    // Utiliza expresiones regulares o funciones de búsqueda de texto
    // para determinar si el texto contiene caracteres en inglés o japonés.

    if (
      /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(rawMessage)
    ) {
      textContainer.style.fontFamily = "Noto Sans JP";
    }

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

  get id() {
    // generate random string
    const randomString = Math.random().toString(36).substring(2, 15);
    const startingLetter = "f";
    return `${startingLetter}${randomString}`;
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

    console.log(this.event, "asdfahjksdgfas");
    const eventType = this.event.type;

    const amount = this.amount;
    let sender = this.event.sender || this.event.name;
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
    const fungiDivContainer = document.createElement("div");

    fungiDivContainer.classList.add(`event-leafs-container`);
    fungiContainer.classList.add("fungi-container");
    const brilli = document.createElement("img");
    brilli.src = "https://i.postimg.cc/rm5k7Ntr/brillito.png";
    brilli.classList.add("brillito");
    fungiContainer.appendChild(brilli);

    const events = {
      follower: "hi",
      subscriber: "sub",
      cheer: "cheer",
      tip: "tip",
      raid: "raid",
    };

    const roleCont = document.createElement("div");
    const roleText = document.createElement("span");
    const contCont = document.createElement("div");
    contCont.classList.add("cont-container");
    roleText.classList.add("role-text");
    roleText.innerText = events[eventType];
    roleCont.appendChild(roleText);
    roleCont.classList.add("role-container");
    roleCont.classList.add(`role-container-no-absolute`);
    contCont.appendChild(roleCont);
    fungiContainer.appendChild(contCont);
    const flower = document.createElement("img");
    flower.src = "https://i.postimg.cc/jqQTXvTV/florr.png";
    flower.classList.add("flower");
    fungiContainer.appendChild(flower);

    nameContainer.classList.add("event-name");
    nameContainer.innerText = nameAndText;

    const eventAndNameContainer = document.createElement("div");
    eventAndNameContainer.classList.add("event-and-name-container");
    eventAndNameContainer.appendChild(nameContainer);
    fungiContainer.appendChild(eventAndNameContainer);
    mainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("event-container");
    mainContainer.appendChild(fungiContainer);

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
  maxMessages = fieldData.maxMessages;
  let main = document.querySelector("main");
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
      mainContainer.appendChild(flowers(mainContainer, listener, event));
    });
});

const flowers = (mainContainer, listener, event) => {
  const flowersContainer = document.createElement("div");
  flowersContainer.classList.add("flowers-container");
  addDots(flowersContainer, listener, event, mainContainer);
  const flowers = flowersContainer.querySelectorAll(".flower");
  return flowersContainer;
};

const addDots = (flowersContainer, listener, event, mainContainer) => {
  const dotsHeight = 11;
  const conteinerHeight = mainContainer.offsetHeight;

  let possibleDots = Math.floor(conteinerHeight / dotsHeight) - 2;
  let minimumFlowers = 5;
  // if (possibleDots < minimumFlowers) possibleDots = minimumFlowers;

  if (listener === "message") {
    console.log(event);
    const role = getRoles(event);
    let circle = document.createElement("div");
    circle.classList.add("circle");
    const roleImg = document.createElement("img");
    roleImg.classList.add("role");
    switch (role.role) {
      case "mod":
        roleImg.src = "https://i.postimg.cc/Fzm4vkjn/escudooo.png";
        break;
      case "vip":
        roleImg.src = "https://i.postimg.cc/GhXC029q/gatito2.png";
        break;
      case "subscriber":
        roleImg.src = "https://i.postimg.cc/J4rLdJ7s/flor2.png";
        break;
      case "streamer":
        roleImg.src = "https://i.postimg.cc/L8hMmp1R/gatito1.png";
        break;
      default:
        roleImg.src = "https://i.postimg.cc/Hn2CkWzW/flor1.png";
        break;
    }
    circle.innerHTML = `
      <svg class="circulo" viewBox="0 0 100 100">
        <circle class="circulo-animado" cx="50" cy="50" r="45">
        </circle>
      </svg>
    `;
    circle.appendChild(roleImg);
    flowersContainer.appendChild(circle);
    for (let i = 0; i < possibleDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      flowersContainer.appendChild(dot);
    }
  } else {
    let structure = ["dot", "dot", "dot", "circle", "dot", "dot", "dot"];
    for (let i = 0; i < structure.length; i++) {
      const element = document.createElement("div");
      element.classList.add(structure[i]);
      if (structure[i] === "circle") {
        element.innerHTML = `
        <svg class="circulo" viewBox="0 0 100 100">
          <circle class="circulo-animado" cx="50" cy="50" r="45">
          </circle>
        </svg>
      `;
        const shiny = document.createElement("img");
        shiny.src = "https://i.postimg.cc/rm5k7Ntr/brillito.png";
        shiny.classList.add("shiny");
        element.appendChild(shiny);
      }
      flowersContainer.appendChild(element);
    }
    flowersContainer.classList.add("fix-height");
  }
};

function getRoles(event) {
  const priorityRole = [];
  const tags = event.data.tags;
  let keys = Object.keys(tags);
  keys.forEach((key) => {
    if (roles.includes(key) && tags[key] === "1") {
      priorityRole.push({ role: key, priority: priorities[key] });
    }
  });

  const isStreamer =
    event.data.displayName.toLowerCase() == event.data.channel.toLowerCase();

  if (isStreamer) {
    priorityRole.push({ role: "streamer", priority: priorities["streamer"] });
  }

  if (priorityRole.length === 0) {
    priorityRole.push({ role: "viewer", priority: priorities["viewer"] });
  }
  priorityRole.sort((a, b) => a.priority - b.priority);
  return priorityRole[0];
}
