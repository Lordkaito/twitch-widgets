const main = document.querySelector(".main")
const button = document.querySelector(".click")

let fromBottom
let time

const getRandomPosition = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const yeah = `
  <div class="yeah">
    <span class="plus ${fieldData.svg}">+</span>
    <span class="yeah-text">Yeah!</span>
  </div>
`

const COLORS = ["#ffcb7a", "#a387ff", "#a0c759", "#fe82ac", "#82b9fe", "#79e1ed", "#eda4ff", "#fa8279"]

const buildYeah = () => {
  console.log(fieldData.svg.value)
  // const isRainbowMode = fieldData.rainbowMode === "true"
  return `
    ${svg.innerHTML}
    <span class="plus ${fieldData.svg}" style="color: ${color}">+</span>
    <span class="yeah-text" style="color: ${color}">Yeah!</span>
    `
}

const renderYeah = () => {
  const yeah = document.createElement("div")
  yeah.classList.add("yeah")
  if (fieldData.theme === "dark") {
    yeah.style.backgroundImage = "url('https://utfs.io/f/39abe8f9-53f3-423f-99e9-d705e6a0345e-opa45a.png')"
  } else {
    yeah.style.backgroundImage = "url('https://utfs.io/f/7255f702-57b8-47c2-9915-7f4e24d6845f-ygp59a.png')"
  }

  if (fromBottom) {
    yeah.style.left = `${getRandomPosition(0, main.clientWidth)}px`
    yeah.style.bottom = "0px"
    yeah.style.top = "auto"
    yeah.style.animationName = `riseUp`
    yeah.style.animationDuration = time / 1000 + "s"
    yeah.style.animationDirection = "forwards"
  } else {
    yeah.style.left = `${getRandomPosition(0, main.clientWidth)}px`
    yeah.style.top = `${getRandomPosition(0, main.clientHeight)}px`
    yeah.style.animationName = "popIn"
    yeah.style.animationDuration = "0.5s"
    yeah.style.animationDirection = "forwards"
  }
  requestAnimationFrame(() => {
    setTimeout(() => {
      // Aplicamos la animación de desaparición después de la animación de entrada
      if(!fromBottom) {
        yeah.style.animationName = "disappear"
        yeah.style.animationDuration = "0.5s"
        yeah.style.animationDelay = "1s"
        yeah.style.animationDirection = "forwards"
      }
      yeah.style.opacity = 0
    }, time - 500) // Tiempo de la animación de entrada
  })
  setTimeout(() => {
    yeah.remove()
  }, time)
  const isRainbowMode = fieldData.rainbowMode
  let color
  if (isRainbowMode) {
    color = COLORS[getRandomPosition(0, COLORS.length)]
  } else {
    color = fieldData.color
  }
  const svg = document.createElement("span")
  svg.classList.add("svg-container")
  switch (fieldData.svg) {
    case "star":
      svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m8.587 8.236l2.598-5.232a.911.911 0 0 1 1.63 0l2.598 5.232l5.808.844a.902.902 0 0 1 .503 1.542l-4.202 4.07l.992 5.75c.127.738-.653 1.3-1.32.952L12 18.678l-5.195 2.716c-.666.349-1.446-.214-1.319-.953l.992-5.75l-4.202-4.07a.902.902 0 0 1 .503-1.54z"></path></svg>`
      break
    case "heart":
      svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="currentColor" d="M240 102c0 70-103.79 126.66-108.21 129a8 8 0 0 1-7.58 0C119.79 228.66 16 172 16 102a62.07 62.07 0 0 1 62-62c20.65 0 38.73 8.88 50 23.89C139.27 48.88 157.35 40 178 40a62.07 62.07 0 0 1 62 62"></path></svg>`
      break
    case "flower":
      svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M4.822 1.112a3.08 3.08 0 0 1 5.256 2.08a3.07 3.07 0 0 1 3.767 1.992l-.475.156l.475-.155a3.052 3.052 0 0 1-1.86 3.813a3.04 3.04 0 0 1-.753 4.168a3.09 3.09 0 0 1-4.227-.581a3.09 3.09 0 0 1-5.043-.291A3.04 3.04 0 0 1 2.022 9a3.062 3.062 0 0 1 1.9-5.817a3.08 3.08 0 0 1 .9-2.07ZM9.205 7.26c0 1.21-.987 2.19-2.205 2.19a2.198 2.198 0 0 1-2.205-2.19c0-1.21.987-2.19 2.205-2.19s2.205.98 2.205 2.19" clip-rule="evenodd"></path></svg>`
      break
    case "moon":
      svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.992a10 10 0 1 0 9.236 13.838c.341-.82-.476-1.644-1.298-1.31a6.5 6.5 0 0 1-6.864-10.787l.077-.08c.551-.63.113-1.653-.758-1.653h-.266l-.068-.006z"></path></svg>`
      break
  }
  svg.querySelector("svg").style.color = color

  const plus = document.createElement("span")
  plus.classList.add("plus")
  plus.style.color = color
  plus.textContent = "+"
  plus.classList.add(fieldData.svg)
  const yeahText = document.createElement("span")
  yeahText.classList.add("yeah-text")
  yeahText.style.color = color
  yeahText.textContent = "Yeah!"
  yeah.appendChild(svg)
  yeah.appendChild(plus)
  yeah.appendChild(yeahText)
  main.appendChild(yeah)
}

window.addEventListener("onWidgetLoad", obj => {
  fieldData = obj.detail.fieldData
  time = parseInt(fieldData.animationTime)
  fromBottom = fieldData.animation === "fromBottom"
})

window.addEventListener("onEventReceived", obj => {
  const { event } = obj.detail
  const shouldGenerateYeah =
    (fieldData.redeemMethod === "channelPoints" && event.type === "channelPoints") ||
    (fieldData.redeemMethod === "command" && event.renderedText.startsWith(fieldData.command))
  if (shouldGenerateYeah) renderYeah()
})

button.addEventListener("click", renderYeah)
