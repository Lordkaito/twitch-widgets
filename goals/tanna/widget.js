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
  let peluche = document.querySelector(".peluche");

  let amount = apiData[goalType].amount;
  if (mainObj.fieldData.goalStart !== 0) {
    amount = amount + mainObj.fieldData.goalStartQuantity;
  }

  if (amount >= mainObj.fieldData.firstStep) {
    peluche.src = "https://i.postimg.cc/RZ1Ykxsb/tannafurro.png";
  }

  if (amount >= mainObj.fieldData.secondStep) {
    peluche.src = "https://i.postimg.cc/N0gnYCZG/tannamaid.png";
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
    peluche: document.querySelector(".peluche"),
    peluche2: document.querySelector(".peluche2"),
    peluche3: document.querySelector(".peluche3"),
    peluche4: document.querySelector(".peluche4"),
    objective: document.querySelector(".goal-obj-100"),
    firstStep: document.querySelector(".goal-obj-50"),
    secondStep: document.querySelector(".goal-obj-70"),
    goalTypeText: document.querySelector(".goal-type-text"),
    goalTypeAmount: document.querySelector(".goal-type-amount"),
  };

  items.objective.innerText = mainObj.fieldData.goalObjectiveQuantity;
  items.firstStep.innerText = mainObj.fieldData.firstStep;
  items.secondStep.innerText = mainObj.fieldData.secondStep;
  items.goalTypeText.innerText = mainObj.fieldData.goalTypeText;
  items.goalTypeAmount.innerText = amount;

  step = getStep(
    items.progressBarContainer,
    mainObj.fieldData.goalObjectiveQuantity
  );

  // items.title.innerText = mainObj.fieldData.title;
  let side = mainObj.fieldData.wateringCanSide;
  if (side === "right") {
    // items.reg.style.transform = "scaleX(-1)";
    // items.reg.style.left = "-11rem";
  }

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
  if (!animationActive) {
    animationActive = true;
    // items.reg.style.opacity = "1";
    // setTimeout(() => {
    //   animationActive = false;
    //   // items.reg.style.opacity = "0";
    // }, 1500);
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
    let ganchosHeight = 30;
    console.log(amountToUpdate);
    let barraHeight = items.progressBar.offsetHeight;
    console.log(barraHeight);
    let ganchoStep = getGachoStep(30, mainObj.fieldData.goalObjectiveQuantity);
    items.ganchos.style.top = `calc(${ganchosHeight}rem - ${(amountToUpdate) * ganchoStep}rem)`;
    console.log(items.ganchos.style.top);
    items.progressBar.style.height = `calc(100% - ${(amountToUpdate * step) - 15}px)`;
    console.log(mainObj.fieldData.firstStep)
    if (amountToUpdate >= mainObj.fieldData.firstStep) {
      items.peluche.style.animation = "fadeOut 1s forwards";
      items.peluche2.style.animation = "fadeIn 1s forwards";
    }

    if (amountToUpdate >= mainObj.fieldData.secondStep) {
      items.peluche2.style.animation = "fadeOut 1s forwards";
      items.peluche3.style.animation = "fadeIn 1s forwards";
    }
    if (goalType === "tip") {
      items.progressionText.innerHTML =
        getPercentage(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity) +
        currency;
    } else {
      items.progressionText.innerHTML = getPercentage(
        amountToUpdate,
        mainObj.fieldData.goalObjectiveQuantity
      );
    }
    items.goalTypeAmount.innerText = amountToUpdate;
  } else {
    items.ganchos.style.top = `0`;
    items.progressBar.style.height = "0%";
    items.progressionText.innerHTML = getPercentage(
      amountToUpdate,
      mainObj.fieldData.goalObjectiveQuantity
    );

    items.peluche3.style.animation = "fadeOut 1s forwards";
    items.peluche4.style.animation = "fadeIn 1s forwards";
    items.goalTypeAmount.innerText = amountToUpdate;
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
