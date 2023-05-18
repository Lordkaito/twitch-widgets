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
  }

  async init() {
    this.roleImages;
    return await this.createMainContainerElement();
  }

  themeColor() {
    const theme = fieldData.theme;
    let colorObj = {};
    if (theme == "pink") {
      colorObj = {
        messageBackground: "#faaac5",
        userColor: "#faaac5",
        userBackground: "#fff",
        pronsColor: "#faaac5",
        iconBackground: "#9da0f5",
        textColor: "#d55482",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    } else {
      colorObj = {
        messageBackground: "#c4c8ff",
        userColor: "#9da0f5",
        userBackground: "#fff",
        pronsColor: "#9da0f5",
        iconBackground: "#9da0f5",
        textColor: "#686bb7",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    }
    return colorObj;
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

  get icon() {
    const pinkPaw = "https://i.postimg.cc/26mxNNZ9/huella2.png";
    const purplePaw = "https://i.postimg.cc/Y2zs9b2m/huella1.png";
    if (fieldData.theme == "pink") {
      return pinkPaw;
    }
    return purplePaw;
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
        roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
        <svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>star_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Shape' transform='translate(-240.000000, -48.000000)' fill-rule='nonzero'><g id='star_fill' transform='translate(240.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path d='M10.9198,2.8677 C11.402,2.03987 12.598,2.03987 13.0801,2.8677 L15.8751,7.66643 L21.3027,8.84175 C22.239,9.0445 22.6086,10.1819 21.9703,10.8963 L18.2701,15.0374 L18.8295,20.5625 C18.926,21.5156 17.9585,22.2186 17.0818,21.8323 L12,19.5929 L6.91816,21.8323 C6.04149,22.2186 5.07395,21.5156 5.17046,20.5625 L5.72987,15.0374 L2.02972,10.8963 C1.3914,10.1819 1.76097,9.0445 2.69728,8.84175 L8.12484,7.66643 L10.9198,2.8677 Z' fill='#ffc976' stroke='white' stroke-width='1.5'></path></g></g></g></svg>`;
        break;
      case "mod":
        if (this.isSub) {
          roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
          <svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g id='Icon' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
          <g id='Nature' transform='translate(-48.000000, -144.000000)'>
          <g id='cat_fill' transform='translate(48.000000, 144.000000)'>
          <path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5935,23.2578 L12.5819,23.2595 L12.5109,23.295 L12.4919,23.2987 L12.4767,23.295 L12.4057,23.2595 C12.3958,23.2564 12.387,23.259 12.3821,23.2649 L12.378,23.2758 L12.3609,23.7031 L12.3659,23.7235 L12.3769,23.7357 L12.4805,23.8097 L12.4953,23.8136 L12.5071,23.8097 L12.6107,23.7357 L12.6233,23.7197 L12.6267,23.7031 L12.6096,23.2758 C12.6076,23.2657 12.601,23.2593 12.5935,23.2578 Z M12.8584,23.1453 L12.8445,23.1473 L12.6598,23.2397 L12.6499,23.2499 L12.6472,23.2611 L12.6651,23.6906 L12.6699,23.7034 L12.6784,23.7105 L12.8793,23.8032 C12.8914,23.8069 12.9022,23.803 12.9078,23.7952 L12.9118,23.7812 L12.8777,23.1665 C12.8753,23.1546 12.8674,23.147 12.8584,23.1453 Z M12.143,23.1473 C12.1332,23.1424 12.1222,23.1453 12.1156,23.1526 L12.1099,23.1665 L12.0758,23.7812 C12.0751,23.7927 12.0828,23.8019 12.0926,23.8046 L12.1083,23.8032 L12.3092,23.7105 L12.3186,23.7024 L12.3225,23.6906 L12.3404,23.2611 L12.3372,23.2485 L12.3278,23.2397 L12.143,23.1473 Z' id='MingCute' fill-rule='nonzero'>
          </path>
		  <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='11' y='10'></rect>
          <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='8' y='10'></rect>
          <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='10' y='12'></rect>
		  <path d='M18.2955,3.0447 C18.6499,3.15433 18.9145,3.45113 18.9829,3.81574 L20.3243,10.9699 C20.4531,11.6568 20.4954,12.3369 20.4598,12.9999999 L21,12.9999999 C21.5523,12.9999999 22,13.4477 22,13.9999999 C22,14.5523 21.5523,14.9999999 21,14.9999999 L20.1056,14.9999999 C19.9612,15.472 19.7763,15.9278 19.5546,16.3631 L20.6247,17.2191 C21.056,17.5641 21.1259,18.1934 20.7809,18.6247 C20.4359,19.056 19.8066,19.1259 19.3753,18.7809 L18.4393,18.0321 C16.899,19.8355 14.6071,20.9999999 12,20.9999999 C9.39284,20.9999999 7.10098,19.8355 5.56069,18.0321 L4.6247,18.7809 C4.19343,19.1259 3.56414,19.056 3.21913,18.6247 C2.87412,18.1934 2.94404,17.5641 3.3753,17.2191 L4.44534,16.3631 C4.22364,15.9279 4.03875,15.472 3.89441,14.9999999 L3,14.9999999 C2.44772,14.9999999 2,14.5523 2,13.9999999 C2,13.4477 2.44772,12.9999999 3,12.9999999 L3.5402,12.9999999 C3.50454,12.3369 3.54691,11.6568 3.67571,10.9699 L5.01712,3.81574 C5.08548,3.45113 5.35006,3.15433 5.70444,3.0447 C6.05883,2.93506 6.44479,3.03061 6.7071,3.29292 L9.12131,5.70713 C9.30884,5.89467 9.5632,6.00003 9.82842,6.00003 L14.1716,6.00003 C14.4368,6.00003 14.6911,5.89467 14.8787,5.70713 L17.2929,3.29292 C17.5552,3.03061 17.9411,2.93506 18.2955,3.0447 Z M12.5528,14.6056 L12,14.882 L11.4472,14.6056 C10.9532,14.3586 10.3526,14.5588 10.1056,15.0528 C9.85858,15.5468 10.0588,16.1474 10.5528,16.3944 L11.1056,16.6708 C11.6686,16.9523 12.3314,16.9523 12.8944,16.6708 L13.4472,16.3944 C13.9412,16.1474 14.1414,15.5468 13.8944,15.0528 C13.6474,14.5588 13.0468,14.3586 12.5528,14.6056 Z M9.5,10 C8.67157,10 8,10.6716 8,11.5 C8,12.3284 8.67157,13 9.5,13 C10.3284,13 11,12.3284 11,11.5 C11,10.6716 10.3284,10 9.5,10 Z M14.5,10 C13.6716,10 13,10.6716 13,11.5 C13,12.3284 13.6716,13 14.5,13 C15.3284,13 16,12.3284 16,11.5 C16,10.6716 15.3284,10 14.5,10 Z' fill='#6dc464' stroke='white' stroke-width='1'></path></g></g></g></svg>`;
          break;
        }

        roleImage.innerHTML = `<?xml version="1.0" encoding="iso-8859-1"?>
        <svg fill="#6dc464" stroke='white' stroke-width='20' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40px" height="40px" viewBox="-58.52 -58.52 702.26 602.26" xml:space="preserve">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fff" stroke-width="58.5225"> <g> <g id="Layer_1_134_"> <g> <path d="M489.6,36.975c-44.625,0-81.6,30.6-90.525,71.4H183.6c-10.2-40.8-47.175-71.4-90.525-71.4 C42.075,36.975,0,79.049,0,130.049c0,35.7,20.4,67.575,51,82.875V313.65c0,130.049,112.2,234.6,242.25,234.6 c130.051,0,242.25-104.551,242.25-234.6V212.924c29.324-15.3,49.725-47.175,49.725-82.875 C583.949,79.049,541.875,36.975,489.6,36.975z M169.575,229.5c0-14.025,11.475-26.775,26.775-26.775s26.775,11.475,26.775,26.775 s-11.475,26.775-26.775,26.775S169.575,244.799,169.575,229.5z M290.7,502.35c-48.45,0-89.25-52.275-89.25-116.025 s39.525-116.025,89.25-116.025c49.726,0,89.249,52.275,89.249,116.025S340.426,502.35,290.7,502.35z M386.324,256.274 c-15.299,0-26.773-11.475-26.773-26.775c0-14.025,11.475-26.775,26.773-26.775c14.025,0,26.775,11.475,26.775,26.775 S401.625,256.274,386.324,256.274z"></path> <path d="M244.8,337.875c-7.65,0-15.3,3.824-17.85,10.199c-2.55,7.65-1.275,15.301,3.825,20.4l45.9,45.9 c7.65,7.65,20.399,7.65,28.049,0l45.9-45.9c5.1-5.1,7.65-12.75,3.824-20.4c-2.549-7.65-10.199-10.199-17.85-10.199H244.8z"></path> </g> </g> </g> </g><g id="SVGRepo_iconCarrier"> <g> <g id="Layer_1_134_"> <g> <path d="M489.6,36.975c-44.625,0-81.6,30.6-90.525,71.4H183.6c-10.2-40.8-47.175-71.4-90.525-71.4 C42.075,36.975,0,79.049,0,130.049c0,35.7,20.4,67.575,51,82.875V313.65c0,130.049,112.2,234.6,242.25,234.6 c130.051,0,242.25-104.551,242.25-234.6V212.924c29.324-15.3,49.725-47.175,49.725-82.875 C583.949,79.049,541.875,36.975,489.6,36.975z M169.575,229.5c0-14.025,11.475-26.775,26.775-26.775s26.775,11.475,26.775,26.775 s-11.475,26.775-26.775,26.775S169.575,244.799,169.575,229.5z M290.7,502.35c-48.45,0-89.25-52.275-89.25-116.025 s39.525-116.025,89.25-116.025c49.726,0,89.249,52.275,89.249,116.025S340.426,502.35,290.7,502.35z M386.324,256.274 c-15.299,0-26.773-11.475-26.773-26.775c0-14.025,11.475-26.775,26.773-26.775c14.025,0,26.775,11.475,26.775,26.775 S401.625,256.274,386.324,256.274z"></path> <path d="M244.8,337.875c-7.65,0-15.3,3.824-17.85,10.199c-2.55,7.65-1.275,15.301,3.825,20.4l45.9,45.9 c7.65,7.65,20.399,7.65,28.049,0l45.9-45.9c5.1-5.1,7.65-12.75,3.824-20.4c-2.549-7.65-10.199-10.199-17.85-10.199H244.8z"></path> </g> </g> </g> </g></svg>`;
        break;
      case "vip":
        if (this.isSub) {
          roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
          <svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g id='Icon' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
          <g id='Nature' transform='translate(-48.000000, -144.000000)'>
          <g id='cat_fill' transform='translate(48.000000, 144.000000)'>
          <path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5935,23.2578 L12.5819,23.2595 L12.5109,23.295 L12.4919,23.2987 L12.4767,23.295 L12.4057,23.2595 C12.3958,23.2564 12.387,23.259 12.3821,23.2649 L12.378,23.2758 L12.3609,23.7031 L12.3659,23.7235 L12.3769,23.7357 L12.4805,23.8097 L12.4953,23.8136 L12.5071,23.8097 L12.6107,23.7357 L12.6233,23.7197 L12.6267,23.7031 L12.6096,23.2758 C12.6076,23.2657 12.601,23.2593 12.5935,23.2578 Z M12.8584,23.1453 L12.8445,23.1473 L12.6598,23.2397 L12.6499,23.2499 L12.6472,23.2611 L12.6651,23.6906 L12.6699,23.7034 L12.6784,23.7105 L12.8793,23.8032 C12.8914,23.8069 12.9022,23.803 12.9078,23.7952 L12.9118,23.7812 L12.8777,23.1665 C12.8753,23.1546 12.8674,23.147 12.8584,23.1453 Z M12.143,23.1473 C12.1332,23.1424 12.1222,23.1453 12.1156,23.1526 L12.1099,23.1665 L12.0758,23.7812 C12.0751,23.7927 12.0828,23.8019 12.0926,23.8046 L12.1083,23.8032 L12.3092,23.7105 L12.3186,23.7024 L12.3225,23.6906 L12.3404,23.2611 L12.3372,23.2485 L12.3278,23.2397 L12.143,23.1473 Z' id='MingCute' fill-rule='nonzero'>
          </path>
		  <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='11' y='10'></rect>
          <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='8' y='10'></rect>
          <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='10' y='12'></rect>
		  <path d='M18.2955,3.0447 C18.6499,3.15433 18.9145,3.45113 18.9829,3.81574 L20.3243,10.9699 C20.4531,11.6568 20.4954,12.3369 20.4598,12.9999999 L21,12.9999999 C21.5523,12.9999999 22,13.4477 22,13.9999999 C22,14.5523 21.5523,14.9999999 21,14.9999999 L20.1056,14.9999999 C19.9612,15.472 19.7763,15.9278 19.5546,16.3631 L20.6247,17.2191 C21.056,17.5641 21.1259,18.1934 20.7809,18.6247 C20.4359,19.056 19.8066,19.1259 19.3753,18.7809 L18.4393,18.0321 C16.899,19.8355 14.6071,20.9999999 12,20.9999999 C9.39284,20.9999999 7.10098,19.8355 5.56069,18.0321 L4.6247,18.7809 C4.19343,19.1259 3.56414,19.056 3.21913,18.6247 C2.87412,18.1934 2.94404,17.5641 3.3753,17.2191 L4.44534,16.3631 C4.22364,15.9279 4.03875,15.472 3.89441,14.9999999 L3,14.9999999 C2.44772,14.9999999 2,14.5523 2,13.9999999 C2,13.4477 2.44772,12.9999999 3,12.9999999 L3.5402,12.9999999 C3.50454,12.3369 3.54691,11.6568 3.67571,10.9699 L5.01712,3.81574 C5.08548,3.45113 5.35006,3.15433 5.70444,3.0447 C6.05883,2.93506 6.44479,3.03061 6.7071,3.29292 L9.12131,5.70713 C9.30884,5.89467 9.5632,6.00003 9.82842,6.00003 L14.1716,6.00003 C14.4368,6.00003 14.6911,5.89467 14.8787,5.70713 L17.2929,3.29292 C17.5552,3.03061 17.9411,2.93506 18.2955,3.0447 Z M12.5528,14.6056 L12,14.882 L11.4472,14.6056 C10.9532,14.3586 10.3526,14.5588 10.1056,15.0528 C9.85858,15.5468 10.0588,16.1474 10.5528,16.3944 L11.1056,16.6708 C11.6686,16.9523 12.3314,16.9523 12.8944,16.6708 L13.4472,16.3944 C13.9412,16.1474 14.1414,15.5468 13.8944,15.0528 C13.6474,14.5588 13.0468,14.3586 12.5528,14.6056 Z M9.5,10 C8.67157,10 8,10.6716 8,11.5 C8,12.3284 8.67157,13 9.5,13 C10.3284,13 11,12.3284 11,11.5 C11,10.6716 10.3284,10 9.5,10 Z M14.5,10 C13.6716,10 13,10.6716 13,11.5 C13,12.3284 13.6716,13 14.5,13 C15.3284,13 16,12.3284 16,11.5 C16,10.6716 15.3284,10 14.5,10 Z' fill='#e198f6' stroke='white' stroke-width='1'></path></g></g></g></svg>`;
          break;
        }
        roleImage.innerHTML = `<?xml version="1.0" encoding="iso-8859-1"?>
        <svg fill="#e198f6" stroke='white' stroke-width='20' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40px" height="40px" viewBox="-58.52 -58.52 702.26 602.26" xml:space="preserve">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fff" stroke-width="58.5225"> <g> <g id="Layer_1_134_"> <g> <path d="M489.6,36.975c-44.625,0-81.6,30.6-90.525,71.4H183.6c-10.2-40.8-47.175-71.4-90.525-71.4 C42.075,36.975,0,79.049,0,130.049c0,35.7,20.4,67.575,51,82.875V313.65c0,130.049,112.2,234.6,242.25,234.6 c130.051,0,242.25-104.551,242.25-234.6V212.924c29.324-15.3,49.725-47.175,49.725-82.875 C583.949,79.049,541.875,36.975,489.6,36.975z M169.575,229.5c0-14.025,11.475-26.775,26.775-26.775s26.775,11.475,26.775,26.775 s-11.475,26.775-26.775,26.775S169.575,244.799,169.575,229.5z M290.7,502.35c-48.45,0-89.25-52.275-89.25-116.025 s39.525-116.025,89.25-116.025c49.726,0,89.249,52.275,89.249,116.025S340.426,502.35,290.7,502.35z M386.324,256.274 c-15.299,0-26.773-11.475-26.773-26.775c0-14.025,11.475-26.775,26.773-26.775c14.025,0,26.775,11.475,26.775,26.775 S401.625,256.274,386.324,256.274z"></path> <path d="M244.8,337.875c-7.65,0-15.3,3.824-17.85,10.199c-2.55,7.65-1.275,15.301,3.825,20.4l45.9,45.9 c7.65,7.65,20.399,7.65,28.049,0l45.9-45.9c5.1-5.1,7.65-12.75,3.824-20.4c-2.549-7.65-10.199-10.199-17.85-10.199H244.8z"></path> </g> </g> </g> </g><g id="SVGRepo_iconCarrier"> <g> <g id="Layer_1_134_"> <g> <path d="M489.6,36.975c-44.625,0-81.6,30.6-90.525,71.4H183.6c-10.2-40.8-47.175-71.4-90.525-71.4 C42.075,36.975,0,79.049,0,130.049c0,35.7,20.4,67.575,51,82.875V313.65c0,130.049,112.2,234.6,242.25,234.6 c130.051,0,242.25-104.551,242.25-234.6V212.924c29.324-15.3,49.725-47.175,49.725-82.875 C583.949,79.049,541.875,36.975,489.6,36.975z M169.575,229.5c0-14.025,11.475-26.775,26.775-26.775s26.775,11.475,26.775,26.775 s-11.475,26.775-26.775,26.775S169.575,244.799,169.575,229.5z M290.7,502.35c-48.45,0-89.25-52.275-89.25-116.025 s39.525-116.025,89.25-116.025c49.726,0,89.249,52.275,89.249,116.025S340.426,502.35,290.7,502.35z M386.324,256.274 c-15.299,0-26.773-11.475-26.773-26.775c0-14.025,11.475-26.775,26.773-26.775c14.025,0,26.775,11.475,26.775,26.775 S401.625,256.274,386.324,256.274z"></path> <path d="M244.8,337.875c-7.65,0-15.3,3.824-17.85,10.199c-2.55,7.65-1.275,15.301,3.825,20.4l45.9,45.9 c7.65,7.65,20.399,7.65,28.049,0l45.9-45.9c5.1-5.1,7.65-12.75,3.824-20.4c-2.549-7.65-10.199-10.199-17.85-10.199H244.8z"></path> </g> </g> </g> </g></svg>`;
        break;
      case "sub":
        roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?>
          <svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
          <g id='Icon' fill='none' fill-rule='evenodd'>
          <g id='Nature' transform='translate(-48.000000, -144.000000)'>
          <g id='cat_fill' transform='translate(48.000000, 144.000000)'>
          <path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5935,23.2578 L12.5819,23.2595 L12.5109,23.295 L12.4919,23.2987 L12.4767,23.295 L12.4057,23.2595 C12.3958,23.2564 12.387,23.259 12.3821,23.2649 L12.378,23.2758 L12.3609,23.7031 L12.3659,23.7235 L12.3769,23.7357 L12.4805,23.8097 L12.4953,23.8136 L12.5071,23.8097 L12.6107,23.7357 L12.6233,23.7197 L12.6267,23.7031 L12.6096,23.2758 C12.6076,23.2657 12.601,23.2593 12.5935,23.2578 Z M12.8584,23.1453 L12.8445,23.1473 L12.6598,23.2397 L12.6499,23.2499 L12.6472,23.2611 L12.6651,23.6906 L12.6699,23.7034 L12.6784,23.7105 L12.8793,23.8032 C12.8914,23.8069 12.9022,23.803 12.9078,23.7952 L12.9118,23.7812 L12.8777,23.1665 C12.8753,23.1546 12.8674,23.147 12.8584,23.1453 Z M12.143,23.1473 C12.1332,23.1424 12.1222,23.1453 12.1156,23.1526 L12.1099,23.1665 L12.0758,23.7812 C12.0751,23.7927 12.0828,23.8019 12.0926,23.8046 L12.1083,23.8032 L12.3092,23.7105 L12.3186,23.7024 L12.3225,23.6906 L12.3404,23.2611 L12.3372,23.2485 L12.3278,23.2397 L12.143,23.1473 Z' id='MingCute' fill-rule='nonzero'>
          </path>
          <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='11' y='10'></rect>
          <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='8' y='10'></rect>
          <rect id='Rectangle' fill='#FFFFFF' width='5' height='5' x='10' y='12'></rect>
          <path d='M18.2955,3.0447 C18.6499,3.15433 18.9145,3.45113 18.9829,3.81574 L20.3243,10.9699 C20.4531,11.6568 20.4954,12.3369 20.4598,12.9999999 L21,12.9999999 C21.5523,12.9999999 22,13.4477 22,13.9999999 C22,14.5523 21.5523,14.9999999 21,14.9999999 L20.1056,14.9999999 C19.9612,15.472 19.7763,15.9278 19.5546,16.3631 L20.6247,17.2191 C21.056,17.5641 21.1259,18.1934 20.7809,18.6247 C20.4359,19.056 19.8066,19.1259 19.3753,18.7809 L18.4393,18.0321 C16.899,19.8355 14.6071,20.9999999 12,20.9999999 C9.39284,20.9999999 7.10098,19.8355 5.56069,18.0321 L4.6247,18.7809 C4.19343,19.1259 3.56414,19.056 3.21913,18.6247 C2.87412,18.1934 2.94404,17.5641 3.3753,17.2191 L4.44534,16.3631 C4.22364,15.9279 4.03875,15.472 3.89441,14.9999999 L3,14.9999999 C2.44772,14.9999999 2,14.5523 2,13.9999999 C2,13.4477 2.44772,12.9999999 3,12.9999999 L3.5402,12.9999999 C3.50454,12.3369 3.54691,11.6568 3.67571,10.9699 L5.01712,3.81574 C5.08548,3.45113 5.35006,3.15433 5.70444,3.0447 C6.05883,2.93506 6.44479,3.03061 6.7071,3.29292 L9.12131,5.70713 C9.30884,5.89467 9.5632,6.00003 9.82842,6.00003 L14.1716,6.00003 C14.4368,6.00003 14.6911,5.89467 14.8787,5.70713 L17.2929,3.29292 C17.5552,3.03061 17.9411,2.93506 18.2955,3.0447 Z M12.5528,14.6056 L12,14.882 L11.4472,14.6056 C10.9532,14.3586 10.3526,14.5588 10.1056,15.0528 C9.85858,15.5468 10.0588,16.1474 10.5528,16.3944 L11.1056,16.6708 C11.6686,16.9523 12.3314,16.9523 12.8944,16.6708 L13.4472,16.3944 C13.9412,16.1474 14.1414,15.5468 13.8944,15.0528 C13.6474,14.5588 13.0468,14.3586 12.5528,14.6056 Z M9.5,10 C8.67157,10 8,10.6716 8,11.5 C8,12.3284 8.67157,13 9.5,13 C10.3284,13 11,12.3284 11,11.5 C11,10.6716 10.3284,10 9.5,10 Z M14.5,10 C13.6716,10 13,10.6716 13,11.5 C13,12.3284 13.6716,13 14.5,13 C15.3284,13 16,12.3284 16,11.5 C16,10.6716 15.3284,10 14.5,10 Z' fill='#ff9eb9' stroke='white' stroke-width='1.3'></path></g></g></g></svg>`;
        break;
      case "viewer":
        roleImage.innerHTML = `<?xml version="1.0" encoding="iso-8859-1"?>
        <svg fill="#bc7e6d" stroke='white' stroke-width='20' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40px" height="40px" viewBox="-58.52 -58.52 702.26 602.26" xml:space="preserve">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fff" stroke-width="58.5225"> <g> <g id="Layer_1_134_"> <g> <path d="M489.6,36.975c-44.625,0-81.6,30.6-90.525,71.4H183.6c-10.2-40.8-47.175-71.4-90.525-71.4 C42.075,36.975,0,79.049,0,130.049c0,35.7,20.4,67.575,51,82.875V313.65c0,130.049,112.2,234.6,242.25,234.6 c130.051,0,242.25-104.551,242.25-234.6V212.924c29.324-15.3,49.725-47.175,49.725-82.875 C583.949,79.049,541.875,36.975,489.6,36.975z M169.575,229.5c0-14.025,11.475-26.775,26.775-26.775s26.775,11.475,26.775,26.775 s-11.475,26.775-26.775,26.775S169.575,244.799,169.575,229.5z M290.7,502.35c-48.45,0-89.25-52.275-89.25-116.025 s39.525-116.025,89.25-116.025c49.726,0,89.249,52.275,89.249,116.025S340.426,502.35,290.7,502.35z M386.324,256.274 c-15.299,0-26.773-11.475-26.773-26.775c0-14.025,11.475-26.775,26.773-26.775c14.025,0,26.775,11.475,26.775,26.775 S401.625,256.274,386.324,256.274z"></path> <path d="M244.8,337.875c-7.65,0-15.3,3.824-17.85,10.199c-2.55,7.65-1.275,15.301,3.825,20.4l45.9,45.9 c7.65,7.65,20.399,7.65,28.049,0l45.9-45.9c5.1-5.1,7.65-12.75,3.824-20.4c-2.549-7.65-10.199-10.199-17.85-10.199H244.8z"></path> </g> </g> </g> </g><g id="SVGRepo_iconCarrier"> <g> <g id="Layer_1_134_"> <g> <path d="M489.6,36.975c-44.625,0-81.6,30.6-90.525,71.4H183.6c-10.2-40.8-47.175-71.4-90.525-71.4 C42.075,36.975,0,79.049,0,130.049c0,35.7,20.4,67.575,51,82.875V313.65c0,130.049,112.2,234.6,242.25,234.6 c130.051,0,242.25-104.551,242.25-234.6V212.924c29.324-15.3,49.725-47.175,49.725-82.875 C583.949,79.049,541.875,36.975,489.6,36.975z M169.575,229.5c0-14.025,11.475-26.775,26.775-26.775s26.775,11.475,26.775,26.775 s-11.475,26.775-26.775,26.775S169.575,244.799,169.575,229.5z M290.7,502.35c-48.45,0-89.25-52.275-89.25-116.025 s39.525-116.025,89.25-116.025c49.726,0,89.249,52.275,89.249,116.025S340.426,502.35,290.7,502.35z M386.324,256.274 c-15.299,0-26.773-11.475-26.773-26.775c0-14.025,11.475-26.775,26.773-26.775c14.025,0,26.775,11.475,26.775,26.775 S401.625,256.274,386.324,256.274z"></path> <path d="M244.8,337.875c-7.65,0-15.3,3.824-17.85,10.199c-2.55,7.65-1.275,15.301,3.825,20.4l45.9,45.9 c7.65,7.65,20.399,7.65,28.049,0l45.9-45.9c5.1-5.1,7.65-12.75,3.824-20.4c-2.549-7.65-10.199-10.199-17.85-10.199H244.8z"></path> </g> </g> </g> </g></svg>`;
        break;
    }
    return roleImage;
  }

  get borderDecorationImg() {
    const borderDecoration = document.createElement("img");
    borderDecoration.src = "https://i.postimg.cc/fWHzqZPt/sobre-rosa.png";
    borderDecoration.classList.add("border-decoration-img");
    // return borderDecoration;
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
    superMainContainer.classList.add("super-main-container");
    mainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("main-container");
    mainContainer.style.backgroundColor = this.themeColor().messageBackground;

    const bigLine = document.createElement("div");
    bigLine.setAttribute("id", "big-line");
    const smallLine = document.createElement("div");
    smallLine.setAttribute("id", "small-line");
    const littlePaw = document.createElement("svg");
    littlePaw.setAttribute("id", "little-paw");
    littlePaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-moon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" stroke-width="0" fill="#ffeab7"></path></svg>`;

    const lines = document.createElement("div");
    lines.setAttribute("id", "lines");
    lines.appendChild(bigLine);
    lines.appendChild(smallLine);
    lines.appendChild(littlePaw);
    mainContainer.appendChild(lines);

    mainContainer.appendChild(await this.createUsernameInfoElement());
    mainContainer.appendChild(await this.createMessageContainerElement());
    mainContainer.appendChild(this.createBarElement());
    mainContainer.appendChild(this.createDecorationElement());
    superMainContainer.appendChild(lines);
    superMainContainer.appendChild(mainContainer);

    return superMainContainer;
  }

  createBorderDecorationContainer() {
    const borderDecoration = document.createElement("span");
    borderDecoration.classList.add("border-decoration-container");
    // borderDecoration.appendChild(this.borderDecorationImg);
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
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    // usernameInfoContainer.appendChild(this.createRoleContainer());
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
    const capitalizeUser = document.createElement("span");
    capitalizeUser.classList.add("capitalize-user");
    capitalizeUser.style.color = this.themeColor().userColor;
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

  get messageIcon() {
    const messageIcon = document.createElement("img");
    messageIcon.classList.add("message-icon");
    messageIcon.src = this.icon;
    return messageIcon;
  }

  createMessageIconElement() {
    const messageIconElement = document.createElement("div");
    messageIconElement.classList.add("icon");
    // messageIconElement.style.backgroundColor =
    //   this.themeColor().iconBackground;
    messageIconElement.appendChild(this.messageIcon);
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
    pronouns.style.color = this.themeColor().pronsColor;

    pronounsContainer.appendChild(pronouns);
    return pronounsContainer;
  }

  // themeColor() {
  //   let color = fieldData.theme;
  //   let colorObj =
  //     color === "purple"
  //       ? {
  //           messageBckg: "#333",
  //           messageText: "#333",
  //           messageIconBckg: "#333",
  //           userColor: "#333",
  //           pronsColor: "#333",
  //         }
  //       : {
  //           messageBckg: "red",
  //           messageText: "red",
  //           messageIconBckg: "pink",
  //           userColor: "red",
  //           pronsColor: "red",
  //         };

  //   return colorObj;
  // }

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
    textContainer.style.color = this.themeColor().textColor;
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

  themeColor() {
    const theme = fieldData.theme;
    let colorObj = {};
    if (theme == "pink") {
      colorObj = {
        messageBackground: "#faaac5",
        userColor: "#faaac5",
        userBackground: "#fff",
        pronsColor: "#faaac5",
        iconBackground: "#9da0f5",
        textColor: "#d55482",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    } else {
      colorObj = {
        messageBackground: "#c4c8ff",
        userColor: "#9da0f5",
        userBackground: "#fff",
        pronsColor: "#9da0f5",
        iconBackground: "#9da0f5",
        textColor: "#686bb7",
        borderColor: "#fff",
        shadow: "#686bb7",
      };
    }
    return colorObj;
  }

  get svgs() {
    const paws = document.createElement("svg");
    paws.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" stroke-width="0" fill="currentColor"></path></svg>`;
    paws.classList.add("paws");

    return paws;
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

    const pawsContainer = document.createElement("div");
    const leftPaw = document.createElement("svg");
    leftPaw.classList.add("left-paw");
    const leftPawContainer = document.createElement("div");
    leftPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    leftPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;
    const rightPaw = document.createElement("svg");
    rightPaw.classList.add("right-paw");
    rightPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    const rightPawContainer = document.createElement("div");
    rightPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;

    leftPawContainer.classList.add("left-paw-container");
    leftPawContainer.appendChild(leftPaw);

    rightPawContainer.classList.add("right-paw-container");
    rightPawContainer.appendChild(rightPaw);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("follow-name");
    nameContainer.style.textShadow = `0 0 0.2em ${
      this.themeColor().shadow
    }, 0 0 0.2em ${this.themeColor().shadow}`;
    nameContainer.innerText = nameAndText;

    pawsContainer.classList.add("paws-container");
    pawsContainer.appendChild(leftPawContainer);
    pawsContainer.appendChild(nameContainer);
    pawsContainer.appendChild(rightPawContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(pawsContainer);

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

  themeColor() {
    const theme = fieldData.theme;
    let colorObj = {};
    if (theme == "pink") {
      colorObj = {
        messageBackground: "#faaac5",
        userColor: "#faaac5",
        userBackground: "#fff",
        pronsColor: "#faaac5",
        iconBackground: "#9da0f5",
        textColor: "#d55482",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    } else {
      colorObj = {
        messageBackground: "#c4c8ff",
        userColor: "#9da0f5",
        userBackground: "#fff",
        pronsColor: "#9da0f5",
        iconBackground: "#9da0f5",
        textColor: "#686bb7",
        borderColor: "#fff",
        shadow: "#686bb7",
      };
    }
    return colorObj;
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
    const sender = this.sender;
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

    const pawsContainer = document.createElement("div");
    const leftPaw = document.createElement("svg");
    leftPaw.classList.add("left-paw");
    const leftPawContainer = document.createElement("div");
    leftPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    leftPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;
    const rightPaw = document.createElement("svg");
    rightPaw.classList.add("right-paw");
    const rightPawContainer = document.createElement("div");
    rightPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    rightPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;

    leftPawContainer.classList.add("left-paw-container");
    leftPawContainer.appendChild(leftPaw);

    rightPawContainer.classList.add("right-paw-container");
    rightPawContainer.appendChild(rightPaw);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("bulk-name");
    nameContainer.style.textShadow = `0 0 0.2em ${
      this.themeColor().shadow
    }, 0 0 0.2em ${this.themeColor().shadow}`;
    nameContainer.innerText = nameAndText;

    pawsContainer.classList.add("paws-container");
    pawsContainer.appendChild(leftPawContainer);
    pawsContainer.appendChild(nameContainer);
    pawsContainer.appendChild(rightPawContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(pawsContainer);

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

  themeColor() {
    const theme = fieldData.theme;
    let colorObj = {};
    if (theme == "pink") {
      colorObj = {
        messageBackground: "#faaac5",
        userColor: "#faaac5",
        userBackground: "#fff",
        pronsColor: "#faaac5",
        iconBackground: "#9da0f5",
        textColor: "#d55482",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    } else {
      colorObj = {
        messageBackground: "#c4c8ff",
        userColor: "#9da0f5",
        userBackground: "#fff",
        pronsColor: "#9da0f5",
        iconBackground: "#9da0f5",
        textColor: "#686bb7",
        borderColor: "#fff",
        shadow: "#686bb7",
      };
    }
    return colorObj;
  }

  async init() {
    const subContainer = await this.createMainSubContainer();

    return subContainer;
  }

  get isResub() {
    return this.sub.amount > 1;
  }

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
    const isGifted = this.isGifted;
    const isBulkGifted = this.isBulkGifted;
    const sender = this.sender;
    const amount = this.amount;

    let subText = fieldData.subText;
    let bulkText = fieldData.bulkGiftText;
    let giftText = fieldData.giftSubText;
    let text = " Se ha suscrito!";
    let nameAndText;
    let resubText = fieldData.resubText;

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
      resubText = resubText.replace("(user)", name);
      resubText = resubText.replace("(months)", amount);
      text = resubText != "" ? resubText : name + text;
      nameAndText = `${text}`;
    } else {
      text = subText != "" ? subText : name + text;
      subText = subText.replace("(user)", name);
      text = subText;
    }

    nameAndText = `${text}`;

    const pawsContainer = document.createElement("div");
    const leftPaw = document.createElement("svg");
    leftPaw.classList.add("left-paw");
    const leftPawContainer = document.createElement("div");
    leftPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    leftPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;
    const rightPaw = document.createElement("svg");
    rightPaw.classList.add("right-paw");
    const rightPawContainer = document.createElement("div");
    rightPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    rightPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;

    leftPawContainer.classList.add("left-paw-container");
    leftPawContainer.appendChild(leftPaw);

    rightPawContainer.classList.add("right-paw-container");
    rightPawContainer.appendChild(rightPaw);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("sub-name");
    nameContainer.style.textShadow = `0 0 0.2em ${
      this.themeColor().shadow
    }, 0 0 0.2em ${this.themeColor().shadow}`;
    nameContainer.innerText = nameAndText;

    pawsContainer.classList.add("paws-container");
    pawsContainer.appendChild(leftPawContainer);
    pawsContainer.appendChild(nameContainer);
    pawsContainer.appendChild(rightPawContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(pawsContainer);

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

  themeColor() {
    const theme = fieldData.theme;
    let colorObj = {};
    if (theme == "pink") {
      colorObj = {
        messageBackground: "#faaac5",
        userColor: "#faaac5",
        userBackground: "#fff",
        pronsColor: "#faaac5",
        iconBackground: "#9da0f5",
        textColor: "#d55482",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    } else {
      colorObj = {
        messageBackground: "#c4c8ff",
        userColor: "#9da0f5",
        userBackground: "#fff",
        pronsColor: "#9da0f5",
        iconBackground: "#9da0f5",
        textColor: "#686bb7",
        borderColor: "#fff",
        shadow: "#686bb7",
      };
    }
    return colorObj;
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

    const pawsContainer = document.createElement("div");
    const leftPaw = document.createElement("svg");
    leftPaw.classList.add("left-paw");
    const leftPawContainer = document.createElement("div");
    leftPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    leftPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;
    const rightPaw = document.createElement("svg");
    rightPaw.classList.add("right-paw");
    const rightPawContainer = document.createElement("div");
    rightPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    rightPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;

    leftPawContainer.classList.add("left-paw-container");
    leftPawContainer.appendChild(leftPaw);

    rightPawContainer.classList.add("right-paw-container");
    rightPawContainer.appendChild(rightPaw);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("raid-name");
    nameContainer.style.textShadow = `0 0 0.2em ${
      this.themeColor().shadow
    }, 0 0 0.2em ${this.themeColor().shadow}`;
    nameContainer.innerText = nameAndText;

    pawsContainer.classList.add("paws-container");
    pawsContainer.appendChild(leftPawContainer);
    pawsContainer.appendChild(nameContainer);
    pawsContainer.appendChild(rightPawContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(pawsContainer);

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

  themeColor() {
    const theme = fieldData.theme;
    let colorObj = {};
    if (theme == "pink") {
      colorObj = {
        messageBackground: "#faaac5",
        userColor: "#faaac5",
        userBackground: "#fff",
        pronsColor: "#faaac5",
        iconBackground: "#9da0f5",
        textColor: "#d55482",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    } else {
      colorObj = {
        messageBackground: "#c4c8ff",
        userColor: "#9da0f5",
        userBackground: "#fff",
        pronsColor: "#9da0f5",
        iconBackground: "#9da0f5",
        textColor: "#686bb7",
        borderColor: "#fff",
        shadow: "#686bb7",
      };
    }
    return colorObj;
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
    const images = this.images;
    const paws = await this.svgs;
    const mainContainer = document.createElement("div");
    const mantarayaContainer = document.createElement("div");
    const sandContainer = document.createElement("div");

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

    const pawsContainer = document.createElement("div");
    const leftPaw = document.createElement("svg");
    leftPaw.classList.add("left-paw");
    const leftPawContainer = document.createElement("div");
    leftPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    leftPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;
    const rightPaw = document.createElement("svg");
    rightPaw.classList.add("right-paw");
    const rightPawContainer = document.createElement("div");
    rightPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    rightPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;

    leftPawContainer.classList.add("left-paw-container");
    leftPawContainer.appendChild(leftPaw);

    rightPawContainer.classList.add("right-paw-container");
    rightPawContainer.appendChild(rightPaw);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("cheer-name");
    nameContainer.style.textShadow = `0 0 0.2em ${
      this.themeColor().shadow
    }, 0 0 0.2em ${this.themeColor().shadow}`;
    nameContainer.innerText = nameAndText;

    pawsContainer.classList.add("paws-container");
    pawsContainer.appendChild(leftPawContainer);
    pawsContainer.appendChild(nameContainer);
    pawsContainer.appendChild(rightPawContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(pawsContainer);

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

  themeColor() {
    const theme = fieldData.theme;
    let colorObj = {};
    if (theme == "pink") {
      colorObj = {
        messageBackground: "#faaac5",
        userColor: "#faaac5",
        userBackground: "#fff",
        pronsColor: "#faaac5",
        iconBackground: "#9da0f5",
        textColor: "#d55482",
        borderColor: "#fff",
        shadow: "#f57198",
      };
    } else {
      colorObj = {
        messageBackground: "#c4c8ff",
        userColor: "#9da0f5",
        userBackground: "#fff",
        pronsColor: "#9da0f5",
        iconBackground: "#9da0f5",
        textColor: "#686bb7",
        borderColor: "#fff",
        shadow: "#686bb7",
      };
    }
    return colorObj;
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

    const pawsContainer = document.createElement("div");
    const leftPaw = document.createElement("svg");
    leftPaw.classList.add("left-paw");
    const leftPawContainer = document.createElement("div");
    leftPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    leftPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;
    const rightPaw = document.createElement("svg");
    rightPaw.classList.add("right-paw");
    const rightPawContainer = document.createElement("div");
    rightPaw.style.filter = `drop-shadow(0 0 5px ${this.themeColor().shadow})`;
    rightPaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-cloud-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" stroke-width="0" fill="white"></path>
</svg>`;

    leftPawContainer.classList.add("left-paw-container");
    leftPawContainer.appendChild(leftPaw);

    rightPawContainer.classList.add("right-paw-container");
    rightPawContainer.appendChild(rightPaw);

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("tip-name");
    nameContainer.style.textShadow = `0 0 0.2em ${
      this.themeColor().shadow
    }, 0 0 0.2em ${this.themeColor().shadow}`;
    nameContainer.innerText = nameAndText;

    pawsContainer.classList.add("paws-container");
    pawsContainer.appendChild(leftPawContainer);
    pawsContainer.appendChild(nameContainer);
    pawsContainer.appendChild(rightPawContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(pawsContainer);

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

const sendMessage = async () => {
  let message = new Message({
    service: "twitch",
    data: {
      time: 1677785567905,
      tags: {
        "badge-info": "",
        badges: "broadcaster/1,premium/1",
        color: "#FF0000",
        "display-name": "Lordkaito_",
        emotes: "",
        "first-msg": "0",
        flags: "",
        id: "9e69737e-8c7b-4b0b-b61c-1cf18a5d6aa0",
        mod: "1",
        "returning-chatter": "0",
        "room-id": "675807879",
        subscriber: "1",
        "tmi-sent-ts": "1677785567710",
        turbo: "1",
        "user-id": "675807879",
        "user-type": "",
      },
      nick: "lordkaito_",
      userId: "675807879",
      displayName: "Streamelements",
      displayColor: "#FF0000",
      badges: [
        {
          type: "broadcaster",
          version: "1",
          url: "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
        },
        {
          type: "premium",
          version: "1",
          url: "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3",
        },
      ],
      channel: "lordkaito_",
      text: "<img src='https://cdn.7tv.app/emote/6268904f4f54759b7184fa72/1x.webp'/> <img src='https://cdn.7tv.app/emote/6268904f4f54759b7184fa72/1x.webp'/> asdfasdf <img src='https://cdn.7tv.app/emote/6268904f4f54759b7184fa72/1x.webp'/> <img src='https://cdn.7tv.app/emote/6268904f4f54759b7184fa72/1x.webp'/> ola que tal asdfasdf asd a asd fasdfasdf asdf a df",
      isAction: false,
      emotes: [],
      msgId: "9e69737e-8c7b-4b0b-b61c-1cf18a5d6aa0",
    },
    renderedText: "asdfasdf",
  });

  const messageMainContainer = message.createMainContainerElement();
  const mainCont = document.querySelector("main");
  mainCont.appendChild(await messageMainContainer);
};

// const removeMessage = (mainContainer) => {
//   const elem = mainContainer;
//   if (elem) {
//     elem.classList.add("scale-up");
//     setTimeout(() => {
//       elem.classList.remove("scale-up");
//       elem.classList.add("scale-down");
//       setTimeout(() => {
//         elem.remove();
//       }, 1000);
//     }, 200);
//   }
// };

const removeMessage = (mainContainer) => {
  const elem = mainContainer;
  if (elem) {
    elem.style.animationName = "removeMessage";
    elem.style.animationDuration = "0.6s";
    setTimeout(() => {
      elem.remove();
    }, 1000);
  }
};
const removeEvent = (mainContainer, event) => {
  const elem = mainContainer;
  console.log(elem.querySelector(`.${event}`));
  elem.querySelector(`.${event}`).style.animationName = "hideNames";
  elem.querySelector(".left-paw").style.animationName = "hideLeftPaw";
  elem.querySelector(".right-paw").style.animationName = "hideRightPaw";
  setTimeout(() => {
    elem.remove();
  }, 1000);
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

let repeatedEvents = 0;
let maxEvents = 0;
let isBulk = false;

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
            }, fieldData.deleteMessages * 1000);
          }
          mainCont.appendChild(mainContainer);
          setTimeout(() => {
            const bigLine = mainContainer.querySelector("#big-line");
            const messageContainer =
              mainContainer.querySelector(".message-container");
            bigLine.style.height = `${messageContainer.offsetHeight}px`;
          }, 500);
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
            }, fieldData.deleteMessages * 1000);
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
            }, fieldData.deleteMessages * 1000);
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
            }, fieldData.deleteMessages * 1000);
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
            }, fieldData.deleteMessages * 1000);
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
            }, fieldData.deleteMessages * 1000);
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
            }, fieldData.deleteMessages * 1000);
          }
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
let previousSender = "";

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

// messages on/off need to be here and the opacity, blacklists
