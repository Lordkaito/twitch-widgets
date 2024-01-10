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

    if (listener === "follower-latest") {
      handleGrow(1, updateApiData, false);
      return;
    }

    if (listener === "subscriber-latest") {
      if (event.bulkGifted) {
        handleGrow(event.amount, updateApiData, false);
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

  let amount = apiData[goalType].amount;
  if (mainObj.fieldData.goalStart !== 0) {
    amount = amount + mainObj.fieldData.goalStartQuantity;
  }

  items = {
    progression: document.querySelector("#title"),
    // goalNameText: document.querySelector("#title"),
    progressBar: document.querySelector(".progress-bar"),
    progressBarContainer: document.querySelector(".progress-bar-container"),
    percentage: document.querySelector(".percentage"),
    imgOff: document.querySelector(".img-off"),
    imgOn: document.querySelector(".img-on"),
  };

  items.progression.innerText = mainObj.fieldData.goalObjectiveQuantity;

  if (mainObj.fieldData.goalType === "tip") {
    items.progression.innerText =
      mainObj.fieldData.goalObjectiveQuantity + mainObj.fieldData.currency;
  }

  step = getStep(
    items.progressBarContainer,
    mainObj.fieldData.goalObjectiveQuantity
  );

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
  console.log(currentAmount, objective);
  return currentAmount >= objective;
}

function getStep(container, objective) {
  const containerHeight = container.offsetWidth;
  const step = containerHeight / objective;
  return step;
}

function getGachoStep(diff, objective) {
  return diff / objective;
}

let isAnimationPlaying = false;

function handleGrow(amount, callback, initial = false) {
  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;
  if (initial === true) {
    amountToUpdate = amount;
  }
  let currency = mainObj.fieldData.currency;
  let completedGoal = checkIfCompleted(amountToUpdate);
  let title = mainObj.fieldData.title || "Goal name"
  let objective = mainObj.fieldData.goalObjectiveQuantity
  items.progression.innertText = title + amountToUpdate + " | " + objective
  items.percentage.innerText = getPercentage(
    amountToUpdate,
    mainObj.fieldData.goalObjectiveQuantity
  );
  if(!isAnimationPlaying) {
    isAnimationPlaying = true;
    items.imgOff.style.animation = "imgOff .8s ease-in-out forwards"
    items.imgOn.style.animation = "imgOn 1.2s .5s ease-in-out forwards"
    setTimeout(() => {
      isAnimationPlaying = false;
      items.imgOff.style.animation = "none"
      items.imgOn.style.animation = "none"
    }, 2000);
  }
  if (!completedGoal) {
    items.progressBar.style.width = `${amountToUpdate * step}px`;
    if (goalType === "tip") {
      items.progression.innerText = title + " " + amountToUpdate + currency +" | " + objective + currency;
    }
  } else {
    items.progressBar.style.width = "100%";
    if (goalType === "tip") {
      items.progression.innerText = title + " " + amountToUpdate + currency +" | " + objective + currency;
    }
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
