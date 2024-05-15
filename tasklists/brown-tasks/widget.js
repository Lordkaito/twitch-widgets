const addTaskToList = task => {
  if (task === "") return
  const taskItem = `<div class="flex-wrap">
  <div class="task">
    <input type="checkbox">
    <p class="task-title">${task}</p>
  </div>
  </div>`
  const taskList = document.querySelector(".tasks-list")

  taskList.innerHTML += taskItem
}

const checkForCommand = event => {
  if (!event.renderedText) return
  const command = fieldData.command
  if (event.renderedText.startsWith(command)) {
    const args = event.renderedText.split(" ").slice(1).join(" ");
    return args
  }
}

window.addEventListener("onWidgetLoad", async obj => {
  fieldData = obj.detail.fieldData
})

window.addEventListener("onEventReceived", async obj => {
  let { listener, event } = obj.detail
  if (event.isCommunityGift) return

  const mainCont = document.querySelector("main")
  const task = checkForCommand(event)
  if (!task) return
  addTaskToList(task)
})

function stringToArray(string = "", separator = ",") {
  return string.split(separator).reduce((acc, value) => {
    const trimmed = value.trim()
    if (trimmed !== "") acc.push(trimmed)
    return acc
  }, [])
}
