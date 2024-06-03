const button = document.querySelector(".click")
const hoursContainer = document.querySelector(".hours-container")
const minutesContainer = document.querySelector(".minutes-container")
const secondsContainer = document.querySelector(".seconds-container")
const hoursSeparator = document.querySelector(".hours-separator")
const minutesSeparator = document.querySelector(".minutes-separator")
const pomosCounter = document.querySelector(".pomos-left")
const pomoContainer = document.querySelector(".pomo-counter")

button.addEventListener("click", () => {
  startPomo()
  if(showPomo) {
    pomoContainer.style.visibility = "visible"
  } else {
    pomoContainer.style.visibility = "hidden"
  }
})
let hoursLeft = 59 /// this will be set to the fieldData value later
let minutesLeft = 23
let secondsLeft = 58

const targetHour = 1
const targetMinute = 10
const targetSeconds = 0
const isTargetTime = targetHour === hoursLeft && targetMinute === minutesLeft && targetSeconds === secondsLeft

secondsContainer.textContent = secondsLeft.toString().padStart(2, "0")
minutesContainer.textContent = minutesLeft.toString().padStart(2, "0")
hoursContainer.textContent = hoursLeft.toString().padStart(2, "0")
const maxPomos = 4 // this will be set to the fieldData value later
let currentPomo = 0

const fieldDataHours = 1
const fieldDataMinutes = 20
const fieldDataSeconds = 0
let isRunning = false
const goUp = true
const showPomo = false

// the padStart method adds a zero to the left of the number if it is less than 10
let hoursTimer, minutesTimer, secondsTimer
const startPomo = () => {
  if (isRunning) return
  isRunning = true
  console.log(hoursLeft, minutesLeft, secondsLeft)
  if (hoursLeft === 0 && minutesLeft === 0 && secondsLeft === 60) {
    hoursLeft = fieldDataHours
    minutesLeft = fieldDataMinutes
    secondsLeft = fieldDataSeconds
  }
  pomosCounter.textContent = `${currentPomo}|${maxPomos}`
  if (hoursLeft <= 0 && !goUp) {
    hoursContainer.style.display = "none"
    hoursSeparator.style.display = "none"
  }

  if (minutesLeft === 60 && goUp) {
    hoursContainer.style.display = "block"
    hoursSeparator.style.display = "block"
  }
  secondsTimer = setInterval(updateSeconds, 1000)
}

const updateHours = () => {
  if (hoursLeft === 0 && !goUp) return

  if (goUp) {
    console.log("asdjfads")
    hoursLeft++
  } else {
    hoursLeft--
  }

  if (hoursLeft <= 0 && !goUp) {
    hoursContainer.style.display = "none"
    hoursSeparator.style.display = "none"
  }

  if (minutesLeft === 0 && goUp) {
    hoursContainer.style.display = "block"
    hoursSeparator.style.display = "block"
  }
  hoursContainer.textContent = hoursLeft.toString().padStart(2, "0")
}

const updateMinutes = () => {
  if (minutesLeft <= 0 && !goUp) return
  if (goUp) {
    minutesLeft++
  } else {
    minutesLeft--
  }

  if (minutesLeft <= 0 && hoursLeft > 0) {
    minutesLeft = 60
  }

  if(minutesLeft === 60 && goUp) {
    minutesLeft = 0
  }
  minutesContainer.textContent = minutesLeft.toString().padStart(2, "0")
}

const updateSeconds = () => {
  if (goUp) {
    secondsLeft++
  } else {
    secondsLeft--
  }

  if (secondsLeft === 59 && !goUp) {
    updateMinutes()
  }

  if (minutesLeft <= 0 && !goUp) {
    updateHours()
  }

  if (secondsLeft === 60 && goUp) {
    updateMinutes()
  }

  if (minutesLeft === 0 && secondsLeft === 60 && goUp) {
    updateHours()
  }

  if (secondsLeft <= 0 && !goUp) {
    secondsLeft = 60
  }

  if (secondsLeft === 60 && goUp) {
    secondsLeft = 0
  }

  if (secondsLeft === 60) {
    secondsContainer.textContent = "00"
  } else {
    secondsContainer.textContent = secondsLeft.toString().padStart(2, "0")
  }
  const isOver = goUp ? isTargetTime : hoursLeft === 0 && minutesLeft === 0 && secondsLeft === 60
  if (isOver && maxPomos > currentPomo) {
    currentPomo++
    pomosCounter.textContent = `${currentPomo}|${maxPomos}`
  }
  if (isOver) {
    isRunning = false
    clearInterval(secondsTimer)
  }
}
