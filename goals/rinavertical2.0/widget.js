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
  // let data = await SE_API.store.get(
  //   "beniartsRinaVerticalGoalWidgetPreviousGained"
  // );
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
  if (mainObj.fieldData.goalStartQuantity !== 0) {
    amount = amount + mainObj.fieldData.goalStartQuantity;
  }

  items = {
    progressBar: document.querySelector(".progress-bar"),
    goalText: document.querySelector(".goal-text"),
    colita: document.querySelector(".colita"),
    progressBarContainer: document.querySelector(".progress-bar-container"),
    progressionText: document.querySelector(".progressNums"),
    progressionTextCompleted: document.querySelector(".progression"),
    title: document.querySelector("#title"),
    progressImg: document.querySelector(".img-container"),
    bit: document.querySelector(".bit"),
  };

  step = getStep(
    items.progressBarContainer,
    mainObj.fieldData.goalObjectiveQuantity
  );

  items.title.innerText = mainObj.fieldData.title;

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

const goalCompletedText = () => {
  const p = document.querySelector(".progression");
  let text = "Goal completed!";
  let completeGoalText = mainObj.fieldData.completeGoalText;
  if (completeGoalText != "") {
    let mockText = "GOAL COMPLETADO!";
    if (completeGoalText.length > mockText.length) {
      completeGoalText = completeGoalText.substring(0, mockText.length);
    }
    text = completeGoalText;
  }
  let string = "";
  let split = text.split("").forEach((letter) => {
    string += letter + "\n";
  });
  p.innerText = string;
};

function handleGrow(amount, callback, initial = false) {
  if (!animationActive) {
    animationActive = true;
    items.colita.style.animationName = "wiggle";
    items.colita.style.animationDuration = "1s";
    items.colita.style.animationTimingFunction = "ease-in-out";
    setTimeout(() => {
      items.colita.style.animationName = "";
      items.colita.style.animationDuration = "";
      items.colita.style.animationTimingFunction = "";
      animationActive = false;
    }, 1000);
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
    // image.style.left = `${amountToUpdate * step - 23}px`;
    items.progressBar.style.height = `${amountToUpdate * step}px`;
    if (goalType === "tip") {
      items.progressionText.innerHTML =
      amountToUpdate +
      "<br>" +
      "/" +
      mainObj.fieldData.goalObjectiveQuantity +
      currency;
    } else if (goalType === "cheer") {
      console.log(goalType)
      items.progressionText.innerHTML =
      amountToUpdate +
      "<br>" +
      "/" +
      mainObj.fieldData.goalObjectiveQuantity
      items.bit.src = "https://i.postimg.cc/kMRNYVh9/ssfsf.png"
    } else {
      items.progressionText.innerHTML =
        amountToUpdate + "<br>" + "/" + mainObj.fieldData.goalObjectiveQuantity;
    }
  } else {
    // image.style.left = `32rem`;
    items.progressBar.style.height = "100%";
    items.progressionText.innerHTML = `${amountToUpdate} <br> /${mainObj.fieldData.goalObjectiveQuantity}`;
    items.bit.src = "https://i.postimg.cc/kMRNYVh9/ssfsf.png"
    goalCompletedText();
  }
  if (callback !== null || mainObj.fieldData.goalFullType === "session") {
    callback(amountToUpdate - mainObj.fieldData.goalStartQuantity);
  }
}

function updateApiData(amountToUpdate) {
  widgetApiData[goalType].amount = amountToUpdate;
  // SE_API.store.set(
  //   "beniartsRinaVerticalGoalWidgetPreviousGained",
  //   widgetApiData
  // );
}

function clearApiData() {
  // SE_API.store.set(
  //   "beniartsRinaVerticalGoalWidgetPreviousGained",
  //   defaultApiData
  // );
  window.location.reload();
}

function cancelExecution(detail) {
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
