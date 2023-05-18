// let fieldData = {};
let currentEvent = null;

const PRONOUNS_API_BASE = "https://pronouns.alejo.io/api";
const PRONOUNS_API = {
  user: (username) => `${PRONOUNS_API_BASE}/users/${username}`,
  pronouns: `${PRONOUNS_API_BASE}/pronouns`,
};

const colors = {
  streamer: {
    text: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    user: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    prons: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
  },
  mod: {
    text: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    user: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    prons: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
  },
  vip: {
    text: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    user: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    prons: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
  },
  sub: {
    text: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    user: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    prons: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
  },
  viewer: {
    text: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    user: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
    },
    prons: {
      background: "#6441a5",
      text: "#ffffff",
      border: "#6441a5",
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

class Message {
  constructor(message) {
    this.message = message;
  }

  get roles() {
    let priorityRole = [];
    const tags = this.message.data.tags;
    let keys = Object.keys(tags);
    keys.forEach((key) => {
      if (roles.includes(key) && tags[key] === "1") {
        priorityRole.push({ role: key, priority: priorities[key] });
      }
    });

    if (this.isStreamer) {
      priorityRole = [];
      priorityRole.push({ role: "streamer", priority: priorities["streamer"] });
      return priorityRole[0];
    }

    if (priorityRole.length === 0) {
      priorityRole = [];
      priorityRole.push({ role: "viewer", priority: priorities["viewer"] });
      return priorityRole[0];
    }

    let minPriorityRole = [];
    if (priorityRole.length >= 1) {
      priorityRole.sort((a, b) => {
        return a.priority - b.priority;
      });
    }

    return minPriorityRole.length === 0 ? priorityRole[0] : minPriorityRole[0];
  }

  async init() {
    if (this.blacklisted) return;
    this.roleImages;
    let idSelector = this.ids;
    return await this.createMainContainerElement();
  }

  get id() {
    return this.message.data.tags.id;
  }

  get isMod() {
    return this.message.data.tags.mod === "1";
  }

  getRole() {
    const roles = [];
    const rolesObj = {
      mod: { role: "mod", priority: 1 },
      vip: { role: "vip", priority: 2 },
      subscriber: { role: "sub", priority: 3 },
      turbo: { role: "turbo", priority: 4 },
    };

    Object.entries(this.message.data.tags).forEach(([key, value]) => {
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

  get roleImages() {
    const roles = this.getRole();

    // Buscar el rol con la menor prioridad
    const minPriorityRole = roles.reduce(
      (minRole, currentRole) =>
        currentRole.priority < minRole.priority ? currentRole : minRole,
      roles[0] // Establecer el primer elemento como valor inicial
    );

    // Asignar la imagen correspondiente
    let roleImage = document.createElement("svg");
    roleImage.classList.add("role");
    if (minPriorityRole.length == 0) {
      minPriorityRole.role = "viewer";
    }
    roleImage.innerHTML = `<svg height="35px" width="35px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="10.24"> <g> <path stroke="#fa88d8" stroke-width="100" d="M512,223.537c0-61.46-49.773-111.264-111.264-111.264c-11.768,0-22.922,2.31-33.496,5.644 C366.948,56.657,317.346,7.084,255.985,7.084c-61.32,0-110.993,49.573-111.224,110.833c-10.573-3.334-21.728-5.644-33.496-5.644 C49.774,112.273,0,162.077,0,223.537c0,49.241,32.171,90.479,76.533,105.12c-13.294,18.354-21.276,40.656-21.276,64.985 c0,61.46,49.773,111.274,111.254,111.274c36.86,0,69.222-18.043,89.475-45.646c20.283,27.603,52.645,45.646,89.465,45.646 c61.521,0,111.264-49.813,111.264-111.274c0-24.329-7.993-46.631-21.246-64.985C479.829,314.017,512,272.779,512,223.537z M255.985,337.433c-31.971,0-57.927-25.916-57.927-57.887c0-31.981,25.956-57.897,57.927-57.897c32,0,57.926,25.916,57.926,57.897 C313.912,311.517,287.986,337.433,255.985,337.433z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path fill="#b909c5" d="M512,223.537c0-61.46-49.773-111.264-111.264-111.264c-11.768,0-22.922,2.31-33.496,5.644 C366.948,56.657,317.346,7.084,255.985,7.084c-61.32,0-110.993,49.573-111.224,110.833c-10.573-3.334-21.728-5.644-33.496-5.644 C49.774,112.273,0,162.077,0,223.537c0,49.241,32.171,90.479,76.533,105.12c-13.294,18.354-21.276,40.656-21.276,64.985 c0,61.46,49.773,111.274,111.254,111.274c36.86,0,69.222-18.043,89.475-45.646c20.283,27.603,52.645,45.646,89.465,45.646 c61.521,0,111.264-49.813,111.264-111.274c0-24.329-7.993-46.631-21.246-64.985C479.829,314.017,512,272.779,512,223.537z M255.985,337.433c-31.971,0-57.927-25.916-57.927-57.887c0-31.981,25.956-57.897,57.927-57.897c32,0,57.926,25.916,57.926,57.897 C313.912,311.517,287.986,337.433,255.985,337.433z"></path> </g> </g></svg>`;

    return roleImage;
  }

  get borderDecorationImg() {
    const borderDecoration = document.createElement("img");
    borderDecoration.src = "https://i.postimg.cc/vmrC6rtk/constelacion.png";
    borderDecoration.classList.add("border-decoration-img");
    return borderDecoration;
  }

  get renderedText() {
    return this.message.data.renderedText;
  }

  get text() {
    return this.message.data.text;
  }

  get emotes() {
    return this.message.data.emotes;
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

  get isSub() {
    return this.message.data.tags.subscriber == "1";
  }

  get badges() {
    return this.message.data.badges;
  }

  get user() {
    return this.message.data.displayName;
  }

  get displayColor() {
    return this.message.data.displayColor;
  }

  get isStreamer() {
    return (
      this.message.data.displayName.toLowerCase() ==
      this.message.data.channel.toLowerCase()
    );
  }

  async createMainContainerElement() {
    const mainContainer = document.createElement("div");
    const superMainContainer = document.createElement("div");
    const animation = fieldData.animation;

    superMainContainer.classList.add("super-main-container");
    mainContainer.classList.add("main-container");
    // mainContainer.classList.add(`${this.roles.role}-main-container`);

    if (fieldData.chatBoxSize == "small") {
      mainContainer.style.maxWidth = "33.5rem";
    }
    // if (this.isMod) mainContainer.classList.add("mods-background");

    mainContainer.appendChild(await this.createUsernameInfoElement());
    mainContainer.appendChild(await this.createMessageContainerElement());
    mainContainer.appendChild(this.createBarElement());
    mainContainer.appendChild(this.createDecorationElement());
    superMainContainer.appendChild(mainContainer);
    if (this.isSub) {
      mainContainer.appendChild(this.lianas);
    }

    return superMainContainer;
  }

  get lianas() {
    const lianas = document.createElement("img");
    const lianasContainer = document.createElement("div");
    lianas.src = "https://i.postimg.cc/fbHGMZVB/lianas.png";
    lianas.classList.add("lianas");
    lianasContainer.classList.add("lianas-container");
    lianasContainer.appendChild(lianas);
    return lianasContainer;
  }

  createRoleContainer() {
    const roleContainer = document.createElement("span");
    roleContainer.classList.add("role-container");
    roleContainer.appendChild(this.roleImages);
    return roleContainer;
  }

  get flower() {
    const flower = document.createElement("img");
    flower.src = "https://i.postimg.cc/bJW42THn/flor-izq.png";
    flower.classList.add("flower");

    return flower;
  }

  async createUsernameInfoElement() {
    const role = this.roles;
    const usernameInfo = document.createElement("div");
    const usernameInfoContainer = document.createElement("div");
    usernameInfoContainer.classList.add("username-info-container");
    usernameInfo.classList.add("username-info");
    // usernameInfo.classList.add(role.role);
    // usernameInfo.appendChild(this.flower);
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    usernameInfoContainer.appendChild(this.createRoleContainer());
    usernameInfoContainer.appendChild(usernameInfo);
    usernameInfoContainer.appendChild(await this.createPronounsContainer());
    return usernameInfoContainer;
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
    let color = this.color;
    const capitalizeUser = document.createElement("span");
    capitalizeUser.classList.add("capitalize-user");
    capitalizeUser.innerText = this.user;
    return capitalizeUser;
  }

  async createMessageContainerElement() {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");
    messageContainer.appendChild(this.createUserInfoThingyElement());
    messageContainer.appendChild(
      await this.createMessageIconContainerElement()
    );
    return messageContainer;
  }

  createUserInfoThingyElement() {
    const userInfoThingy = document.createElement("div");
    userInfoThingy.classList.add("user-info-thingy");
    return userInfoThingy;
  }

  async createMessageIconContainerElement() {
    const messageIconContainer = document.createElement("div");
    messageIconContainer.classList.add("message-icon-container");
    messageIconContainer.appendChild(await this.createRenderedTextElement());
    for (let i = 0; i < 2; i++) {
      messageIconContainer.appendChild(this.flower);
    }
    return messageIconContainer;
  }

  createMessageIconElement() {
    const messageIconElement = document.createElement("span");
    messageIconElement.classList.add("icon");
    // messageIconElement.appendChild(this.imageIconThing);
    return messageIconElement;
  }

  async createRenderedTextElement() {
    const renderedText = document.createElement("div");
    renderedText.classList.add("rendered-text");
    // renderedText.classList.add(`${this.roles.role}-text`);
    renderedText.appendChild(await this.buildMessage());
    return renderedText;
  }

  createBarElement() {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    return bar;
  }

  // not being used for LoveLetterChat2.0
  createDecorationElement() {
    const decoration = document.createElement("span");
    decoration.classList.add("decoration");
    // decoration.classList.add('ribbon');
    // decoration.appendChild(this.decorationImg);
    return decoration;
  }

  get leafs() {
    const leafs = document.createElement("img");
    leafs.src = "https://i.postimg.cc/Y2fmk818/ronro2.png";
    leafs.classList.add("leafs");

    return leafs;
  }

  get cactus() {
    const cactus = document.createElement("img");
    cactus.src = "https://i.postimg.cc/9X4hF4tT/planta-pron.png";
    cactus.classList.add("cactus");

    return cactus;
  }

  async createPronounsContainer() {
    const pronounsContainer = document.createElement("div");
    const pronouns = document.createElement("span");
    pronouns.classList.add("prons");
    // pronounsContainer.appendChild(this.leafs);
    pronounsContainer.classList.add("pronouns");
    if (this.isSub) {
      pronounsContainer.appendChild(this.cactus);
    }
    pronouns.innerText = await this.getUserPronoun();
    pronouns.innerText == ""
      ? (pronounsContainer.style.display = "none")
      : (pronounsContainer.style.display = "block");
    if (fieldData.allowPronouns == "false") {
      pronounsContainer.style.display = "none";
    }
    // pronouns.classList.add(`${this.roles.role}-prons`)

    pronounsContainer.appendChild(pronouns);
    return pronounsContainer;
  }

  themeColor() {
    let color = fieldData.theme;

    return color;
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

  async buildMessage() {
    // get emotes if any
    let emoteNames = [];
    let customEmotesNames = [];
    let customEmotes = await this.customEmotes();
    if (customEmotes != undefined) {
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
}

class Follow {
  constructor(follow) {
    this.follow = follow;
  }

  async init() {
    const followContainer = await this.createMainFollowContainer();

    return followContainer;
  }

  get name() {
    const name = this.follow.name;
    const trimmed = this.trimName(name);

    return trimmed;
  }

  get amount() {
    return this.follow.amount;
  }

  trimName(name) {
    const trimmed = name.slice(0, 20);
    return trimmed;
  }

  async createMainFollowContainer() {
    const mainContainer = document.createElement("div");

    const { name } = this;

    let followText = fieldData.followText;
    let text = followText != "" ? followText : "Gracias por el follow!";
    text = followText != "" ? followText : text;
    if (followText != "") {
      followText = followText.replace("(user)", name);
      text = followText;
    }

    const nameAndText = `${text}`;
    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    for (let i = 0; i < 2; i++) {
      const fungi = document.createElement("img");

      fungi.src = "https://i.postimg.cc/6qZgVvYm/cactus-izq.png";

      fungi.classList.add("fungi");
      const fungiDivContainer = document.createElement("div");

      fungiDivContainer.classList.add(`fungi-img-container-${i + 1}`);
      fungiDivContainer.appendChild(fungi);
      fungiContainer.classList.add("fungi-container");
      fungiContainer.appendChild(fungiDivContainer);
      fungiContainer.appendChild(nameContainer);
    }
    nameContainer.classList.add("follow-name");
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(fungiContainer);

    return mainContainer;
  }
}

class BulkGift {
  constructor(bulk) {
    this.bulk = bulk;
  }

  async init() {
    const bulkContainer = await this.createMainBulkContainer();

    return bulkContainer;
  }

  get sender() {
    return this.bulk.sender;
  }

  get amount() {
    return this.bulk.amount;
  }

  get isBulkGifted() {
    return this.bulk.bulkGifted;
  }

  get name() {
    const name = this.bulk.name;
    const trimmed = this.trimName(name);

    return trimmed;
  }

  trimName(name) {
    const trimmed = name.slice(0, 20);
    return trimmed;
  }

  async createMainBulkContainer() {
    const mainContainer = document.createElement("div");
    const mantarayaContainer = document.createElement("div");
    const sandContainer = document.createElement("div");

    const name = this.name;
    const isGifted = this.isGifted;
    const isBulkGifted = this.isBulkGifted;
    const sender = this.sender.toLowerCase();
    const amount = this.amount;

    let bulkText = fieldData.bulkGiftText;
    let text = ` ha regalado ${amount} subs!`;
    if (bulkText == "") {
      bulkText = ` ha regalado ${amount} subs!`;
      text = name + bulkText;
    } else {
      bulkText = bulkText.replace("(amount)", amount);
      bulkText = bulkText.replace("(sender)", sender);
      text = bulkText;
    }

    const nameAndText = `${text}`;
    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    for (let i = 0; i < 2; i++) {
      const fungi = document.createElement("img");

      fungi.src = "https://i.postimg.cc/6qZgVvYm/cactus-izq.png";

      fungi.classList.add("fungi");
      const fungiDivContainer = document.createElement("div");

      fungiDivContainer.classList.add(`fungi-img-container-${i + 1}`);
      fungiDivContainer.appendChild(fungi);
      fungiContainer.classList.add("fungi-container");
      fungiContainer.appendChild(fungiDivContainer);
      fungiContainer.appendChild(nameContainer);
    }
    nameContainer.classList.add("bulk-name");
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(fungiContainer);

    return mainContainer;
  }
}

class Sub {
  constructor(sub) {
    this.sub = sub;
    this.originalName = sub.originalEventName;
    if (this.originalName == currentEvent) {
      return;
    }
  }

  async init() {
    const subContainer = await this.createMainSubContainer();

    return subContainer;
  }

  // get message() {
  //   return this.sub.message;
  // }

  get isGifted() {
    let gifted = false;
    gifted = this.sub.gifted;
    return gifted;
  }

  get isBulkGifted() {
    let isBulkGifted = false;
    isBulkGifted = this.sub.bulkGifted;
    return isBulkGifted;
  }

  get sender() {
    return this.sub.sender;
  }

  get amount() {
    return this.sub.amount;
  }

  get isBulkGifted() {
    return this.sub.bulkGifted;
  }

  get isCommunityGift() {
    return this.sub.isCommunityGift;
  }

  get name() {
    const name = this.sub.name;
    const trimmed = this.trimName(name);

    return trimmed;
  }

  trimName(name) {
    const trimmed = name.slice(0, 20);
    return trimmed;
  }

  get isResub() {
    return this.sub.amount > 1;
  }

  async createMainSubContainer() {
    const mainContainer = document.createElement("div");

    const name = this.name;
    // capitalize name
    const isGifted = this.isGifted;
    const isBulkGifted = this.isBulkGifted;
    const sender =
      this.sender != undefined ? this.sender.toLowerCase() : undefined;
    const amount = this.amount;

    let subText = fieldData.subText;
    let bulkText = fieldData.bulkGiftText;
    let giftText = fieldData.giftSubText;
    let text = " Se ha suscrito!";
    let nameAndText;

    if (!isBulkGifted && isGifted) {
      if (giftText == "") {
        giftText = `${sender} gifted a sub to ${name}`;
      } else {
        giftText = giftText.replace("(sender)", sender);
        giftText = giftText.replace("(user)", name);
      }
      text = giftText;
      nameAndText = `${text}`;
    } else if (this.isResub) {
      text = name + ` Se ha resuscrito por ${amount} meses!`;
      nameAndText = `${text}`;
    } else {
      text = subText != "" ? subText : name + text;
      subText = subText.replace("(user)", name);
      text = subText;
    }

    nameAndText = `${text}`;

    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    for (let i = 0; i < 2; i++) {
      const fungi = document.createElement("img");

      fungi.src = "https://i.postimg.cc/6qZgVvYm/cactus-izq.png";

      fungi.classList.add("fungi");
      const fungiDivContainer = document.createElement("div");

      fungiDivContainer.classList.add(`fungi-img-container-${i + 1}`);
      fungiDivContainer.appendChild(fungi);
      fungiContainer.classList.add("fungi-container");
      fungiContainer.appendChild(fungiDivContainer);
      fungiContainer.appendChild(nameContainer);
    }
    nameContainer.classList.add("sub-name");
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(fungiContainer);

    return mainContainer;
  }
}

class Raid {
  constructor(raid) {
    this.raid = raid;
  }

  async init() {
    const raidContainer = await this.createMainRaidContainer();

    return raidContainer;
  }

  get name() {
    const name = this.raid.name;
    const trimmed = this.trimName(name);

    return trimmed;
  }

  get amount() {
    return this.raid.amount;
  }

  trimName(name) {
    const trimmed = name.slice(0, 20);
    return trimmed;
  }

  async createMainRaidContainer() {
    const mainContainer = document.createElement("div");

    const { name, amount } = this;

    let raidText = fieldData.raidText;
    let text = `${name} Nos ha raideado con ${amount} personas`;
    if (raidText != "") {
      raidText = raidText.replace("(amount)", amount);
      raidText = raidText.replace("(sender)", name);
      text = raidText;
    }

    const nameAndText = `${text}`;
    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    for (let i = 0; i < 2; i++) {
      const fungi = document.createElement("img");

      fungi.src = "https://i.postimg.cc/6qZgVvYm/cactus-izq.png";

      fungi.classList.add("fungi");
      const fungiDivContainer = document.createElement("div");

      fungiDivContainer.classList.add(`fungi-img-container-${i + 1}`);
      fungiDivContainer.appendChild(fungi);
      fungiContainer.classList.add("fungi-container");
      fungiContainer.appendChild(fungiDivContainer);
      fungiContainer.appendChild(nameContainer);
    }
    nameContainer.classList.add("raid-name");
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(fungiContainer);

    return mainContainer;
  }
}
class Cheer {
  constructor(cheer) {
    this.cheer = cheer;
  }

  async init() {
    const cheerContainer = await this.createMaincheerContainer();

    return cheerContainer;
  }

  get name() {
    const name = this.cheer.name;
    const trimmed = this.trimName(name);

    return trimmed;
  }

  get amount() {
    return this.cheer.amount;
  }

  trimName(name) {
    const trimmed = name.slice(0, 20);
    return trimmed;
  }

  async createMaincheerContainer() {
    const mainContainer = document.createElement("div");

    const { name } = this;
    const amount = this.amount;

    let cheerText = fieldData.cheerText;
    let text = `${name} cheered x${amount}`;
    if (cheerText != "") {
      cheerText = cheerText.replace("(amount)", amount);
      cheerText = cheerText.replace("(user)", name);
      text = cheerText;
    }
    const nameAndText = `${text}`;
    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    for (let i = 0; i < 2; i++) {
      const fungi = document.createElement("img");

      fungi.src = "https://i.postimg.cc/6qZgVvYm/cactus-izq.png";

      fungi.classList.add("fungi");
      const fungiDivContainer = document.createElement("div");

      fungiDivContainer.classList.add(`fungi-img-container-${i + 1}`);
      fungiDivContainer.appendChild(fungi);
      fungiContainer.classList.add("fungi-container");
      fungiContainer.appendChild(fungiDivContainer);
      fungiContainer.appendChild(nameContainer);
    }
    nameContainer.classList.add("cheer-name");
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(fungiContainer);

    return mainContainer;
  }
}
class Tip {
  constructor(tip) {
    this.tip = tip;
  }

  async init() {
    const tipContainer = await this.createMainTipContainer();

    return tipContainer;
  }

  get name() {
    const name = this.tip.name;
    const trimmed = this.trimName(name);

    return trimmed;
  }

  trimName(name) {
    const trimmed = name.slice(0, 20);
    return trimmed;
  }

  get message() {
    return this.tip.message;
  }

  get amount() {
    return this.tip.amount;
  }

  get currency() {
    return this.tip.currency;
  }

  async createMainTipContainer() {
    const mainContainer = document.createElement("div");

    const { name, amount } = this;

    let tipText = fieldData.tipText;
    let lowerName = name.toLowerCase();
    let text = `${lowerName} tipped $` + amount;
    if (tipText != "") {
      tipText = tipText.replace("(amount)", amount);
      tipText = tipText.replace("(user)", lowerName);
      text = tipText;
    }

    const nameAndText = `${text}`;
    const nameContainer = document.createElement("p");

    const fungiContainer = document.createElement("div");
    for (let i = 0; i < 2; i++) {
      const fungi = document.createElement("img");

      fungi.src = "https://i.postimg.cc/6qZgVvYm/cactus-izq.png";

      fungi.classList.add("fungi");
      const fungiDivContainer = document.createElement("div");

      fungiDivContainer.classList.add(`fungi-img-container-${i + 1}`);
      fungiDivContainer.appendChild(fungi);
      fungiContainer.classList.add("fungi-container");
      fungiContainer.appendChild(fungiDivContainer);
      fungiContainer.appendChild(nameContainer);
    }
    nameContainer.classList.add("tip-name");
    nameContainer.innerText = nameAndText;

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
  let main = document.querySelector("main");

  if (fieldData.transparency == "false") {
    main.style.maskImage = "none";
    main.style.webkitMaskImage = "none";
  }
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
    }, 100000000);
  }
};

const removeEvent = (mainContainer, event) => {
  const elem = mainContainer;
  elem.querySelector(".fungi-img-container-2").style.animationName =
    "hideRightStar";
  elem.querySelector(".fungi-img-container-2").style.animationDuration = "0.7s";
  elem.querySelector(".fungi-img-container-2").style.animationFillMode =
    "forwards";

  elem.querySelector(".fungi-img-container-1").style.animationName =
    "hideLeftStar";
  elem.querySelector(".fungi-img-container-1").style.animationDuration = "0.7s";
  elem.querySelector(".fungi-img-container-1").style.animationFillMode =
    "forwards";

  elem.querySelector(`.${event}`).style.animationName = "hideNames";
  setTimeout(() => {
    elem.remove();
  }, 100000000);
};

let repeatedEvents = 0;
let maxEvents = 0;
let isBulk = false;

let previousEvent = "";
let previousSender = "";
let currentSender = "";
let sameEventsAmount = 0;

const isSameSender = (event) => {
  if (event.sender != "" && event.sender != null) {
    if (event.sender == previousSender) {
      previousSender = event.sender;
      return true;
    }
    previousSender = event.sender;
  }
  return false;
};

const isSameEvent = (listener, event) => {
  if (listener != "" && listener != null) {
    if (listener == previousEvent) {
      previousEvent = listener;
      return isSameSender(event);
    }
    previousEvent = listener;
  }
  return false;
};

// window.addEventListener("onEventReceived", async (obj) => {
//   let { listener, event } = obj.detail;
//   holdedEvent = event;
//   if(holdedEvent != event) {
//   }
//   let sameEvent = isSameEvent(listener, event);

//   if (sameEvent) {
//     sameEventsAmount++;
//     return;
//   } else {
//     const mainCont = document.querySelector("main");

//     switch (listener) {
//       case "message":
//         let isBlackListed = blacklisted(event.data.displayName);
//         if(isBlackListed) return;
//         let specialSymbols = ignoreMessagesStartingWith(event.data.text);
//         if(specialSymbols) return;
//         const message = new Message(event);
//         message
//           .init()
//           .then((mainContainer) => {
//             if (fieldData.allowDeleteMessages === "true") {
//               setTimeout(() => {
//                 removeMessage(mainContainer);
//               }, fieldData.deleteMessages * 100000000);
//             }
//             mainCont.appendChild(mainContainer);
//           })
//           .finally(() => {
//             $("main").scrollTop($("main")[0].scrollHeight);
//           });
//         break;
//       case "follower-latest":
//         const follow = new Follow(event);
//         follow
//           .init()
//           .then((followContainer) => {
//             if (fieldData.allowDeleteMessages === "true") {
//               setTimeout(() => {
//                 removeEvent(followContainer, "follow-name");
//               }, fieldData.deleteMessages * 100000000);
//             }
//             mainCont.appendChild(followContainer);
//           })
//           .finally(() => {
//             $("main").scrollTop($("main")[0].scrollHeight);
//           });
//         break;
//       case "subscriber-latest":
//         const sub = new Sub(event);
//         sub
//           .init()
//           .then((subContainer) => {
//             if (fieldData.allowDeleteMessages === "true") {
//               setTimeout(() => {
//                 removeEvent(subContainer, "sub-name");
//               }, fieldData.deleteMessages * 100000000);
//             }
//             mainCont.appendChild(subContainer);
//           })
//           .finally(() => {
//             $("main").scrollTop($("main")[0].scrollHeight);
//           });
//         break;
//       case "raid-latest":
//         const raid = new Raid(event);
//         raid
//           .init()
//           .then((raidContainer) => {
//             if (fieldData.allowDeleteMessages === "true") {
//               setTimeout(() => {
//                 removeEvent(raidContainer, "raid-name");
//               }, fieldData.deleteMessages * 100000000);
//             }
//             mainCont.appendChild(raidContainer);
//           })
//           .finally(() => {
//             $("main").scrollTop($("main")[0].scrollHeight);
//           });
//         break;
//       case "cheer-latest":
//         const cheer = new Cheer(event);
//         cheer
//           .init()
//           .then((cheerContainer) => {
//             if (fieldData.allowDeleteMessages === "true") {
//               setTimeout(() => {
//                 removeEvent(cheerContainer, "cheer-name");
//               }, fieldData.deleteMessages * 100000000);
//             }
//             mainCont.appendChild(cheerContainer);
//           })
//           .finally(() => {
//             $("main").scrollTop($("main")[0].scrollHeight);
//           });
//         break;
//       case "tip-latest":
//         const tip = new Tip(event);
//         tip
//           .init()
//           .then((tipContainer) => {
//             if (fieldData.allowDeleteMessages === "true") {
//               setTimeout(() => {
//                 removeEvent(tipContainer, "tip-name");
//               }, fieldData.deleteMessages * 100000000);
//             }
//             mainCont.appendChild(tipContainer);
//           })
//           .finally(() => {
//             $("main").scrollTop($("main")[0].scrollHeight);
//           });
//         break;
//       default:
//         const bulk = new BulkGift(event, sameEventsAmount);
//         bulk
//           .init()
//           .then((bulkContainer) => {
//             if (fieldData.allowDeleteMessages === "true") {
//               setTimeout(() => {
//                 removeEvent(bulkContainer, "bulk");
//               }, fieldData.deleteMessages * 100000000);
//             }
//             mainCont.appendChild(bulkContainer);
//           })
//           .finally(() => {
//             $("main").scrollTop($("main")[0].scrollHeight);
//             sameEventsAmount = 0;
//           });
//         break;
//     }
//   }
//   // if (event.bulkGifted) listener = "bulk";
//   // if (isBulk && repeatedEvents < maxEvents) {
//   //   repeatedEvents++;
//   //   return;
//   // }

//   // repeatedEvents = 0;
//   // isBulk = false;
//   // maxEvents = 0;
// });

window.addEventListener("onEventReceived", async (obj) => {
  console.log(obj);
  let { listener, event } = obj.detail;

  if (listener === "subscriber-latest") {
    holdedEvent(event);
    return;
  }

  const mainCont = document.querySelector("main");

  switch (listener) {
    case "message":
      let isBlackListed = blacklisted(event.data.displayName);
      if (isBlackListed) return;
      let specialSymbols = ignoreMessagesStartingWith(event.data.text);
      if (specialSymbols) return;
      const message = new Message(event);
      message
        .init()
        .then((mainContainer) => {
          if (fieldData.allowDeleteMessages === "true") {
            setTimeout(() => {
              removeMessage(mainContainer);
            }, fieldData.deleteMessages * 100000000);
          }
          mainCont.appendChild(mainContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    case "follower-latest":
      const follow = new Follow(event);
      follow
        .init()
        .then((followContainer) => {
          if (fieldData.allowDeleteMessages === "true") {
            setTimeout(() => {
              removeEvent(followContainer, "follow-name");
            }, fieldData.deleteMessages * 100000000);
          }
          mainCont.appendChild(followContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    case "subscriber":
      const sub = new Sub(event);
      sub
        .init()
        .then((subContainer) => {
          if (fieldData.allowDeleteMessages === "true") {
            setTimeout(() => {
              removeEvent(subContainer, "sub-name");
            }, fieldData.deleteMessages * 100000000);
          }
          mainCont.appendChild(subContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    case "raid-latest":
      const raid = new Raid(event);
      raid
        .init()
        .then((raidContainer) => {
          if (fieldData.allowDeleteMessages === "true") {
            setTimeout(() => {
              removeEvent(raidContainer, "raid-name");
            }, fieldData.deleteMessages * 100000000);
          }
          mainCont.appendChild(raidContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    case "cheer-latest":
      const cheer = new Cheer(event);
      cheer
        .init()
        .then((cheerContainer) => {
          if (fieldData.allowDeleteMessages === "true") {
            setTimeout(() => {
              removeEvent(cheerContainer, "cheer-name");
            }, fieldData.deleteMessages * 100000000);
          }
          mainCont.appendChild(cheerContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    case "tip-latest":
      const tip = new Tip(event);
      tip
        .init()
        .then((tipContainer) => {
          if (fieldData.allowDeleteMessages === "true") {
            setTimeout(() => {
              removeEvent(tipContainer, "tip-name");
            }, fieldData.deleteMessages * 100000000);
          }
          mainCont.appendChild(tipContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    default:
      console.log(event);
      const bulk = new BulkGift(event);
      bulk
        .init()
        .then((bulkContainer) => {
          if (fieldData.allowDeleteMessages === "true") {
            setTimeout(() => {
              removeEvent(bulkContainer, "bulk");
            }, fieldData.deleteMessages * 100000000);
          }
          bc;
          mainCont.appendChild(bulkContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
  }
});

let storedEvents = [];
let eventCounter = 0;
let eventTimer = null;
let firstEvent = true;

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
      eventCounter += storedEvents.length;
      console.log(
        `se recibieron ${storedEvents.length} eventos, se envia el ultimo`
      );
      previousSender = "";
    } else if (storedEvents.length === 1) {
      console.log("heresdfadsf");
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
