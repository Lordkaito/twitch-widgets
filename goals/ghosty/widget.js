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
  // let data = await SE_API.store.get("beniartsStarredSkyGoalWidgetPreviousGained");
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
    completeText: document.querySelector(".progression"),
  };

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
  const containerWidth = container.offsetHeight;
  const step = containerWidth / objective;
  return step;
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
  let currency = mainObj.fieldData.currency;
  if (!completedGoal) {
    items.progressBar.style.height = `${amountToUpdate * step}px`;

    if (goalType === "tip") {
      items.progressionText.innerHTML =
        "<p class=' obtectiveText'>" +
        amountToUpdate + currency +
        "</p><span class='barSeparator'>|</span><p class='objective2 obtectiveText'>" +
        mainObj.fieldData.goalObjectiveQuantity + currency
        "</p>";
    } else {
      items.progressionText.innerHTML =
        "<p class=' obtectiveText'>" +
        amountToUpdate +
        "</p><span class='barSeparator'>|</span><p class='objective2 obtectiveText'>" +
        mainObj.fieldData.goalObjectiveQuantity +
        "</p>";
    }
  } else {
    if (goalType === "tip") {
      items.progressionText.innerHTML =
        "<p class=' obtectiveText'>" +
        amountToUpdate + currency +
        "</p><span class='barSeparator'>|</span><p class='objective2 obtectiveText'>" +
        mainObj.fieldData.goalObjectiveQuantity + currency
        "</p>";
    } else {
      items.progressionText.innerHTML =
      "<p class=' obtectiveText'>" +
      amountToUpdate +
      "</p><span class='barSeparator'>|</span><p class='objective2 obtectiveText'>" +
      mainObj.fieldData.goalObjectiveQuantity +
      "</p>";
    }
    items.progressBar.style.height = "100%";
  }
  if (callback !== null || mainObj.fieldData.goalFullType === "session") {
    callback(amountToUpdate - mainObj.fieldData.goalStartQuantity);
  }
}

function updateApiData(amountToUpdate) {
  widgetApiData[goalType].amount = amountToUpdate;
  // SE_API.store.set("beniartsStarredSkyGoalWidgetPreviousGained", widgetApiData);
}

function clearApiData() {
  // SE_API.store.set("beniartsStarredSkyGoalWidgetPreviousGained", defaultApiData);
  window.location.reload();
}

function getPercentage(amount, objective) {
  let percentage = (amount / objective) * 100;
  return Math.round(percentage) + "%";
}
