const main = document.querySelector(".main")
const button = document.querySelector(".click")

const getRandomPosition = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const generateYeah = () => {
  console.log("yeah")
  const yeah = document.createElement("div")
  yeah.classList.add("yeah")
  yeah.textContent = "+Yeah!"
  yeah.style.left = `${getRandomPosition(0, main.clientWidth)}px`
  yeah.style.top = `${getRandomPosition(0, main.clientHeight)}px`
  // yeah.style.animation = 'appear 2s forwards'
  setTimeout(() => {
    yeah.style.animation = "disappear 0.5s 2s forwards"
    // yeah.remove()
    setTimeout(() => {
      yeah.remove()
    }, 2500)
  }, 2000)
  main.appendChild(yeah)
}

window.addEventListener("onWidgetLoad", obj => {
  fieldData = obj.detail.fieldData
})

window.addEventListener("onEventReceived", obj => {
  const { event, listener } = obj.detail
  const shouldGenerateYeah =
    (fieldData.redeemMethod === "channelPoints" && event.type === "channelPoints") ||
    (fieldData.redeemMethod === "command" && event.renderedText.startsWith(fieldData.command))
  if (shouldGenerateYeah) generateYeah()
})

button.addEventListener("click", generateYeah)
