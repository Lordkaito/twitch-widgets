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
let items, step, goalType;
let objective;
let activeGoal;
let goals;

window.addEventListener("onWidgetLoad", async function (obj) {
  let api = await getApiData(obj);
  objective = obj.detail.fieldData.goalObjectiveQuantity;
  goals = {
    goal1: obj.detail.fieldData.goalObjectiveQuantity,
    goal2: obj.detail.fieldData.goalObjectiveQuantity2,
    goal3: obj.detail.fieldData.goalObjectiveQuantity3,
    goal4: obj.detail.fieldData.goalObjectiveQuantity4,
    goal5: obj.detail.fieldData.goalObjectiveQuantity5,
    goal6: obj.detail.fieldData.goalObjectiveQuantity6,
  };
  activeGoal = goals.goal1;
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

  if (
    listener == "message" &&
    event.data.text.startsWith(mainObj.fieldData.command)
  ) {
    if (animationActive(items.goalTopBox)) return;
    items.goalTopBox.classList.add("upOutTop");
    setTimeout(() => {
      items.goalTopBox.classList.remove("upOutTop");
    }, 4000);
  }

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
    objective: document.querySelector(".goal-obj-50"),
    goalTypeText: document.querySelector(".goal-type-text"),
    goalTopBox: document.querySelector(".img-goal-top"),
    titleGoal: document.querySelector("#goal-type-text"),
  };

  let text = mainObj.fieldData.goalTypeText.toLowerCase();

  items.objective.innerText = mainObj.fieldData.goalObjectiveQuantity;
  // if (goalType === "tip") {
  //   items.objective.innerText =
  //     mainObj.fieldData.goalObjectiveQuantity + mainObj.fieldData.currency;
  // }

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

function checkIfCompleted(amountToUpdate, currentGoal) {
  // let objective = mainObj.fieldData.goalObjectiveQuantity;
  let currentAmount = amountToUpdate;
  return currentAmount >= currentGoal;
}

function getStep(container, objective) {
  const step = container / objective;
  return step;
}

function getGachoStep(diff, objective) {
  return diff / objective;
}

function getActiveGoal(keys, activeGoal) {
  const current = keys.find((key) => goals[key] === activeGoal);
  return current;
}

function animationActive(animation, element) {
  element.classList.contains(animation) &&
  amountToUpdate <= mainObj.fieldData.goalObjectiveQuantity6
    ? true
    : false;
}

function animationActive(element) {
  return element.classList.contains("upOutTop");
}

function handleGrow(amount, callback, initial = false) {
  let chocolates = {
    goal1: document.querySelector(".img-goal1"),
    goal2: document.querySelector(".img-goal2"),
    goal3: document.querySelector(".img-goal3"),
    goal4: document.querySelector(".img-goal4"),
    goal5: document.querySelector(".img-goal5"),
    goal6: document.querySelector(".img-goal6"),
  };

  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;

  if (initial === true) {
    amountToUpdate = amount;
  }

  const completed = checkIfCompleted(amountToUpdate, activeGoal);

  const currency = mainObj.fieldData.currency;

  if (!completed) {
    items.objective.innerText = amountToUpdate + " | " + activeGoal;
    if (goalType === "tip") {
      items.objective.innerText =
        amountToUpdate + currency + " | " + activeGoal + currency;
    }
  } else {
    if (amountToUpdate >= activeGoal) {
      if (animationActive(items.goalTopBox)) {
      } else {
        const keys = Object.keys(goals);
        const current = getActiveGoal(keys, activeGoal, amountToUpdate);
        items.goalTopBox.classList.add("upOutTop");
        chocolates[current].classList.add("upOut");
        setTimeout(() => {
          items.goalTopBox.classList.remove("upOutTop");
        }, 4000);
      }
    }
    if (amountToUpdate >= mainObj.fieldData.goalObjectiveQuantity6) {
      items.objective.innerText =
        amountToUpdate + " | " + mainObj.fieldData.goalObjectiveQuantity6;
      if (goalType === "tip") {
        items.objective.innerText =
          amountToUpdate +
          currency +
          " | " +
          mainObj.fieldData.goalObjectiveQuantity6 +
          currency;
      }
    } else {
      const keys = Object.keys(goals);
      const current = getActiveGoal(keys, activeGoal, amountToUpdate);
      const currentIndex = keys.indexOf(current);
      const nextIndex = (currentIndex + 1) % keys.length;
      const nextGoal = keys[nextIndex];

      if (amountToUpdate >= activeGoal) {
        if (animationActive(items.goalTopBox)) {
        } else {
          items.goalTopBox.classList.add("upOutTop");
          setTimeout(() => {
            items.goalTopBox.classList.remove("upOutTop");
          }, 4000);
        }
      }
      activeGoal = goals[nextGoal];
      items.objective.innerText = amountToUpdate + " | " + activeGoal;
      if (goalType === "tip") {
        items.objective.innerText =
          amountToUpdate + currency + " | " + activeGoal + currency;
      }
      chocolates[current].classList.add("upOut");
    }
  }

  // if (goal) {
  //   items.objective.innerText = amountToUpdate + " | " + goal;
  // }

  // if (!isCompleted) {
  //   items.objective.innerText = amountToUpdate + " | " + goal;
  // }

  // if (isCompleted) {
  //   items.goalTopBox.classList.add("upOutTop");
  //   chocolates.chocolate1.classList.add("upOut");
  //   items.objective.innerText = amountToUpdate + " | " + goal;
  // }

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
