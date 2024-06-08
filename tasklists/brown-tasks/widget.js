let totalTasks = 0
let completedTasks
let goalApiData = {}
let defaultWidgetApiData = {
  tasks: [],
  completedTasks: 0,
  totalTasks: 0,
}
let widgetApiData = {}
let tasks = []

const button = document.querySelector(".click")
button.addEventListener("click", () => {
  addTaskToList({
    task: "test jasdhfkj adhsfkjh djkf hkjsd fhjksd hfjkas dfhjk dkfj askdjf kajsdhf klajsd fa ",
    username: "test",
    streamerTask: false,
    completed: false,
    id: randomId(),
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
// later we will use the widgetapidata to generate the list of tasks

const getApiData = async () => {
  // let data = await SE_API.store.get("newTest")
  // if (data === null) {
  //   // tasks = defaultApiData
  //   widgetApiData = defaultWidgetApiData
  // } else {
  //   widgetApiData = data
  //   tasks = widgetApiData.tasks
  // }
  // if (obj.detail.fieldData.goalFullType === "session") {
  // }
  widgetApiData = defaultWidgetApiData
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
    // SE_API.store.set("newTest", widgetApiData)
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

  // SE_API.store.set("newTest", widgetApiData)
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
  // SE_API.store.set("newTest", removedTask)
}

const addTaskToList = task => {
  if (task === "") return
  const taskItem = `
  <div class="flex-wrap" id=${task.id} ${task.completed ? "low-opacity" : ""}>
    <div class="task">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 11l3 3l8 -8" class="${task.completed ? "" : "invisible"}"/>
    <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
  </svg>
      <p class="task-title ${task.completed ? "completed" : ""}">
      <span class="username-glow">${task.username}</span>: ${task.task}
      </p>
    </div>
  </div>`
  const taskList = document.querySelector(".tasks-list")

  taskList.innerHTML += taskItem
  taskList.scrollTo({
    top: taskList.scrollHeight,
    behavior: "smooth",
  })
  // setTimeout(() => {
  //   taskList.scrollTo({
  //     top: -taskList.scrollHeight,
  //     behavior: "smooth",
  //   })
  // }, 5000)
}

const completeTask = task => {
  const taskToComplete = document.getElementById(task.id)
  const checkIcon = taskToComplete.querySelector(".invisible")
  const completeTask = taskToComplete.querySelector(".task-title")
  completeTask.classList.add("completed")
  checkIcon.classList.remove("invisible")
}

const checkForCommand = event => {
  if (!event.renderedText) return
  const addTaskCommand = fieldData.command
  const removeTaskCommand = "!removeTask"
  const completeTaskCommand = "!complete"
  if (event.renderedText.startsWith(addTaskCommand)) {
    const args = {
      task: event.renderedText.split(" ").slice(1).join(" "),
      username: event.data.displayName,
      streamerTask: event.isTest,
      completed: false,
      id: randomId(),
      command: event.renderedText.split(" ")[0],
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
      command: event.renderedText.split(" ")[0],
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
      command: event.renderedText.split(" ")[0],
      completed: true,
      task: task.task,
      username: task.username,
    }
    return args
  }
}

window.addEventListener("onWidgetLoad", async obj => {
  title.textContent = obj.detail.fieldData.title?.toUpperCase() ?? "Task List".toUpperCase()
  const width = obj.detail.fieldData.width
  const eightyPercent = width * 0.8
  tasksContainer.style.width = `${width ?? 30}rem`
  mainGoal.style.width = `${width ?? 25}rem`
  container.style.width = `${eightyPercent ?? 25}rem`
  round.style.width = `${eightyPercent ?? 25}rem`
  progressBarContainer.style.width = `${eightyPercent ?? 25}rem`
  await getApiData()
  tasks = widgetApiData.tasks ?? []
  fieldData = obj.detail.fieldData
  tasks.map(task => addTaskToList(task))
  const taskList = document.querySelector(".tasks-list")
  const allInvisible = taskList.querySelectorAll(".invisible")
  totalTasks = taskList.childElementCount
  completedTasks = totalTasks - allInvisible.length
  await loadGoal()
})

window.addEventListener("onEventReceived", async obj => {
  const taskList = document.querySelector(".tasks-list")
  if (obj.detail.event.value === "reset") {
    clearApiData()
    return
  }

  let { event } = obj.detail
  if (event.isCommunityGift) return

  const mainCont = document.querySelector("main")
  const task = checkForCommand(event)
  if (!task || task.task === "") return
  switch (task.command) {
    case fieldData.command:
      addTaskToList(task)
      saveTask(task)
      break
    case fieldData.completeCommand:
      completeTask(task)
      saveTask(task)
      break
    case fieldData.removeCommand:
      removeTaskFromList(task.id, event.data.displayName)
      break
  }
  const allInvisible = taskList.querySelectorAll(".invisible")
  totalTasks = taskList.childElementCount
  completedTasks = totalTasks - allInvisible.length
  const step = getStep(progressContainer, totalTasks)
  updateGoal(step)
})

const clearApiData = () => {
  // SE_API.store.set("newTest", defaultWidgetApiData)
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
  progressBar.style.width = `${completedTasks * step}px`
  imgGoal.style.left = `${completedTasks * step - 10}px`
  saveGoalData()
}

const saveGoalData = async () => {
  widgetApiData.completedTasks = completedTasks
  widgetApiData.totalTasks = totalTasks
  // SE_API.store.set("testGoalTasks", widgetApiData)
}
