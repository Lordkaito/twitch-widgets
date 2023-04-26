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

  get icon() {
    const iconUrl = "https://i.postimg.cc/fWHzqZPt/sobre-rosa.png";
    return iconUrl;
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

  get flowers() {
    let repeated = 8;
    let flowerArr = [];
    for (let i = 0; i < repeated; i++) {
      const flower = document.createElement("img");
      flower.classList.add("flower");
      flower.src = "https://i.postimg.cc/t47RXFL8/flower.png";
      flower.classList.add(`flower-${i + 1}`);
      flowerArr.push(flower);
    }
    return flowerArr;
  }

  async createMainContainerElement() {
    const mainContainer = document.createElement("div");
    const superMainContainer = document.createElement("div");
    const flowers = this.flowers;
    flowers.forEach((flower) => {
      mainContainer.appendChild(flower);
    });
    superMainContainer.classList.add("super-main-container");
    mainContainer.setAttribute("id", `${this.id}`);
    mainContainer.classList.add("main-container");
    // mainContainer.style.backgroundColor = this.themeColor().messageBckg;

    const bigLine = document.createElement("div");
    bigLine.setAttribute("id", "big-line");
    const smallLine = document.createElement("div");
    smallLine.setAttribute("id", "small-line");
    const littlePaw = document.createElement("svg");
    littlePaw.setAttribute("id", "little-paw");
    littlePaw.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-paw-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 10c-1.32 0 -1.983 .421 -2.931 1.924l-.244 .398l-.395 .688a50.89 50.89 0 0 0 -.141 .254c-.24 .434 -.571 .753 -1.139 1.142l-.55 .365c-.94 .627 -1.432 1.118 -1.707 1.955c-.124 .338 -.196 .853 -.193 1.28c0 1.687 1.198 2.994 2.8 2.994l.242 -.006c.119 -.006 .234 -.017 .354 -.034l.248 -.043l.132 -.028l.291 -.073l.162 -.045l.57 -.17l.763 -.243l.455 -.136c.53 -.15 .94 -.222 1.283 -.222c.344 0 .753 .073 1.283 .222l.455 .136l.764 .242l.569 .171l.312 .084c.097 .024 .187 .045 .273 .062l.248 .043c.12 .017 .235 .028 .354 .034l.242 .006c1.602 0 2.8 -1.307 2.8 -3c0 -.427 -.073 -.939 -.207 -1.306c-.236 -.724 -.677 -1.223 -1.48 -1.83l-.257 -.19l-.528 -.38c-.642 -.47 -1.003 -.826 -1.253 -1.278l-.27 -.485l-.252 -.432c-1.011 -1.696 -1.618 -2.099 -3.053 -2.099z" stroke-width="0" fill="white"></path>
    <path d="M19.78 7h-.03c-1.219 .02 -2.35 1.066 -2.908 2.504c-.69 1.775 -.348 3.72 1.075 4.333c.256 .109 .527 .163 .801 .163c1.231 0 2.38 -1.053 2.943 -2.504c.686 -1.774 .34 -3.72 -1.076 -4.332a2.05 2.05 0 0 0 -.804 -.164z" stroke-width="0" fill="white"></path>
    <path d="M9.025 3c-.112 0 -.185 .002 -.27 .015l-.093 .016c-1.532 .206 -2.397 1.989 -2.108 3.855c.272 1.725 1.462 3.114 2.92 3.114l.187 -.005a1.26 1.26 0 0 0 .084 -.01l.092 -.016c1.533 -.206 2.397 -1.989 2.108 -3.855c-.27 -1.727 -1.46 -3.114 -2.92 -3.114z" stroke-width="0" fill="white"></path>
    <path d="M14.972 3c-1.459 0 -2.647 1.388 -2.916 3.113c-.29 1.867 .574 3.65 2.174 3.867c.103 .013 .2 .02 .296 .02c1.39 0 2.543 -1.265 2.877 -2.883l.041 -.23c.29 -1.867 -.574 -3.65 -2.174 -3.867a2.154 2.154 0 0 0 -.298 -.02z" stroke-width="0" fill="white"></path>
    <path d="M4.217 7c-.274 0 -.544 .054 -.797 .161c-1.426 .615 -1.767 2.562 -1.078 4.335c.563 1.451 1.71 2.504 2.941 2.504c.274 0 .544 -.054 .797 -.161c1.426 -.615 1.767 -2.562 1.078 -4.335c-.563 -1.451 -1.71 -2.504 -2.941 -2.504z" stroke-width="0" fill="white"></path>
  </svg>`;

    const lines = document.createElement("div");
    lines.setAttribute("id", "lines");
    lines.appendChild(bigLine);
    lines.appendChild(smallLine);
    lines.appendChild(littlePaw);
    // mainContainer.appendChild(lines);

    mainContainer.appendChild(await this.createUsernameInfoElement());
    mainContainer.appendChild(await this.createMessageContainerElement());
    mainContainer.appendChild(this.createBarElement());
    mainContainer.appendChild(this.createDecorationElement());
    // superMainContainer.appendChild(lines);
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
    // usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.strawberries);
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    usernameInfo.appendChild(this.strawberries);
    usernameInfoContainer.appendChild(usernameInfo);
    return usernameInfoContainer;
  }

  get strawberries() {
    const strawberries = document.createElement("img");
    strawberries.classList.add("strawberries");
    strawberries.src = "https://i.postimg.cc/wBm6NgxV/strawberries.png";
    return strawberries;
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
    // capitalizeUser.style.color = this.themeColor().userColor;
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
    // messageIconContainer.appendChild(this.createMessageIconElement());
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
    messageIconElement.style.backgroundColor =
      this.themeColor().messageIconBckg;
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

  themeColor() {
    let color = fieldData.theme;
    let colorObj =
      color === "purple"
        ? {
            messageBckg: "#333",
            messageText: "#333",
            messageIconBckg: "#333",
            userColor: "#333",
            pronsColor: "#333",
          }
        : {
            messageBckg: "red",
            messageText: "red",
            messageIconBckg: "pink",
            userColor: "red",
            pronsColor: "red",
          };

    return colorObj;
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

  get svgs() {
    const paws = document.createElement("img");
    paws.src = "https://i.postimg.cc/hvs4D0z6/patita.png";
    paws.classList.add("paws");

    // return paws;
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
    nameContainer.classList.add("follow-name");
    nameContainer.innerText = nameAndText;

    const dotsAndName = document.createElement("div");
    dotsAndName.classList.add("dots-and-name");
    dotsAndName.appendChild(nameContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(dotsAndName);

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

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("bulk-name");
    nameContainer.innerText = nameAndText;

    const dotsAndName = document.createElement("div");
    dotsAndName.classList.add("dots-and-name");
    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dark-dot");
      dotsAndName.appendChild(dot);
    }
    dotsAndName.appendChild(nameContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(dotsAndName);

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
    const isGifted = this.isGifted;
    const isBulkGifted = this.isBulkGifted;
    const sender = this.sender;
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

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("sub-name");
    nameContainer.innerText = nameAndText;

    const dotsAndName = document.createElement("div");
    dotsAndName.classList.add("dots-and-name");
    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dark-dot");
      dotsAndName.appendChild(dot);
    }
    dotsAndName.appendChild(nameContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(dotsAndName);

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
    nameContainer.classList.add("raid-name");
    nameContainer.innerText = nameAndText;

    const dotsAndName = document.createElement("div");
    dotsAndName.classList.add("dots-and-name");
    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dark-dot");
      dotsAndName.appendChild(dot);
    }
    dotsAndName.appendChild(nameContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(dotsAndName);

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
    const images = this.images;
    const paws = await this.svgs;
    const mainContainer = document.createElement("div");
    const mantarayaContainer = document.createElement("div");
    const sandContainer = document.createElement("div");

    // this is the name of the person who sent the cheer
    const { name } = this;
    // this is the amount of bits they sent
    const amount = this.amount;

    // this is the text to show when people cheer
    let cheerText = fieldData.cheerText;
    let text = `${name} cheered x${amount}`;
    if (cheerText != "") {
      cheerText = cheerText.replace("(amount)", amount);
      cheerText = cheerText.replace("(user)", name);
      text = cheerText;
    }
    const nameAndText = `${text}`;

    // this is the container for the text
    const nameContainer = document.createElement("p");
    nameContainer.classList.add("cheer-name");
    nameContainer.innerText = nameAndText;

    // this is the container for the dots and the text
    const dotsAndName = document.createElement("div");
    dotsAndName.classList.add("dots-and-name");
    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dark-dot");
      dotsAndName.appendChild(dot);
    }
    dotsAndName.appendChild(nameContainer);

    // this is the container for the entire cheer
    mainContainer.classList.add("event-container");
    mainContainer.appendChild(dotsAndName);

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
    nameContainer.classList.add("tip-name");
    nameContainer.innerText = nameAndText;

    const dotsAndName = document.createElement("div");
    dotsAndName.classList.add("dots-and-name");
    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dark-dot");
      dotsAndName.appendChild(dot);
    }
    dotsAndName.appendChild(nameContainer);

    mainContainer.classList.add("event-container");
    mainContainer.appendChild(dotsAndName);

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
  elem.querySelector(`.${event}`).style.animationName = "hideNames";
  elem.style.animationName = "removeMessage";
  setTimeout(() => {
    elem.remove();
  }, 1000);
};

let repeatedEvents = 0;
let maxEvents = 0;
let isBulk = false;
let initialEvent = true;

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
          if (initialEvent) {
            initialEvent = false;
          } else {
            bulkContainer.appendChild(heartsContainer(2, listener));
          }
          setTimeout(() => {
            removeEvent(bulkContainer, "bulk-name");
          }, fieldData.deleteMessages * 1000);
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
          if (initialEvent) {
            initialEvent = false;
          } else {
            const hearts = heartsContainer(3, listener);
            if (hearts.children.length === 3) {
              mainContainer.style.marginTop = "7rem";
              hearts.style.top = "-5.9rem";
            }
            let main = mainContainer.querySelector(".main-container");
            main.appendChild(hearts);
          }
          setTimeout(() => {
            removeMessage(mainContainer);
          }, fieldData.deleteMessages * 1000);
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
          if (initialEvent) {
            initialEvent = false;
          } else {
            followContainer.appendChild(heartsContainer(2, listener));
          }
          setTimeout(() => {
            removeEvent(followContainer, "follow-name");
          }, fieldData.deleteMessages * 1000);
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
          if (initialEvent) {
            initialEvent = false;
          } else {
            subContainer.appendChild(heartsContainer(2, listener));
          }
          setTimeout(() => {
            removeEvent(subContainer, "sub-name");
          }, fieldData.deleteMessages * 1000);
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
          if (initialEvent) {
            initialEvent = false;
          } else {
            raidContainer.appendChild(heartsContainer(2, listener));
          }
          setTimeout(() => {
            removeEvent(raidContainer, "raid-name");
          }, fieldData.deleteMessages * 1000);
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
          if (initialEvent) {
            initialEvent = false;
          } else {
            cheerContainer.appendChild(heartsContainer(2, listener));
          }
          setTimeout(() => {
            removeEvent(cheerContainer, "cheer-name");
          }, fieldData.deleteMessages * 1000);
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
          if (initialEvent) {
            initialEvent = false;
          } else {
            tipContainer.appendChild(heartsContainer(2, listener));
          }
          setTimeout(() => {
            removeEvent(tipContainer, "tip-name");
          }, fieldData.deleteMessages * 1000);
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

let heartFirst = true;
let lastEvent = "message";
const heartsContainer = (amount, listener) => {
  if (lastEvent !== "message") amount = 2;
  const hearts = document.createElement("div");
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("svg");
    const dot = document.createElement("div");
    listener === "message"
      ? dot.classList.add(`dot-${i + 1}`)
      : dot.classList.add(`event-dot-${i + 1}`);
    heart.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15"
    height="20" viewBox="0 0 100 100" stroke-width="100" stroke="white">
    <image id="Capa_1_copia_2" data-name="Capa 1 copia 2" y="1" width="100" height="99"
      xlink:href="data:img/png;base64,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" />
  </svg>`;
    listener === "message"
      ? hearts.classList.add("hearts-container")
      : hearts.classList.add(`event-hearts-container`);
    heart.classList.add(`heart-${i + 1}`);
    hearts.appendChild(heart);
    hearts.appendChild(dot);
  }
  hearts.lastElementChild.remove();
  heartFirst = !heartFirst;
  lastEvent = listener;

  return hearts;
};
