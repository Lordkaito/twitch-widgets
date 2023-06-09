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

// all this is just for session goals, and the progress resets if you reload widget, change config or session resets

const progress = document.querySelector(".progress-bar-container");
progress.style.setProperty("--progress-bar-left", "0");

window.addEventListener("onWidgetLoad", function (obj) {
  let apiData;
  SE_API.store.get("beniartsGoalWidgetPreviousGained").then((data) => {
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

  goalType = mainObj.fieldData.goalType;
  goalStartQuantity = mainObj.fieldData.goalStartQuantity;
  if (mainObj.fieldData.goalStartQuantity === null) {
    goalStartQuantity = 0;
  }
  goalObjectiveQuantity = mainObj.fieldData.goalObjectiveQuantity;
  initGoalCallback(goalType, data);
};

const progressFn = (data, listener) => {
  if (data.type === "subscriber" && data.gifted === true) {
    grow(data.type, data.amount);
  } else if (data.type === "subscriber" || data.type === "follower") {
    grow(data.type);
  } else {
    grow(data.type, data.amount);
  }
};

const grow = (type, amount = 1, data) => {
  if (type !== goalType) {
    if (type === "initial") {
      gained = data;
      amount = amount;
    } else {
      return;
    }
  }

  switch (type) {
    case "subscriber":
      gained.subscriber.amount += amount;
      SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    case "follower":
      gained.follower.amount += amount;
      SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    case "tip":
      gained.tip.amount += amount;
      SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    case "cheer":
      gained.cheer.amount += amount;
      SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    default:
      break;
  }

  let progressBar = document.querySelector(".progress-bar");
  let progressImg = document.querySelector(".img-container");
  let currentWidth = progressBar.offsetWidth;
  const progression = document.querySelector(".progression");
  total = goal.current + amount;
  if (goal.current + amount >= goalObjectiveQuantity) {
    hidden.style.width = `100%`;
    progressBar.style.width = `100%`;
    progressImg.style.left = `${hidden.offsetWidth - 40}px`;
    let customGoalText = "";
    if (mainObj.fieldData.goalText != "") {
      customGoalText = mainObj.fieldData.goalText;
    }
    total >= goalObjectiveQuantity
      ? (progression.innerText =
          customGoalText != "" ? customGoalText : "Goal completed!")
      : (progression.innerText = total + "/" + goalObjectiveQuantity);
    return;
  }
  if (goal.current < goalObjectiveQuantity) {
    goal.current += amount;
    hidden.style.width = `${currentWidth + goal.step * amount}px`;
    progressBar.style.width = `${currentWidth + goal.step * amount}px`;
    progressImg.style.left = `${hidden.offsetWidth + 6}px`;
    progression.innerText = goal.current + "/" + goalObjectiveQuantity;
  }
};

window.addEventListener("onEventReceived", function (obj) {
  if (obj.detail.event.value === "reset") {
    let clear = {
      subscriber: { type: "subscriber", amount: 0 },
      follower: { type: "follower", amount: 0 },
      tip: { type: "tip", amount: 0 },
      cheer: { type: "cheer", amount: 0 },
    };
    SE_API.store.set("beniartsGoalWidgetPreviousGained", clear);
    window.location.reload();
  }

  if (obj.detail.listener === "grow") {
    progressFn(obj.detail.event);
  } else {
    holdedEvent(obj.detail.event);
  }
});

const initGoal = (type, data) => {
  if (mainObj.fieldData.goalTheme === "pink") {
    image.src = "https://i.postimg.cc/hvs4D0z6/patita.png ";
    round.style.backgroundColor = "pink";
    const goalText = document.querySelector(".goal-name");
    const progressBar = document.querySelector(".progress-bar");
    const progression = document.querySelector(".progression");
    goalText.style.color = "#ff9eb9";
    progressBar.style.backgroundColor = "#ff9eb9";
    progression.style.textShadow = `-1px -1px 0 #ff9eb9, 1px -1px 0 #ff9eb9, -1px 1px 0 #ff9eb9,
    1px 1px 0 #ff9eb9`;
  }
  // let current = goalStartQuantity;
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

  let goalTitle = "";
  if (mainObj.fieldData.title != "") {
    goalTitle = mainObj.fieldData.title;
    const title = document.querySelector(".goal-title");
    const titleP = document.querySelector("#title");
    titleP.innerText = goalTitle;
  }
  // const maxChars = 11;
  // if (goalTitle.length > maxChars) {
  //   goalTitle = goalTitle.substring(0, maxChars);
  // }

  goal = {
    type: type,
    current: current,
    step: step,
  };
  progression.innerText = current + "/" + goalObjectiveQuantity;
  if (mainObj.fieldData.goalFullType === "allTime") {
    grow("initial", goalStartQuantity, data);
  } else {
    grow("initial", goalStartQuantity, data);
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
