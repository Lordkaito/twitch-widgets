let mainObj = {};
const goalBox = {
  heartBox: "https://i.postimg.cc/N0db0kF2/basecaja.png",
  // heartTopBox: "https://i.postimg.cc/C5q4myNb/tapacaja.png",
  // chocolate1: "https://i.postimg.cc/kXSjyS1L/bombon1.png",
  // chocolate2: "https://i.postimg.cc/FHQTCKwz/bombon2.png",
  // chocolate3: "https://i.postimg.cc/pdWqx6Wt/bombon3.png",
  // chocolate4: "https://i.postimg.cc/y8XvMHzP/bombon4.png",
  // chocolate5: "https://i.postimg.cc/PxNyvvv3/bombon5.png",
  // chocolate6: "https://i.postimg.cc/9MSpdXGW/bombon6.png",
};
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
    goalBox: document.querySelector(".img-goal"),
    goalTopBox: document.querySelector(".img-goal-top"),
    goalStroke: document.querySelector("#stroke-circle"),
    progressCircle: document.getElementById("progressCircle"),
    titleGoal: document.querySelector("#goal-type-text"),
  };

  let text = mainObj.fieldData.goalTypeText;

  items.objective.innerText = mainObj.fieldData.goalObjectiveQuantity;

  // Setting custom color to title of goal
  items.titleGoal.style.color = "#ffe4c2";
  // items.titleGoal.style.color = mainObj.fieldData.textGoalTitleColor;

  // Setting custom background color to title of goal
  items.titleGoal.style.background = "#cf4055";
  // items.titleGoal.style.background = mainObj.fieldData.backgroundGoalTitleColor;

  // Setting custom color to title of goal
  items.objective.style.color = "#cf4055";
  // items.objective.style.color = mainObj.fieldData.goalColor;

  // Setting custom background color to title of goal
  items.objective.style.background = "#f38e99";
  // items.objective.style.background = mainObj.fieldData.backgroundGoalColor;

  // Setting custom color to nums/counters of goal
  items.objective.style.color = mainObj.fieldData.numsGoalColor;

  // Setting each chocolate
  // items.chocolate1.src = goalBox.chocolate1;
  // items.chocolate2.src = goalBox.chocolate2;
  // items.chocolate3.src = goalBox.chocolate3;
  // items.chocolate4.src = goalBox.chocolate4;
  // items.chocolate5.src = goalBox.chocolate5;
  // items.chocolate6.src = goalBox.chocolate6;

  // Setting custom tree to goal
  switch (mainObj.fieldData.goalBox) {
    case "heart":
      items.goalBox.src = goalBox.heartBox;
      break;

    default:
      items.goalBox.src = goalBox.heartBox;
      break;
  }

  items.goalTypeText.innerText = text;

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
  // const containerHeight = container.offsetHeight;
  const step = container / objective;
  return step;
}

function getGachoStep(diff, objective) {
  return diff / objective;
}

let progreso = 0;
let circle = document.querySelector("circle");
const newStep = getStep(540, objective);
function aumentarProgreso(amount) {
  const thing = getStep(540, objective) * amount;
  console.log(thing);
  progreso += newStep;
  let progress = 540 - (540 * thing) / 720;
  circle.style.strokeDashoffset = progress;
  items.progressCircle.innerText = getPercentage(amount, objective);
}

function handleGrow(amount, callback, initial = false) {
  let chocolates = {
    chocolate1: document.querySelector(".img-goal1"),
    chocolate2: document.querySelector(".img-goal2"),
    chocolate3: document.querySelector(".img-goal3"),
    chocolate4: document.querySelector(".img-goal4"),
    chocolate5: document.querySelector(".img-goal5"),
    chocolate6: document.querySelector(".img-goal6"),
  };

  let goalCounter = 0;

  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;

  if (initial === true) {
    amountToUpdate = amount;
  }

  let completedGoal = checkIfCompleted(amountToUpdate);
  aumentarProgreso(amountToUpdate);
  items.objective.innerText =
    amountToUpdate + " | " + mainObj.fieldData.goalObjectiveQuantity;

  if (completedGoal) {
    if (goalCounter <= 6 && goalCounter >= 0) {
      goalCounter++;
      items.goalTopBox.classList.add("upOutTop");
      switch (goalCounter) {
        case 1:
          chocolates.chocolate1.classList.add("upOut");
          break;
        case 2:
          chocolates.chocolate2.classList.add("upOut");
          break;
        case 3:
          chocolates.chocolate3.classList.add("upOut");
          break;
        case 4:
          chocolates.chocolate4.classList.add("upOut");
          break;
        case 5:
          chocolates.chocolate5.classList.add("upOut");
          break;
        case 6:
          chocolates.chocolate6.classList.add("upOut");
          goalCounter = 0;
          break;
      }
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
