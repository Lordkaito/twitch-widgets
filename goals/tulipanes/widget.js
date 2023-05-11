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
  let text = "GOAL COMPLETED!";
  let string = "";
  let split = text.split("").forEach((letter) => {
    string += letter + "\n";
    console.log(string);
  });
  p.innerText = string;
};

const progress = document.querySelector(".progress-bar-container");
progress.style.setProperty("--progress-bar-left", "0");

window.addEventListener("onWidgetLoad", function (obj) {
  let apiData;
  SE_API.store.get("beniartsGoalWidgetPreviousGained").then((data) => {
    if (data === null) {
      apiData = gained;
    } else {
      apiData = gained;
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

  if (mainObj.fieldData.resetGoalData === "true") {
    let clear = {
      subscriber: { type: "subscriber", amount: 0 },
      follower: { type: "follower", amount: 0 },
      tip: { type: "tip", amount: 0 },
      cheer: { type: "cheer", amount: 0 },
    };
    SE_API.store.set("beniartsGoalWidgetPreviousGained", clear);
  }

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
    SE_API.store.set("beniartsGoalWidgetPreviousGained", clear);
    window.location.reload();
  }

  if (obj.detail.event.type === mainObj.fieldData.goalType) {
    const reg = document.querySelector(".gifReg");
    if (!reg.classList.contains("playing")) {
      reg.classList.add("playing");
      setTimeout(() => {
        reg.classList.remove("playing");
      }, 2000);
    }
  }

  progressFn(obj.detail.event);
});

const progressFn = (data) => {
  if (data.type === "subscriber" || data.type === "follower") {
    grow(data.type);
  } else {
    grow(data.type, data.amount);
  }
};

const initGoal = (type, data) => {
  if (mainObj.fieldData.goalTheme === "pink") {
    image.src = "https://i.postimg.cc/hvs4D0z6/patita.png ";
    round.style.backgroundColor = "pink";
    const goalText = document.querySelector(".goal-name");
    const progressBar = document.querySelector(".progress-bar");
    const progression = document.querySelector(".progressNums");
    goalText.style.color = "#ea769b";
    progressBar.style.backgroundColor = "#c9527a";
    progression.style.textShadow = `-1px -1px 0 #c9527a, 1px -1px 0 #c9527a, -1px 1px 0 #c9527a,
    1px 1px 0 #c9527a`;
  }
  let current = goalStartQuantity;
  let step;
  const progression = document.querySelector(".progressNums");
  let progressBarHeight = document.querySelector(
    ".progress-bar-container"
  ).offsetHeight;

  if (type === "tip" || type === "cheer") {
    step = progressBarHeight / goalObjectiveQuantity;
  } else {
    step = progressBarHeight / (goalObjectiveQuantity - goalStartQuantity);
  }

  goal = {
    type: type,
    current: current,
    step: step,
  };
  progression.innerText = current + "/" + "\n" + goalObjectiveQuantity;
  if (mainObj.fieldData.goalFullType === "allTime") {
    grow("initial", 1, data);
  }
};

const grow = (type, amount = 1, data) => {
  if (type !== goalType) {
    if (type === "initial") {
      gained = data;
      amount = data[goalType].amount;
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
  const completeGoal = document.querySelector(".progression");
  let currentHeight = progressBar.offsetHeight;
  const progression = document.querySelector(".progressNums");
  total = goal.current + amount;
  if (goal.current + amount >= goalObjectiveQuantity) {
    progressBar.style.height = `100%`;
    progression.style.opacity = "0";
    goalCompletedText();
    if (total >= goalObjectiveQuantity) {
      goalCompletedText();
    }
    return;
  }
  if (goal.current < goalObjectiveQuantity) {
    goal.current += amount;
    progressBar.style.height = `${currentHeight + goal.step * amount}px`;
    progression.innerText = goal.current + "/" + "\n" + goalObjectiveQuantity;
  }
};
