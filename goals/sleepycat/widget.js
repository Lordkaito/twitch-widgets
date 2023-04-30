let mainObj = {};
let goal = {};
let goalType, goalObjectiveQuantity, goalActive, goalStartQuantity;
let current = 0;

const progress = document.querySelector(".progress-bar-container");
progress.style.setProperty("--progress-bar-left", "0");

window.addEventListener("onWidgetLoad", function (obj) {
  init(obj, initGoal);
});

const init = (obj, initGoalCallback) => {
  initialStart = false;
  mainObj.data = obj["detail"]["session"]["data"];
  mainObj.recents = obj["detail"]["recents"];
  mainObj.currency = obj["detail"]["currency"];
  mainObj.channelName = obj["detail"]["channel"]["username"];
  mainObj.apiToken = obj["detail"]["channel"]["apiToken"];
  mainObj.fieldData = obj["detail"]["fieldData"];

  goalActive = mainObj.fieldData.goalActive;
  goalType = mainObj.fieldData.goalType;
  goalStartQuantity = mainObj.fieldData.goalStartQuantity;
  goalObjectiveQuantity = mainObj.fieldData.goalObjectiveQuantity;
  console.log(mainObj);
  initGoalCallback(goalType);
};

const initGoal = (type) => {
  let current = goalStartQuantity;
  let step;
  let progressBarWidth = document.querySelector(
    ".progress-bar-container"
  ).offsetWidth;

  if (type === "tip" || type === "cheer") {
    step = progressBarWidth / goalObjectiveQuantity;
  } else {
    step = progressBarWidth / (goalObjectiveQuantity - goalStartQuantity);
  }

  goal = {
    type: type,
    current: current,
    step: step,
  };

  const progression = document.querySelector(".progression");
  progression.innerText = goal.current + "/" + goalObjectiveQuantity;
};

window.addEventListener("onEventReceived", async (obj) => {
  let { listener, event } = obj.detail;
  let isBulk = event.bulkGifted;
  let repeatedEvents = 0;
  let maxEvents = 0;

  if (isBulk && repeatedEvents < maxEvents) {
    repeatedEvents++;
    return;
  }

  let dictionary = {
    "subscriber-latest": "subscriber",
    "follower-latest": "follower",
    "cheer-latest": "cheer",
    "tip-latest": "tip",
    bulk: "bulk",
  };

  if (event.bulkGifted) {
    grow("bulk", event.amount);
    return;
  }

  if (goal.type === "tip" || goal.type === "cheer") {
    console.log("asdfafsdasdfadsf");
    dictionary[listener] === goal.type && growBitsTips(obj.detail);
    return;
  } else {
    dictionary[listener] === goal.type && grow();
  }
});

let completed = false;

const growBitsTips = (data) => {
  let amount = data.event.amount;
  let progressBar = document.querySelector(".progress-bar");
  let progressImg = document.querySelector(".img-container");
  let currentLeft = progressBar.offsetWidth;
  let step = goal.step * amount;
  if (
    goal.current < goalObjectiveQuantity &&
    goal.current + amount >= goalObjectiveQuantity
  ) {
    progressImg.style.position = "absolute";
    progressImg.style.right = `10px`;
    progressImg.style.top = `8px`;
    progressBar.style.width = `100%`;
    const progression = document.querySelector(".progression");
    let total = goal.current + amount;
    total > goalObjectiveQuantity
      ? (progression.innerText =
          goalObjectiveQuantity + "/" + goalObjectiveQuantity)
      : (progression.innerText = total + "/" + goalObjectiveQuantity);
    return;
  }
  goal.current += amount;
  progressBar.style.width = `${currentLeft + step}px`;
  const progression = document.querySelector(".progression");
  progression.innerText = goal.current + "/" + goalObjectiveQuantity;
};

let total;
const grow = (type = "sub", amount = 1) => {
  let progressBar = document.querySelector(".progress-bar");
  let currentLeft = progressBar.offsetLeft;
  total = goal.current + amount;
  if (goal.current + amount >= goalObjectiveQuantity) {
    progressBar.style.left = `0`;
    const progression = document.querySelector(".progression");
    total > goalObjectiveQuantity
      ? (progression.innerText =
          goalObjectiveQuantity + "/" + goalObjectiveQuantity)
      : (progression.innerText = total + "/" + goalObjectiveQuantity);
    return;
  }
  if (goal.current < goalObjectiveQuantity) {
    goal.current += amount;
    progressBar.style.left = `${currentLeft + goal.step * amount}px`;
    const progression = document.querySelector(".progression");

    progression.innerText = goal.current + "/" + goalObjectiveQuantity;
  }
};

// const setInitialGrow = () => {
//   if (goalStartQuantity !== 0) {
//     let progressBar = document.querySelector(".progress-bar");
//     let currentLeft = progressBar.offsetLeft;
//     let step = goal.step * goalStartQuantity;
//     progressBar.style.left = `${currentLeft + step}px`;
//     const progression = document.querySelector(".progression");
//     progression.innerText = `${goal.current}/${goalObjectiveQuantity}`;
//   }
// };
