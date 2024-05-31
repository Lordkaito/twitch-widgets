const button = document.querySelector(".click")
const hoursContainer = document.querySelector(".hours-container")
const minutesContainer = document.querySelector(".minutes-container")
const secondsContainer = document.querySelector(".seconds-container")
const hoursSeparator = document.querySelector(".hours-separator")
const minutesSeparator = document.querySelector(".minutes-separator")
const pomosCounter = document.querySelector(".pomos-left")

button.addEventListener("click", () => {
  startPomo()
})
let hoursLeft = 0 // this will be set to the fieldData value later
let minutesLeft = 0
let secondsLeft = 3

secondsContainer.textContent = secondsLeft.toString().padStart(2, "0")
minutesContainer.textContent = minutesLeft.toString().padStart(2, "0")
hoursContainer.textContent = hoursLeft.toString().padStart(2, "0")
const maxPomos = 4 // this will be set to the fieldData value later
let currentPomo = 0

const fieldDataHours = 1
const fieldDataMinutes = 20
const fieldDataSeconds = 0
let isRunning = false

// the padStart method adds a zero to the left of the number if it is less than 10
let hoursTimer, minutesTimer, secondsTimer
const startPomo = () => {
  if(isRunning) return
  isRunning = true
  console.log(hoursLeft, minutesLeft, secondsLeft)
  if(hoursLeft === 0 && minutesLeft === 0 && secondsLeft === 60) {
    hoursLeft = fieldDataHours
    minutesLeft = fieldDataMinutes
    secondsLeft = fieldDataSeconds
  }
  pomosCounter.textContent = `${currentPomo}|${maxPomos}`
  if(hoursLeft <= 0) {
    hoursContainer.style.display = "none"
    hoursSeparator.style.display = "none"
  }
  secondsTimer = setInterval(updateSeconds, 1000)
}

const updateHours = () => {
  if (hoursLeft === 0) return
  hoursLeft--
  hoursContainer.textContent = minutesLeft.toString().padStart(2, "0")
}

const updateMinutes = () => {
  if (minutesLeft <= 0) return
  minutesLeft--

  if (minutesLeft <= 0 && hoursLeft > 0) {
    minutesLeft = 60
  }
  minutesContainer.textContent = minutesLeft.toString().padStart(2, "0")
}

const updateSeconds = () => {
  secondsLeft--

  if (secondsLeft === 59) {
    updateMinutes()
  }

  if (minutesLeft <= 0) {
    updateHours()
  }
  if (secondsLeft <= 0) {
    secondsLeft = 60
  }

  if (secondsLeft === 60) {
    secondsContainer.textContent = "00"
  } else {
    secondsContainer.textContent = secondsLeft.toString().padStart(2, "0")
  }
  const isOver = hoursLeft === 0 && minutesLeft === 0 && secondsLeft === 60
  if(isOver && maxPomos > currentPomo) {
    currentPomo++
    pomosCounter.textContent = `${currentPomo}|${maxPomos}`
  }
  if (isOver) {
    isRunning = false
    clearInterval(secondsTimer)
  }
}
