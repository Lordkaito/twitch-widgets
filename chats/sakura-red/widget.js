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

  get id() {
    // generate random string
    const randomString = Math.random().toString(36).substring(2, 15);
    const startingLetter = "f";
    return `${startingLetter}${randomString}`;
  }

  async createMainContainerElement() {
    const mainContainer = document.createElement("div");
    const superMainContainer = document.createElement("div");

    superMainContainer.classList.add("super-main-container");
    // superMainContainer.appendChild(this.flowers);
    superMainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("main-container");

    mainContainer.appendChild(await this.createUsernameInfoElement());
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
    const circle = document.createElement("div");
    circle.innerHTML = `
      <svg class="circulo" viewBox="0 0 100 100">
        <circle class="circulo-animado" cx="50" cy="50" r="45">
        </circle>
      </svg>
    `;
    const heart = document.createElement("img");
    if (this.isSub || this.isStreamer) {
      heart.src = "https://i.postimg.cc/d30kpgH4/misakisub.png";
    } else {
      heart.src = "https://i.postimg.cc/63c4HB08/misakipleb.png";
    }

    const role = this.roles.role;
    const roleCont = document.createElement("div");
    roleCont.classList.add("role-container");
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

    if(fieldData.showPronouns === "true") {
      roleText.innerText = await this.getUserPronoun();
    }

    if(fieldData.showPronouns === "none") {
      roleText.innerText = "";
      roleText.style.display = "none";
    }
    roleCont.appendChild(roleText);
    heart.classList.add("heart");
    circle.classList.add("circle");
    circle.appendChild(heart);
    usernameInfoContainer.appendChild(circle);
    usernameInfo.classList.add("username-info");
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    usernameInfoContainer.appendChild(usernameInfo);
    usernameInfoContainer.appendChild(roleCont);
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

    const eventType = this.event.type;

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
    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    const fungi = document.createElement("img");

    fungi.src = "https://i.postimg.cc/j28NjRwp/coramisa.png";
    fungi.classList.add("bellota");
    // switch (eventType) {
    //   case "follower":
    //     fungi.classList.add("heart");
    //     break;
    //   case "subscriber":
    //     fungi.src = "https://i.postimg.cc/5tVtGNpD/strll.png";
    //     fungi.classList.add("star");
    //     break;
    //   case "cheer":
    //     fungi.src = "https://i.postimg.cc/9FwFQqnv/bitt.png";
    //     fungi.classList.add("bit");
    //     break;
    //   case "tip":
    //     fungi.src = "https://i.postimg.cc/SNHR6G9S/monedd.png";
    //     fungi.classList.add("coin");
    //     break;
    //   case "raid":
    //     fungi.src = "https://i.postimg.cc/Jn7zr6fq/flrr.png";
    //     fungi.classList.add("raid");
    //     break;
    // }

    fungi.classList.add("fungi");
    const fungiDivContainer = document.createElement("div");

    let theme = fieldData.theme;
    fungiDivContainer.classList.add(`event-leafs-container`);
    fungiDivContainer.appendChild(fungi);
    fungiContainer.classList.add("fungi-container");
    theme === "purple"
      ? fungiContainer.classList.add("fungi-container-purple")
      : null;
    const moon = document.createElement("img");
    moon.src = "https://i.postimg.cc/zfPDcV64/luna.png";
    moon.classList.add("moon");
    fungiContainer.appendChild(moon);
    nameContainer.classList.add("event-name");
    nameContainer.innerText = nameAndText;

    const eventAndNameContainer = document.createElement("div");
    eventAndNameContainer.classList.add("event-and-name-container");
    eventAndNameContainer.appendChild(fungiDivContainer);
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
  addFlowers(mainContainer, flowersContainer, listener, event);
  const flowers = flowersContainer.querySelectorAll(".flower");
  return flowersContainer;
};

const addFlowers = (mainContainer, flowersContainer, listener, event) => {
  const flowers = {
    0: "https://i.postimg.cc/m25Cf2GM/misa1.png",
    1: "https://i.postimg.cc/zfnggCHS/misa2.png",
    2: "https://i.postimg.cc/pL582b2S/misa3.png",
    3: "https://i.postimg.cc/CKy85P5x/misa4.png",
    4: "https://i.postimg.cc/LX2ZBJzd/misa5.png",
  };
  let flower0 = document.createElement("img");
  flower0.src = flowers[0];
  flower0.classList.add("petalo1");
  let flower1 = document.createElement("img");
  flower1.src = flowers[1];
  flower1.classList.add("thingy1");
  let flower2 = document.createElement("img");
  flower2.src = flowers[2];
  flower2.classList.add("petalo2");
  let flower3 = document.createElement("img");
  flower3.src = flowers[3];
  flower3.classList.add("flor");
  let flower4 = document.createElement("img");
  flower4.src = flowers[4];
  flower4.classList.add("thingy2");
  if (listener !== "message") {
    flower3.classList.add("flor-event");
    flower2.classList.add("petalo2-event");
    flower1.classList.add("thingy1-event");
    flowersContainer.appendChild(flower2);
    flowersContainer.appendChild(flower1);
    flowersContainer.appendChild(flower3);
    return;
  }
  const isStreamer =
    event.data.displayName.toLowerCase() === event.data.channel.toLowerCase();
  const isSub = event.data.tags.subscriber === "1";
  if (isStreamer || isSub) {
    flowersContainer.appendChild(flower0);
    flowersContainer.appendChild(flower1);
    flowersContainer.appendChild(flower2);
    flowersContainer.appendChild(flower3);
  } else {
    flowersContainer.appendChild(flower0);
    flowersContainer.appendChild(flower1);
    flowersContainer.appendChild(flower2);
    flowersContainer.appendChild(flower4);
  }
  // flowersContainer.appendChild(flower);
};
