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
function checkIfCompletedGoals(amountToUpdate) {
  const objectives = [
    mainObj.fieldData.goalObjectiveQuantity,
    mainObj.fieldData.goalObjectiveQuantity2,
    mainObj.fieldData.goalObjectiveQuantity3,
    mainObj.fieldData.goalObjectiveQuantity4,
    mainObj.fieldData.goalObjectiveQuantity5,
    mainObj.fieldData.goalObjectiveQuantity6,
  ];
  const currentAmount = amountToUpdate;
  let nextGoal = 0;

  for (let i = 0; i < objectives.length; i++) {
    console.log(currentAmount + " vs " + objectives[i]);
    if (currentAmount === objectives[i]) {
      if (objectives[i + 1] !== undefined) {
        nextGoal = objectives[i + 1];
      } else {
        nextGoal = null;
      }
      return {
        isCompleted: true,
        goal: nextGoal,
        goals: objectives,
      };
    }
  }

  return {
    isCompleted: false,
    goals: objectives,
  };
}

function getStep(container, objective) {
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

  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;

  if (initial === true) {
    amountToUpdate = amount;
  }

  let { isCompleted, goal, goals } = checkIfCompletedGoals(amountToUpdate);
  // let currentGoal = mainObj.fieldData.goalStartQuantity;

  // true
  // isCompleted = true goal = 200

  // false
  // isCompleted = false

  aumentarProgreso(amountToUpdate);
  if (goal) {
    items.objective.innerText = amountToUpdate + " | " + goal;
  }

  if (goals) {
    
    items.goalTopBox.classList.remove("upOutTop");
    chocolates.chocolate1.classList.remove("upOut");
    if (amountToUpdate <= goals[0] && isCompleted == false) {
      items.objective.innerText = amountToUpdate + " | " + goals[0];
    } else if (amountToUpdate <= goals[1] && isCompleted == false) {
      items.objective.innerText = amountToUpdate + " | " + goals[1];
    } else if (amountToUpdate <= goals[2] && isCompleted == false) {
      items.objective.innerText = amountToUpdate + " | " + goals[2];
    } else if (amountToUpdate <= goals[3] && isCompleted == false) {
      items.objective.innerText = amountToUpdate + " | " + goals[3];
    } else if (amountToUpdate <= goals[4] && isCompleted == false) {
      items.objective.innerText = amountToUpdate + " | " + goals[4];
    } else if (amountToUpdate <= goals[5] && isCompleted == false) {
      items.objective.innerText = amountToUpdate + " | " + goals[5];
    }
  }

  if (isCompleted) {
    items.goalTopBox.classList.add("upOutTop");
    chocolates.chocolate1.classList.add("upOut");
    items.objective.innerText = amountToUpdate + " | " + goal;
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
