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

// let progreso = 0;
// let circle = document.querySelector("circle");
// let progressText = document.getElementById("progressCircle");
// function aumentarProgreso() {
//   if (progreso < 100) {
//     progreso += 10;
//     let progress = 540 - (540 * progreso) / 130;
//     circle.style.strokeDashoffset = progress;
//     progressText.innerText = progreso + "%";
//   }
// }

// document
//   .getElementById("progressCircle")
//   .addEventListener("click", aumentarProgreso);
let objective;

window.addEventListener("onWidgetLoad", async function (obj) {
  let api = await getApiData(obj);
  objective = obj.detail.fieldData.goalObjectiveQuantity;
  console.log(objective);
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
    progressBar: document.querySelector(".progress-bar"),
    goalText: document.querySelector(".goal-text"),
    colita: document.querySelector(".colita"),
    progressBarContainer: document.querySelector(".progress-bar-container"),
    progressionText: document.querySelector(".progressNums"),
    title: document.querySelector("#title"),
    progressImg: document.querySelector(".img-container"),
    completeText: document.querySelector(".progression"),
    reg: document.querySelector(".gifReg"),
    image: document.querySelector("#image"),
    ganchos: document.querySelector(".ganchos"),
    objective: document.querySelector(".goal-obj-50"),
    goalTypeText: document.querySelector(".goal-type-text"),
  };

  let text = {
    subscriber: "sub goal",
    follower: "follow goal",
    cheer: "cheer goal",
    tip: "tip goal",
  };

  items.objective.innerText = mainObj.fieldData.goalObjectiveQuantity;

  if (mainObj.fieldData.goalType === "tip") {
    items.objective.innerText =
      mainObj.fieldData.goalObjectiveQuantity + mainObj.fieldData.currency;
  }

  if (mainObj.fieldData.goalObjectiveQuantity > 999) {
    items.objective.style.fontSize = "1.5rem";
    items.objective.style.fontSize = "1.3rem";
    items.objective.style.top = "2rem";
    items.objective.style.left = "1.1rem";
  }

  if (mainObj.fieldData.goalObjectiveQuantity > 9999) {
    items.objective.style.fontSize = "1.3rem";
    items.objective.style.top = "2rem";
    items.objective.style.left = "1.1rem";
  }
  if (mainObj.fieldData.goalObjectiveQuantity > 99999) {
    items.objective.style.fontSize = "1.1rem";
    items.objective.style.top = "2rem";
    items.objective.style.left = "1.1rem";
  }
  items.goalTypeText.innerText = text[goalType];

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
  return currentAmount >= objective;
}

function getStep(container, objective) {
  const containerHeight = container.offsetHeight;
  const step = container / objective;
  return step;
}

function getGachoStep(diff, objective) {
  return diff / objective;
}

let progreso = 0;
let circle = document.querySelector("circle");
let progressText = document.getElementById("progressCircle");
const newStep = getStep(540, objective);
function aumentarProgreso(amount) {
  const thing = getStep(540, objective) * amount;
  console.log(thing);
  progreso += newStep;
  let progress = 540 - (540 * thing) / 720;
  circle.style.strokeDashoffset = progress;
  progressText.innerText = getPercentage(amount, objective);
}

function handleGrow(amount, callback, initial = false) {
  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;
  if (initial === true) {
    amountToUpdate = amount;
  }

  let completedGoal = checkIfCompleted(amountToUpdate);
  if (!completedGoal) {
    console.log(amountToUpdate);
    aumentarProgreso(amountToUpdate);
  } else {
    aumentarProgreso(objective);
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
