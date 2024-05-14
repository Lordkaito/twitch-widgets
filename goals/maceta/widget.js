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
    waveContainer: document.querySelector(".wave-container"),
    flexContainer: document.querySelector(".flex"),
    flex2: document.querySelector(".flex2"),
    progressNums: document.querySelector(".progress-nums"),
    tierra: document.querySelector(".tierra"),
    brote: document.querySelector(".brote"),
    tallo1: document.querySelector(".tallo1"),
    tallo2: document.querySelector(".tallo2"),
    tallo3: document.querySelector(".tallo3"),
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

function handleGrow(amount, callback, initial = false) {
  let amountToUpdate = widgetApiData[goalType].amount + amount + mainObj.fieldData.goalStartQuantity
  if (initial === true) {
    amountToUpdate = amount
  }

  const updateWaveContainerTopPosition = percentage => {
    const maxTop = 14
    const minTop = -1
    const currentTop = ((maxTop - minTop) * percentage) / 100 + minTop
    items.waveContainer.style.bottom = `${currentTop}rem`
  }

  const updateFlexTwoHeight = percentage => {
    const maxHeight = 200
    const minHeight = 0
    const currentHeight = ((maxHeight - minHeight) * percentage) / 100 + minHeight
    items.flex2.style.height = `${currentHeight}px`
  }

  const updateProgressNums = percentage => {
    items.progressNums.innerText = `${percentage}%`
  }

  let completedGoal = checkIfCompleted(amountToUpdate)
  if (!completedGoal) {
    const percentage = getPercentage(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity)
    updateWaveContainerTopPosition(percentage)
    updateFlexTwoHeight(percentage)
    updateProgressNums(percentage)
    if (percentage >= 25 && percentage < 50) {
      items.brote.style.opacity = 1
    }
    if (percentage >= 50 && percentage < 75) {
      items.brote.style.opacity = 0
      items.tierra.style.opacity = 0
      items.tallo1.style.opacity = 1
    }
    if (percentage >= 75 && percentage < 100) {
      items.tallo2.style.opacity = 1
    }
    if (percentage >= 100) {
      items.tallo3.style.opacity = 1
    }
  } else {
    updateWaveContainerTopPosition(100)
    updateFlexTwoHeight(100)
    updateProgressNums(getPercentage(amountToUpdate, mainObj.fieldData.goalObjectiveQuantity))
    const opacityTallo1 = window.getComputedStyle(items.tallo1).getPropertyValue("opacity")
    const opacityTallo2 = window.getComputedStyle(items.tallo2).getPropertyValue("opacity")
    const opacityTallo3 = window.getComputedStyle(items.tallo3).getPropertyValue("opacity")
    const opacityBrote = window.getComputedStyle(items.brote).getPropertyValue("opacity")
    const opacityTierra = window.getComputedStyle(items.tierra).getPropertyValue("opacity")
    console.log(
      opacityTallo1,
      opacityTallo2,
      opacityTallo3,
      opacityBrote,
      opacityTierra,
      typeof opacityTallo1,
      typeof opacityTallo2,
      typeof opacityTallo3,
      typeof opacityBrote,
      typeof opacityTierra
    )
    if (opacityBrote === "1") items.brote.style.opacity = 0
    if (opacityTierra === "1") items.tierra.style.opacity = 0
    if (opacityTallo1 === "0") items.tallo1.style.opacity = 1
    if (opacityTallo2 === "0") items.tallo2.style.opacity = 1
    if (opacityTallo3 === "0") items.tallo3.style.opacity = 1
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
