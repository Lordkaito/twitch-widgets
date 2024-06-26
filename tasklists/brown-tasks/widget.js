let totalTasks = 0
let completedTasks
let goalApiData = {}
let defaultWidgetApiData = {
  tasks: [],
  completedTasks: 0,
  totalTasks: 0,
  glowedUsers: [],
}
let widgetApiData = {}
let tasks = []
let glowedUsers = []

const button = document.querySelector(".click")
const completeButton = document.querySelector(".complete")
button.addEventListener("click", () => {
  addTaskToList({
    task: "test ",
    username: "test",
    streamerTask: false,
    completed: false,
    id: 1,
  })
})

completeButton.addEventListener("click", () => {
  completeTask({
    id: 1,
  })
})

const progression = document.querySelector("#progression")
const imgGoal = document.querySelector(".img-container")
const title = document.querySelector(".title h1")
const tasksContainer = document.querySelector(".tasks-container")
const mainGoal = document.querySelector(".main-goal")
const container = document.querySelector(".container")
const round = document.querySelector("#round")
const progressBarContainer = document.querySelector(".progress-bar-container")
const randomId = () => Math.random().toString(36).substr(2, 9)

const getApiData = async () => {
  let data = await SE_API.store.get("newTest")
  if (data === null) {
    // tasks = defaultApiData
    widgetApiData = defaultWidgetApiData
  } else {
    console.log(data, "data")
    widgetApiData = data
    tasks = widgetApiData.tasks
  }

  // widgetApiData = defaultWidgetApiData
}

const saveTask = task => {
  if (task.completed) {
    const taskToSave = {
      id: task.id,
      task: task.task,
      completed: task.completed,
      username: task.username,
      streamerTask: task.streamerTask,
    }
    tasks = tasks.map(t => (t.id === task.id ? taskToSave : t))
    widgetApiData.tasks = tasks
    SE_API.store.set("newTest", widgetApiData)
    return
  }
  const taskToSave = {
    id: task.id,
    task: task.task,
    completed: task.completed,
    username: task.username,
    streamerTask: task.streamerTask,
  }
  tasks.push(taskToSave)
  widgetApiData.tasks = tasks

  SE_API.store.set("newTest", widgetApiData)
}

const removeTaskFromList = (id, username) => {
  const taskList = document.querySelector(".tasks-list")
  const task = document.getElementById(id)

  taskList.removeChild(task)
  deleteTask(id, username)
}

const deleteTask = (id, username) => {
  const removedTask = tasks.filter(task => !(task.id === id && task.username === username))
  widgetApiData.tasks = removedTask
  SE_API.store.set("newTest", removedTask)
}

const addTaskToList = task => {
  if (task === "") return
  let shouldGlow = false
  if (glowedUsers.some(user => user.username === task.username)) {
    shouldGlow = true
  }
  const taskItem = `
  <div class="flex-wrap" id=${task.id} ${task.completed ? "low-opacity" : ""}>
    <div class="task">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="${task.completed ? fieldData.completeColor : "#a35fb4"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 11l3 3l8 -8" class="${task.completed ? "" : "invisible"}"/>
        <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
      </svg>
      <p class="task-title ${task.completed ? "completed" : ""}">
        <span class="username-glow ${shouldGlow ? "glow" : ""}">
          ${task.username}</span><span>: ${task.task}
        </span>
      </p>
    </div>
  </div>`
  const taskList = document.querySelector(".tasks-list")

  taskList.innerHTML += taskItem
  taskList.scrollTo({
    top: taskList.scrollHeight,
    behavior: "smooth",
  })
}

const completeTask = task => {
  const taskToComplete = document.getElementById(task.id)
  const svg = taskToComplete.querySelector("svg")
  // replace with fieldData.completeColor
  svg.style.stroke = "#cc88dd"
  const checkIcon = taskToComplete.querySelector(".invisible")
  const completeTask = taskToComplete.querySelector(".task-title")
  completeTask.classList.add("completed")
  checkIcon.classList.remove("invisible")
}

const checkForCommand = event => {
  if (!event.renderedText) return
  const addTaskCommand = fieldData.command
  const removeTaskCommand = fieldData.removeCommand
  const completeTaskCommand = fieldData.completeCommand
  const scrollUpCommand = fieldData.scrollUpCommand
  const scrollDownCommand = fieldData.scrollDownCommand
  const removeFromCommand = fieldData.removeFromCommand
  if (event.renderedText.startsWith(addTaskCommand)) {
    const args = {
      task: event.renderedText.split(" ").slice(1).join(" "),
      username: event.data.displayName,
      streamerTask: event.isTest,
      completed: false,
      id: randomId(),
      command: addTaskCommand,
    }
    return args
  }

  if (event.renderedText.startsWith(removeTaskCommand)) {
    const task = tasks.find(
      task => task.username === event.data.displayName && task.task === event.renderedText.split(" ").slice(1).join(" ")
    )
    const args = {
      streamerTask: event.isTest,
      id: task.id,
      command: removeTaskCommand,
    }
    return args
  }

  if (event.renderedText.startsWith(removeFromCommand)) {
    const splitTask = event.renderedText.split(" ")
    const userToRemoveFrom = splitTask[1]
    const taskText = splitTask[2]
    const task = tasks.find(task => task.username === userToRemoveFrom && task.task === taskText)
    const args = {
      streamerTask: event.isTest,
      id: task.id,
      command: removeFromCommand,
      user: userToRemoveFrom,
    }
    return args
  }

  if (event.renderedText.startsWith(completeTaskCommand)) {
    const task = tasks.find(
      task => task.username === event.data.displayName && task.task === event.renderedText.split(" ").slice(1).join(" ")
    )
    const args = {
      streamerTask: event.isTest,
      id: task.id,
      command: completeTaskCommand,
      completed: true,
      task: task.task,
      username: task.username,
    }
    return args
  }

  if (event.renderedText.startsWith(scrollUpCommand)) {
    smoothScroll(document.querySelector(".tasks-list"), 0, 5000)
    return
  }

  if (event.renderedText.startsWith(scrollDownCommand)) {
    smoothScroll(document.querySelector(".tasks-list"), document.querySelector(".tasks-list").scrollHeight, 5000)
    return
  }
}

let streamerName = ""

const checkTimeForUserGlow = () => {
  const currentDate = Date.now()
  const millisecondsIn24Hours = 24 * 60 * 60 * 1000
  // const millisecondsIn24Hours = 1000
  // remove from widgetApiData.glowedUsers all the users that have been glowed for more than 24 hours
  const usersToGlow = widgetApiData.glowedUsers.filter(user => currentDate - user.date < millisecondsIn24Hours)
  widgetApiData.glowedUsers = usersToGlow
  SE_API.store.set("newTest", widgetApiData)
}

window.addEventListener("onWidgetLoad", async obj => {
  streamerName = obj.detail.fieldData.username
  title.textContent = obj.detail.fieldData.title?.toUpperCase() ?? "Task List".toUpperCase()
  const width = obj.detail.fieldData.width
  tasksContainer.style.width = `${width ?? 30}rem`
  mainGoal.style.width = `${width}rem`
  // container.style.width = `${ninetyPercent - 2}rem`
  // round.style.width = `${ninetyPercent - 2}rem`
  progressBarContainer.style.width = `${width - 4}rem`
  await getApiData()
  tasks = widgetApiData.tasks ?? []
  fieldData = obj.detail.fieldData
  glowedUsers = widgetApiData.glowedUsers ?? []
  checkTimeForUserGlow()
  tasks.map(task => addTaskToList(task))
  const taskList = document.querySelector(".tasks-list")
  const allInvisible = taskList.querySelectorAll(".invisible")
  totalTasks = taskList.childElementCount
  completedTasks = totalTasks - allInvisible.length
  console.log(widgetApiData, "widgetApiData")
  await loadGoal()
})

// const isStreamer = event => {
//   return event.data?.displayName === event.data?.channel ?? false
// }

window.addEventListener("onEventReceived", async obj => {
  let hasPower = false
  const taskList = document.querySelector(".tasks-list")
  if (obj.detail.event.value === "reset") {
    clearApiData()
    return
  }

  let { event } = obj.detail
  const isMod = event.data?.tags?.mod === "1" ?? false
  const isStreamer =
    (event.data?.displayName === fieldData.username || event.data?.channel === fieldData.username) ?? false
  const givePowerToMods = fieldData.givePowerToMods === "true"
  if ((isMod && givePowerToMods) || isStreamer) hasPower = true
  if (event.isCommunityGift) return
  if (event.type === "channelPoints") {
    redeemChannelPoints(event)
    return
  }

  const task = checkForCommand(event)
  if (!task || task.task === "") return
  let success = false
  switch (task.command) {
    case fieldData.command:
      if (isStreamer) task.username = fieldData.username
      addTaskToList(task)
      saveTask(task)
      success = true
      break
    case fieldData.completeCommand:
      completeTask(task)
      saveTask(task)
      success = true
      break
    case fieldData.removeCommand:
      removeTaskFromList(task.id, event.data.displayName)
      success = true
      break
    case fieldData.removeFromCommand:
      if (hasPower) removeTaskFromList(task.id, task.user)
      success = true
      break
  }
  const allInvisible = taskList.querySelectorAll(".invisible")
  totalTasks = taskList.childElementCount
  completedTasks = totalTasks - allInvisible.length
  const step = getStep(progressContainer, totalTasks)
  if(success) updateGoal(step)
})

const clearApiData = () => {
  SE_API.store.set("newTest", defaultWidgetApiData)
  window.location.reload()
}
function stringToArray(string = "", separator = ",") {
  return string.split(separator).reduce((acc, value) => {
    const trimmed = value.trim()
    if (trimmed !== "") acc.push(trimmed)
    return acc
  }, [])
}

const progressContainer = document.querySelector(".img-progress")
const progressBar = document.querySelector(".progress-bar")
const getStep = (container, objective) => {
  if (objective === 0) return
  const containerWidth = container.offsetWidth
  const step = containerWidth / objective
  return step
}

const loadGoal = async () => {
  progression.textContent = `${completedTasks ?? 0}/${totalTasks ?? 0} DONE`
  progressBar.style.width = `${completedTasks * getStep(progressContainer, totalTasks)}px`
  imgGoal.style.left = `${completedTasks * getStep(progressContainer, totalTasks) - 10}px`
}

const updateGoal = step => {
  progression.textContent = `${completedTasks ?? 0}/${totalTasks ?? 0} DONE`
  if (totalTasks === 0) return
  if (completedTasks === 0) return
  progressBar.style.width = `${completedTasks * step}px`
  imgGoal.style.left = `${completedTasks * step - 30}px`
  saveGoalData()
}

const saveGoalData = async () => {
  widgetApiData.completedTasks = completedTasks
  widgetApiData.totalTasks = totalTasks
  SE_API.store.set("newTest", widgetApiData)
}

const saveGlowedUsers = async () => {
  widgetApiData.glowedUsers = glowedUsers
  console.log(widgetApiData, "widgetApiData", glowedUsers, "saving")
  SE_API.store.set("newTest", widgetApiData)
}

const redeemChannelPoints = async event => {
  if (event.data.title === fieldData.pointsTitle) {
    const user = {
      username: event.data.username,
      date: Date.now(),
    }
    glowedUsers.push(user)
    const task = tasks.filter(task => task.username === user.username)
    console.log(glowedUsers, "glowedUsers")
    glowUser(task)
    await saveGlowedUsers()
  }

  if (event.data.title === fieldData.randomTaskTitle) {
    let randomTasks = []
    let fieldDataRandomTasks = fieldData.randomTasks.split(",")
    fieldDataRandomTasks.forEach(task => {
      randomTasks.push(task.trim())
    })

    // take a random task from the randomrasks list
    const randomTask = randomTasks[Math.floor(Math.random() * randomTasks.length)]

    addTaskToList({
      task: randomTask,
      username: streamerName,
      completed: false,
      id: randomId(),
    })
    saveTask({
      task: randomTask,
      username: streamerName,
      completed: false,
      id: randomId(),
    })
  }
}

const glowUser = tasksArray => {
  tasksArray.map(task => {
    const taskToGlow = document.getElementById(task.id)
    const username = taskToGlow.querySelector(".username-glow")
    username.style.color = fieldData.glowColor
    username.style.textShadow = `0 0 10px ${fieldData.glowShadowColor}`
  })
}

function smoothScroll(element, target, duration) {
  const start = element.scrollTop
  const distance = target - start
  let startTime = null

  function scroll(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    element.scrollTop = start + distance * progress

    if (progress < 1) {
      requestAnimationFrame(scroll)
    }
  }

  requestAnimationFrame(scroll)
}
