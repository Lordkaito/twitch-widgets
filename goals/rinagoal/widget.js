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
  // SE_API.store.get("beniartsGoalWidgetPreviousGained").then((data) => {
  //   if (data === null) {
  //     apiData = gained;
  //   } else {
  //   }
  // });
  apiData = gained;
  init(obj, initGoal, apiData);
});

/*
  * This function initializes the data coming from the API.
  * It also calls the proper function to initialize the goal
  * depending on the goal type.
*/
const init = (obj, initGoalCallback, data) => {
  console.log(goal.current, 'init')
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
  console.log(goal.current, 'progressFn')
  // If the data is a gift, then grow the bar by the amount of the gift.
  if (data.type === "subscriber" && data.gifted === true) {
    grow(data.type, data.amount);
  } else if (data.type === "subscriber" || data.type === "follower") {
    // If the data is a subscriber or follower, then grow the bar by 1.
    grow(data.type);
  } else {
    // If the data is not a gift, subscriber, or follower, then grow the bar by the amount of the data.
    grow(data.type, data.amount);
  }
};

const grow = (type, amount = 1, data) => {
  console.log(goal.current, 'grow')
  if (type !== goalType) {
    if (type === "initial") {
      console.log(goal.current);
      gained = data;
      amount = amount;
    } else {
      return;
    }
  }

  switch (type) {
    case "subscriber":
      gained.subscriber.amount += amount;
      // SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    case "follower":
      gained.follower.amount += amount;
      // SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    case "tip":
      gained.tip.amount += amount;
      // SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    case "cheer":
      gained.cheer.amount += amount;
      // SE_API.store.set("beniartsGoalWidgetPreviousGained", gained);
      break;
    default:
      break;
  }

  let progressBar = document.querySelector(".progress-bar");
  let progressImg = document.querySelector(".img-container");
  let currentWidth = progressBar.offsetWidth;
  let colita = document.querySelector(".colita");
  const progression = document.querySelector(".progression");
  total = goal.current + amount;
  /*
  If the total is greater than or equal to the goal objective quantity,
  set the hidden progress bar to 100%, the visible progress bar to 100%,
  and the progress image to the rightmost side of the visible progress bar.
  */
  if (goal.current + amount >= goalObjectiveQuantity) {
    hidden.style.width = `100%`;
    progressBar.style.width = `100%`;
    colita.style.animationName = "wiggle"
    colita.style.animationDuration = "2s"
    colita.style.animationTimingFunction = "ease-in-out"
    setTimeout(() => {
      colita.style.animationName = "none"
    }, 2000);
    // progressImg.style.left = `${hidden.offsetWidth - 40}px`;
    let customGoalText = "";
    if (mainObj.fieldData.goalText != "") {
      customGoalText = mainObj.fieldData.goalText;
    }
    /*
    If the goal text is not empty, use the user's custom text, otherwise
    set the goal text to "Goal completed!".
    */
    total >= goalObjectiveQuantity
      ? (progression.innerText =
          customGoalText != "" ? customGoalText : "Goal completed!")
      : (progression.innerText = total + "/" + goalObjectiveQuantity);
    return;
  }
  /*
  If the goal is not complete, then update the progress bar.
  */
  if (goal.current < goalObjectiveQuantity) {
    goal.current += amount;
    hidden.style.width = `${currentWidth + goal.step * amount}px`;
    progressBar.style.width = `${currentWidth + goal.step * amount}px`;
    colita.style.animationName = "wiggle"
    colita.style.animationDuration = "2s"
    colita.style.animationTimingFunction = "ease-in-out"
    setTimeout(() => {
      colita.style.animationName = "none"
    }, 2000);
    // progressImg.style.left = `${hidden.offsetWidth + 7}px`;
    progression.innerText = goal.current + "/" + goalObjectiveQuantity;
  }
};

window.addEventListener("onEventReceived", function (obj) {
  console.log(goal.current, 'onEventReceived')
  let { listener, event } = obj.detail;
  if (event.value === "reset") {
    let clear = {
      subscriber: { type: "subscriber", amount: 0 },
      follower: { type: "follower", amount: 0 },
      tip: { type: "tip", amount: 0 },
      cheer: { type: "cheer", amount: 0 },
    };
    SE_API.store.set("beniartsGoalWidgetPreviousGained", clear);
    window.location.reload();
  }

  if (listener === "grow") {
    progressFn(event, listener);
  } else {
    holdedEvent(event);
  }

  //if (mainObj.fieldData.resetGoalData === "true") {
  //let clear = {
  // subscriber: { type: "subscriber", amount: 0 },
  //follower: { type: "follower", amount: 0 },
  //tip: { type: "tip", amount: 0 },
  // cheer: { type: "cheer", amount: 0 },
  //};
  // SE_API.store.set("beniartsGoalWidgetPreviousGained", clear);
  //}

  // progressFn(obj.detail.event);
});

const initGoal = (goalType, data) => {
  console.log(goal.current, 'initGoal')
  // image.src = "https://i.postimg.cc/0NKkvZr6/nueva-patita.png";
  const progression = document.querySelector(".progression");
  // let current = goalStartQuantity;
  let step;
  let progressBarWidth = document.querySelector(
    ".progress-bar-container"
  ).offsetWidth;

  if (goalType === "tip" || goalType === "cheer") {
    step = progressBarWidth / goalObjectiveQuantity;
  } else {
    step = progressBarWidth / (goalObjectiveQuantity);
  }

  if (mainObj.fieldData.title != "") {
    const title = document.querySelector(".goal-title");
    const maxChars = 11;
  }

  goal = {
    type: goalType,
    current: current,
    step: step,
  };
  progression.innerText = current + "/" + goalObjectiveQuantity;
  if (
    mainObj.fieldData.goalFullType === "allTime" &&
    mainObj.fieldData.startFromCero === "false"
  ) {
    grow("initial", goalStartQuantity, data);
  }
};

let storedEvents = [];
let eventCounter = 0;
let eventTimer = null;
let firstEvent = true;
let previousSender = "";

const dispatchNewEvent = (event) => {
  console.log(goal.current, 'dispatchNewEvent')
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
    // if there are more than 1 events, send the last one and dispatch the event
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
      console.log(
        `se recibieron ${storedEvents.length} eventos, se envia el ultimo`
      );
      previousSender = "";
    } else if (storedEvents.length === 1) {
      // if there is only one event, send it
      console.log("heresdfadsf");
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
  console.log(goal.current, 'holdedEvent')
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
