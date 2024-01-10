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
  console.log(obj.detail.listener);
  console.log(obj);
  // if (firstCopy) {
  //   console.log("first copy", firstCopy);
  //   firstCopy = false;
  //   console.log("first copy", firstCopy);
  //   return;
  // }
  // if (obj.detail.listener === "kvstore:update") return;
  // console.log("onEventReceived", obj);
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
  // let data = await SE_API.store.get(
  //   "beniartsRinaHorizontalGoalWidgetPreviousGained"
  // );
  // console.log(data, "getApiData");
  // if (data === null) {
  //   widgetApiData = defaultApiData;
  // } else {
  //   widgetApiData = data;
  // }
  // if(obj.detail.fieldData.goalFullType === "session") {
  //   widgetApiData = defaultApiData;
  // }
  widgetApiData = defaultApiData;
  return widgetApiData;
};

function init(obj, apiData, initial = false) {
  console.log("init");
  mainObj = obj.detail;
  goalType = mainObj.fieldData.goalType;
  console.log(apiData[goalType], "apiData goal type")

  let amount = apiData[goalType].amount;
  console.log(amount, apiData);

  items = {
    progressBar: document.querySelector(".progress-bar"),
    goalText: document.querySelector(".goal-text"),
    colita: document.querySelector(".colita"),
    progressBarContainer: document.querySelector(".progress-bar-container"),
    progressionText: document.querySelector(".progression"),
    title: document.querySelector("#title"),
  };

  step = getStep(
    items.progressBarContainer,
    mainObj.fieldData.goalObjectiveQuantity
  );
  // goalType = fieldData.goalType.value;
  items.title.innerText = mainObj.fieldData.title;

  if (mainObj.fieldData.goalFullType === "session") {
    widgetApiData = defaultApiData;
    handleGrow(amount, null, true);
  } else if (initial === true) {
    console.log(apiData[goalType], "apiData goal type initial")
    handleGrow(amount, null, true);
  } else {
    handleGrow(amount, updateApiData, false);
  }
}

function checkIfCompleted(widgetApiData, goalType) {
  console.log("checkIfCompleted");
  let objective = mainObj.fieldData.goalObjectiveQuantity;
  let currentAmount = widgetApiData[goalType].amount;
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
  let amountToUpdate = widgetApiData[goalType].amount + amount;
  if(initial === true) {
    amountToUpdate = amount;
  }

  let completedGoal = checkIfCompleted(widgetApiData, goalType);

  if (!completedGoal) {
    items.progressBar.style.width = `${amountToUpdate * step}px`;
    items.progressionText.innerHTML = `${amountToUpdate} / ${mainObj.fieldData.goalObjectiveQuantity}`;
  } else {
    items.progressBar.style.width = "100%";
    items.progressionText.innerHTML = `Goal completed!`;
  }
  if (callback !== null || mainObj.fieldData.goalFullType === "session") {
    callback(amountToUpdate);
  }
}

function updateApiData(amountToUpdate) {
  console.log("updateApiData");
  widgetApiData[goalType].amount = amountToUpdate;
  console.log(widgetApiData[goalType].amount, amountToUpdate, widgetApiData);
  // SE_API.store.set(
  //   "beniartsRinaHorizontalGoalWidgetPreviousGained",
  //   widgetApiData
  // );
}

function clearApiData() {
  console.log("clearApiData");
  // SE_API.store.set(
  //   "beniartsRinaHorizontalGoalWidgetPreviousGained",
  //   defaultApiData
  // );
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

// function resetApiData() {
//   handleGrow();
// }
