const button = document.querySelector(".click")
const hoursContainer = document.querySelector(".hours-container")
const minutesContainer = document.querySelector(".minutes-container")
const secondsContainer = document.querySelector(".seconds-container")

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

// the padStart method adds a zero to the left of the number if it is less than 10
let hoursTimer, minutesTimer, secondsTimer
const startPomo = () => {
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
  console.log(secondsLeft)
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
  if (isOver) {
    clearInterval(secondsTimer)
  }
}
