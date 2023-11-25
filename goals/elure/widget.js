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
}

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
  // let data = await SE_API.store.get("beniartsElureGoalWidgetPreviousGained");
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
    progressBarContainer: document.querySelector(".progress-bar-container"),
    progressionText: document.querySelector(".progressNums"),
    ganchos: document.querySelector(".ganchos"),
    objective: document.querySelector(".goal-obj-50"),
    goalTypeText: document.querySelector(".goal-type-text"),
    goalTypeText2: document.querySelector(".goal-type-text-2"),
    peluche: document.querySelector(".peluche"),
    progressNums2: document.querySelector(".progressNums2"),
    nube4: document.querySelector(".nube4"),
    nube1: document.querySelector(".nube1"),
    luna: document.querySelector(".luna"),
    textVersion2: document.querySelector(".version-2-text"),
  };

  items.goalTypeText.innerText = mainObj.fieldData.goalText;
  items.goalTypeText2.innerText = mainObj.fieldData.goalText2;
  if (mainObj.fieldData.version === "2") {
    items.nube4.style.display = "none";
    items.nube1.style.display = "none";
    items.luna.style.top = "6.5rem";
    items.textVersion2.innerText = mainObj.fieldData.goalText;
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
  let currency = mainObj.fieldData.currency;

  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;
  if (initial === true) {
    amountToUpdate = amount;
  }

  let completedGoal = checkIfCompleted(amountToUpdate);
  items.objective.innerText = getPercentage(
    amountToUpdate,
    mainObj.fieldData.goalObjectiveQuantity
  );
  if (!completedGoal) {
    console.log(getPercentageInNums(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity) >= 25)
    if (
      getPercentageInNums(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity) >= 25
    ) {
      items.peluche.src = "https://i.postimg.cc/5trKtrXG/elure2.png";
    }
    if (
      getPercentageInNums(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity) >=
      50
    ) {
      items.peluche.src = "https://i.postimg.cc/0NjHPvyD/elure3.png";
    }
    if (
      getPercentageInNums(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity) >=
      75
    ) {
      items.peluche.src = "https://i.postimg.cc/tTVSnzPg/elure4.png";
    }
    let ganchosHeight = 32;
    let ganchoStep = getGachoStep(32, mainObj.fieldData.goalObjectiveQuantity);
    items.ganchos.style.top = `calc(${ganchosHeight}rem - ${
      amountToUpdate * ganchoStep
    }rem)`;
    console.log(items.ganchos.style.top);
    items.progressBar.style.height = `calc(100% - ${
      amountToUpdate * step - 5
    }px)`;
    if (goalType === "tip") {
      items.progressionText.innerHTML = `${amountToUpdate}` + currency;
      items.progressNums2.innerText = `${mainObj.fieldData.goalObjectiveQuantity}` + currency;
    } else {
      items.progressionText.innerHTML = `${amountToUpdate}`;
      items.progressNums2.innerText = `${mainObj.fieldData.goalObjectiveQuantity}`;
    }
  } else {
    items.ganchos.style.top = `0`;
    items.progressBar.style.height = "1%";
    items.progressionText.innerHTML = `${amountToUpdate}`;
    items.progressNums2.innerText = `${mainObj.fieldData.goalObjectiveQuantity}`;

    // 100% completed
    items.peluche.src = "https://i.postimg.cc/tTVSnzPg/elure4.png";
    if (goalType === "tip") {
      items.progressionText.innerHTML = `${amountToUpdate}` + currency;
      items.progressNums2.innerText = `${mainObj.fieldData.goalObjectiveQuantity}` + currency;
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

function getPercentageInNums(amount, objective) {
  let percentage = (amount / objective) * 100;
  return Math.round(percentage);
}

function updateApiData(amountToUpdate) {
  widgetApiData[goalType].amount = amountToUpdate;
  // SE_API.store.set("beniartsElureGoalWidgetPreviousGained", widgetApiData);
}

function clearApiData() {
  // SE_API.store.set("beniartsElureGoalWidgetPreviousGained", defaultApiData);
  window.location.reload();
}
