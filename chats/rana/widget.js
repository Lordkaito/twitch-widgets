// let fieldData = {};
let currentEvent = null;
let startingColor = 'red';
let maxMessages;
let currentAmountOfMessages = 0;
let currentMessagesIds = [];
let theme;
const themes = {
  red: {
    userBackground: '#87a27a',
    username: '#fef5e9',
    messageBackground: '#bad2af',
    messageText: '#5c6f52',
    messageBorder: '#f79e60',
    pronounsBackground: '#fef5e9',
    pronounsText: ' #cd9a75',
    campanitaRanaImg: 'https://i.ibb.co/vXy91Qk/campanitarana.png',
    firstMessageImg: 'https://i.ibb.co/Pg5j4TX/nenufarfirst.png',
    vipImg: 'https://i.ibb.co/hZBrQGk/nenufarvip.png',
    baseImg: 'https://i.ibb.co/L1nr0fT/nenufarbase.png',
    modImg: 'https://i.ibb.co/F5Qcx1S/nenufarmod.png',
    margaSub: 'https://i.ibb.co/WF7PH9L/margasub.png',
  },
  pink: {
    userBackground: '#87a27a',
    username: '#fef5e9',
    messageBackground: '#bad2af',
    messageText: '#5c6f52',
    messageBorder: '#f79e60',
    pronounsBackground: '#fef5e9',
    pronounsText: ' #cd9a75',
    campanitaRanaImg: 'https://i.ibb.co/vXy91Qk/campanitarana.png',
    firstMessageImg: 'https://i.ibb.co/Pg5j4TX/nenufarfirst.png',
    vipImg: 'https://i.ibb.co/hZBrQGk/nenufarvip.png',
    baseImg: 'https://i.ibb.co/L1nr0fT/nenufarbase.png',
    modImg: 'https://i.ibb.co/F5Qcx1S/nenufarmod.png',
    margaSub: 'https://i.ibb.co/WF7PH9L/margasub.png',
  },
};

const SE_API_BASE = 'https://api.streamelements.com/kappa/v2';

const PRONOUNS_API_BASE = 'https://pronouns.alejo.io/api';
const PRONOUNS_API = {
  user: (username) => `${PRONOUNS_API_BASE}/users/${username}`,
  pronouns: `${PRONOUNS_API_BASE}/pronouns`,
};

const roles = ['streamer', 'mod', 'vip', 'subscriber', 'viewer'];
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
    return this.event.data.tags.mod === '1';
  }

  get isStreamer() {
    return (
      this.event.data.displayName.toLowerCase() ==
      this.event.data.channel.toLowerCase()
    );
  }

  get isSub() {
    return this.event.data.tags.subscriber === '1';
  }

  get isVip() {
    return this.event.data.tags.vip === '1';
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
      if (roles.includes(key) && tags[key] === '1') {
        priorityRole.push({ role: key, priority: priorities[key] });
      }
    });

    if (this.isStreamer) {
      priorityRole.push({ role: 'streamer', priority: priorities['streamer'] });
    }

    if (priorityRole.length === 0) {
      priorityRole.push({ role: 'viewer', priority: priorities['viewer'] });
    }
    priorityRole.sort((a, b) => a.priority - b.priority);
    return priorityRole[0];
  }

  eventType() {
    if (this.listener === 'message') {
      return this.buildMessageCont();
    } else {
      return this.buildEvent();
    }
  }

  get flower() {
    const flower = document.createElement('img');
    flower.src = 'https://i.postimg.cc/W12nD9TL/arco-iris-4.png';
    flower.classList.add('flower');

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

  get id() {
    // generate random string
    const randomString = Math.random().toString(36).substring(2, 15);
    const startingLetter = 'c';
    return `${startingLetter}${randomString}`;
  }

  async createMainContainerElement() {
    let role = this.roles;
    console.log(role.role);
    const mainContainer = document.createElement('div');
    const superMainContainer = document.createElement('div');
    const division = document.createElement('div');
    const division2 = document.createElement('div');
    division2.classList.add('separation2');
    division.classList.add('separation');

    const animation = fieldData.animation;

    superMainContainer.classList.add('super-main-container');
    superMainContainer.setAttribute('id', `${this.id}`);
    mainContainer.classList.add('main-container');

    //region MARGARITA-IF-SUB
    if (role.role === 'streamer') {
        const margarita = document.createElement('img');
        margarita.classList.add('margarita');
        margarita.src = themes[theme].margaSub;
        mainContainer.appendChild(margarita);
    }
    mainContainer.style.background = themes[theme].messageBackground;

    //region HEIGHT-ROLE
    mainContainer.appendChild(await this.createMessageContainerElement());
    division2.appendChild(this.roleImages);
    division.appendChild(await this.createUsernameInfoElement());
    division.appendChild(mainContainer);

    superMainContainer.appendChild(division);
    console.log(division);
    console.log(division.offsetHeight);

    superMainContainer.appendChild(division2);

    requestAnimationFrame(() => {
        let heightUsernameContainer = document.querySelector('.username-info-container').offsetHeight;
        console.log(heightUsernameContainer)
        let heightSeparation = division.offsetHeight;
        let neededHeight = heightSeparation - heightUsernameContainer;
        console.log(heightSeparation);
        division2.style.height = `${neededHeight / 2}px`;
    });

    return superMainContainer;
}


  async createUsernameInfoElement() {
    const usernameInfo = document.createElement('div');
    const usernameInfoContainer = document.createElement('div');

    usernameInfoContainer.classList.add('username-info-container');
    usernameInfo.classList.add('username-info');
    usernameInfo.style.backgroundColor = themes[theme].userBackground;

    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    usernameInfoContainer.appendChild(usernameInfo);

    usernameInfoContainer.appendChild(await this.createPronounsContainer());
    return usernameInfoContainer;
  }

  async createMessageContainerElement() {
    const messageContainer = document.createElement('div');

    messageContainer.classList.add('message-container');

    messageContainer.appendChild(
      await this.createMessageIconContainerElement(),
    );
    return messageContainer;
  }

  createUsernameBadgesElement() {
    const usernameBadges = document.createElement('span');

    usernameBadges.classList.add('username-badges');

    this.badges.forEach((badge) => {
      let badgeImg = document.createElement('img');
      badgeImg.classList.add('badges-img');
      badgeImg.src = badge.url;
      usernameBadges.appendChild(badgeImg);
    });

    if (fieldData.displayBadges == 'false') {
      usernameBadges.style.display = 'none';
    }
    return usernameBadges;
  }

  createCapitalizeUserElement() {
    const capitalizeUser = document.createElement('span');

    capitalizeUser.classList.add('capitalize-user');
    capitalizeUser.style.color = themes[theme].username;
    capitalizeUser.innerText = this.user;
    capitalizeUser.style.maxWidth =
      fieldData.limitUsernames == 'false' ? 'none' : '13ch';

    return capitalizeUser;
  }

  createRoleContainer() {
    const roleContainer = document.createElement('span');

    roleContainer.classList.add('role-container');

    return roleContainer;
  }

  async createPronounsContainer() {
    let role = this.roles;
    const pronounsContainer = document.createElement('div');
    const pronouns = document.createElement('span');

    pronouns.classList.add('prons');
    pronounsContainer.classList.add('pronouns');
    pronounsContainer.style.backgroundColor = themes[theme].pronounsBackground;
    pronouns.style.color = themes[theme].pronounsText;

    pronouns.innerText = await this.getUserPronoun();
    pronouns.innerText == ''
      ? (pronounsContainer.style.opacity = '0')
      : (pronounsContainer.style.opacity = '1');
    if (fieldData.allowPronouns == 'false') {
      pronounsContainer.style.opacity = '0';
    }

    pronounsContainer.appendChild(pronouns);

    return pronounsContainer;
  }

  async createMessageIconContainerElement() {
    const messageIconContainer = document.createElement('div');

    messageIconContainer.classList.add('message-icon-container');

    messageIconContainer.appendChild(await this.createRenderedTextElement());

    return messageIconContainer;
  }

  get roleImages() {
    const roles = this.getRole();

    // Buscar el rol con la menor prioridad
    const minPriorityRole = roles.reduce(
      (minRole, currentRole) =>
        currentRole.priority < minRole.priority ? currentRole : minRole,
      roles[0], // Establecer el primer elemento como valor inicial
    );

    // Asignar la imagen correspondiente
    let roleImage = document.createElement('img');
    let division2 = document.querySelector('.separation2');
    /* division2.appendChild(roleImage); */
    roleImage.classList.add('role');
    //region INSTANCE FIRST MSG
    let firstMsg = this.event.data.tags['first-msg'];
    if (firstMsg == 1) {
      roleImage.src = themes[theme].firstMessageImg;
    } else {
      if (minPriorityRole.length == 0) {
        minPriorityRole.role = 'viewer';
      }
      //region ADD-ROLE-IMG
      switch (minPriorityRole.role) {
        case 'streamer':
          roleImage.src = themes[theme].baseImg;
          break;
        case 'mod':
          roleImage.src = themes[theme].modImg;
          break;
        case 'vip':
          roleImage.src = themes[theme].vipImg;
          break;
        case 'sub':
          roleImage.src = themes[theme].baseImg;
          break;
        case 'viewer':
          roleImage.style.display = 'none';
          break;
      }
    }

    return roleImage;
  }

  async getUserPronoun() {
    let pronoun = null;
    let username = this.user.toLowerCase();

    const response = await fetch(`${PRONOUNS_API_BASE}/users/${username}`);
    const data = await response.json();
    if (data[0] == undefined) {
      return '';
    }
    pronoun = data[0].pronoun_id;

    // pronoun = await pronoun_api;
    switch (pronoun) {
      case 'aeaer':
        pronoun = 'ae/aer';
        break;
      case 'eem':
        pronoun = 'e/em';
        break;
      case 'faefaer':
        pronoun = 'fae/faer';
        break;
      case 'hehim':
        pronoun = 'he/him';
        break;
      case 'heshe':
        pronoun = 'he/she';
        break;
      case 'hethem':
        pronoun = 'he/they';
        break;
      case 'itits':
        pronoun = 'it/its';
        break;
      case 'perper':
        pronoun = 'per/per';
        break;
      case 'sheher':
        pronoun = 'she/her';
        break;
      case 'shethem':
        pronoun = 'she/they';
        break;
      case 'theythem':
        pronoun = 'they/them';
        break;
      case 'vever':
        pronoun = 've/ver';
        break;
      case 'xexem':
        pronoun = 'xe/xem';
        break;
      case 'ziehir':
        pronoun = 'zie/hir';
        break;
      default:
        break;
    }
    return pronoun;
  }

  async createRenderedTextElement() {
    const renderedText = document.createElement('div');
    renderedText.classList.add('rendered-text');
    renderedText.classList.add(`${this.roles.role}-text`);
    renderedText.appendChild(await this.buildMessage());
    return renderedText;
  }

  getRole() {
    const roles = [];
    const rolesObj = {
      mod: { role: 'mod', priority: 1 },
      vip: { role: 'vip', priority: 2 },
      subscriber: { role: 'sub', priority: 3 },
      turbo: { role: 'turbo', priority: 4 },
    };

    Object.entries(this.event.data.tags).forEach(([key, value]) => {
      if (value === '1' && rolesObj[key]) {
        roles.push(rolesObj[key]);
      } else {
        const viewer = { role: 'viewer', priority: 5 };
        if (roles.includes(viewer)) {
          return;
        } else {
          roles.push(viewer);
        }
      }
    });

    if (this.isStreamer) {
      const streamer = { role: 'streamer', priority: 0 };
      roles.unshift(streamer);
    }
    return roles;
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
    const words = rawMessage.split(' ');

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

    let textContainer = document.createElement('p');
    textContainer.classList.add('text');
    textContainer.style.color = themes[theme].messageText;

    textContainer.innerHTML = words.join(' ');

    return textContainer;
  }

  async customEmotes() {
    let id = fieldData.emotesId;
    let url;
    let customEmotesArr;
    if (id != '') {
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
    const mainContainer = document.createElement('div');

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
    const sender = this.event.name;
    let eventText = dictionary[this.event.type];
    if (this.event.gifted) {
      eventText = dictionary['giftsub'];
      let text = ` ha regalado ${amount} subs!`;
      if (eventText == '') {
        eventText = ` ha regalado ${amount} subs!`;
        text = name + eventText;
      } else {
        eventText = eventText.replace('(amount)', amount);
        eventText = eventText.replace('(sender)', sender);
        text = eventText;
      }
    }

    if (this.event.bulkGifted) {
      eventText = dictionary['bulkgift'];
      let text = ` ha regalado ${amount} subs!`;
      if (eventText == '') {
        eventText = ` ha regalado ${amount} subs!`;
        text = name + eventText;
      } else {
        eventText = eventText.replace('(amount)', amount);
        eventText = eventText.replace('(sender)', sender);
        text = eventText;
      }
    }

    let text = eventText != '' ? eventText : `Gracias ${name}!`;
    text = eventText != '' ? eventText : text;
    if (eventText != '') {
      eventText = eventText.replace('(user)', name);
      eventText = eventText.replace('(amount)', amount);
      eventText = eventText.replace('(sender)', sender);
      text = eventText;
    }

    //region REPLACE
    if (this.event.count > 1) {
      dictionary.subscriber.length;
      let textLength = text.length - 1;
      text = `${text.slice(0, textLength)} for ${this.event.count} months!`;
    }
    const nameAndText = `${text}`;
    const nameContainer = document.createElement('p');

    const bellContainer = document.createElement('div');
    const fungi = document.createElement('img');

    fungi.src = themes[theme].campanitaRanaImg;

    fungi.classList.add('fungi');
    const ranaBellContainer = document.createElement('div');
    const flower = document.createElement('img');
    flower.classList.add('flower-event');
    flower.src = themes[theme].margaSub;

    ranaBellContainer.classList.add(`rana-bell`);
    ranaBellContainer.appendChild(fungi);
    bellContainer.classList.add('rana-event-container');
    bellContainer.appendChild(flower);

    bellContainer.appendChild(ranaBellContainer);
    bellContainer.appendChild(nameContainer);
    nameContainer.classList.add('event-name');
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add('event-container');
    mainContainer.setAttribute('id', `${this.id}`);
    mainContainer.appendChild(bellContainer);

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
    api: 'https://api2.frankerfacez.com/v1/set/global',
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
    api: 'https://api.betterttv.net/3/cached/emotes/global',
    transformer: (response) => {
      return response.map((emote) => emote.code);
    },
  },
  '7tv': {
    api: 'https://api.7tv.app/v2/emotes/global',
    transformer: (response) => {
      return response.map((emote) => emote.name);
    },
  },
};

window.addEventListener('onWidgetLoad', async (obj) => {
  Widget.channel = obj.detail.channel;
  fieldData = obj.detail.fieldData;
  theme = fieldData.theme;
  console.log(theme);
  maxMessages = fieldData.maxMessages;
});

function stringToArray(string = '', separator = ',') {
  return string.split(separator).reduce((acc, value) => {
    const trimmed = value.trim();
    if (trimmed !== '') acc.push(trimmed);
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

const removeMessage = (messageContainer) => {
  const elem = messageContainer;
  if (elem) {
    elem.style.animation = 'removeMessage 0.5s ease-in-out forwards';
    setTimeout(() => {
      elem.remove();
    }, 700);
  }
};
let repeatedEvents = 0;
let maxEvents = 0;
let isBulk = false;

const blacklisted = (name) => {
  let username = name.toLowerCase().trim();
  let blacklist = [];
  let blackListFieldData = fieldData.usersBlackList.split(',');
  blackListFieldData.forEach((nick) => {
    blacklist.push(nick.toLowerCase().trim());
  });
  return blacklist.includes(username);
};

const ignoreMessagesStartingWith = (message) => {
  let ignoreList = [];
  let ignoreListFieldData = fieldData.specialCharsBlackList.split(',');
  if (ignoreListFieldData !== '') {
    ignoreListFieldData.forEach((symbol) => {
      ignoreList.push(symbol.trim());
    });
  }

  if (ignoreList.length === 1 && ignoreList[0] === '') {
    return false;
  }
  return ignoreList.some((symbol) => message.toLowerCase().startsWith(symbol));
};

window.addEventListener('onEventReceived', async (obj) => {
  let { listener, event } = obj.detail;
  if (event.isCommunityGift) return;
  console.log(obj.detail);

  if (listener === 'message') {
    let isBlackListed = blacklisted(event.data.displayName);
    if (isBlackListed) return;
    let specialSymbols = ignoreMessagesStartingWith(event.data.text);
    if (specialSymbols) return;
  }

  const mainCont = document.querySelector('main');

  const events = new mainEvent(event, listener);

  events.init.then((mainContainer) => {
    if (fieldData.allowDeleteMessages === 'true') {
      if (fieldData.deleteMessagesOption === 'amount') {
        if (currentAmountOfMessages >= maxMessages) {
          let messageToRemove = currentMessagesIds.shift();
          /* let eventToRemove = document.querySelector(".event-container"); */
          /* removeMessage(eventToRemove); */
          removeMessage(document.querySelector('#' + messageToRemove));
          currentMessagesIds.push(mainContainer.id);
        } else {
          currentAmountOfMessages++;
          currentMessagesIds.push(mainContainer.id);
        }
      }
      if (fieldData.deleteMessagesOption === 'timer') {
        setTimeout(() => {
          removeMessage(mainContainer);
        }, fieldData.deleteMessagesTimer * 1000);
      }
    }
    mainCont.appendChild(mainContainer);
    return mainContainer;
  });
});
