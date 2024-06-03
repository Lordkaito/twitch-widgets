const button = document.querySelector(".click")
button.addEventListener("click", () => {
  addTaskToList({ task: "test task" })
})

let totalTasks = 0
let completedTasks

const progression = document.querySelector("#progression")

const randomId = () => Math.random().toString(36).substr(2, 9)
// later we will use the widgetapidata to generate the list of tasks
const defaultApiData = []

let tasks = []
const getApiData = async () => {
  // let data = await SE_API.store.get("testTasks")
  // if (data === null) {
  //   tasks = defaultApiData
  // } else {
  //   tasks = data
  // }
  // if (obj.detail.fieldData.goalFullType === "session") {
  // }
  widgetApiData = defaultApiData
}

const saveTask = task => {
  const taskToSave = {
    id: task.id,
    task: task.task,
    completed: task.completed,
    username: task.username,
    streamerTask: task.streamerTask,
  }

  tasks.push(taskToSave)

  // SE_API.store.set("testTasks", tasks)
}

const deleteTask = (id, username) => {
  const removedTask = tasks.filter(task => !(task.id === id && task.username === username))
  // SE_API.store.set("testTasks", removedTask)
}

const removeTaskFromList = (id, username) => {
  const taskList = document.querySelector(".tasks-list")
  const task = document.getElementById(id)

  taskList.removeChild(task)
  deleteTask(id, username)
}

const completedTaskColor = "#cc88dd"
const defaultColor = "#a35fb4"

const addTaskToList = task => {
  if (task === "") return
  const taskItem = `
  <div class="flex-wrap" id=${task.id}>
    <div class="task">
    <svg xmlns="http://www.w3.org/2000/svg" class="item-to-complete" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="${defaultColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 11l3 3l8 -8" class="invisible"/>
    <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
  </svg>
      <p class="task-title">${task.task}</p>
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
  const taskToComplete = document.querySelector(`#${task.id}`)
  const taskText = taskToComplete.querySelector(".task-title")
  const checkIcon = taskToComplete.querySelector(".invisible")
  const itemToComplete = taskToComplete.querySelector(".item-to-complete")
  itemToComplete.style.stroke = completedTaskColor
  checkIcon.classList.remove("invisible")
  taskText.classList.add("completed")
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

  if(event.renderedText.startsWith(completeTaskCommand)) {
    const task = tasks.find(
      task => task.username === event.data.displayName && task.task === event.renderedText.split(" ").slice(1).join(" ")
    )
    const args = {
      streamerTask: event.isTest,
      id: task.id,
      command: event.renderedText.split(" ")[0],
      completed: true
    }
    return args
  }
}

window.addEventListener("onWidgetLoad", async obj => {
  await getApiData()
  loadGoal()
  fieldData = obj.detail.fieldData
  tasks.map(task => addTaskToList(task))
})

window.addEventListener("onEventReceived", async obj => {
  const taskList = document.querySelector(".tasks-list")
  if (obj.detail.event.value === "reset") {
    clearApiData()
    return
  }
  let { listener, event } = obj.detail
  if (event.isCommunityGift) return

  const mainCont = document.querySelector("main")
  const task = checkForCommand(event)
  if (!task) return
  if (task.command === fieldData.command) {
    addTaskToList(task)
    saveTask(task)
  } if(task.command === "!complete") {
    completeTask(task)
    saveTask(task)
  } else {
    removeTaskFromList(task.id, event.data.displayName)
  }
  totalTasks = taskList.childElementCount
  const allInvisible = taskList.querySelectorAll(".invisible")
  completedTasks = totalTasks - allInvisible.length
  const step = getStep(progressContainer, totalTasks)
  updateGoal(step)
})

const clearApiData = () => {
  // SE_API.store.set("testTasks", defaultApiData)
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
  if(objective === 0) return
  const containerWidth = container.offsetWidth;
  const step = containerWidth / objective;
  return step;
}

const loadGoal = async () => {
  await getGoalApiData()
  console.log(goalApiData)
  progression.textContent = `${goalApiData.completed ?? 0}/${goalApiData.total}`
}

const updateGoal = (step) => {
  progression.textContent = `${completedTasks ?? 0}/${totalTasks}`
  progressBar.style.width = `${completedTasks * step}px`
  saveGoalData()
}

let goalApiData = {}
let defaultGoalApiData = {
  completed: 5,
  total: 10,
}
const saveGoalData = () => {
  goalApiData.completed = completedTasks
  goalApiData.total = totalTasks
  // SE_API.store.set("testGoalTasks", goalApiData)
}

const getGoalApiData = async () => {
  // let data = await SE_API.store.get("testTasks")
  // if (data === null) {
  //   goalApiData = defaultApiData
  // } else {
  //   goalApiData = data
  // }
  // if (obj.detail.fieldData.goalFullType === "session") {
  // }
  goalApiData = defaultGoalApiData
}
