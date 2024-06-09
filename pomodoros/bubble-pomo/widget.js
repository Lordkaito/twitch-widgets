const button = document.querySelector(".click")
const hoursContainer = document.querySelector(".hours-container")
const minutesContainer = document.querySelector(".minutes-container")
const secondsContainer = document.querySelector(".seconds-container")
const hoursSeparator = document.querySelector(".hours-separator")
const minutesSeparator = document.querySelector(".minutes-separator")
const pomosCounter = document.querySelector(".pomos-left")
const pomoContainer = document.querySelector(".pomo-counter")
const textObjective = document.querySelector(".text-objective")
const circle1 = document.querySelector(".circle-1")
const circle2 = document.querySelector(".circle-2")
const circle3 = document.querySelector(".circle-3")
const circle4 = document.querySelector(".circle-4")
const circle5 = document.querySelector(".circle-5")
// let fieldData = {}
let currentPomo = 0
let maxPomos
let startHours
let startMinutes
let startSeconds
let showPomo
let goUp
let targetHour
let targetMinute
let targetSeconds
let fieldDataHours
let fieldDataMinutes
let fieldDataSeconds

button.addEventListener("click", () => {
  startPomo()
})

window.addEventListener("onWidgetLoad", obj => {
  fieldData = obj.detail.fieldData
  startHours = fieldData.hoursLeft
  startMinutes = fieldData.minutesLeft
  startSeconds = fieldData.secondsLeft
  maxPomos = fieldData.maxPomos
  showPomo = fieldData.showPomo
  targetHour = fieldData.targetHours
  targetMinute = fieldData.targetMinutes
  targetSeconds = fieldData.targetSeconds
  fieldDataHours = fieldData.targetHours
  fieldDataMinutes = fieldData.targetMinutes
  fieldDataSeconds = fieldData.targetSeconds
  goUp = fieldData.goUp === "true"
  hoursContainer.textContent = startHours?.toString().padStart(2, "0") ?? "00"
  minutesContainer.textContent = startMinutes?.toString().padStart(2, "0") ?? "00"
  secondsContainer.textContent = startSeconds?.toString().padStart(2, "0") ?? "00"
  pomosCounter.textContent = currentPomo + " | " + maxPomos
  if (showPomo) {
    pomoContainer.style.visibility = "visible"
  } else {
    pomoContainer.style.visibility = "hidden"
  }
  if (isRunning) {
    textObjective.textContent = "WORK"
  } else {
    textObjective.textContent = "BREAK"
  }
})

window.addEventListener("onEventReceived", obj => {
  console.log(obj.detail)
  if (obj.detail.event.value === "start") {
    startPomo()
  }

  if (obj.detail.event.value === "stop") {
    isRunning = false
    // clear all intervals existing
    clearInterval(secondsTimer)
  }
})

const isTargetTime = targetHour === startHours && targetMinute === startMinutes && targetSeconds === targetSeconds

secondsContainer.textContent = startSeconds?.toString().padStart(2, "0") ?? "00"
minutesContainer.textContent = startMinutes?.toString().padStart(2, "0") ?? "00"
hoursContainer.textContent = startHours?.toString().padStart(2, "0") ?? "00"

let isRunning = false
const startPomo = () => {
  if (isRunning) return
  startHours = fieldData.hoursLeft
  startMinutes = fieldData.minutesLeft
  startSeconds = fieldData.secondsLeft
  hoursContainer.textContent = startHours.toString().padStart(2, "0")
  minutesContainer.textContent = startMinutes.toString().padStart(2, "0")
  secondsContainer.textContent = startSeconds.toString().padStart(2, "0")
  isRunning = true
  if (startHours === 0 && startMinutes === 0 && startSeconds === 60) {
    startHours = fieldDataHours
    startMinutes = fieldDataMinutes
    startSeconds = fieldDataSeconds
  }
  pomosCounter.textContent = currentPomo + " | " + maxPomos
  if (startHours <= 0) {
    hoursContainer.style.display = "none"
    hoursSeparator.style.display = "none"
  }

  if (startMinutes === 60 && goUp) {
    hoursContainer.style.display = "block"
    hoursSeparator.style.display = "block"
  }
  secondsTimer = setInterval(updateSeconds, 1000)
}

const updateHours = () => {
  if (startHours === 0 && !goUp) return

  if (goUp) {
    startHours++
  } else {
    startHours--
  }

  if (startHours <= 0 && !goUp) {
    hoursContainer.style.display = "none"
    hoursSeparator.style.display = "none"
  }

  if (startHours === 0) {
    hoursContainer.style.display = "none"
    hoursSeparator.style.display = "none"
  }

  if (startMinutes === 0 && goUp) {
    hoursContainer.style.display = "block"
    hoursSeparator.style.display = "block"
  }
  hoursContainer.textContent = startHours.toString().padStart(2, "0")
}

const updateMinutes = () => {
  if (startMinutes <= 0 && !goUp) return
  if (goUp) {
    startMinutes++
  } else {
    startMinutes--
  }

  if (startMinutes <= 0 && startHours > 0) {
    startMinutes = 60
  }

  if (startMinutes === 60 && goUp) {
    startMinutes = 0
  }
  minutesContainer.textContent = startMinutes.toString().padStart(2, "0")
}

const updateSeconds = () => {
  if (isRunning) textObjective.textContent = "WORK"
  if (goUp) {
    startSeconds++
  } else {
    startSeconds--
  }

  if (startSeconds === 59 && !goUp) {
    updateMinutes()
  }

  if (startMinutes <= 0 && !goUp) {
    updateHours()
  }

  if (startSeconds === 60 && goUp) {
    updateMinutes()
  }

  if (startMinutes === 0 && startSeconds === 60 && goUp) {
    updateHours()
  }

  if (startSeconds <= 0 && !goUp) {
    startSeconds = 60
  }

  if (startSeconds === 60 && goUp) {
    startSeconds = 0
  }

  if (startSeconds === 60) {
    secondsContainer.textContent = "00"
  } else {
    secondsContainer.textContent = startSeconds.toString().padStart(2, "0")
  }
  const isOver = goUp
    ? targetHour == startHours && targetMinute == startMinutes && targetSeconds == startSeconds
    : startHours === 0 && startMinutes === 0 && startSeconds === 60
  if (isOver && maxPomos > currentPomo) {
    currentPomo++
    pomosCounter.textContent = currentPomo + " | " + maxPomos
  }
  if (currentPomo >= 1) {
    circle1.style.visibility = "visible"
  }

  if (currentPomo >= 2) {
    circle2.style.visibility = "visible"
  }

  if (currentPomo >= 3) {
    circle3.style.visibility = "visible"
  }

  if (currentPomo >= 4) {
    circle4.style.visibility = "visible"
  }

  if (currentPomo >= 5) {
    circle5.style.visibility = "visible"
  }
  if (isOver) {
    if (fieldData.sound === "soundOne") {
      firstAudio.play()
      const audio = new Audio(firstAudio.src)
      audio.play()
    }

    if (fieldData.sound === "soundTwo") {
      const audio = new Audio(secondAudio.src)
      audio.play()
    }

    isRunning = false
    textObjective.textContent = "BREAK"
    clearInterval(secondsTimer)
  }
}
