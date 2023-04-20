// let fieldData = {};
let currentEvent = null;
let initialBorder = "purple";

const PRONOUNS_API_BASE = "https://pronouns.alejo.io/api";
const PRONOUNS_API = {
  user: (username) => `${PRONOUNS_API_BASE}/users/${username}`,
  pronouns: `${PRONOUNS_API_BASE}/pronouns`,
};

class Message {
  constructor(message) {
    this.message = message;
    this.color = this.toggleBorder();
  }

  async init() {
    this.roleImages;
    let idSelector = this.ids;
    return await this.createMainContainerElement();
  }

  toggleBorder() {
    if (initialBorder == "pink") {
      initialBorder = "purple";
    } else {
      initialBorder = "pink";
    }

    return initialBorder;
  }

  get id() {
    return this.message.data.tags.id;
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

    switch (minPriorityRole.role) {
      case "streamer":
        roleImage.innerHTML = `<svg width="40px" height="40px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke=""><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.624"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="8" stroke="#fe9ba0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle> <path d="M8.39864 4.84867C5.37158 2.58215 2.97238 1.48892 2.23065 2.23065C1.05676 3.40454 4.47902 8.73006 9.87448 14.1255C15.2699 19.521 20.5955 22.9432 21.7693 21.7693C22.2003 21.3384 22.0118 20.348 21.3337 19" stroke="#fe9ba0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
        break;
      case "mod":
        roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
        <svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#b5fbff'></path></g></g></g></svg>`;
        break;
      case "vip":
        roleImage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-comet" width="40" height="40" viewBox="0 0 24 24" stroke-width="2" stroke="#ff6fed" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M15.5 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z" fill='none'></path>
        <path d="M4 4l7 7"></path>
        <path d="M9 4l3.5 3.5"></path>
        <path d="M4 9l3.5 3.5"></path>
        </svg>`;
        break;
      case "sub":
        roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?><svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
        <title>moon_stars_fill</title>
        <g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Weather' transform='translate(-528.000000, -48.000000)' fill-rule='nonzero'>
        <g id='moon_stars_fill' transform='translate(528.000000, 48.000000)'>
        <path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'>
        </path><path d='M12.4769,4.54557 C12.1415,3.79855 12.7837,2.99779 13.5739,3.13729 C17.7941,3.88225 21,7.5657 21,12 C21,16.9705 16.9705,21 12,21 C7.5657,21 3.88225,17.7941 3.13729,13.5739 C2.99778,12.7836 3.79861,12.1416 4.54557,12.4769 C5.29352,12.8127 6.12352,13 6.99996,13 C10.3137,13 13,10.3137 13,6.99996 C13,6.12352 12.8127,5.29352 12.4769,4.54557 Z M5.56482,7.71573 L5.62857,7.85506 L5.62857,7.85506 C5.90134,8.41936 6.33105,8.89305 6.86601,9.21934 L6.96534,9.27755 C7.0115,9.30351 7.0115,9.36997 6.96534,9.39593 L6.86601,9.45414 C6.33105,9.78043 5.90134,10.2541 5.62857,10.8184 L5.56482,10.9577 L5.56482,10.9577 C5.53984,11.0139 5.46007,11.0139 5.4351,10.9577 L5.37134,10.8184 L5.37134,10.8184 C5.09857,10.2541 4.66887,9.78043 4.13391,9.45414 L4.03457,9.39593 L4.03457,9.39593 C3.98842,9.36997 3.98842,9.30351 4.03457,9.27755 L4.13391,9.21934 L4.13391,9.21934 C4.66887,8.89305 5.09857,8.41936 5.37134,7.85506 L5.4351,7.71573 L5.4351,7.71573 C5.46007,7.65953 5.53984,7.65953 5.56482,7.71573 Z M8.39662,2.85738 C8.43638,2.76792 8.56335,2.76792 8.6031,2.85738 L8.70458,3.07914 L8.70458,3.07914 C9.13876,3.97736 9.82274,4.73135 10.6743,5.25072 L10.8324,5.34337 L10.8324,5.34337 C10.9058,5.38469 10.9058,5.49048 10.8324,5.5318 L10.6743,5.62445 L10.6743,5.62445 C9.82274,6.14382 9.13876,6.89781 8.70458,7.79603 C8.66919,7.86924 8.63613,7.94349 8.6031,8.0178 C8.56335,8.10725 8.43638,8.10725 8.39662,8.0178 L8.29515,7.79603 L8.29515,7.79603 C7.86097,6.89781 7.17699,6.14382 6.32548,5.62445 L6.16736,5.5318 L6.16736,5.5318 C6.09389,5.49048 6.09389,5.38469 6.16736,5.34337 L6.32548,5.25072 L6.32548,5.25072 C7.17699,4.73135 7.86097,3.97736 8.29515,3.07914 L8.39662,2.85738 L8.39662,2.85738 Z' fill='#ffe6bb'></path></g></g></g></svg>`;
        break;
      case "viewer":
        roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
        <svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
        <title>message_3_line</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
        <g id='Contact' transform='translate(-432.000000, 0.000000)' fill-rule='nonzero'>
        <g id='message_3_line' transform='translate(432.000000, 0.000000)'>
        <path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M13.5,3 C18.1944,3 22,6.80558 22,11.5 C22,16.1944 18.1944,20 13.5,20 L13,20 L13,20.99 C13,21.5477 12.5477,22.0005 11.989,22 C9.52884,21.9976 7.03691,21.1771 5.14647,19.4959 C3.23771,17.7984 2.0022,15.2749 2,12.0087 L2,11.5 C2,6.80558 5.80558,3 10.5,3 L13.5,3 Z M13.5,5 L10.5,5 C6.91015,5 4,7.91015 4,11.5 L4.00124,12.1647 L4.00124,12.1647 C4.04119,14.8074 5.04228,16.7268 6.47556,18.0014 C7.71401,19.1028 9.31744,19.759 11,19.945 L11,19.01 C11,18.4522 11.4522,18 12.01,18 L13.5,18 C17.0899,18 20,15.0899 20,11.5 C20,7.91015 17.0899,5 13.5,5 Z M8.5,10 C9.32843,10 10,10.6716 10,11.5 C10,12.3284 9.32843,13 8.5,13 C7.67157,13 7,12.3284 7,11.5 C7,10.6716 7.67157,10 8.5,10 Z M15.5,10 C16.3284,10 17,10.6716 17,11.5 C17,12.3284 16.3284,13 15.5,13 C14.6716,13 14,12.3284 14,11.5 C14,10.6716 14.6716,10 15.5,10 Z' fill='#d19afe'></path></g></g></g></svg>`;
        break;
    }
    return roleImage;
  }

  get borderDecorationImg() {
    const borderDecoration = document.createElement("img");
    borderDecoration.src = "https://i.postimg.cc/vmrC6rtk/constelacion.png";
    borderDecoration.classList.add("border-decoration-img");
    return borderDecoration;
  }

  get identifierImg() {
    const identifierImg = document.createElement("img");
    identifierImg.src = "";
    identifierImg.classList.add("identifier-img");
    return identifierImg;
  }

  get renderedText() {
    return this.message.data.renderedText;
  }

  get data() {
    return this.message.data;
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
    if(animation === "false") {
      superMainContainer.style.animationName = "";
    } else {
      superMainContainer.style.animationName = "twinkle";
    }
    superMainContainer.classList.add("super-main-container");
    mainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("main-container");

    let color = this.color;
    if (this.themeColor() == "purple") {
      if (color == "pink") {
        mainContainer.classList.add("purple-background");
      } else {
        mainContainer.classList.add("pink-background");
      }
    } else {
      if (color == "purple") {
        mainContainer.classList.add("purple-border");
      } else {
        mainContainer.classList.add("pink-border");
      }
    }

    mainContainer.appendChild(this.createBorderDecorationContainer());
    mainContainer.appendChild(await this.createUsernameInfoElement());
    mainContainer.appendChild(await this.createMessageContainerElement());
    mainContainer.appendChild(this.createBarElement());
    mainContainer.appendChild(this.createDecorationElement());
    mainContainer.appendChild(await this.createPronounsContainer());
    superMainContainer.appendChild(mainContainer);

    return superMainContainer;
  }

  createBorderDecorationContainer() {
    const borderDecoration = document.createElement("span");
    borderDecoration.classList.add("border-decoration-container");
    borderDecoration.appendChild(this.borderDecorationImg);
    return borderDecoration;
  }

  createRoleContainer() {
    const roleContainer = document.createElement("span");
    roleContainer.classList.add("role-container");
    roleContainer.appendChild(this.roleImages);
    return roleContainer;
  }

  async createUsernameInfoElement() {
    const usernameInfo = document.createElement("div");
    const usernameInfoContainer = document.createElement("div");
    usernameInfoContainer.classList.add("username-info-container");
    usernameInfo.classList.add("username-info");
    const color = this.color;
    if (this.themeColor() == "purple") {
      usernameInfo.classList.add("low-opacity");
      if (color == "purple") {
        usernameInfo.classList.add("purple-background");
      } else {
        usernameInfo.classList.add("pink-background");
      }
    }
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    usernameInfoContainer.appendChild(this.createRoleContainer());
    usernameInfoContainer.appendChild(usernameInfo);
    // usernameInfoContainer.appendChild(await this.createPronounsContainer());
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
    messageIconContainer.appendChild(this.createMessageIconElement());
    messageIconContainer.appendChild(await this.createRenderedTextElement());
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

    const starContainer = document.createElement("div");
    const leftStar = document.createElement("svg");
    const rightStar = document.createElement("svg");
    rightStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";
    leftStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";

    leftStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;

    rightStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;
    leftStar.classList.add("left-star");
    rightStar.classList.add("right-star");
    const leftStarContainer = document.createElement("div");
    const rightStarContainer = document.createElement("div");

    leftStarContainer.classList.add("left-star-container");
    leftStarContainer.appendChild(leftStar);

    rightStarContainer.classList.add("right-star-container");
    rightStarContainer.appendChild(rightStar);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("follow-name");
    nameContainer.innerText = nameAndText;

    starContainer.classList.add("star-container");
    starContainer.appendChild(leftStarContainer);
    starContainer.appendChild(nameContainer);
    starContainer.appendChild(rightStarContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(starContainer);

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

    const starContainer = document.createElement("div");
    const leftStar = document.createElement("svg");
    const rightStar = document.createElement("svg");
    rightStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";
    leftStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";

    leftStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;

    rightStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;
    leftStar.classList.add("left-star");
    rightStar.classList.add("right-star");
    const leftStarContainer = document.createElement("div");
    const rightStarContainer = document.createElement("div");

    leftStarContainer.classList.add("left-star-container");
    leftStarContainer.appendChild(leftStar);

    rightStarContainer.classList.add("right-star-container");
    rightStarContainer.appendChild(rightStar);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("bulk-name");
    nameContainer.innerText = nameAndText;

    starContainer.classList.add("star-container");
    starContainer.appendChild(leftStarContainer);
    starContainer.appendChild(nameContainer);
    starContainer.appendChild(rightStarContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(starContainer);

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
    } else {
      text = subText != "" ? subText : name + text;
      subText = subText.replace("(user)", name);
      text = subText;
    }

    nameAndText = `${text}`;

    const starContainer = document.createElement("div");
    const leftStar = document.createElement("svg");
    const rightStar = document.createElement("svg");
    rightStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";
    leftStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";

    leftStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;

    rightStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;
    leftStar.classList.add("left-star");
    rightStar.classList.add("right-star");
    const leftStarContainer = document.createElement("div");
    const rightStarContainer = document.createElement("div");

    leftStarContainer.classList.add("left-star-container");
    leftStarContainer.appendChild(leftStar);

    rightStarContainer.classList.add("right-star-container");
    rightStarContainer.appendChild(rightStar);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("sub-name");
    nameContainer.innerText = nameAndText;

    starContainer.classList.add("star-container");
    starContainer.appendChild(leftStarContainer);
    starContainer.appendChild(nameContainer);
    starContainer.appendChild(rightStarContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(starContainer);

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

    const starContainer = document.createElement("div");
    const leftStar = document.createElement("svg");
    const rightStar = document.createElement("svg");
    rightStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";
    leftStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";

    leftStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;

    rightStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;
    leftStar.classList.add("left-star");
    rightStar.classList.add("right-star");
    const leftStarContainer = document.createElement("div");
    const rightStarContainer = document.createElement("div");

    leftStarContainer.classList.add("left-star-container");
    leftStarContainer.appendChild(leftStar);

    rightStarContainer.classList.add("right-star-container");
    rightStarContainer.appendChild(rightStar);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("raid-name");
    nameContainer.innerText = nameAndText;

    starContainer.classList.add("star-container");
    starContainer.appendChild(leftStarContainer);
    starContainer.appendChild(nameContainer);
    starContainer.appendChild(rightStarContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(starContainer);

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

    const starContainer = document.createElement("div");
    const leftStar = document.createElement("svg");
    const rightStar = document.createElement("svg");
    rightStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";
    leftStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";

    leftStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;

    rightStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;
    leftStar.classList.add("left-star");
    rightStar.classList.add("right-star");
    const leftStarContainer = document.createElement("div");
    const rightStarContainer = document.createElement("div");

    leftStarContainer.classList.add("left-star-container");
    leftStarContainer.appendChild(leftStar);

    rightStarContainer.classList.add("right-star-container");
    rightStarContainer.appendChild(rightStar);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("cheer-name");
    nameContainer.innerText = nameAndText;

    starContainer.classList.add("star-container");
    starContainer.appendChild(leftStarContainer);
    starContainer.appendChild(nameContainer);
    starContainer.appendChild(rightStarContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(starContainer);

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

    const starContainer = document.createElement("div");
    const leftStar = document.createElement("svg");
    const rightStar = document.createElement("svg");
    rightStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";
    leftStar.style.filter =
      "drop-shadow(0 0 10px #d19afe) drop-shadow(0 0 10px #d19afe)";

    leftStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;

    rightStar.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
    <svg width='30px' height='30px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' id='路径' fill='#ffc4e6'></path></g></g></g></svg>`;
    leftStar.classList.add("left-star");
    rightStar.classList.add("right-star");
    const leftStarContainer = document.createElement("div");
    const rightStarContainer = document.createElement("div");

    leftStarContainer.classList.add("left-star-container");
    leftStarContainer.appendChild(leftStar);

    rightStarContainer.classList.add("right-star-container");
    rightStarContainer.appendChild(rightStar);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("tip-name");
    nameContainer.innerText = nameAndText;

    starContainer.classList.add("star-container");
    starContainer.appendChild(leftStarContainer);
    starContainer.appendChild(nameContainer);
    starContainer.appendChild(rightStarContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(starContainer);

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
    elem.style.animationName = "twinkleOut";
    elem.style.animationDuration = "0.5s";
    setTimeout(() => {
      elem.remove();
    }, 1000);
  }
};

const removeEvent = (mainContainer, event) => {
  const elem = mainContainer;
  console.log(elem.querySelector(`.${event}`));
  console.log(elem.querySelector(".left-star"));
  elem.querySelector(`.${event}`).style.animationName = "hideNames";
  elem.querySelector(".left-star-container").style.animationName =
    "hideLeftStar";
  elem.querySelector(".right-star-container").style.animationName =
    "hideRightStar";
  elem.querySelector(".left-star-container").style.animationDuration = "0.5s";
  elem.querySelector(".right-star-container").style.animationDuration = "0.5s";
  elem.querySelector(".right-star-container").style.animationFillMode =
    "forwards";
  elem.querySelector(".left-star-container").style.animationFillMode =
    "forwards";
  setTimeout(() => {
    elem.remove();
  }, 1000);
};

let repeatedEvents = 0;
let maxEvents = 0;
let isBulk = false;

window.addEventListener("onEventReceived", async (obj) => {
  let { listener, event } = obj.detail;
  if (event.bulkGifted) listener = "bulk";

  const mainCont = document.querySelector("main");

  if (isBulk && repeatedEvents < maxEvents) {
    repeatedEvents++;
    return;
  }

  repeatedEvents = 0;
  isBulk = false;
  maxEvents = 0;
  switch (listener) {
    case "bulk":
      maxEvents = event.count;
      isBulk = true;
      const bulk = new BulkGift(event);
      bulk
        .init()
        .then((bulkContainer) => {
          // setTimeout(() => {
          //   removeEvent(bulkContainer, "bulk");
          // }, fieldData.deleteMessages * 1000);
          mainCont.appendChild(bulkContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    case "message":
      const message = new Message(event);
      message
        .init()
        .then((mainContainer) => {
          // setTimeout(() => {
          //   removeMessage(mainContainer);
          // }, fieldData.deleteMessages * 1000);
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
          // setTimeout(() => {
          //   removeEvent(followContainer, "follow-name");
          // }, fieldData.deleteMessages * 1000);
          mainCont.appendChild(followContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    case "subscriber-latest":
      const sub = new Sub(event);
      sub
        .init()
        .then((subContainer) => {
          // setTimeout(() => {
          //   removeEvent(subContainer, "sub-name");
          // }, fieldData.deleteMessages * 1000);
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
          // setTimeout(() => {
          //   removeEvent(raidContainer, "raid-name");
          // }, fieldData.deleteMessages * 1000);
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
          // setTimeout(() => {
          //   removeEvent(cheerContainer, "cheer-name");
          // }, fieldData.deleteMessages * 1000);
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
          // setTimeout(() => {
          //   removeEvent(tipContainer, "tip-name");
          // }, fieldData.deleteMessages * 1000);
          mainCont.appendChild(tipContainer);
        })
        .finally(() => {
          $("main").scrollTop($("main")[0].scrollHeight);
        });
      break;
    default:
      return;
  }
});
