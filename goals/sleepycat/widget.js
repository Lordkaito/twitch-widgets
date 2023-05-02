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
  const progression = document.querySelector(".progression");
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
  let currentWidth = progressBar.offsetWidth;
  let step = goal.step * amount;
  const progression = document.querySelector(".progression");
  if (
    goal.current < goalObjectiveQuantity &&
    goal.current + amount >= goalObjectiveQuantity
  ) {
    progressBar.style.width = `100%`;
    hidden.style.width = `100%`;
    progressImg.style.left = `${hidden.offsetWidth - 32}px`;
    let total = goal.current + amount;
    total >= goalObjectiveQuantity
      ? (progression.innerText = "Goal completed!")
      : (progression.innerText = total + "/" + goalObjectiveQuantity);
    return;
  }
  goal.current += amount;
  progressBar.style.width = `${currentWidth + step}px`;
  hidden.style.width = `${currentWidth + step}px`;
  progressImg.style.left = `${hidden.offsetWidth + 14}px`;
  progression.innerText = goal.current + "/" + goalObjectiveQuantity;
};

let total;
const grow = (amount = 1) => {
  let progressBar = document.querySelector(".progress-bar");
  let progressImg = document.querySelector(".img-container");
  let currentWidth = progressBar.offsetWidth;
  const progression = document.querySelector(".progression");
  total = goal.current + amount;
  if (goal.current + amount >= goalObjectiveQuantity) {
    hidden.style.width = `100%`;
    progressBar.style.width = `100%`;
    progressImg.style.left = `${hidden.offsetWidth - 32}px`;
    total >= goalObjectiveQuantity
      ? (progression.innerText = "Goal completed!")
      : (progression.innerText = total + "/" + goalObjectiveQuantity);
    return;
  }
  if (goal.current < goalObjectiveQuantity) {
    goal.current += amount;
    hidden.style.width = `${currentWidth + goal.step * amount}px`;
    progressBar.style.width = `${currentWidth + goal.step * amount}px`;
    progressImg.style.left = `${hidden.offsetWidth + 14}px`;
    progression.innerText = goal.current + "/" + goalObjectiveQuantity;
  }
};
