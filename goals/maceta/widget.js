let mainObj = {}
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
}
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
}
let storedEvents = []
let eventCounter = 0
let timeout = null
let firstEvent = true
let previousSender = ""
let currentSender = ""
let items, step, goalType
let animationActive = false

window.addEventListener("onWidgetLoad", async function (obj) {
  let api = await getApiData(obj)
  init(obj, api, true)
})

let firstCopy = true

window.addEventListener("onEventReceived", function (obj) {
  if (obj.detail.event.value === "reset") {
    clearApiData()
    return
  }

  let event = obj.detail.event
  let listener = obj.detail.listener

  if (event.isCommunityGift) return

  if (event.type === goalType) {
    if (listener === "cheer-latest" || listener === "tip-latest") {
      handleGrow(event.amount, updateApiData, false)
      return
    }

    if (listener === "follower-latest") {
      handleGrow(1, updateApiData, false)
      return
    }

    if (listener === "subscriber-latest") {
      if (event.bulkGifted) {
        handleGrow(event.amount, updateApiData, false)
        return
      }
      handleGrow(1, updateApiData, false)
      return
    }
  }
})

const getApiData = async obj => {
  // let data = await SE_API.store.get("beniartsTulipanGoalWidgetPreviousGained");
  // if (data === null) {
  //   widgetApiData = defaultApiData;
  // } else {
  //   widgetApiData = data;
  // }
  // if (obj.detail.fieldData.goalFullType === "session") {
  //   widgetApiData = defaultApiData;
  // }
  widgetApiData = defaultApiData
  return widgetApiData
}

function init(obj, apiData, initial = false) {
  mainObj = obj.detail
  goalType = mainObj.fieldData.goalType

  let amount = apiData[goalType].amount
  if (mainObj.fieldData.goalStart !== 0) {
    amount = amount + mainObj.fieldData.goalStartQuantity
  }

  items = {
    progressBar: document.querySelector(".progress-bar"),
    trapezoid: document.querySelector(".trapezoid"),
  }

  let text = {
    subscriber: "sub goal",
    follower: "follow goal",
    cheer: "cheer goal",
    tip: "tip goal",
  }

  // items.objective.innerText = mainObj.fieldData.goalObjectiveQuantity

  if (mainObj.fieldData.goalType === "tip") {
    // items.objective.innerText = mainObj.fieldData.goalObjectiveQuantity + mainObj.fieldData.currency
  }

  // items.goalTypeText.innerText = text[goalType]

  step = getStep(14, mainObj.fieldData.goalObjectiveQuantity)

  if (mainObj.fieldData.goalFullType === "session") {
    widgetApiData = defaultApiData
    handleGrow(amount, null, true)
  } else if (initial === true) {
    handleGrow(amount, null, true)
  } else {
    handleGrow(amount, updateApiData, false)
  }
}

function checkIfCompleted(amountToUpdate) {
  let objective = mainObj.fieldData.goalObjectiveQuantity
  let currentAmount = amountToUpdate
  return currentAmount >= objective
}

function getStep(height, objective) {
  return height / objective
}

function getGachoStep(diff, objective) {
  return diff / objective
}
const clipAtMaxHeight = {
  topLeft: 6,
  topRight: 94,
  bottomRight: 85,
  bottomLeft: 15,
}

const clipAtMinHeight = {
  topLeft: 0,
  topRight: 90,
  bottomRight: 88,
  bottomLeft: 12,
}

function handleGrow(amount, callback, initial = false) {
  let amountToUpdate = widgetApiData[goalType].amount + amount + mainObj.fieldData.goalStartQuantity
  if (initial === true) {
    amountToUpdate = amount
  }

  const RoT = (clipAtMaxHeight, clipAtMinHeight, amountToUpdate) => {
    const percentage = getPercentage(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity)
    const currentClip = {
      topLeft: (percentage * clipAtMaxHeight.topLeft) / 100,
      topRight: (percentage * clipAtMaxHeight.topRight) / 100,
      bottomRight: (percentage * clipAtMaxHeight.bottomRight) / 100,
      bottomLeft: (percentage * clipAtMaxHeight.bottomLeft) / 100,
    }
    return currentClip
  }

  let completedGoal = checkIfCompleted(amountToUpdate)
  if (!completedGoal) {
    items.trapezoid.style.height = `${amountToUpdate * step}rem`
    items.trapezoid.style.clipPath = `polygon(
      ${RoT(clipAtMaxHeight, clipAtMinHeight, amountToUpdate).topLeft}% 0,
      ${RoT(clipAtMaxHeight, clipAtMinHeight, amountToUpdate).topRight}% 0,
      85% 100%,
      15% 100%`
    // if (goalType === "tip") {
    //   items.progressionText.innerHTML = getPercentage(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity)
    // } else {
    //   items.progressionText.innerHTML = getPercentage(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity)
    // }
  } else {
    items.trapezoid.style.height = "14rem"
  }
  if (callback !== null || mainObj.fieldData.goalFullType === "session") {
    callback(amountToUpdate - mainObj.fieldData.goalStartQuantity)
  }
}

function getPercentage(amount, objective) {
  let percentage = (amount / objective) * 100
  return Math.round(percentage)
}

function updateApiData(amountToUpdate) {
  widgetApiData[goalType].amount = amountToUpdate
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", widgetApiData);
}

function clearApiData() {
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", defaultApiData);
  window.location.reload()
}
