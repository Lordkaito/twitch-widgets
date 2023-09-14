let mainObj = {};
let defaultApiData = {
  subscriber: {
    type: "subscriber",
    amount: 0,
  },
  follower: {
    type: "follower",
    amount: 0,
  },
  cheer: {
    type: "cheer",
    amount: 0,
  },
  tip: {
    type: "tip",
    amount: 0,
  },
};
let widgetApiData = {
  subscriber: {
    type: "subscriber",
    amount: 0,
  },
  follower: {
    type: "follower",
    amount: 0,
  },
  cheer: {
    type: "cheer",
    amount: 0,
  },
  tip: {
    type: "tip",
    amount: 0,
  },
};
let storedEvents = [];
let eventCounter = 0;
let timeout = null;
let firstEvent = true;
let previousSender = "";
let currentSender = "";
let items, step, goalType;
let animationActive = false;

window.addEventListener("onWidgetLoad", async function (obj) {
  let api = await getApiData(obj);
  init(obj, api, true);
});

let firstCopy = true;

window.addEventListener("onEventReceived", function (obj) {
  if (obj.detail.event.value === "reset") {
    clearApiData();
    return;
  }

  let event = obj.detail.event;
  let listener = obj.detail.listener;

  if (event.isCommunityGift) return;
  if (event.type === goalType) {
    if (listener === "cheer-latest" || listener === "tip-latest") {
      handleGrow(event.amount, updateApiData, false);
      return;
    }

    if (listener === "subscriber-latest" || listener === "follower-latest") {
      if (event.bulkGifted) {
        return;
      }
      handleGrow(1, updateApiData, false);
      return;
    }
  }
});

const getApiData = async (obj) => {
  // let data = await SE_API.store.get("beniartsTulipanGoalWidgetPreviousGained");
  // if (data === null) {
  //   widgetApiData = defaultApiData;
  // } else {
  //   widgetApiData = data;
  // }
  // if (obj.detail.fieldData.goalFullType === "session") {
  //   widgetApiData = defaultApiData;
  // }
  widgetApiData = defaultApiData;
  return widgetApiData;
};

function init(obj, apiData, initial = false) {
  mainObj = obj.detail;
  goalType = mainObj.fieldData.goalType;
  let peluche = document.querySelector(".peluche");

  let amount = apiData[goalType].amount;
  if (mainObj.fieldData.goalStart !== 0) {
    amount = amount + mainObj.fieldData.goalStartQuantity;
  }

  if (amount >= mainObj.fieldData.firstStep) {
    peluche.src = "https://i.postimg.cc/RZ1Ykxsb/tannafurro.png";
  }

  if (amount >= mainObj.fieldData.secondStep) {
    peluche.src = "https://i.postimg.cc/N0gnYCZG/tannamaid.png";
  }

  items = {
    progressBar: document.querySelector(".progress-bar"),
    goalText: document.querySelector(".goal-text-p"),
    goalAmount: document.querySelector(".goal-amount"),
    progressBarContainer: document.querySelector(".progress-bar-container"),
    progressionText: document.querySelector(".progressNums"),
    title: document.querySelector("#title"),
    round: document.querySelector("#round"),
  };

  let itemsColor = mainObj.fieldData.itemsColor;
  let percentageColor = mainObj.fieldData.percentageColor;
  // let progressBarColor = mainObj.fieldData.progressBarColor;
  items.progressBar.style.color = percentageColor;
  // items.goalText.innerText = mainObj.fieldData.goalText;
  // items.progressBar.style.backgroundColor = progressBarColor;
  // items.goalAmount.innerText = `${mainObj.fieldData.goalStartQuantity} | ${mainObj.fieldData.goalObjectiveQuantity}`;

  if (mainObj.fieldData.theme === "circles") {
    for (let i = 0; i < 5; i++) {
      let circle = document.createElement("div");
      circle.classList.add("circle");
      circle.classList.add("circle-" + (i + 1));
      circle.style.backgroundColor = itemsColor;
      items.round.appendChild(circle);
    }
  }

  if (mainObj.fieldData.theme === "hearts") {
    for (let i = 0; i < 5; i++) {
      let heart = document.createElement("div");
      heart.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 20 20"><path fill="${itemsColor}" d="m9.653 16.915l-.005-.003l-.019-.01a20.759 20.759 0 0 1-1.162-.682a22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01l-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z"></path></svg>`;
      heart.classList.add("heart");
      heart.classList.add("heart-" + (i + 1));
      items.round.appendChild(heart);
    }
  }

  if (mainObj.fieldData.theme === "stars") {
    for (let i = 0; i < 5; i++) {
      let stars = document.createElement("div");
      stars.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path fill="${itemsColor}" d="M9.153 5.408C10.42 3.136 11.053 2 12 2c.947 0 1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182c.28.213.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506c-.766.582-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452c-.347 0-.674.15-1.329.452l-.595.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882c.293-.941 1.523-1.22 3.983-1.776l.636-.144c.699-.158 1.048-.237 1.329-.45c.28-.213.46-.536.82-1.182l.328-.588Z"></path></svg>`;
      stars.classList.add("stars");
      stars.classList.add("stars-" + (i + 1));
      items.round.appendChild(stars);
    }
  }

  step = getStep(
    items.progressBarContainer,
    mainObj.fieldData.goalObjectiveQuantity
  );

  // items.title.innerText = mainObj.fieldData.title;
  let side = mainObj.fieldData.wateringCanSide;
  if (side === "right") {
    // items.reg.style.transform = "scaleX(-1)";
    // items.reg.style.left = "-11rem";
  }

  if (mainObj.fieldData.goalFullType === "session") {
    widgetApiData = defaultApiData;
    handleGrow(amount, null, true);
  } else if (initial === true) {
    handleGrow(amount, null, true);
  } else {
    handleGrow(amount, updateApiData, false);
  }
}

function checkIfCompleted(amountToUpdate) {
  let objective = mainObj.fieldData.goalObjectiveQuantity;
  let currentAmount = amountToUpdate;
  return currentAmount >= objective;
}

function getStep(container, objective) {
  const containerHeight = container.offsetHeight;
  const step = containerHeight / objective;
  return step;
}

function getGachoStep(diff, objective) {
  return diff / objective;
}

function handleGrow(amount, callback, initial = false) {
  if (!animationActive) {
    animationActive = true;
    // items.reg.style.opacity = "1";
    // setTimeout(() => {
    //   animationActive = false;
    //   // items.reg.style.opacity = "0";
    // }, 1500);
  }
  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;
  if (initial === true) {
    amountToUpdate = amount;
  }

  let completedGoal = checkIfCompleted(amountToUpdate);
  let currency = mainObj.fieldData.currency;
  if (!completedGoal) {
    console.log(items.progressBar);
    items.progressBar.style.height = amountToUpdate * step + "px";
    // items.goalAmount.innerText = `${amountToUpdate} | ${mainObj.fieldData.goalObjectiveQuantity}`;

    if (goalType === "tip") {
      items.progressionText.innerHTML =
        getPercentage(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity) +
        currency;
    } else {
      items.progressionText.innerHTML = getPercentage(
        amountToUpdate,
        mainObj.fieldData.goalObjectiveQuantity
      );
    }
  } else {
    items.progressBar.style.height = "100%";
    // items.goalAmount.innerText = `${amountToUpdate} | ${mainObj.fieldData.goalObjectiveQuantity}`;
    items.progressionText.innerHTML = getPercentage(
      amountToUpdate,
      mainObj.fieldData.goalObjectiveQuantity
    );
  }
  if (callback !== null || mainObj.fieldData.goalFullType === "session") {
    callback(amountToUpdate - mainObj.fieldData.goalStartQuantity);
  }
}

function getPercentage(amount, objective) {
  let percentage = (amount / objective) * 100;
  return Math.round(percentage) + "%";
}

function updateApiData(amountToUpdate) {
  widgetApiData[goalType].amount = amountToUpdate;
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", widgetApiData);
}

function clearApiData() {
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", defaultApiData);
  window.location.reload();
}
