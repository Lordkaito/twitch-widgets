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
  const progression = document.querySelector(".progression");
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
  SE_API.store.get("beniartsCustomizableGoalWidgetPreviousGained").then((data) => {
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
  // SE_API.store.set("beniartsCustomizableGoalWidgetPreviousGained", clear);
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
    SE_API.store.set("beniartsCustomizableGoalWidgetPreviousGained", clear);
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
  let progressBar = document.querySelector(".progress-bar");

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

  const goalText = document.querySelector("#title");
  console.log(goalText);
  mainObj.fieldData.title !== ""
    ? (goalText.innerText = mainObj.fieldData.title)
    : (goalText.innerText = "Goal");
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
      SE_API.store.set("beniartsCustomizableGoalWidgetPreviousGained", gained);
      break;
    case "follower":
      gained.follower.amount += amount;
      SE_API.store.set("beniartsCustomizableGoalWidgetPreviousGained", gained);
      break;
    case "tip":
      gained.tip.amount += amount;
      SE_API.store.set("beniartsCustomizableGoalWidgetPreviousGained", gained);
      break;
    case "cheer":
      gained.cheer.amount += amount;
      SE_API.store.set("beniartsCustomizableGoalWidgetPreviousGained", gained);
      break;
    default:
      break;
  }

  let progressBar = document.querySelector(".progress-bar");
  let progressImg = document.querySelector(".img-container");
  const completeGoal = document.querySelector(".progression");
  let currentWidth = progressBar.offsetWidth;
  const progression = document.querySelector(".progression");
  total = goal.current + amount;
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
      image.style.transform = "scale(.7)"
      progressImg.style.top = "7rem";
      break;
    case "flower":
      goalNameColor = "#ffee6e";
      numbersColor = "#ffee6e";
      progressBarColor = "#feabb1";
      progressBackColor = "#fff";
      image.src = "https://i.postimg.cc/G9w8jGmh/flo.png";
      image.style.width = "64px";
      image.style.height = "64px";
      image.style.transform = "scale(.7)"
      progressImg.style.top = "6.5rem";
      break;
    case "leaf":
      goalNameColor = "#9dda57";
      numbersColor = "#9dda57";
      progressBarColor = "#b7f076";
      progressBackColor = "#f99175";
      image.src = "https://i.postimg.cc/9M07XckV/hojiiis.png";
      image.style.width = "56px";
      image.style.height = "58px";
      image.style.transform = "scale(.6)"
      progressImg.style.top = "7rem";
      break;
    case "moon":
      goalNameColor = "#a5baff";
      numbersColor = "#a5baff";
      progressBarColor = "#7693f0";
      progressBackColor = "#373e54";
      image.src = "https://i.postimg.cc/43BcTYBB/lunita.png";
      image.style.width = "64px";
      image.style.height = "64px";
      image.style.transform = "scale(.7)"
      progressImg.style.top = "6.5rem";
      break;
  }
  if(mainObj.fieldData.goalNameColor === "#123456"){
    console.log("here");
    goalNameColor = goalNameColor
  } else {
    goalNameColor = mainObj.fieldData.goalNameColor;
  }

  if(mainObj.fieldData.numbersColor === "#123456"){
    numbersColor = numbersColor
  } else {
    numbersColor = mainObj.fieldData.numbersColor;
  }

  if(mainObj.fieldData.progressBarColor === "#123456"){
    progressBarColor = progressBarColor
  } else {
    progressBarColor = mainObj.fieldData.progressBarColor;
  }

  if(mainObj.fieldData.progressBackColor === "#123456"){
    progressBackColor = progressBackColor
  } else {
    progressBackColor = mainObj.fieldData.progressBackColor;
  }
  let progressBarBack = document.querySelector(".progress-bar-container");
  progressBarBack.style.backgroundColor = progressBackColor;
  progressBar.style.backgroundColor = progressBarColor;
  progression.style.color = numbersColor;
  title.style.color = goalNameColor;
  if (goal.current + amount >= goalObjectiveQuantity) {
    hidden.style.width = "100%";
    progressBar.style.width = `100%`;
    progressImg.style.left = `${hidden.offsetWidth - 40}px`;
    if (total >= goalObjectiveQuantity) {
      goal.current += amount;
      progression.innerText = goal.current + "/" + goalObjectiveQuantity;
    }
    return;
  }
  if (goal.current < goalObjectiveQuantity) {
    goal.current += amount;
    hidden.style.width = `${currentWidth + goal.step * amount}px`;
    progressBar.style.width = `${currentWidth + goal.step * amount}px`;
    progression.innerText = goal.current + "/" + goalObjectiveQuantity;
    progressImg.style.left = `${hidden.offsetWidth + 6}px`;
    if (mainObj.fieldData.goalType === "tip") {
      progression.innerText = goal.current + "/" + goalObjectiveQuantity + mainObj.fieldData.currency;
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
