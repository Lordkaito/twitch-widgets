let nicknames = [
  "AboutGameplay",
  "ActionCartridge",
  "Adventurese",
  "Alcomnet",
  "AnimeBuff",
  "Archwayco",
  "AssaultAimCorner",
  "AuraScanner",
  "Castield",
  "CoverageCheckpoint",
  "Daily igra",
  "DefendWeapon",
  "Dyarche",
  "Entimans",
  "Exposureli",
  "FeaturedViews",
  "FootageSmart",
  "Forwardonyx",
  "Ghtscore",
  "HitTelevision",
  "Infident",
  "Ivertrag",
  "MoviesFootage",
  "Obscessor",
  "Populist",
  "Prosemedq",
  "Setralitype",
  "SingularNetwork",
  "Teriantig",
  "TrackerAbsolute",
];
let session = {
  session: {
    data: {
      "follower-latest": {
        name: "StreamElements",
      },
      "follower-week": {
        count: 1,
      },
      "follower-month": {
        count: 2,
      },
      "follower-goal": {
        amount: 1,
      },
      "follower-total": {
        count: 6,
      },
      "subscriber-latest": {
        name: "Lordkaito_",
        amount: 1,
        tier: "1",
        message: "My test",
      },
      "subscriber-week": {
        count: 1,
      },
      "subscriber-month": {
        count: 2,
      },
      "subscriber-goal": {
        amount: 1,
      },
      "subscriber-total": {
        count: 4,
      },
      "subscriber-points": {
        amount: 4,
      },
      "host-latest": {
        name: "HostElements",
        amount: 20,
      },
      "raid-latest": {
        name: "RaidElements",
        amount: 20,
      },
      "cheer-week": {
        amount: 10,
      },
      "cheer-month": {
        amount: 20,
      },
      "cheer-total": {
        amount: 30,
      },
      "cheer-count": {
        count: 20,
      },
      "cheer-goal": {
        amount: 5000,
      },
      "cheer-latest": {
        name: "Andrewwanchev",
        amount: 200,
      },
      "tip-latest": {
        name: "pepsdas",
        amount: 5,
        message: "A fancy test message",
      },
      "tip-monthly-top-donation": {
        name: "mr_tester",
        amount: 100,
      },
      "tip-alltime-top-donation": {
        name: "username",
        amount: 123,
      },
      "tip-monthly-top-donator": {
        name: "mr_tester",
        amount: 200,
      },
      "tip-alltime-top-donator": {
        name: "pep",
        amount: 2000,
      },
      "tip-week": {
        amount: 5,
      },
      "tip-month": {
        amount: 205,
      },
      "tip-total": {
        amount: 377.99,
      },
      "tip-goal": {
        amount: 5,
      },
      "merch-goal-orders": {
        amount: 0,
      },
      "merch-goal-items": {
        amount: 0,
      },
      "merch-goal-total": {
        amount: 0,
      },
      "follower-recent": [
        {
          name: "StreamElements",
          type: "follower",
        },
      ],
      "subscriber-recent": [],
      "host-recent": [],
      "raid-recent": [],
      "cheer-recent": [],
      "tip-recent": [
        {
          name: "Test",
          amount: 5,
          createdAt: "2019-01-11T15:21:08.160Z",
          type: "tip",
        },
      ],
      "merch-recent": [],
      "subscriber-alltime-gifter": {
        name: "",
        amount: 0,
      },
      "subscriber-gifted-latest": {
        name: "",
        amount: 0,
        message: "",
      },
      "subscriber-new-latest": {
        name: "",
        amount: 0,
        message: "",
      },
      "subscriber-resub-latest": {
        name: "",
        amount: 0,
        message: "",
      },
      "cheer-alltime-top-donation": {
        name: "",
        amount: 0,
      },
      "cheer-alltime-top-donator": {
        name: "pep",
        amount: 100000,
      },
      "cheer-monthly-top-donation": {
        name: "",
        amount: 0,
      },
      "cheer-monthly-top-donator": {
        name: "",
        amount: 0,
      },
      "cheer-session": {
        amount: 0,
      },
      "cheer-session-top-donation": {
        name: "",
        amount: 0,
      },
      "cheer-session-top-donator": {
        name: "",
        amount: 0,
      },
      "cheer-weekly-top-donation": {
        name: "",
        amount: 0,
      },
      "cheer-weekly-top-donator": {
        name: "",
        amount: 0,
      },
      "follower-session": {
        count: 0,
      },
      "subscriber-gifted-session": {
        count: 0,
      },
      "subscriber-new-session": {
        count: 0,
      },
      "subscriber-resub-session": {
        count: 0,
      },
      "subscriber-session": {
        count: 0,
      },
      "tip-count": {
        count: 6,
      },
      "tip-session": {
        amount: 205,
      },
      "tip-session-top-donation": {
        name: "ter",
        amount: 200,
      },
      "tip-session-top-donator": {
        name: "lordkaito",
        amount: 5,
      },
      "tip-weekly-top-donation": {
        name: "lordkaito",
        amount: 5,
      },
      "tip-weekly-top-donator": {
        name: "lordkaito",
        amount: 5,
      },
      "merch-latest": {
        amount: 0,
        items: [],
        name: "",
      },
    },
    settings: {
      autoReset: true,
      calendar: true,
    },
  },
  recents: [
    {
      name: "Test",
      amount: 5,
      createdAt: "2019-01-11T15:21:08.160Z",
      type: "tip",
    },
    {
      name: "Andrew",
      type: "follower",
      createdAt: "2019-01-11T12:21:22.360Z",
    },
  ],
  currency: {
    code: "GBP",
    name: "U.S. Dollar",
    symbol: "£",
  },
  channel: {
    username: "MyLittleChannel",
  },
  fieldData: {},
};
let events = {
  follower: {
    listener: "follower-latest",
    event: {
      type: "follower",
      name: "Gizela",
      isTest: true,
      originalEventName: "follower-latest",
    },
  },
  redemption: {
    listener: "redemption-latest",
    event: {
      item: "SE T-shirt",
      itemId: "test",
      name: "Kara",
      type: "perk",
    },
  },
  subscriber: {
    listener: "subscriber-latest",
    event: {
      type: "subscriber",
      name: "Linnie",
      amount: "",
      count: 1,
      isTest: true,
      tier: "prime",
      message:
        "Do not fear a man that spams 1000 memes, instead fear a man that spams a meme 1000 times",
      originalEventName: "subscriber-latest",
    },
  },
  host: {
    listener: "host-latest",
    event: {
      type: "host",
      name: "Zorina",
      amount: 43,
      isTest: true,
      originalEventName: "host-latest",
    },
  },
  raid: {
    listener: "raid-latest",
    event: {
      type: "raid",
      name: "Benetta",
      amount: 10,
      isTest: true,
      originalEventName: "raid-latest",
    },
  },
  tip: {
    listener: "tip-latest",
    event: {
      type: "tip",
      name: "farmer",
      amount: 10,
      message: "Howdy, my name is Bill",
      originalEventName: "tip-latest",
    },
  },
  cheer: {
    listener: "cheer-latest",
    event: {
      type: "cheer",
      name: "Revkah",
      amount: 1000,
      count: 4,
      isTest: true,
      message: "cheer1000 my",
      originalEventName: "cheer-latest",
    },
  },
  message: {
    listener: "message",
    event: {
      type: "message",
      name: "Lordkaito_",
      message: "test",
      originalEventName: "message",
      service: "twitch",
      data: {
        time: 1680558919215,
        tags: {
          "badge-info": "",
          badges: "broadcaster/1,premium/1",
          color: "#FF0000",
          "display-name": "Lordkaito_",
          emotes: "",
          "first-msg": "0",
          flags: "",
          id: "726779f6-da00-4d26-8111-7a14f253c94b",
          mod: "0",
          "returning-chatter": "0",
          "room-id": "675807879",
          subscriber: "0",
          "tmi-sent-ts": "1680558919103",
          turbo: "0",
          "user-id": "675807879",
          "user-type": "",
          vip: "0",
        },
        nick: "lordkaito_",
        userId: "675807879",
        displayName: "Lordkaito_",
        displayColor: "#FF0000",
        badges: [
          {
            type: "broadcaster",
            version: "1",
            url: "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
            description: "Broadcaster",
          },
          {
            type: "premium",
            version: "1",
            url: "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3",
            description: "Prime Gaming",
          },
          // {
          //   type: "subscriber",
          //   version: "1",
          //   url: "https://i.postimg.cc/vHBd3bdk/SAKURA.png",
          //   description: "Subscriber",
          // }
        ],
        channel: "lordkaito_",
        text: "probando&nbsp;",
        isAction: false,
        emotes: ["HypeShock"],
        msgId: "726779f6-da00-4d26-8111-7a14f253c94b",
      },
    },
  },
};

function emulateNew(type, amount = "random", count = 1) {
  isGift = 0;
  if (amount === "random") {
    amount = Math.floor(Math.random() * 36) + 1;
  }
  if (amount === "gift") {
    amount = 1;
    isGift = 1;
  }
  let name = nicknames[Math.floor(Math.random() * nicknames.length)];
  let details = events[type];
  let timestamp = new Date();
  let recent = {
    name: name,
    type: type,
    createdAt: timestamp.toISOString,
  };
  if (type === "subscriber" && isGift) {
    details.event.isGift = true;
    details.event.count = count;
    details.event.sender =
      nicknames[Math.floor(Math.random() * nicknames.length)];
    recent.sender = details.event.sender;
  }
  // if (type !== "follower" && type !== "redemption") {
  //   details.event.amount = amount;
  //   recent.amount = amount;
  // }
  if (type === "cheer") {
    details.event.message = "cheer" + amount + " oh my";
  }
  details.event.name = name;
  session.recents.push(recent);
  // session.session.data[type + "-recent"].push(recent);
  let sessionIndex = type + "-latest";
  session.session.data[sessionIndex] = details.event;
  emulateSessionUpdate();
  const e = new CustomEvent("onEventReceived", {
    detail: details,
  });
  window.dispatchEvent(e);
}

function emulateInit() {
  for (var key in fieldData) {
    if (fieldData.hasOwnProperty(key)) {
      session.fieldData[key] = fieldData[key]["value"];
    }
  }

  const loadEvent = new CustomEvent("onWidgetLoad", {
    detail: session,
  });
  window.dispatchEvent(loadEvent);
}

function emulateSessionUpdate() {
  const sessionEvent = new CustomEvent("onSessionUpdate", {
    detail: {
      session: session,
    },
  });
  window.dispatchEvent(sessionEvent);
}

function setChannelName(channelName) {
  session.channel = channelName;
}
