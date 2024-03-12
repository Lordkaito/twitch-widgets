let mainObj = {};
const goalTree = {
  tree1: "https://i.postimg.cc/KzMqkDwH/planta1.png",
  tree2: "https://i.postimg.cc/tg1Dwzq4/planta2.png",
  tree3: "https://i.postimg.cc/3J7SNpBt/planta4.png",
  tree4: "https://i.postimg.cc/RZpXgYzY/planta8.png",
};
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

let objective;

window.addEventListener("onWidgetLoad", async function (obj) {
  let api = await getApiData(obj);
  objective = obj.detail.fieldData.goalObjectiveQuantity;
  console.log(objective);
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

  if (event.isCommunityGift) return;

  if (event.type === goalType) {
    if (listener === "cheer-latest" || listener === "tip-latest") {
      handleGrow(event.amount, updateApiData, false);
      return;
    }

    if (listener === "follower-latest") {
      handleGrow(1, updateApiData, false);
      return;
    }

    if (listener === "subscriber-latest") {
      if (event.bulkGifted) {
        handleGrow(event.amount, updateApiData, false);
        return;
      }
      handleGrow(1, updateApiData, false);
      return;
    }
  }
});

const getApiData = async (obj) => {
  // let data = await SE_API.store.get("beniartsCircleGoalsPackWidgetPreviousGained");
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
  if (mainObj.fieldData.goalStart !== 0) {
    amount = amount + mainObj.fieldData.goalStartQuantity;
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
    objective: document.querySelector(".goal-obj-50"),
    goalTypeText: document.querySelector(".goal-type-text"),
    goalTree: document.querySelector(".img-goal"),
    goalStroke: document.querySelector("#stroke-circle"),
    progressCircle: document.getElementById("progressCircle"),
    titleGoal: document.querySelector("#goal-type-text"),
  };

  let text = mainObj.fieldData.goalTypeText;

  items.objective.innerText = mainObj.fieldData.goalObjectiveQuantity;

  if (mainObj.fieldData.goalType === "tip") {
    items.objective.innerText =
      amount +
      mainObj.fieldData.currency +
      "/" +
      mainObj.fieldData.goalObjectiveQuantity +
      mainObj.fieldData.currency;
  }

  if (mainObj.fieldData.goalType === "follower" || "subscriber" || "cheer") {
    items.objective.innerText =
      amount + "/" + mainObj.fieldData.goalObjectiveQuantity;
  }
  // Setting custom color to text porcentage
  items.progressCircle.style.color = mainObj.fieldData.porcentageBarColor;

  // Setting custom color to progress bar
  items.goalStroke.style.stroke = mainObj.fieldData.barColor;

  // Setting custom color to title of goal
  items.titleGoal.style.color = mainObj.fieldData.textGoalColor;

  // Setting custom color to nums/counters of goal
  items.objective.style.color = mainObj.fieldData.numsGoalColor;

  // Setting custom tree to goal
  switch (mainObj.fieldData.goalTree) {
    case "sabila":
      items.goalTree.src = goalTree.tree1;
      break;
    case "enrredadera":
      items.goalTree.src = goalTree.tree2;
      break;
    case "monstera":
      items.goalTree.src = goalTree.tree3;
      break;
    case "bonsai":
      items.goalTree.src = goalTree.tree4;
      break;

    default:
      items.goalTree.src = goalTree.tree4;
      break;
  }

  items.goalTypeText.innerText = text;

  step = getStep(
    items.progressBarContainer,
    mainObj.fieldData.goalObjectiveQuantity
  );

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
  // const containerHeight = container.offsetHeight;
  const step = container / objective;
  return step;
}

function getGachoStep(diff, objective) {
  return diff / objective;
}

let progreso = 0;
let circle = document.querySelector("circle");
// let progressText = document.getElementById("progressCircle");
const newStep = getStep(540, objective);
function aumentarProgreso(amount) {
  if (amount > objective) {
    items.progressCircle.innerText = getPercentage(amount, objective);
    progreso += newStep;
    let progress = 540 - (540 * 540) / 720;
    circle.style.transition = "stroke-dashoffset .5s ease-out"; // Agrega esta línea
    circle.style.strokeDashoffset = progress;
    return;
  } else {
    items.progressCircle.innerText = getPercentage(amount, objective);
    const thing = getStep(540, objective) * amount;
    progreso += newStep;
    let progress = 540 - (540 * thing) / 720;
    circle.style.transition = "stroke-dashoffset .5s ease-out"; // Agrega esta línea
    circle.style.strokeDashoffset = progress;
  }
}

function roundtip(amount) {
  return Math.round(amount * 100) / 100;
}

function handleGrow(amount, callback, initial = false) {
  let amountToUpdate =
    widgetApiData[goalType].amount +
    amount +
    mainObj.fieldData.goalStartQuantity;
  if (initial === true) {
    amountToUpdate = amount;
  }

  let completedGoal = checkIfCompleted(amountToUpdate);
  if (!completedGoal) {
    aumentarProgreso(amountToUpdate);
    if (goalType === "tip") {
      const rounded = roundtip(amountToUpdate)
      items.objective.innerText =
        rounded +
        mainObj.fieldData.currency +
        "/" +
        mainObj.fieldData.goalObjectiveQuantity +
        mainObj.fieldData.currency;
    } else {
      items.objective.innerText =
        amountToUpdate + "/" + mainObj.fieldData.goalObjectiveQuantity;
    }
  } else {
    aumentarProgreso(amountToUpdate);
    if (goalType === "tip") {
      const rounded = roundtip(amountToUpdate)
      items.objective.innerText =
        rounded +
        mainObj.fieldData.currency +
        "/" +
        mainObj.fieldData.goalObjectiveQuantity +
        mainObj.fieldData.currency;
    } else {
      items.objective.innerText =
        amountToUpdate + "/" + mainObj.fieldData.goalObjectiveQuantity;
    }
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
  // SE_API.store.set("beniartsCircleGoalsPackWidgetPreviousGained", widgetApiData);
}

function clearApiData() {
  // SE_API.store.set("beniartsCircleGoalsPackWidgetPreviousGained", defaultApiData);
  window.location.reload();
}
