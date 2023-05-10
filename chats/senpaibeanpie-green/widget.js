// let fieldData = {};
let currentEvent = null;

const SE_API_BASE = "https://api.streamelements.com/kappa/v2";

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
  sub: 4,
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
    flower.src = "https://i.postimg.cc/qM5HFSJR/FLOWER-RIGHT.png";
    flower.classList.add("flower");

    return flower;
  }

  get leafs() {
    const leafsContainer = document.createElement("div");
    const leafs = document.createElement("img");
    leafs.src = "https://i.postimg.cc/Z5hf4JGS/margarita-der.png";
    leafs.classList.add("leafs");
    leafsContainer.classList.add("leafs-container");
    leafsContainer.appendChild(leafs);

    return leafsContainer;
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
    const mainContainer = document.createElement("div");
    const superMainContainer = document.createElement("div");
    const animation = fieldData.animation;

    superMainContainer.classList.add("super-main-container");
    mainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("main-container");
    mainContainer.classList.add(`${this.roles.role}-main-container`); // not being used for ronros, but useful for future chats if we need to style them differently
    // mainContainer.appendChild(this.flower);
    // for (let i = 0; i < 2; i++) {
    //   let leaf = this.leafs;
    //   mainContainer.appendChild(this.leafs);
    // }
    if (fieldData.chatBoxSize == "small") {
      mainContainer.style.maxWidth = "33.5rem";
    }

    mainContainer.appendChild(await this.createUsernameInfoElement());
    mainContainer.appendChild(await this.createMessageContainerElement());
    superMainContainer.appendChild(mainContainer);

    return superMainContainer;
  }

  // get butterfly() {
  //   const img = document.createElement("img");
  //   const imgContainer = document.createElement("div");
  //   img.src = "https://i.postimg.cc/RVSHXtvv/mariposita.png";
  //   img.classList.add("butterfly");
  //   imgContainer.classList.add("butterfly-container");
  //   imgContainer.appendChild(img);

  //   return imgContainer;
  // }

  async createUsernameInfoElement() {
    const role = this.roles;
    const usernameInfo = document.createElement("div");
    const usernameInfoContainer = document.createElement("div");
    usernameInfoContainer.classList.add("username-info-container");
    usernameInfo.classList.add("username-info");
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    for (let i = 0; i < 2; i++) {
      let flower = this.flower;
      flower.classList.add("flower-" + (i + 1));
      usernameInfo.appendChild(flower);
    }
    usernameInfoContainer.appendChild(usernameInfo);
    usernameInfoContainer.appendChild(await this.createPronounsContainer());
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
    let color = this.color;
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
    pronouns.classList.add("prons");
    pronounsContainer.classList.add("pronouns");
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
    let roleImage = document.createElement("svg");
    roleImage.classList.add("role");
    if (minPriorityRole.length == 0) {
      minPriorityRole.role = "viewer";
    }

    roleImage.innerHTML = `<svg height="40px" width="40px" version="1.1" id="x32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fff" stroke-width="90"> <g> <path d="M449.469,110.076C366.072,76.721,319.373,0,255.996,0C192.619,0,145.927,76.721,62.531,110.076 c-56.854,22.748-76.72,80.055-30.022,126.754c36.889,36.897,111.242,55.038,175.385,61.04 c-1.51,46.071-6.614,75.586-21.974,108.512c-19.72,42.254-5.64,92.962,42.254,104.228c47.896,11.267,75.778-48.14,81.695-101.416 c3.38-30.42,3.717-75.026,0.406-111.939c62.68-6.568,133.498-24.71,169.215-60.426C526.19,190.131,506.323,132.825,449.469,110.076 z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path fill="#b48e7b" d="M449.469,110.076C366.072,76.721,319.373,0,255.996,0C192.619,0,145.927,76.721,62.531,110.076 c-56.854,22.748-76.72,80.055-30.022,126.754c36.889,36.897,111.242,55.038,175.385,61.04 c-1.51,46.071-6.614,75.586-21.974,108.512c-19.72,42.254-5.64,92.962,42.254,104.228c47.896,11.267,75.778-48.14,81.695-101.416 c3.38-30.42,3.717-75.026,0.406-111.939c62.68-6.568,133.498-24.71,169.215-60.426C526.19,190.131,506.323,132.825,449.469,110.076 z"></path> </g> </g></svg>`;

    // switch (minPriorityRole.role) {
    //   case "streamer":
    //     roleImage.innerHTML = `<svg height="35px" width="35px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="10.24"> <g> <path stroke="white" stroke-width="100" d="M512,223.537c0-61.46-49.773-111.264-111.264-111.264c-11.768,0-22.922,2.31-33.496,5.644 C366.948,56.657,317.346,7.084,255.985,7.084c-61.32,0-110.993,49.573-111.224,110.833c-10.573-3.334-21.728-5.644-33.496-5.644 C49.774,112.273,0,162.077,0,223.537c0,49.241,32.171,90.479,76.533,105.12c-13.294,18.354-21.276,40.656-21.276,64.985 c0,61.46,49.773,111.274,111.254,111.274c36.86,0,69.222-18.043,89.475-45.646c20.283,27.603,52.645,45.646,89.465,45.646 c61.521,0,111.264-49.813,111.264-111.274c0-24.329-7.993-46.631-21.246-64.985C479.829,314.017,512,272.779,512,223.537z M255.985,337.433c-31.971,0-57.927-25.916-57.927-57.887c0-31.981,25.956-57.897,57.927-57.897c32,0,57.926,25.916,57.926,57.897 C313.912,311.517,287.986,337.433,255.985,337.433z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path fill="#f8c2a6" d="M512,223.537c0-61.46-49.773-111.264-111.264-111.264c-11.768,0-22.922,2.31-33.496,5.644 C366.948,56.657,317.346,7.084,255.985,7.084c-61.32,0-110.993,49.573-111.224,110.833c-10.573-3.334-21.728-5.644-33.496-5.644 C49.774,112.273,0,162.077,0,223.537c0,49.241,32.171,90.479,76.533,105.12c-13.294,18.354-21.276,40.656-21.276,64.985 c0,61.46,49.773,111.274,111.254,111.274c36.86,0,69.222-18.043,89.475-45.646c20.283,27.603,52.645,45.646,89.465,45.646 c61.521,0,111.264-49.813,111.264-111.274c0-24.329-7.993-46.631-21.246-64.985C479.829,314.017,512,272.779,512,223.537z M255.985,337.433c-31.971,0-57.927-25.916-57.927-57.887c0-31.981,25.956-57.897,57.927-57.897c32,0,57.926,25.916,57.926,57.897 C313.912,311.517,287.986,337.433,255.985,337.433z"></path> </g> </g></svg>`;
    //     break;
    //   case "mod":
    //     roleImage.innerHTML = `<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40px" height="40px" viewBox="-56.32 -56.32 675.86 675.86" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="white" stroke-width="100"> <g> <path d="M490.307,165.398c-28.237,0-48.242,13.885-61.965,31.834l-0.803-24.786c0-12.068-8.444-22.988-18.867-22.988H201.166 c-10.414,0-18.867,10.92-18.867,22.988l-2.333,65.704L56.771,138.949c5.814-13.933,6.493-25.541,0.516-29.701 c-8.597-5.977-27.444,6.407-42.094,27.483c-14.65,21.066-19.555,43.07-10.959,49.046c6.589,4.578,19.172-1.596,31.292-14.181 l140.221,184.527l-2.878,77.198c0,12.067,8.444,22.155,18.867,22.155H418.1c10.414,0,18.867-10.088,18.867-22.155l-1.511-40.593 c17.7-21.793,38.25-36.49,58.322-51.322c35.716-26.393,69.442-51.006,69.442-105.886 C563.221,193.397,533.921,165.398,490.307,165.398z M480.792,324.451c-15.023,11.103-31.155,23.218-46.464,38.403l-4.389-121.339 c6.903-21.879,23.352-54.258,60.367-54.258c31.978,0,51.064,18.15,51.064,48.578C541.371,279.699,514.634,299.445,480.792,324.451z "></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path fill="#b18882" d="M490.307,165.398c-28.237,0-48.242,13.885-61.965,31.834l-0.803-24.786c0-12.068-8.444-22.988-18.867-22.988H201.166 c-10.414,0-18.867,10.92-18.867,22.988l-2.333,65.704L56.771,138.949c5.814-13.933,6.493-25.541,0.516-29.701 c-8.597-5.977-27.444,6.407-42.094,27.483c-14.65,21.066-19.555,43.07-10.959,49.046c6.589,4.578,19.172-1.596,31.292-14.181 l140.221,184.527l-2.878,77.198c0,12.067,8.444,22.155,18.867,22.155H418.1c10.414,0,18.867-10.088,18.867-22.155l-1.511-40.593 c17.7-21.793,38.25-36.49,58.322-51.322c35.716-26.393,69.442-51.006,69.442-105.886 C563.221,193.397,533.921,165.398,490.307,165.398z M480.792,324.451c-15.023,11.103-31.155,23.218-46.464,38.403l-4.389-121.339 c6.903-21.879,23.352-54.258,60.367-54.258c31.978,0,51.064,18.15,51.064,48.578C541.371,279.699,514.634,299.445,480.792,324.451z "></path> </g> </g></svg>`;
    //     break;
    //   case "vip":
    //     roleImage.innerHTML = `<svg height="35px" width="35px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0">
    //     </g>
    //     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="white" stroke-width="100"><g> <path d="M193.945,399.491c0,26.182,0,45.436,0,59.754c0,27.928,12.4,52.755,62.054,52.755 c49.655,0,62.054-24.827,62.054-52.755c0-14.318,0-33.572,0-59.754c-20,2.509-40.727,3.9-62.054,3.9 C234.673,403.391,213.945,402,193.945,399.491z">
    //     </path> <path d="M493.382,203.663C446.836,123.973,367.709,0,256,0C144.291,0,65.164,123.973,18.618,203.663 c-46.546,79.701,60.509,171.8,237.382,171.8C432.873,375.464,539.927,283.364,493.382,203.663z M106.673,279.273 c-24.637,0-44.609-19.973-44.609-44.6c0-24.646,19.972-44.609,44.609-44.609c24.627,0,44.6,19.964,44.6,44.609 C151.273,259.3,131.3,279.273,106.673,279.273z M194.718,127.618c0-28.5,23.1-51.591,51.591-51.591 c28.481,0,51.582,23.091,51.582,51.591c0,28.482-23.101,51.582-51.582,51.582C217.818,179.2,194.718,156.1,194.718,127.618z M282.764,328.146c-21.209,0-38.4-17.191-38.4-38.4c0-21.209,17.191-38.4,38.4-38.4c21.209,0,38.4,17.191,38.4,38.4 C321.164,310.954,303.973,328.146,282.764,328.146z M421.009,262.7c-22.174-3.59-38.492-25.064-34.964-46.891 c3.401-20.991,23.691-32.208,44.054-26.172c18.955,5.627,32.046,24.618,30.328,43.337 C458.645,252.345,441.554,266.027,421.009,262.7z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path fill="#ad5b61" d="M193.945,399.491c0,26.182,0,45.436,0,59.754c0,27.928,12.4,52.755,62.054,52.755 c49.655,0,62.054-24.827,62.054-52.755c0-14.318,0-33.572,0-59.754c-20,2.509-40.727,3.9-62.054,3.9 C234.673,403.391,213.945,402,193.945,399.491z"></path> <path fill="#ad5b61" d="M493.382,203.663C446.836,123.973,367.709,0,256,0C144.291,0,65.164,123.973,18.618,203.663 c-46.546,79.701,60.509,171.8,237.382,171.8C432.873,375.464,539.927,283.364,493.382,203.663z M106.673,279.273 c-24.637,0-44.609-19.973-44.609-44.6c0-24.646,19.972-44.609,44.609-44.609c24.627,0,44.6,19.964,44.6,44.609 C151.273,259.3,131.3,279.273,106.673,279.273z M194.718,127.618c0-28.5,23.1-51.591,51.591-51.591 c28.481,0,51.582,23.091,51.582,51.591c0,28.482-23.101,51.582-51.582,51.582C217.818,179.2,194.718,156.1,194.718,127.618z M282.764,328.146c-21.209,0-38.4-17.191-38.4-38.4c0-21.209,17.191-38.4,38.4-38.4c21.209,0,38.4,17.191,38.4,38.4 C321.164,310.954,303.973,328.146,282.764,328.146z M421.009,262.7c-22.174-3.59-38.492-25.064-34.964-46.891 c3.401-20.991,23.691-32.208,44.054-26.172c18.955,5.627,32.046,24.618,30.328,43.337 C458.645,252.345,441.554,266.027,421.009,262.7z"></path> </g> </g></svg>`;
    //     break;
    //   case "sub":
    //     roleImage.classList.add("role-offset");
    //     roleImage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="67.029 -20 377.9 368.6" width="25" height="25">
    //     <path d="M137.542,212.252c-8.77,12.118-14.043,26.836-14.043,42.895c0,40.566,32.858,73.449,73.432,73.449 c24.335,0,45.692-11.913,59.06-30.127c13.386,18.214,34.75,30.127,59.052,30.127c40.608,0,73.441-32.883,73.441-73.449 c0-16.058-5.274-30.776-14.027-42.895c29.279-9.658,50.513-36.881,50.513-69.385c0-40.566-32.85-73.433-73.433-73.433 c-7.774,0-15.137,1.522-22.114,3.718C329.235,32.718,296.493,0,255.991,0c-40.475,0-73.259,32.718-73.416,73.153 c-6.976-2.196-14.339-3.718-22.105-3.718c-40.592,0-73.441,32.866-73.441,73.433C87.029,175.371,108.263,202.594,137.542,212.252z M255.991,141.624c21.119,0,38.239,17.104,38.239,38.214c0,21.101-17.12,38.205-38.239,38.205 c-21.101,0-38.238-17.104-38.238-38.205C217.754,158.728,234.891,141.624,255.991,141.624z" stroke="#fff" stroke-width="40" fill="#f8c2a6"/>
    //     </svg>
    //     <svg class="role2" xmlns="http://www.w3.org/2000/svg" viewBox="86.5759 336.449 337.9 195.6" width="23" height="23">
    //     <path d="M373.479,356.452c-48.053,0.33-90.602,23.389-117.61,58.904c-27.469-35.154-70.331-57.637-118.392-57.325 c-10.589,0.074-20.905,1.259-30.859,3.439c0,0.856-0.05,1.704-0.041,2.576c0.551,82.251,67.674,148.502,149.942,147.951 c82.269-0.552,148.511-67.682,147.96-149.942c-0.009-0.864-0.066-1.72-0.09-2.574C394.417,357.439,384.067,356.386,373.479,356.452 z" stroke="#fff" stroke-width="40" fill="#d0ceb3"/>
    //   </svg>`;
    //     break;
    //   case "viewer":
    //     roleImage.innerHTML = `<svg width="35px" height="35px" viewBox="-1.6 -2 19.20 19.20" xmlns="http://www.w3.org/2000/svg" fill="#000000">
    //     <g id="SVGRepo_bgCarrier" stroke-width="0">
    //     </g>
    //     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="white" stroke-width="3"> <path fill="#000000" fill-rule="evenodd" d="M13.3256006,7.32558062 C12.0516006,8.59953062 10.3124006,8.94299062 9,8.99311062 L9,14 C9,14.5523006 8.55228062,15 8,15 C7.44772062,15 7,14.5523006 7,14 L7,10.9931006 C5.68757062,10.9430006 3.94837062,10.5995006 2.67442062,9.32558062 C0.348837624,7 1.12403062,3.12403062 1.12403062,3.12403062 C1.12403062,3.12403062 5,2.34884062 7.32558062,4.67442062 C7.35231062,4.70114062 7.37862062,4.72808062 7.40454062,4.75520062 C7.65733062,4.02001062 8.05637062,3.29246062 8.67442062,2.67442062 C11,0.348837624 14.8760006,1.12403062 14.8760006,1.12403062 C14.8760006,1.12403062 15.6512006,5 13.3256006,7.32558062 Z M9.00920062,6.99080062 C9.07159062,6.98768062 9.13502062,6.98371062 9.19932062,6.97876062 C10.2275006,6.89967062 11.2265006,6.59628062 11.9114006,5.91137062 C12.5963006,5.22645062 12.8997006,4.22752062 12.9788006,3.19932062 C12.9837006,3.13502062 12.9877006,3.07159062 12.9908006,3.00920062 C12.9284006,3.01232062 12.8650006,3.01629062 12.8007006,3.02124062 C11.7725006,3.10033062 10.7735006,3.40372062 10.0886006,4.08863062 C9.40372062,4.77355062 9.10033062,5.77248062 9.02124062,6.80068062 C9.01629062,6.86498062 9.01232062,6.92841062 9.00920062,6.99080062 Z M6.80068062,8.97876062 C6.86498062,8.98371062 6.92841062,8.98768062 6.99080062,8.99080062 C6.98768062,8.92841062 6.98371062,8.86498062 6.97876062,8.80068062 C6.89967062,7.77248062 6.59628062,6.77355062 5.91137062,6.08863062 C5.22645062,5.40372062 4.22752062,5.10033062 3.19932062,5.02124062 C3.13502062,5.01629062 3.07159062,5.01232062 3.00920062,5.00920062 C3.01232062,5.07159062 3.01629062,5.13502062 3.02124062,5.19932062 C3.10033062,6.22752062 3.40372062,7.22645062 4.08863062,7.91137062 C4.77355062,8.59628062 5.77248062,8.89967062 6.80068062,8.97876062 Z">
    //     </path> </g><g id="SVGRepo_iconCarrier"> <path fill="#d0ceb3" fill-rule="evenodd" d="M13.3256006,7.32558062 C12.0516006,8.59953062 10.3124006,8.94299062 9,8.99311062 L9,14 C9,14.5523006 8.55228062,15 8,15 C7.44772062,15 7,14.5523006 7,14 L7,10.9931006 C5.68757062,10.9430006 3.94837062,10.5995006 2.67442062,9.32558062 C0.348837624,7 1.12403062,3.12403062 1.12403062,3.12403062 C1.12403062,3.12403062 5,2.34884062 7.32558062,4.67442062 C7.35231062,4.70114062 7.37862062,4.72808062 7.40454062,4.75520062 C7.65733062,4.02001062 8.05637062,3.29246062 8.67442062,2.67442062 C11,0.348837624 14.8760006,1.12403062 14.8760006,1.12403062 C14.8760006,1.12403062 15.6512006,5 13.3256006,7.32558062 Z M9.00920062,6.99080062 C9.07159062,6.98768062 9.13502062,6.98371062 9.19932062,6.97876062 C10.2275006,6.89967062 11.2265006,6.59628062 11.9114006,5.91137062 C12.5963006,5.22645062 12.8997006,4.22752062 12.9788006,3.19932062 C12.9837006,3.13502062 12.9877006,3.07159062 12.9908006,3.00920062 C12.9284006,3.01232062 12.8650006,3.01629062 12.8007006,3.02124062 C11.7725006,3.10033062 10.7735006,3.40372062 10.0886006,4.08863062 C9.40372062,4.77355062 9.10033062,5.77248062 9.02124062,6.80068062 C9.01629062,6.86498062 9.01232062,6.92841062 9.00920062,6.99080062 Z M6.80068062,8.97876062 C6.86498062,8.98371062 6.92841062,8.98768062 6.99080062,8.99080062 C6.98768062,8.92841062 6.98371062,8.86498062 6.97876062,8.80068062 C6.89967062,7.77248062 6.59628062,6.77355062 5.91137062,6.08863062 C5.22645062,5.40372062 4.22752062,5.10033062 3.19932062,5.02124062 C3.13502062,5.01629062 3.07159062,5.01232062 3.00920062,5.00920062 C3.01232062,5.07159062 3.01629062,5.13502062 3.02124062,5.19932062 C3.10033062,6.22752062 3.40372062,7.22645062 4.08863062,7.91137062 C4.77355062,8.59628062 5.77248062,8.89967062 6.80068062,8.97876062 Z"></path> </g></svg>`;
    //     break;
    // }
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

    const amount = this.amount;
    const sender = this.event.name;
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

    let thanks = "Thank you for being a supporter!";

    if (fieldData.thanksMessage != "") {
      thanks = fieldData.thanksMessage;
    }

    const nameAndText = `${text}`;
    const nameContainer = document.createElement("p");
    const thanksMessage = document.createElement("p");
    thanksMessage.classList.add("thanks-message");
    thanksMessage.innerText = thanks;
    const thanksAndNameContainer = document.createElement("div");
    thanksAndNameContainer.classList.add("thanks-and-name-container");

    nameContainer.classList.add("event-name");
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");

    thanksAndNameContainer.appendChild(nameContainer);
    thanksAndNameContainer.appendChild(thanksMessage);

    mainContainer.appendChild(thanksAndNameContainer);
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

  elem.style.animationName = "removeMessage";
  setTimeout(() => {
    elem.remove();
  }, 1000);
};

let repeatedEvents = 0;
let maxEvents = 0;
let isBulk = false;

window.addEventListener("onEventReceived", async (obj) => {
  let { listener, event } = obj.detail;

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
