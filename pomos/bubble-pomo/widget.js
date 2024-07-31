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
let isOver = false
// let fieldData // Variable para almacenar los datos del campo

window.addEventListener("onWidgetLoad", obj => {
  fieldData = obj.detail.fieldData
  workHours = parseInt(fieldData.targetHours) || 0
  workMinutes = parseInt(fieldData.targetMinutes) || 0
  workSeconds = parseInt(fieldData.targetSeconds) || 0
  breakHours = parseInt(fieldData.breakHours) || 0
  breakMinutes = parseInt(fieldData.breakMinutes) || 0
  breakSeconds = parseInt(fieldData.breakSeconds) || 0
  maxPomos = parseInt(fieldData.maxPomos) || 5 // Asegúrate de convertir a entero
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
  pomosLeft.textContent = currentPomo + " | " + maxPomos
  displayTime()
  updateObjectiveText()
  const pomoContainer = document.querySelector(".pomo-container")
  const timer = document.querySelector("#timer")
  const circles = document.querySelectorAll(".circle")
  const pomoCounter = document.querySelector(".pomo-counter")
  const pomoNameColor = document.querySelector(".title-counter p")
  const textObjective = document.querySelector(".text-objective")
  const pomosLeftContainer = document.querySelector(".pomos-left")
  const svg = document.querySelector(".svg-container svg")
  const separator = document.querySelector(".counter-separator")
  if (fieldData.theme === "purple") {
    if (fieldData.showCustomColors === "false") {
      timer.style.color = "#ffefe6"
      circles.forEach(circle => (circle.style.backgroundColor = "#8f4ba0"))
      pomoCounter.style.backgroundColor = "#cc88dd"
      pomoCounter.style.borderColor = "#ffefdb"
      pomoNameColor.style.color = "#ffefdb"
      textObjective.style.color = "#8f4ba0"
      pomosLeftContainer.style.color = "#ffefdb"
      svg.style.color = "#8f4ba0"
      separator.style.backgroundColor = "#ffefdb"
      timer.style.textShadow = "0 0 10px #8f4ba0"
    }
    pomoContainer.style.background =
      "url('https://utfs.io/f/348c068a-1e63-4f7c-990b-841c5d3d4e14-szp3se.png') no-repeat center"
  }
  if (fieldData.theme === "pink") {
    if (fieldData.showCustomColors === "false") {
      timer.style.color = "#ffefe6"
      circles.forEach(circle => (circle.style.backgroundColor = "#c14b67"))
      pomoCounter.style.backgroundColor = "#ffa4bb"
      pomoCounter.style.borderColor = "#ffefdb"
      pomoNameColor.style.color = "#ffefdb"
      textObjective.style.color = "#c14b67"
      pomosLeftContainer.style.color = "#ffefdb"
      svg.style.color = "#c14b67"
      separator.style.backgroundColor = "#ffefdb"
      timer.style.textShadow = "0 0 10px #c14b67"
    }
    pomoContainer.style.background =
      "url('https://utfs.io/f/98431f00-d5d8-4dd1-b269-7223a2e3bec5-szl591.png') no-repeat center"
  }
  if (fieldData.theme === "green") {
    if (fieldData.showCustomColors === "false") {
      timer.style.color = "#ffefe6"
      circles.forEach(circle => (circle.style.backgroundColor = "#8e5e42"))
      pomoCounter.style.backgroundColor = "#b0a881"
      pomoCounter.style.borderColor = "#ffefdb"
      pomoNameColor.style.color = "#ffefdb"
      textObjective.style.color = "#736b44"
      pomosLeftContainer.style.color = "#ffefdb"
      svg.style.color = "#736b44"
      separator.style.backgroundColor = "#ffefdb"
      timer.style.textShadow = "0 0 10px #736b44"
    }
    pomoContainer.style.background =
      "url('https://utfs.io/f/be045d88-5f9a-4084-a1b5-751f3b87ad09-ot9ytg.png') no-repeat center"
  }
  if (fieldData.theme === "brown") {
    if (fieldData.showCustomColors === "false") {
      timer.style.color = "#ffefe6"
      circles.forEach(circle => (circle.style.backgroundColor = "#8e5e42"))
      pomoCounter.style.backgroundColor = "#cb9b7f"
      pomoCounter.style.borderColor = "#ffefdb"
      pomoNameColor.style.color = "#ffefdb"
      textObjective.style.color = "#8e5e42"
      pomosLeftContainer.style.color = "#ffefdb"
      svg.style.color = "#8e5e42"
      separator.style.backgroundColor = "#ffefdb"
      timer.style.textShadow = "0 0 10px #8e5e42"
    }
    pomoContainer.style.background =
      "url('https://utfs.io/f/56734d71-d008-46d4-9622-0e17bd5d4033-gg93l9.png') no-repeat center"
  }
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
  isOver = false
  workTime = workHours * 3600 + workMinutes * 60 + workSeconds
  breakTime = breakHours * 3600 + breakMinutes * 60 + breakSeconds

  maxPomos = parseInt(fieldData.maxPomos) || 5 // Asegúrate de convertir a entero
  countDirection = fieldData.goUp === "true" ? "up" : "down"
  currentPomo = 0
  isWorkPeriod = true
  secondsRemaining = countDirection === "down" ? workTime : 0
  showHours = workHours > 0 || breakHours > 0

  clearInterval(interval)
  if (countDirection === "down") {
    interval = setInterval(updateTimerDown, 1000)
  } else {
    interval = setInterval(updateTimerUp, 1000)
  }
  updateObjectiveText() // Actualizar el texto al iniciar
}

function updateTimerDown() {
  secondsRemaining--

  if (secondsRemaining < 0) {
    handlePeriodEnd()
  }

  displayTime()
}

function updateTimerUp() {
  secondsRemaining++

  if (
    (isWorkPeriod && secondsRemaining > workTime) || // Cambiar de >= a >
    (!isWorkPeriod && secondsRemaining > breakTime) // Cambiar de >= a >
  ) {
    handlePeriodEnd()
  }

  displayTime()
}

function handlePeriodEnd() {
  const audio1 = document.querySelector("#firstAudio")
  const audio2 = document.querySelector("#secondAudio")

  if (isWorkPeriod) {
    currentPomo++
    if (currentPomo >= maxPomos) {
      clearInterval(interval)
      secondsRemaining = 0 // Setea segundos a 0 cuando se completa el último pomodoro
      displayTime()
      pomosLeft.textContent = currentPomo + " | " + maxPomos
      audio1.play()
      isOver = true
      updateObjectiveText()
      return
    }
    secondsRemaining = countDirection === "down" ? breakTime : 0
    isWorkPeriod = false
    audio1.play() // Reproducir audio 1 al terminar el periodo de trabajo
  } else {
    secondsRemaining = countDirection === "down" ? workTime : 0
    isWorkPeriod = true
    audio2.play() // Reproducir audio 2 al terminar el periodo de descanso
  }
  updateObjectiveText() // Actualizar el texto al cambiar de periodo
  pomosLeft.textContent = currentPomo + " | " + maxPomos
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
    document.getElementById("timer").style.transform = "scale(0.7)"
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

function updateObjectiveText() {
  const textObjective = document.querySelector(".text-objective")
  if (isOver) {
    textObjective.textContent = "FINISHED"
    return
  }
  textObjective.textContent = isWorkPeriod ? "WORK" : "BREAK"
}
