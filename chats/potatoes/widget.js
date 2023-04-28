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
    const iconUrl = "https://i.postimg.cc/RhMvKv3G/valla.png";
    return iconUrl;
  }

  get patatas() {
    const patatasUrl = "https://i.postimg.cc/0y4H7J0t/patataaa.png";
    return patatasUrl;
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
        roleImage.innerHTML = `<?xml version='1.0' encoding='UTF-8'?><svg width='40px' height='40px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>camcorder_fill</title><g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='Media' transform='translate(-48.000000, -48.000000)' fill-rule='nonzero'><g id='camcorder_fill' transform='translate(48.000000, 48.000000)'><path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z' id='MingCute' fill-rule='nonzero'></path><path stroke="white" stroke-width="2" d='M4,4 C2.89543,4 2,4.89543 2,6 L2,18 C2,19.1046 2.89543,20 4,20 L16,20 C17.1046,20 18,19.1046 18,18 L18,15.7905 L20.0944,17.0807 C20.9272,17.5938 22,16.9946 22,16.0165 L22,7.98353 C22,7.00536 20.9272,6.40622 20.0944,6.91926 L18,8.20945 L18,6 C18,4.89543 17.1046,4 16,4 L4,4 Z' id='路径' fill='${
          this.themeColor().role
        }'></path></g></g></g></svg>`;
        break;
      case "mod":
        roleImage.innerHTML = `<svg fill="#000000" height="40px" width="40px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-3.2 -3.2 38.40 38.40" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fefbfb" stroke-width="6"> <path d="M31.9,16.6l-3-8c-0.1-0.2-0.2-0.4-0.4-0.5l-12-7c-0.3-0.2-0.7-0.2-1,0l-12,7C3.3,8.3,3.1,8.4,3.1,8.6l-3,8 C-0.1,17,0,17.3,0.2,17.6C0.4,17.8,0.7,18,1,18h3v12c0,0.6,0.4,1,1,1h6c0.3,0,0.5-0.1,0.7-0.3l4.3-4.3l4.3,4.3 c0.2,0.2,0.5,0.3,0.7,0.3h6c0.6,0,1-0.4,1-1V18h3c0.3,0,0.6-0.2,0.8-0.4C32,17.3,32.1,17,31.9,16.6z M10.1,30.4 c0,0.1,0.1,0.2,0.2,0.3s0.2,0.2,0.3,0.2C10.4,30.8,10.2,30.6,10.1,30.4z M10.3,29.3C10.1,29.5,10,29.7,10,30V20 c0,0.3,0.1,0.5,0.3,0.7l4.3,4.3L10.3,29.3z M21,19c-0.3,0-0.5,0.1-0.7,0.3L16,23.6l-4.3-4.3C11.5,19.1,11.3,19,11,19H21z M12,16v-5 c0-0.6,0.4-1,1-1h6c0.6,0,1,0.4,1,1v5c0,0.6-0.4,1-1,1h-6C12.4,17,12,16.6,12,16z M10.1,19.6c0.1-0.2,0.3-0.4,0.5-0.5 c-0.1,0-0.2,0.1-0.3,0.2S10.1,19.5,10.1,19.6z M21.4,30.9c0.1,0,0.2-0.1,0.3-0.2s0.2-0.2,0.2-0.3C21.8,30.6,21.6,30.8,21.4,30.9z M22,30c0-0.3-0.1-0.5-0.3-0.7L17.4,25l4.3-4.3c0.2-0.2,0.3-0.5,0.3-0.7V30z M21.4,19.1c0.2,0.1,0.4,0.3,0.5,0.5 c0-0.1-0.1-0.2-0.2-0.3S21.5,19.1,21.4,19.1z M27.7,16l-1.8-5.3c-0.1-0.2-0.2-0.4-0.5-0.6l-9-5c-0.3-0.2-0.7-0.2-1,0l-9,5 c-0.2,0.1-0.4,0.3-0.5,0.6L4.3,16H2.4l2.4-6.3L16,3.2l11.2,6.5l2.4,6.3H27.7z"></path> </g><g id="SVGRepo_iconCarrier"> <path d="M31.9,16.6l-3-8c-0.1-0.2-0.2-0.4-0.4-0.5l-12-7c-0.3-0.2-0.7-0.2-1,0l-12,7C3.3,8.3,3.1,8.4,3.1,8.6l-3,8 C-0.1,17,0,17.3,0.2,17.6C0.4,17.8,0.7,18,1,18h3v12c0,0.6,0.4,1,1,1h6c0.3,0,0.5-0.1,0.7-0.3l4.3-4.3l4.3,4.3 c0.2,0.2,0.5,0.3,0.7,0.3h6c0.6,0,1-0.4,1-1V18h3c0.3,0,0.6-0.2,0.8-0.4C32,17.3,32.1,17,31.9,16.6z M10.1,30.4 c0,0.1,0.1,0.2,0.2,0.3s0.2,0.2,0.3,0.2C10.4,30.8,10.2,30.6,10.1,30.4z M10.3,29.3C10.1,29.5,10,29.7,10,30V20 c0,0.3,0.1,0.5,0.3,0.7l4.3,4.3L10.3,29.3z M21,19c-0.3,0-0.5,0.1-0.7,0.3L16,23.6l-4.3-4.3C11.5,19.1,11.3,19,11,19H21z M12,16v-5 c0-0.6,0.4-1,1-1h6c0.6,0,1,0.4,1,1v5c0,0.6-0.4,1-1,1h-6C12.4,17,12,16.6,12,16z M10.1,19.6c0.1-0.2,0.3-0.4,0.5-0.5 c-0.1,0-0.2,0.1-0.3,0.2S10.1,19.5,10.1,19.6z M21.4,30.9c0.1,0,0.2-0.1,0.3-0.2s0.2-0.2,0.2-0.3C21.8,30.6,21.6,30.8,21.4,30.9z M22,30c0-0.3-0.1-0.5-0.3-0.7L17.4,25l4.3-4.3c0.2-0.2,0.3-0.5,0.3-0.7V30z M21.4,19.1c0.2,0.1,0.4,0.3,0.5,0.5 c0-0.1-0.1-0.2-0.2-0.3S21.5,19.1,21.4,19.1z M27.7,16l-1.8-5.3c-0.1-0.2-0.2-0.4-0.5-0.6l-9-5c-0.3-0.2-0.7-0.2-1,0l-9,5 c-0.2,0.1-0.4,0.3-0.5,0.6L4.3,16H2.4l2.4-6.3L16,3.2l11.2,6.5l2.4,6.3H27.7z" fill="${
          this.themeColor().role
        }"></path> </g></svg>`;
        break;
      case "vip":
        roleImage.innerHTML = `<svg fill="#000000" height="40px" width="40px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-3.2 -3.2 38.40 38.40" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fdfcfc" stroke-width="5"> <path d="M32,13c0-0.6-0.4-1-1-1h-5v-2c0-1.7-1.3-3-3-3c-0.6,0-1,0.4-1,1s0.4,1,1,1c0.6,0,1,0.4,1,1v2h-4.2l-2.4-6H19 c0.6,0,1-0.4,1-1s-0.4-1-1-1h-3H7C6.9,4,6.7,4,6.6,4.1c0,0-0.1,0-0.1,0.1c-0.1,0-0.1,0.1-0.2,0.1c0,0-0.1,0.1-0.1,0.1 c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0.1-0.1,0.1c0,0,0,0.1,0,0.1l-1.7,8.3c-1.2,0.5-2.2,1.3-3.1,2.2c-0.4,0.4-0.4,1,0,1.4 c0.4,0.4,1,0.4,1.4,0C4.3,15,6.6,14,9,14c5,0,9,4,9,9c0,0.3,0,0.6,0,0.9c0,0,0,0,0,0.1c0,0,0,0,0,0.1c0,0.1,0,0.1,0,0.2 c0,0.1,0,0.1,0,0.2c0,0.1,0.1,0.1,0.1,0.2c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.1,0.1,0.2,0.2c0,0,0.1,0.1,0.1,0.1c0.1,0,0.2,0.1,0.3,0.1 c0,0,0.1,0,0.1,0c0,0,0,0,0.1,0c0,0,0,0,0,0h3.1C22,25.3,22,25.7,22,26c0,2.8,2.2,5,5,5s5-2.2,5-5c0-0.5-0.1-1-0.2-1.4 c0.1-0.2,0.2-0.4,0.2-0.6V13z M27,29c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S28.7,29,27,29z"></path> <path d="M9,15c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S13.4,15,9,15z M9,26c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S10.7,26,9,26z"></path> </g><g id="SVGRepo_iconCarrier"> <path d="M32,13c0-0.6-0.4-1-1-1h-5v-2c0-1.7-1.3-3-3-3c-0.6,0-1,0.4-1,1s0.4,1,1,1c0.6,0,1,0.4,1,1v2h-4.2l-2.4-6H19 c0.6,0,1-0.4,1-1s-0.4-1-1-1h-3H7C6.9,4,6.7,4,6.6,4.1c0,0-0.1,0-0.1,0.1c-0.1,0-0.1,0.1-0.2,0.1c0,0-0.1,0.1-0.1,0.1 c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0.1-0.1,0.1c0,0,0,0.1,0,0.1l-1.7,8.3c-1.2,0.5-2.2,1.3-3.1,2.2c-0.4,0.4-0.4,1,0,1.4 c0.4,0.4,1,0.4,1.4,0C4.3,15,6.6,14,9,14c5,0,9,4,9,9c0,0.3,0,0.6,0,0.9c0,0,0,0,0,0.1c0,0,0,0,0,0.1c0,0.1,0,0.1,0,0.2 c0,0.1,0,0.1,0,0.2c0,0.1,0.1,0.1,0.1,0.2c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.1,0.1,0.2,0.2c0,0,0.1,0.1,0.1,0.1c0.1,0,0.2,0.1,0.3,0.1 c0,0,0.1,0,0.1,0c0,0,0,0,0.1,0c0,0,0,0,0,0h3.1C22,25.3,22,25.7,22,26c0,2.8,2.2,5,5,5s5-2.2,5-5c0-0.5-0.1-1-0.2-1.4 c0.1-0.2,0.2-0.4,0.2-0.6V13z M27,29c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S28.7,29,27,29z" fill="${
          this.themeColor().role
        }"></path> <path d="M9,15c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S13.4,15,9,15z M9,26c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S10.7,26,9,26z" fill="${
          this.themeColor().role
        }"></path> </g></svg>`;
        break;
      case "sub":
        roleImage.innerHTML = `<svg fill="#000000" height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fefbfb" stroke-width="100"> <g> <g> <path d="M492.312,19.663c-26.187-26.186-68.796-26.187-94.983,0L254.853,162.138l-11.872-11.872 c-6.556-6.557-17.188-6.557-23.746,0c-6.557,6.557-6.557,17.188,0,23.746c17.213,17.213,30.278,30.278,47.492,47.492 l-47.492,47.492l-83.11-83.11c-6.556-6.557-17.188-6.556-23.746,0l-36.281,36.281c-34.14,34.14-58.048,77.022-69.141,124.012 c-11.093,46.99-8.886,96.037,6.381,141.84c1.671,5.013,5.606,8.947,10.62,10.619c44.245,14.747,93.28,17.845,141.84,6.382 c46.99-11.093,89.872-35.001,124.012-69.141l36.281-36.281c6.557-6.557,6.557-17.188,0-23.746l-83.11-83.11l47.492-47.492 c4.897,4.897,42.6,42.6,47.492,47.491c6.556,6.557,17.188,6.559,23.746,0c6.557-6.557,6.557-17.188,0-23.746l-11.873-11.873 l35.616-35.615c0.001-0.001,0.002-0.002,0.003-0.003c0.001-0.001,0.002-0.002,0.003-0.005l106.853-106.852 C518.559,88.399,518.565,45.914,492.312,19.663z M326.091,233.375l-47.492-47.491l23.746-23.747l47.492,47.492L326.091,233.375z"></path> </g> </g> </g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M492.312,19.663c-26.187-26.186-68.796-26.187-94.983,0L254.853,162.138l-11.872-11.872 c-6.556-6.557-17.188-6.557-23.746,0c-6.557,6.557-6.557,17.188,0,23.746c17.213,17.213,30.278,30.278,47.492,47.492 l-47.492,47.492l-83.11-83.11c-6.556-6.557-17.188-6.556-23.746,0l-36.281,36.281c-34.14,34.14-58.048,77.022-69.141,124.012 c-11.093,46.99-8.886,96.037,6.381,141.84c1.671,5.013,5.606,8.947,10.62,10.619c44.245,14.747,93.28,17.845,141.84,6.382 c46.99-11.093,89.872-35.001,124.012-69.141l36.281-36.281c6.557-6.557,6.557-17.188,0-23.746l-83.11-83.11l47.492-47.492 c4.897,4.897,42.6,42.6,47.492,47.491c6.556,6.557,17.188,6.559,23.746,0c6.557-6.557,6.557-17.188,0-23.746l-11.873-11.873 l35.616-35.615c0.001-0.001,0.002-0.002,0.003-0.003c0.001-0.001,0.002-0.002,0.003-0.005l106.853-106.852 C518.559,88.399,518.565,45.914,492.312,19.663z M326.091,233.375l-47.492-47.491l23.746-23.747l47.492,47.492L326.091,233.375z" fill="${
          this.themeColor().role
        }"></path> </g> </g> </g></svg>`;
        break;
      case "viewer":
        roleImage.innerHTML = `<svg fill="#000000" height="40px" width="40px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-3.2 -3.2 38.40 38.40" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fefbfb" stroke-width="6"> <g> <path d="M27.4,23.8c0.8-5.7,0.8-9.9,0-15.6c-0.1-0.8,0-1.7,0.4-2.8C27.9,5.1,28,4.8,28,4.5C28,3.1,26.9,2,25.5,2 c-0.3,0-0.6,0.1-0.9,0.2c-1.1,0.4-1.9,0.5-2.6,0.4c-4.3-0.7-7.7-0.7-12.1,0c-0.7,0.1-1.5,0-2.6-0.4C7.1,2.1,6.8,2,6.5,2 C5.1,2,4,3.1,4,4.5c0,0.3,0.1,0.6,0.2,0.9c0.4,1.1,0.5,2,0.4,2.8c-0.8,5.7-0.8,9.9,0,15.6c0.1,0.8,0,1.7-0.4,2.8 C4.1,26.9,4,27.2,4,27.5C4,28.9,5.1,30,6.5,30c0.3,0,0.6-0.1,0.9-0.2c1.1-0.4,1.9-0.5,2.6-0.4c4.3,0.7,7.7,0.7,12.1,0 c0.7-0.1,1.5,0,2.6,0.4c0.3,0.1,0.6,0.2,0.9,0.2c1.4,0,2.5-1.1,2.5-2.5c0-0.3-0.1-0.6-0.2-0.9C27.4,25.5,27.3,24.6,27.4,23.8z M22,17.5c0.3,0,0.5,0.2,0.5,0.5c0,3.6-2.9,6.5-6.5,6.5S9.5,21.6,9.5,18c0-0.3,0.2-0.5,0.5-0.5c0.5,0,1,0.1,1.5,0.2 c-1.2-1.2-2-2.8-2-4.7c0-0.3,0.2-0.5,0.5-0.5c1.5,0,2.9,0.5,4,1.4c-0.7-2.2-0.1-4.8,1.6-6.5c0.2-0.2,0.5-0.2,0.7,0 c1.8,1.8,2.3,4.3,1.6,6.5c1.1-0.9,2.5-1.4,4-1.4c0.3,0,0.5,0.2,0.5,0.5c0,1.8-0.8,3.5-2,4.7C21,17.6,21.5,17.5,22,17.5z"></path> <path d="M14.5,19.3c0.6,0.6,1.2,1.4,1.5,2.2c0.3-0.8,0.9-1.6,1.5-2.2c-0.5,0.1-1,0.2-1.5,0.2S15,19.4,14.5,19.3z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path fill="${
          this.themeColor().role
        }" d="M27.4,23.8c0.8-5.7,0.8-9.9,0-15.6c-0.1-0.8,0-1.7,0.4-2.8C27.9,5.1,28,4.8,28,4.5C28,3.1,26.9,2,25.5,2 c-0.3,0-0.6,0.1-0.9,0.2c-1.1,0.4-1.9,0.5-2.6,0.4c-4.3-0.7-7.7-0.7-12.1,0c-0.7,0.1-1.5,0-2.6-0.4C7.1,2.1,6.8,2,6.5,2 C5.1,2,4,3.1,4,4.5c0,0.3,0.1,0.6,0.2,0.9c0.4,1.1,0.5,2,0.4,2.8c-0.8,5.7-0.8,9.9,0,15.6c0.1,0.8,0,1.7-0.4,2.8 C4.1,26.9,4,27.2,4,27.5C4,28.9,5.1,30,6.5,30c0.3,0,0.6-0.1,0.9-0.2c1.1-0.4,1.9-0.5,2.6-0.4c4.3,0.7,7.7,0.7,12.1,0 c0.7-0.1,1.5,0,2.6,0.4c0.3,0.1,0.6,0.2,0.9,0.2c1.4,0,2.5-1.1,2.5-2.5c0-0.3-0.1-0.6-0.2-0.9C27.4,25.5,27.3,24.6,27.4,23.8z M22,17.5c0.3,0,0.5,0.2,0.5,0.5c0,3.6-2.9,6.5-6.5,6.5S9.5,21.6,9.5,18c0-0.3,0.2-0.5,0.5-0.5c0.5,0,1,0.1,1.5,0.2 c-1.2-1.2-2-2.8-2-4.7c0-0.3,0.2-0.5,0.5-0.5c1.5,0,2.9,0.5,4,1.4c-0.7-2.2-0.1-4.8,1.6-6.5c0.2-0.2,0.5-0.2,0.7,0 c1.8,1.8,2.3,4.3,1.6,6.5c1.1-0.9,2.5-1.4,4-1.4c0.3,0,0.5,0.2,0.5,0.5c0,1.8-0.8,3.5-2,4.7C21,17.6,21.5,17.5,22,17.5z"></path> <path d="M14.5,19.3c0.6,0.6,1.2,1.4,1.5,2.2c0.3-0.8,0.9-1.6,1.5-2.2c-0.5,0.1-1,0.2-1.5,0.2S15,19.4,14.5,19.3z" ></path> </g> </g></svg>`;
        break;
    }
    return roleImage;
  }

  get borderDecorationImg() {
    const borderDecoration = document.createElement("img");
    borderDecoration.src = "https://i.postimg.cc/RhMvKv3G/valla.png";
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
    mainContainer.style.backgroundColor = this.themeColor().messageBackg;

    if (this.isStreamer) {
      mainContainer.style.borderColor = this.themeColor().streamer.border;
    } else if (this.isMod) {
      mainContainer.style.borderColor = this.themeColor().mod.border;
    } else if (this.isVip) {
      mainContainer.style.borderColor = this.themeColor().vip.border;
    } else if (this.isSub) {
      mainContainer.style.borderColor = this.themeColor().sub.border;
    } else {
      mainContainer.style.borderColor = this.themeColor().viewer.border;
    }
    mainContainer.style.backgroundImage =
      fieldData.theme === "light"
        ? "url('https://i.postimg.cc/3JwFF6vx/onda-chat-patata2.png')"
        : "url('https://i.postimg.cc/y8p2nGsy/onda-chat-patata.png')";

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

  get isMod() {
    console.log(this.message);
    return this.message.data.tags.mod === "1";
  }

  get isVip() {
    return this.message.data.tags.vip === "1";
  }

  async createUsernameInfoElement() {
    const usernameInfo = document.createElement("div");
    const usernameInfoContainer = document.createElement("div");
    const patatas = document.createElement("div");
    patatas.classList.add("patatas");
    const patatasImg = document.createElement("img");
    patatasImg.src = this.patatas;
    patatas.appendChild(patatasImg);
    usernameInfoContainer.classList.add("username-info-container");
    usernameInfo.classList.add("username-info");
    if (this.isStreamer) {
      usernameInfo.style.backgroundColor = this.themeColor().streamer.userBackg;
    } else if (this.isMod) {
      usernameInfo.style.backgroundColor = this.themeColor().mod.userBackg;
    } else if (this.isVip) {
      usernameInfo.style.backgroundColor = this.themeColor().vip.userBackg;
    } else if (this.isSub) {
      usernameInfo.style.backgroundColor = this.themeColor().sub.userBackg;
    } else {
      usernameInfo.style.backgroundColor = this.themeColor().viewer.userBackg;
    }
    usernameInfo.appendChild(this.createUsernameBadgesElement());
    usernameInfo.appendChild(this.createCapitalizeUserElement());
    usernameInfo.appendChild(patatas);
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
    const capitalizeUser = document.createElement("span");
    capitalizeUser.classList.add("capitalize-user");
    // capitalizeUser.style.color = this.themeColor().userColor;
    capitalizeUser.innerText = this.user;
    if (this.isStreamer) {
      capitalizeUser.style.color = this.themeColor().streamer.userColor;
    } else if (this.isMod) {
      capitalizeUser.style.color = this.themeColor().mod.userColor;
    } else if (this.isVip) {
      capitalizeUser.style.color = this.themeColor().vip.userColor;
    } else if (this.isSub) {
      capitalizeUser.style.color = this.themeColor().sub.userColor;
    } else {
      capitalizeUser.style.color = this.themeColor().viewer.userColor;
    }
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

    if (this.isStreamer) {
      pronouns.style.backgroundColor = this.themeColor().streamer.pronsBackg;
    } else if (this.isMod) {
      pronouns.style.backgroundColor = this.themeColor().mod.pronsBackg;
    } else if (this.isVip) {
      pronouns.style.backgroundColor = this.themeColor().vip.pronsBackg;
    } else if (this.isSub) {
      pronouns.style.backgroundColor = this.themeColor().sub.pronsBackg;
    } else {
      pronouns.style.backgroundColor = this.themeColor().pronsBackg;
    }

    pronounsContainer.appendChild(pronouns);
    return pronounsContainer;
  }

  themeColor() {
    let color = fieldData.theme;
    let colorObj =
      color === "dark"
        ? {
            messageBackg: "#d0945f",
            messageText: "#fff1cf",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "white",
            eventTextColor: "#b24c4a",
            border: "#aee173",
            role: "#ffc976",
            streamer: {
              border: "#aee173",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "white",
              userColor: "white",
            },
            vip: {
              border: "#aee173",
              userBackg: "#93ace4",
              pronsBackg: "#93ace4",
              color: "white",
              userColor: "white",
            },
            mod: {
              border: "#aee173",
              userBackg: "#aee073",
              pronsBackg: "#aee073",
              color: "white",
              userColor: "white",
            },
            viewer: {
              border: "#aee173",
              userBackg: "#ffcf98",
              pronsBackg: "#ffcf98",
              color: "white",
              userColor: "#ae713a",
            },
            sub: {
              border: "#aee173",
              userBackg: "#c4a2eb",
              pronsBackg: "#c4a2eb",
              color: "white",
              userColor: "white",
            },
          }
        : {
            messageBackg: "#ffe8cb",
            messageText: "#ae713a",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "#ffc976",
            eventTextColor: "white",
            border: "#ffcf98",
            role: "#ffc976",
            streamer: {
              border: "#ed746c",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "#b24c4a",
              userColor: "white",
            },
            vip: {
              border: "#93ace4",
              userBackg: "#93ace4",
              pronsBackg: "#93ace4",
              color: "#93ace4",
              userColor: "white",
            },
            mod: {
              border: "#aee173",
              userBackg: "#aee073",
              pronsBackg: "#aee073",
              color: "#7b9d3f",
              userColor: "white",
            },
            viewer: {
              border: "#ffcf98",
              userBackg: "#ffcf98",
              pronsBackg: "#ffcf98",
              color: "#ae713a",
              userColor: "#ae713a",
            },
            sub: {
              border: "#c4a2eb",
              userBackg: "#c4a2eb",
              pronsBackg: "#c4a2eb",
              color: "#9268c1",
              userColor: "white",
            },
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
    textContainer.style.color = this.themeColor().messageText;
    if (this.isStreamer) {
      textContainer.style.color = this.themeColor().streamer.color;
    } else if (this.isMod) {
      textContainer.style.color = this.themeColor().mod.color;
    } else if (this.isVip) {
      textContainer.style.color = this.themeColor().vip.color;
    } else if (this.isSub) {
      textContainer.style.color = this.themeColor().sub.color;
    } else {
      textContainer.style.color = this.themeColor().viewer.color;
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

  get icon() {
    const iconUrl = "https://i.postimg.cc/RhMvKv3G/valla.png";
    return iconUrl;
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

  themeColor() {
    let color = fieldData.theme;
    let colorObj =
      color === "dark"
        ? {
            messageBackg: "#d0945f",
            messageText: "#fff1cf",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "white",
            eventTextColor: "#b24c4a",
            border: "#aee173",
            role: "#ffc976",
            imgBackg: "#b24c4a",
            streamer: {
              border: "#aee173",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "white",
            },
          }
        : {
            messageBackg: "#ffe8cb",
            messageText: "#93ace4",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "#aee173",
            eventTextColor: "#637319",
            border: "#93ace4",
            role: "#ffc976",
            imgBackg: "#ffe8cb",
            streamer: {
              border: "#ed746c",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "#ed746c",
            },
          };

    return colorObj;
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
    const cont = document.createElement("div");
    const eventImage = document.createElement("div");
    const image = document.createElement("img");
    image.src = this.icon;

    eventImage.classList.add("event-image");
    eventImage.style.backgroundColor = this.themeColor().imgBackg;
    eventImage.appendChild(image);
    cont.classList.add("follow-container");
    cont.style.backgroundColor = this.themeColor().eventBckg;
    nameContainer.classList.add("follow-name");
    nameContainer.style.color = this.themeColor().eventTextColor;
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    cont.appendChild(eventImage);
    cont.appendChild(nameContainer);
    mainContainer.appendChild(cont);

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
    let color = fieldData.theme;
    let colorObj =
      color === "dark"
        ? {
            messageBackg: "#d0945f",
            messageText: "#fff1cf",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "white",
            eventTextColor: "#b24c4a",
            border: "#aee173",
            role: "#ffc976",
            imgBackg: "#b24c4a",
            streamer: {
              border: "#aee173",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "white",
            },
          }
        : {
            messageBackg: "#ffe8cb",
            messageText: "#93ace4",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "#aee173",
            eventTextColor: "white",
            border: "#93ace4",
            role: "#ffc976",
            imgBackg: "#ffe8cb",
            streamer: {
              border: "#ed746c",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "#ed746c",
            },
          };

    return colorObj;
  }

  get icon() {
    const iconUrl = "https://i.postimg.cc/RhMvKv3G/valla.png";
    return iconUrl;
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
    const cont = document.createElement("div");
    const eventImage = document.createElement("div");
    const image = document.createElement("img");
    image.src = this.icon;

    eventImage.classList.add("event-image");
    eventImage.style.backgroundColor = this.themeColor().imgBackg;
    eventImage.appendChild(image);
    cont.classList.add("bulk-container");
    cont.style.backgroundColor = this.themeColor().eventBckg;
    nameContainer.classList.add("bulk-name");
    nameContainer.style.color = this.themeColor().eventTextColor;
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    cont.appendChild(eventImage);
    cont.appendChild(nameContainer);
    mainContainer.appendChild(cont);

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

  themeColor() {
    let color = fieldData.theme;
    let colorObj =
      color === "dark"
        ? {
            messageBackg: "#d0945f",
            messageText: "#fff1cf",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "white",
            eventTextColor: "#b24c4a",
            border: "#aee173",
            role: "#ffc976",
            imgBackg: "#b24c4a",
            streamer: {
              border: "#aee173",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "white",
            },
          }
        : {
            messageBackg: "#ffe8cb",
            messageText: "#93ace4",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "#aee173",
            eventTextColor: "white",
            border: "#93ace4",
            role: "#ffc976",
            imgBackg: "#ffe8cb",
            streamer: {
              border: "#ed746c",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "#ed746c",
            },
          };

    return colorObj;
  }

  get icon() {
    const iconUrl = "https://i.postimg.cc/RhMvKv3G/valla.png";
    return iconUrl;
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
    const cont = document.createElement("div");
    const eventImage = document.createElement("div");
    const image = document.createElement("img");
    image.src = this.icon;

    eventImage.classList.add("event-image");
    eventImage.style.backgroundColor = this.themeColor().imgBackg;
    eventImage.appendChild(image);
    cont.classList.add("sub-container");
    cont.style.backgroundColor = this.themeColor().eventBckg;
    nameContainer.classList.add("sub-name");
    nameContainer.style.color = this.themeColor().eventTextColor;
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    cont.appendChild(eventImage);
    cont.appendChild(nameContainer);
    mainContainer.appendChild(cont);

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
    let color = fieldData.theme;
    let colorObj =
      color === "dark"
        ? {
            messageBackg: "#d0945f",
            messageText: "#fff1cf",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "white",
            eventTextColor: "#b24c4a",
            border: "#aee173",
            role: "#ffc976",
            imgBackg: "#b24c4a",
            streamer: {
              border: "#aee173",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "white",
            },
          }
        : {
            messageBackg: "#ffe8cb",
            messageText: "#93ace4",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "#aee173",
            eventTextColor: "white",
            border: "#93ace4",
            role: "#ffc976",
            imgBackg: "#ffe8cb",
            streamer: {
              border: "#ed746c",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "#ed746c",
            },
          };

    return colorObj;
  }

  get icon() {
    const iconUrl = "https://i.postimg.cc/RhMvKv3G/valla.png";
    return iconUrl;
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
    const cont = document.createElement("div");
    const eventImage = document.createElement("div");
    const image = document.createElement("img");
    image.src = this.icon;

    eventImage.classList.add("event-image");
    eventImage.style.backgroundColor = this.themeColor().imgBackg;
    eventImage.appendChild(image);
    cont.classList.add("raid-container");
    cont.style.backgroundColor = this.themeColor().eventBckg;
    nameContainer.classList.add("raid-name");
    nameContainer.style.color = this.themeColor().eventTextColor;
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    cont.appendChild(eventImage);
    cont.appendChild(nameContainer);
    mainContainer.appendChild(cont);

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
    let color = fieldData.theme;
    let colorObj =
      color === "dark"
        ? {
            messageBackg: "#d0945f",
            messageText: "#fff1cf",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "white",
            eventTextColor: "#b24c4a",
            border: "#aee173",
            role: "#ffc976",
            imgBackg: "#b24c4a",
            streamer: {
              border: "#aee173",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "white",
            },
          }
        : {
            messageBackg: "#ffe8cb",
            messageText: "#93ace4",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "#aee173",
            eventTextColor: "white",
            border: "#93ace4",
            role: "#ffc976",
            imgBackg: "#ffe8cb",
            streamer: {
              border: "#ed746c",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "#ed746c",
            },
          };

    return colorObj;
  }

  get icon() {
    const iconUrl = "https://i.postimg.cc/RhMvKv3G/valla.png";
    return iconUrl;
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

    const nameContainer = document.createElement("p");
    const cont = document.createElement("div");
    const eventImage = document.createElement("div");
    const image = document.createElement("img");
    image.src = this.icon;

    eventImage.classList.add("event-image");
    eventImage.style.backgroundColor = this.themeColor().imgBackg;
    eventImage.appendChild(image);
    cont.classList.add("cheer-container");
    cont.style.backgroundColor = this.themeColor().eventBckg;
    nameContainer.classList.add("cheer-name");
    nameContainer.style.color = this.themeColor().eventTextColor;
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    cont.appendChild(eventImage);
    cont.appendChild(nameContainer);
    mainContainer.appendChild(cont);

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
    let color = fieldData.theme;
    let colorObj =
      color === "dark"
        ? {
            messageBackg: "#d0945f",
            messageText: "#fff1cf",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "white",
            eventTextColor: "#b24c4a",
            border: "#aee173",
            role: "#ffc976",
            imgBackg: "#b24c4a",
            streamer: {
              border: "#aee173",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "white",
            },
          }
        : {
            messageBackg: "#ffe8cb",
            messageText: "#93ace4",
            userColor: "white",
            userBackg: "#93ace4",
            pronsColor: "white",
            pronsBackg: "#93ace4",
            eventBckg: "#aee173",
            eventTextColor: "white",
            border: "#93ace4",
            role: "#ffc976",
            imgBackg: "#ffe8cb",
            streamer: {
              border: "#ed746c",
              userBackg: "#ed746c",
              pronsBackg: "#ed746c",
              color: "#ed746c",
            },
          };

    return colorObj;
  }

  get icon() {
    const iconUrl = "https://i.postimg.cc/RhMvKv3G/valla.png";
    return iconUrl;
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
    const cont = document.createElement("div");
    const eventImage = document.createElement("div");
    const image = document.createElement("img");
    image.src = this.icon;

    eventImage.classList.add("event-image");
    eventImage.style.backgroundColor = this.themeColor().imgBackg;
    eventImage.appendChild(image);
    cont.classList.add("tip-container");
    cont.style.backgroundColor = this.themeColor().eventBckg;
    nameContainer.classList.add("tip-name");
    nameContainer.style.color = this.themeColor().eventTextColor;
    nameContainer.innerText = nameAndText;

    mainContainer.classList.add("event-container");
    cont.appendChild(eventImage);
    cont.appendChild(nameContainer);
    mainContainer.appendChild(cont);

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
  if (elem) {
    elem.style.animationName = `removeMessage`;
    elem.style.animationDuration = "0.6s";
    setTimeout(() => {
      elem.remove();
    }, 1000);
  }
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
          setTimeout(() => {
            removeMessage(mainContainer);
          }, fieldData.deleteMessages * 1000);
          mainCont.appendChild(mainContainer);

          // setTimeout(() => {
          //   const bigLine = mainContainer.querySelector("#big-line");
          //   const messageContainer =
          //     mainContainer.querySelector(".message-container");
          //   bigLine.style.height = `${messageContainer.offsetHeight}px`;
          // }, 500);
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
