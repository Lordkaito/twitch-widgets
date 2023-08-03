let mainObj = {};
let goal = {};
let goalType, goalObjectiveQuantity, goalStartQuantity;
let current = 0;
let gained = {
  subscriber: { type: "subscriber", amount: 0 },
  follower: { type: "follower", amount: 0 },
  tip: { type: "tip", amount: 0 },
  cheer: { type: "cheer", amount: 0 },
};

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
  // let string = "";
  // let split = text.split("").forEach((letter) => {
  //   string += letter;
  // });
  p.innerText = text;
};

const progress = document.querySelector(".progress-bar-container");
progress.style.setProperty("--progress-bar-left", "0");

window.addEventListener("onWidgetLoad", function (obj) {
  let apiData;
  SE_API.store.get("beniartsRinaHorizontalGoalWidgetPreviousGained").then((data) => {
    if (data === null) {
      apiData = gained;
    } else {
      apiData = data;
    }
    init(obj, initGoal, apiData);
  });
});

const init = (obj, initGoalCallback, data) => {
  initialStart = false;
  mainObj.data = obj["detail"]["session"]["data"];
  mainObj.recents = obj["detail"]["recents"];
  mainObj.currency = obj["detail"]["currency"];
  mainObj.channelName = obj["detail"]["channel"]["username"];
  mainObj.apiToken = obj["detail"]["channel"]["apiToken"];
  mainObj.fieldData = obj["detail"]["fieldData"];

  // if (mainObj.fieldData.resetGoalData === "true") {
  //   let clear = {
  //     subscriber: { type: "subscriber", amount: 0 },
  //     follower: { type: "follower", amount: 0 },
  //     tip: { type: "tip", amount: 0 },
  //     cheer: { type: "cheer", amount: 0 },
  //   };
  // SE_API.store.set("beniartsRinaHorizontalGoalWidgetPreviousGained", clear);
  // }

  // if (mainObj.fieldData.wateringCanSide === "right") {
  //   const reg = document.querySelector(".gifReg");
  //   reg.style.transform = "scaleX(-1)";
  // }

  goalType = mainObj.fieldData.goalType;
  goalStartQuantity = mainObj.fieldData.goalStartQuantity;
  goalObjectiveQuantity = mainObj.fieldData.goalObjectiveQuantity;
  initGoalCallback(goalType, data);
};

window.addEventListener("onEventReceived", function (obj) {
  if (obj.detail.event.value === "reset") {
    let clear = {
      subscriber: { type: "subscriber", amount: 0 },
      follower: { type: "follower", amount: 0 },
      tip: { type: "tip", amount: 0 },
      cheer: { type: "cheer", amount: 0 },
    };
    SE_API.store.set("beniartsRinaHorizontalGoalWidgetPreviousGained", clear);
    window.location.reload();
  }

  if (obj.detail.listener === "grow") {
    progressFn(obj.detail.event, obj.detail.listener, obj);
  } else {
    holdedEvent(obj.detail.event);
  }
});

const progressFn = (data, listener, obj) => {
  if (data.type === "subscriber" && data.gifted === true) {
    grow(data.type, data.amount);
  } else if (data.type === "subscriber" || data.type === "follower") {
    grow(data.type);
  } else {
    grow(data.type, data.amount);
  }
  // if (obj.detail.event.type === mainObj.fieldData.goalType) {
  //   const reg = document.querySelector(".gifReg");
  //   if (!reg.classList.contains("playing")) {
  //     reg.classList.add("playing");
  //     setTimeout(() => {
  //       reg.classList.remove("playing");
  //     }, 1500);
  //   }
  // }
};

const initGoal = (type, data) => {
  let step;
  const progression = document.querySelector(".progression");
  let progressBarWidth = document.querySelector(
    ".progress-bar-container"
  ).offsetWidth;

  if (type === "tip" || type === "cheer") {
    step = progressBarWidth / goalObjectiveQuantity;
  } else {
    step = progressBarWidth / goalObjectiveQuantity;
  }

  goal = {
    type: type,
    current: current,
    step: step,
  };

  if (type === "tip") {
    console.log("here");
    progression.innerText = current + "/" + goalObjectiveQuantity + " $";
  } else {
    progression.innerText = current + "/" + goalObjectiveQuantity;
  }
  // type === "tip" ? progression.innerText = current + "/" + goalObjectiveQuantity + " $" : progression.innerText = current + "/" + goalObjectiveQuantity;
  if (mainObj.fieldData.goalFullType === "allTime") {
    grow("initial", 1, data);
  } else {
    grow("initial", goalStartQuantity, data);
  }

  const goalText = document.querySelector(".goal-text");
  goalText.innerText = mainObj.fieldData.goalText;
};

const grow = (type, amount = 1, data) => {
  if (type !== goalType) {
    if (type === "initial") {
      gained = data;
      if (
        mainObj.fieldData.goalStartQuantity !== 0 &&
        mainObj.fieldData.goalFullType === "allTime"
      ) {
        amount = data[goalType].amount + goalStartQuantity;
      } else if (mainObj.fieldData.goalFullType === "session") {
        amount = 0;
      } else {
        amount = data[goalType].amount;
      }
    } else {
      return;
    }
  }

  switch (type) {
    case "subscriber":
      gained.subscriber.amount += amount;
      SE_API.store.set("beniartsRinaHorizontalGoalWidgetPreviousGained", gained);
      break;
    case "follower":
      gained.follower.amount += amount;
      SE_API.store.set("beniartsRinaHorizontalGoalWidgetPreviousGained", gained);
      break;
    case "tip":
      gained.tip.amount += amount;
      SE_API.store.set("beniartsRinaHorizontalGoalWidgetPreviousGained", gained);
      break;
    case "cheer":
      gained.cheer.amount += amount;
      SE_API.store.set("beniartsRinaHorizontalGoalWidgetPreviousGained", gained);
      break;
    default:
      break;
  }

  let progressBar = document.querySelector(".progress-bar");
  let progressImg = document.querySelector(".img-container");
  let colita = document.querySelector(".colita");
  const completeGoal = document.querySelector(".progression");
  let currentWidth = progressBar.offsetWidth;
  const progression = document.querySelector(".progression");
  console.log(fieldData.goalType.value);
  total = goal.current + amount;
  colita.style.animationName = "wiggle";
  colita.style.animationDuration = "2s";
  colita.style.animationTimingFunction = "ease-in-out";
  setTimeout(() => {
    colita.style.animationName = "none";
  }, 2000);
  if (goal.current + amount >= goalObjectiveQuantity) {
    progressBar.style.width = `100%`;
    // progression.style.opacity = "0";
    goalCompletedText();
    if (total >= goalObjectiveQuantity) {
      goalCompletedText();
      goal.current += amount;
      // progression.innerText = goal.current + "/" + goalObjectiveQuantity;
    }
    return;
  }
  if (goal.current < goalObjectiveQuantity) {
    goal.current += amount;
    progressBar.style.width = `${currentWidth + goal.step * amount}px`;
    progression.innerText = goal.current + "/" + goalObjectiveQuantity;
    if(fieldData.goalType.value === "tip") {
      progression.innerText = goal.current + "/" + goalObjectiveQuantity + "$";
    }
    if(fieldData.goalType.value === "cheer") {
      const img = document.querySelector(".progression-container img");
      console.log(img);
      img.src = "https://i.postimg.cc/dVFyhWyM/BITVAC.png"
    }
  }
};

let storedEvents = [];
let eventCounter = 0;
let eventTimer = null;
let firstEvent = true;
let previousSender = "";

const dispatchNewEvent = (event) => {
  if (
    previousSender === currentSender ||
    firstEvent === true ||
    previousSender === ""
  ) {
    storedEvents.push(event);
  } else {
    event.amount = 1;
    window.dispatchEvent(
      new CustomEvent("onEventReceived", {
        detail: {
          listener: "grow",
          event: event,
        },
      })
    );
    previousSender = "";
  }

  if (eventTimer) {
    clearTimeout(eventTimer);
  }

  eventTimer = setTimeout(() => {
    if (storedEvents.length > 1) {
      window.dispatchEvent(
        new CustomEvent("onEventReceived", {
          detail: {
            listener: "grow",
            event: {
              amount: storedEvents.length,
              avatar: event.avatar,
              displayName: event.displayName,
              gifted: event.gifted,
              sender: storedEvents[0].sender,
              type: event.type,
              tier: event.tier,
              message: event.message,
              name: event.name,
              quantity: event.quantity,
              sessionTop: event.sessionTop,
              providerId: event.providerId,
              originalEventName: event.originalEventName,
            },
          },
        })
      );
      eventCounter += storedEvents.length;
      previousSender = "";
    } else if (storedEvents.length === 1) {
      window.dispatchEvent(
        new CustomEvent("onEventReceived", {
          detail: {
            listener: "grow",
            event: {
              amount: storedEvents.length,
              avatar: event.avatar,
              displayName: event.displayName,
              gifted: event.gifted,
              sender: storedEvents[0].sender,
              type: event.type,
              tier: event.tier,
              message: event.message,
              name: event.name,
              quantity: event.quantity,
              sessionTop: event.sessionTop,
              providerId: event.providerId,
              originalEventName: event.originalEventName,
            },
          },
        })
      );
      previousSender = "";
    }
    storedEvents = [];
    eventTimer = null;
    eventCounter = 0;
  }, 500);
  firstEvent = false;
  previousSender = event.sender;
};

const holdedEvent = (event) => {
  if (event.gifted) {
    currentSender = event.sender;
    dispatchNewEvent(event);
  } else {
    window.dispatchEvent(
      new CustomEvent("onEventReceived", {
        detail: {
          listener: "grow",
          event: event,
        },
      })
    );
  }
};
