let workHours
let workMinutes
let workSeconds
let breakHours
let breakMinutes
let breakSeconds
let interval
let workTime,
  breakTime,
  maxPomos,
  countDirection,
  currentPomo = 0,
  isWorkPeriod = true,
  secondsRemaining
let showHours = true
let circle1, circle2, circle3, circle4, circle5
let pomosLeft

const button = document.querySelector(".click")
button.addEventListener("click", startPomodoro)

window.addEventListener("onWidgetLoad", obj => {
  fieldData = obj.detail.fieldData
  console.log(fieldData)
  workHours = parseInt(fieldData.targetHours) || 0
  workMinutes = parseInt(fieldData.targetMinutes) || 0
  workSeconds = parseInt(fieldData.targetSeconds) || 0
  breakHours = parseInt(fieldData.breakHours) || 0
  breakMinutes = parseInt(fieldData.breakMinutes) || 0
  breakSeconds = parseInt(fieldData.breakSeconds) || 0
  maxPomos = parseInt(fieldData.maxPomos.value) || 5 // Asegúrate de convertir a entero
  countDirection = fieldData.goUp === "true" ? "up" : "down"
  workTime = workHours * 3600 + workMinutes * 60 + workSeconds
  breakTime = breakHours * 3600 + breakMinutes * 60 + breakSeconds
  secondsRemaining = countDirection === "down" ? workTime : 0
  showHours = workHours > 0 || breakHours > 0
  circle1 = document.querySelector(".circle-1")
  circle2 = document.querySelector(".circle-2")
  circle3 = document.querySelector(".circle-3")
  circle4 = document.querySelector(".circle-4")
  circle5 = document.querySelector(".circle-5")
  pomosLeft = document.querySelector(".pomos-left")
  pomosLeft.textContent = `${currentPomo} | ${maxPomos}`
  displayTime()
})

window.addEventListener("onEventReceived", obj => {
  if (obj.detail.event.value === "start") {
    startPomodoro()
  }

  if (obj.detail.event.value === "stop") {
    clearInterval(interval)
  }
})

function startPomodoro() {
  workTime = workHours * 3600 + workMinutes * 60 + workSeconds
  breakTime = breakHours * 3600 + breakMinutes * 60 + breakSeconds

  maxPomos = parseInt(fieldData.maxPomos.value) || 5 // Asegúrate de convertir a entero
  countDirection = fieldData.goUp === "true" ? "up" : "down"
  currentPomo = 0
  isWorkPeriod = true
  secondsRemaining = countDirection === "down" ? workTime : 0
  showHours = workHours > 0 || breakHours > 0
  updateTimer()
  clearInterval(interval)
  interval = setInterval(updateTimer, 1000)
}

function updateTimer() {
  if (countDirection === "down") {
    secondsRemaining--
  } else {
    secondsRemaining++
  }

  if (secondsRemaining < 0) {
    handlePeriodEnd()
  } else if (
    countDirection === "up" &&
    ((isWorkPeriod && secondsRemaining >= workTime) || (!isWorkPeriod && secondsRemaining >= breakTime))
  ) {
    handlePeriodEnd()
  }

  displayTime()
}

function handlePeriodEnd() {
  if (isWorkPeriod) {
    currentPomo++
    if (currentPomo >= maxPomos) {
      clearInterval(interval)
      secondsRemaining = 0 // Setea segundos a 0 cuando se completa el último pomodoro
      displayTime()
      pomosLeft.textContent = `${currentPomo} | ${maxPomos}`
      return
    }
    secondsRemaining = countDirection === "down" ? breakTime : 0
    isWorkPeriod = false
  } else {
    secondsRemaining = countDirection === "down" ? workTime : 0
    isWorkPeriod = true
  }
  pomosLeft.textContent = `${currentPomo} | ${maxPomos}`
}

function displayTime() {
  let hours = Math.floor(secondsRemaining / 3600)
  let minutes = Math.floor((secondsRemaining % 3600) / 60)
  let seconds = secondsRemaining % 60
  if (secondsRemaining < 0) {
    hours = 0
    minutes = 0
    seconds = 0
  }
  if (showHours) {
    document.getElementById("timer").textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`
  } else {
    document.getElementById("timer").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`
  }
  // Mostrar círculos de iteraciones completadas
  showCompletedPomos(currentPomo)
}

function showCompletedPomos(count) {
  const circles = [circle1, circle2, circle3, circle4, circle5]
  circles.forEach((circle, index) => {
    if (index < count) {
      circle.style.visibility = "visible"
    } else {
      circle.style.visibility = "hidden"
    }
  })
}
