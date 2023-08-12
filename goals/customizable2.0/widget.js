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

window.addEventListener("onWidgetLoad", async function (obj) {
  console.log("onWidgetLoad");
  let api = await getApiData(obj);
  console.log(api, "aaa");
  init(obj, api, true);
});

let firstCopy = true;

window.addEventListener("onEventReceived", function (obj) {
  console.log(obj);
  if (obj.detail.event.value === "reset") {
    clearApiData();
    return;
  }

  let event = obj.detail.event;
  let listener = obj.detail.listener;

  if (event.type === goalType) {
    if (listener === "cheer-latest" || listener === "tip-latest") {
      console.log("inside cheer-latest or tip-latest");
      handleGrow(event.amount, updateApiData, false);
      return;
    }

    if (listener === "subscriber-latest" || listener === "follower-latest") {
      if (event.bulkGifted) {
        return;
      }
      console.log("inside subscriber-latest or follower-latest");
      handleGrow(1, updateApiData, false);
      return;
    }
  }
});

const getApiData = async (obj) => {
  console.log("getApiData");
  let data = await SE_API.store.get(
    "beniartsRinaHorizontalGoalWidgetPreviousGained"
  );
  console.log(data, "getApiData");
  if (data === null) {
    widgetApiData = defaultApiData;
  } else {
    widgetApiData = data;
  }
  if (obj.detail.fieldData.goalFullType === "session") {
    widgetApiData = defaultApiData;
  }
  // widgetApiData = defaultApiData;
  return widgetApiData;
};

function init(obj, apiData, initial = false) {
  console.log("init");
  mainObj = obj.detail;
  goalType = mainObj.fieldData.goalType;
  console.log(apiData[goalType], "apiData goal type");

  let amount = apiData[goalType].amount;
  if(mainObj.fieldData.goalStart !== 0){
    amount = amount + mainObj.fieldData.goalStartQuantity;
  }
  console.log(amount, apiData);

  items = {
    progressBar: document.querySelector(".progress-bar"),
    goalText: document.querySelector(".goal-text"),
    colita: document.querySelector(".colita"),
    progressBarContainer: document.querySelector(".progress-bar-container"),
    progressionText: document.querySelector(".progression"),
    title: document.querySelector("#title"),
    progressImg: document.querySelector(".img-container"),
  };

  step = getStep(
    items.progressBarContainer,
    mainObj.fieldData.goalObjectiveQuantity
  );

  items.title.innerText = mainObj.fieldData.title;
  let { goalNameColor, numbersColor, progressBarColor, progressBackColor } =
    mainObj.fieldData;
  let theme = mainObj.fieldData.theme;
  switch (theme) {
    case "heart":
      goalNameColor = "#ff5cab";
      numbersColor = "#ff5cab";
      progressBarColor = "#ffa4d1";
      progressBackColor = "#fff";
      image.src = "https://i.postimg.cc/rwTgVtNk/cora.png";
      image.style.width = "64px";
      image.style.height = "54px";
      image.style.transform = "scale(.7)";
      image.style.top = "-.6rem";
      break;
    case "flower":
      goalNameColor = "#ffee6e";
      numbersColor = "#ffee6e";
      progressBarColor = "#feabb1";
      progressBackColor = "#fff";
      image.src = "https://i.postimg.cc/G9w8jGmh/flo.png";
      image.style.width = "64px";
      image.style.height = "64px";
      image.style.transform = "scale(.7)";
      image.style.top = "-.8rem";
      break;
    case "leaf":
      goalNameColor = "#9dda57";
      numbersColor = "#9dda57";
      progressBarColor = "#b7f076";
      progressBackColor = "#f99175";
      image.src = "https://i.postimg.cc/9M07XckV/hojiiis.png";
      image.style.width = "56px";
      image.style.height = "58px";
      image.style.transform = "scale(.6)";
      image.style.top = "-.6rem";
      break;
    case "moon":
      goalNameColor = "#a5baff";
      numbersColor = "#a5baff";
      progressBarColor = "#7693f0";
      progressBackColor = "#373e54";
      image.src = "https://i.postimg.cc/43BcTYBB/lunita.png";
      image.style.width = "64px";
      image.style.height = "64px";
      image.style.transform = "scale(.7)";
      image.style.top = "-1rem";
      break;
  }
  if (mainObj.fieldData.goalNameColor === "#123456") {
    console.log("here");
    goalNameColor = goalNameColor;
  } else {
    goalNameColor = mainObj.fieldData.goalNameColor;
  }

  if (mainObj.fieldData.numbersColor === "#123456") {
    numbersColor = numbersColor;
  } else {
    numbersColor = mainObj.fieldData.numbersColor;
  }

  if (mainObj.fieldData.progressBarColor === "#123456") {
    progressBarColor = progressBarColor;
  } else {
    progressBarColor = mainObj.fieldData.progressBarColor;
  }

  if (mainObj.fieldData.progressBackColor === "#123456") {
    progressBackColor = progressBackColor;
  } else {
    progressBackColor = mainObj.fieldData.progressBackColor;
  }
  let progressBarBack = document.querySelector(".progress-bar-container");
  progressBarBack.style.backgroundColor = progressBackColor;
  items.progressBar.style.backgroundColor = progressBarColor;
  console.log(progressBarColor, "progressBarColor");
  items.progressionText.style.color = numbersColor;
  items.title.style.color = goalNameColor;

  if (mainObj.fieldData.goalFullType === "session") {
    widgetApiData = defaultApiData;
    handleGrow(amount, null, true);
  } else if (initial === true) {
    console.log(apiData[goalType], "apiData goal type initial");
    handleGrow(amount, null, true);
  } else {
    handleGrow(amount, updateApiData, false);
  }
}

function checkIfCompleted(amountToUpdate) {
  console.log("checkIfCompleted");
  let objective = mainObj.fieldData.goalObjectiveQuantity;
  let currentAmount = amountToUpdate;
  console.log(currentAmount, objective, "checkIfCompleted");
  return currentAmount >= objective;
}

function getStep(container, objective) {
  console.log("getStep");
  const containerWidth = container.offsetWidth;
  const step = containerWidth / objective;
  return step;
}

function handleGrow(amount, callback, initial = false) {
  console.log("handleGrow");
  let amountToUpdate = widgetApiData[goalType].amount + amount + mainObj.fieldData.goalStartQuantity;
  if (initial === true) {
    amountToUpdate = amount;
  }

  let completedGoal = checkIfCompleted(amountToUpdate);
  let currency = mainObj.fieldData.currency;
  if (!completedGoal) {
    image.style.left = `${amountToUpdate * step - 23}px`;
    items.progressBar.style.width = `${amountToUpdate * step}px`;

    if (goalType === "tip") {
      items.progressionText.innerHTML =
        amountToUpdate +
        "/" +
        mainObj.fieldData.goalObjectiveQuantity +
        currency;
    } else {
      items.progressionText.innerHTML =
        amountToUpdate + "/" + mainObj.fieldData.goalObjectiveQuantity;
    }
  } else {
    image.style.left = `32rem`;
    items.progressBar.style.width = "100%";
    items.progressionText.innerHTML = `${amountToUpdate} / ${mainObj.fieldData.goalObjectiveQuantity}`;
  }
  if (callback !== null || mainObj.fieldData.goalFullType === "session") {
    callback(amountToUpdate - mainObj.fieldData.goalStartQuantity);
  }
}

function updateApiData(amountToUpdate) {
  console.log("updateApiData");
  widgetApiData[goalType].amount = amountToUpdate;
  console.log(widgetApiData[goalType].amount, amountToUpdate, widgetApiData);
  SE_API.store.set(
    "beniartsRinaHorizontalGoalWidgetPreviousGained",
    widgetApiData
  );
}

function clearApiData() {
  console.log("clearApiData");
  SE_API.store.set(
    "beniartsRinaHorizontalGoalWidgetPreviousGained",
    defaultApiData
  );
  window.location.reload();
}

function cancelExecution(detail) {
  console.log("cancelExecution");
  if (!detail.event.gifted) {
    currentSender = detail.event.sender || detail.event.name;
    detail.event.amount = 1;
    window.dispatchEvent(
      new CustomEvent("onEventReceived", {
        detail: {
          listener: "custom",
          event: {
            amount: 1,
            avatar: detail.event.avatar,
            displayName: detail.event.displayName,
            gifted: detail.event.gifted,
            type: detail.event.type,
            tier: detail.event.tier,
            message: detail.event.message,
            name: detail.event.name,
            quantity: detail.event.quantity,
            sessionTop: detail.event.sessionTop,
            providerId: detail.event.providerId,
            originalEventName: detail.event.originalEventName,
          },
        },
      })
    );
    return;
  }

  if (firstEvent || currentSender === previousSender || previousSender === "") {
    storedEvents.push(detail.event);
  } else {
    detail.event.amount = 1;
    window.dispatchEvent(
      new CustomEvent("onEventReceived", {
        detail: {
          listener: "custom",
          event: {
            amount: 1,
            avatar: detail.event.avatar,
            displayName: detail.event.displayName,
            gifted: detail.event.gifted,
            sender: detail.event.sender,
            type: detail.event.type,
            tier: detail.event.tier,
            message: detail.event.message,
            name: detail.event.name,
            quantity: detail.event.quantity,
            sessionTop: detail.event.sessionTop,
            providerId: detail.event.providerId,
            originalEventName: detail.event.originalEventName,
          },
        },
      })
    );
    previousSender = "";
  }

  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    if (storedEvents.length > 1) {
      window.dispatchEvent(
        new CustomEvent("onEventReceived", {
          detail: {
            listener: "custom",
            event: {
              amount: storedEvents.length,
              avatar: detail.event.avatar,
              displayName: detail.event.displayName,
              gifted: detail.event.gifted,
              sender: storedEvents[0].sender,
              type: detail.event.type,
              tier: detail.event.tier,
              message: detail.event.message,
              name: detail.event.name,
              quantity: detail.event.quantity,
              sessionTop: detail.event.sessionTop,
              providerId: detail.event.providerId,
              originalEventName: detail.event.originalEventName,
            },
          },
        })
      );
      previousSender = "";
    } else if (storedEvents.length === 1) {
      window.dispatchEvent(
        new CustomEvent("onEventReceived", {
          detail: {
            listener: "custom",
            event: {
              amount: storedEvents.length,
              avatar: detail.event.avatar,
              displayName: detail.event.displayName,
              gifted: detail.event.gifted,
              sender: storedEvents[0].sender,
              type: "custom",
              tier: detail.event.tier,
              message: detail.event.message,
              name: detail.event.name,
              quantity: detail.event.quantity,
              sessionTop: detail.event.sessionTop,
              providerId: detail.event.providerId,
              originalEventName: detail.event.originalEventName,
            },
          },
        })
      );
    }
    storedEvents = [];
  }, 500);
}