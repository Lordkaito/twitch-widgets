//region INSTANCE
/* let fieldData = {
  displayBadges: true,
}; */
let currentEvent = null;
let flowerCount = 0;
let currentMessagesIds = [];
let currentAmountOfMessages = 0;
let maxMessages;

let imagesUrls = {
  mod: 'https://i.ibb.co/h8K2XB2/beewe-mod.png',
  vip: 'https://i.ibb.co/5vzfzrN/beewe-vip.png',
  subscriber: 'https://i.ibb.co/6W3bB1x/beewe-sub.png',
  viewer: 'https://i.ibb.co/ynvRHMJ/beewe-follower.png',
  streamer: 'https://i.ibb.co/cDdrzDD/beewe-streamer.png',
  trebol1: 'https://i.ibb.co/wYb8wWh/trebol1.png',
  trebol2: 'https://i.ibb.co/y6HJfQ2/trebol2.png',
  trebol3: 'https://i.ibb.co/cQBxwXt/trebol3.png',
  trebol4: 'https://i.ibb.co/M2T4K7c/trebol4.png',
  bot: 'https://i.ibb.co/mJws0WN/beewe-bot.png',
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
//region CATCH-EVENT
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

  //region GET-ROLE
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

  get emotes() {
    return this.event.data.emotes;
  }

  get text() {
    return this.event.data.text;
  }

  async buildMessageCont() {
    //region BUILD-MESSAGE
    return await this.createMainContainerElement();
  }

  async createMainContainerElement() {
    const colors = {
      username: '#651e22',
      userBackground: '#f0e1dc',
      textColor: '#687233',
      textBackground: '#ffffff',
      lineColor: '#45336d',
      pronsColor: 'white',
      dotsColor: '#b0cd6c',
    };

    //region CREATE-MAIN-DIV
    const theme = fieldData.theme;
    console.log(theme);
    const superMainContainer = document.createElement('div');
    superMainContainer.classList.add('super-main-container');
    superMainContainer.setAttribute('id', `${this.id}`);
    //region DEFINE-ROLE
    const role = this.roles.role;
    console.log(role);
    let roleImageURL;
    console.log(this.user)
    if(this.user === "thisistumble") {
      roleImageURL = imagesUrls.bot;
    } else {
      roleImageURL = imagesUrls[role];
    }
    //region PRONOUNSE-MODIFICATION
    let roleText = (await this.getUserPronoun()) || 'she/her';

    function showBadges(thisObj) {
      return thisObj.badges
        .map((badge) => {
          return `<img src="${badge.url}" class="badges-img"/>`;
        })
        .join('');
    }
    let inlineStyle;
    if (fieldData.allowPronouns == 'false' || roleText == '') {
      inlineStyle = `display: none;`;
    } else if (fieldData.allowPronouns == 'true' && roleText != '') {
      inlineStyle = `display: inline;`;
    }

    superMainContainer.innerHTML = `
      <div class="main-container">
      <img src="${roleImageURL}" class="role-img"/>
        <div class="message-container">
          <div class="username-info-container">
            <div class="username-info">
              <span class="username-badges" style="${
                fieldData.displayBadges == 'false' ? 'display: none;' : ''
              }">
                ${fieldData.displayBadges == 'true' ? showBadges(this) : ''}
              </span>
              <span class="capitalize-user" style="color: ${colors.username}">${
      this.user
    }
              </span>
              <span class="role-container" style='${inlineStyle}'>
                ${roleText}
              </span>
            </div>
            <div class="message-icon-container">
              <div class="rendered-text">
                <p class="text" style="color: ${colors.textColor}">${
      //region INNER-MESSAGE-TEXT
      !(await this.buildMessage()).innerHTML ||
      'Lorem Ipsiumm Lorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem IpsiummLorem Ipsiumms'
    }
                </p>
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
      roles[0], // Establecer el primer elemento como valor inicial
    );

    // Asignar la imagen correspondiente
    let roleImage = document.createElement('img');
    roleImage.classList.add('role');
    if (minPriorityRole.length == 0) {
      minPriorityRole.role = 'viewer';
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
    if (customEmotes != undefined && customEmotes.status != 'Not Found') {
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
    const startingLetter = 'f';
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

    const nameAndText = `${text}`;
    const newContainer = document.createElement('div');
    newContainer.classList.add('new-container');
    newContainer.setAttribute('id', `${this.id}`);
    const theme = fieldData.theme;
    let toggleClass = 'toggle-circle';
    let toggleClass2 = 'toggle';
    if (theme === 'dark') {
      toggleClass = 'toggle-circle-dark';
      toggleClass2 = 'toggle-dark';
    }

    const colors = {
      username: '#5e8501',
      userBackground: '#b0cd6c',
      textColor: '#72a101',
      textBackground: '#ffefdb',
      lineColor: '#ffefdb',
      dotsColor: '#ffefdb',
      eventsColor: 'white',
    };

    newContainer.innerHTML = `
      <div class="event-container">
        <img class="bote" src="https://i.ibb.co/58bPVGq/botehada.png" />
        <div class="event-and-name-container">
          <p class="event-name" style="color: ${colors.eventsColor}">${nameAndText}</p>
        </div>
        <img class="joya" src="https://i.ibb.co/nPdC92v/joyahada.png" />
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

const removeMessage = (mainContainer) => {
  console.log('Removing message', mainContainer);
  const elem = mainContainer;
  if (elem) {
    elem.style.animationName = 'removeMessage';
    elem.style.animationDuration = '0.7s';
    elem.style.animationTimingFunction = 'ease-in-out';
    elem.style.animationDelay = '1s';
    elem.style.animationFillMode = 'forwards';
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

  if (listener === 'message') {
    let isBlackListed = blacklisted(event.data.displayName);
    if (isBlackListed) return;
    let specialSymbols = ignoreMessagesStartingWith(event.data.text);
    if (specialSymbols) return;
  }

  const mainCont = document.querySelector('main');

  const events = new mainEvent(event, listener);

  events.init
    .then((mainContainer) => {
      if (fieldData.allowDeleteMessages === 'true') {
        if (fieldData.deleteMessagesOption === 'amount') {
          if (currentAmountOfMessages >= maxMessages) {
            let messageToRemove = currentMessagesIds.shift();
            removeMessage(document.querySelector(`#${messageToRemove}`));
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
    })
    .then((mainContainer) => {
      addTrebols(mainContainer, listener, event);
    });
});
//region ADDING-TREBOLS
async function addTrebols(container, listener, event) {
  if (listener === 'message') {
    let nickContainer = container.querySelector('.username-info');
    let totalHeight = container.querySelector(
      '.message-icon-container',
    ).offsetHeight;
    let nickHeight = nickContainer.offsetHeight;

    const trebolsContainer = document.querySelectorAll(
      '.message-icon-container',
    );
    console.log(trebolsContainer);
    let trebol1Url = imagesUrls['trebol1'];
    let trebol2Url = imagesUrls['trebol2'];
    let trebol3Url = imagesUrls['trebol3'];
    let trebol4Url = imagesUrls['trebol4'];

    trebolsContainer.forEach((element) => {
      element.innerHTML += `
      <img class="trebol t1" src="${trebol1Url}" alt="trebol1">
      <img class="trebol t2" src="${trebol2Url}" alt="trebol1">
      <img class="trebol t3" src="${trebol3Url}" alt="trebol1">
      <img class="trebol t4" src="${trebol4Url}" alt="trebol1">
      `;
      let t1 = document.querySelectorAll('.t1');
      console.log(t1);
      t1.forEach((t1s) => {
        t1s.style.top = `${nickHeight + 4}px`;
      });

      let t3 = document.querySelectorAll('.t3');
      console.log(t1);
      t1.forEach((t3s) => {
        t3s.style.top = `${nickHeight + 4}px`;
      });

      let t4 = document.querySelectorAll('.t4');
      console.log(t1);
      t1.forEach((t4s) => {
        t4s.style.right = "8px";
      });
    });
  }

  if (listener !== 'message') {
    linesContainer.innerHTML = `
      <img src="${moonUrl}" class="moon"/>
  `;
  }

  container.appendChild(linesContainer);
}
