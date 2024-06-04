let totalTasks = 0
let completedTasks
let goalApiData = {}
let defaultGoalApiData = {
  completed: 0,
  total: 0,
}
let tasks = []

const progression = document.querySelector("#progression")

const randomId = () => Math.random().toString(36).substr(2, 9)
// later we will use the widgetapidata to generate the list of tasks
const defaultApiData = []

const getApiData = async () => {
  let data = await SE_API.store.get("testTasks")
  if (data === null) {
    tasks = defaultApiData
  } else {
    tasks = data
  }
  // if (obj.detail.fieldData.goalFullType === "session") {
  // }
  // widgetApiData = defaultApiData
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
    SE_API.store.set("testTasks", tasks)
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

  SE_API.store.set("testTasks", tasks)
}

const removeTaskFromList = (id, username) => {
  const taskList = document.querySelector(".tasks-list")
  const task = document.getElementById(id)

  taskList.removeChild(task)
  deleteTask(id, username)
}

const deleteTask = (id, username) => {
  const removedTask = tasks.filter(task => !(task.id === id && task.username === username))
  SE_API.store.set("testTasks", removedTask)
}

const addTaskToList = task => {
  console.log(task, "task being added")
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
      <p class="task-title ${task.completed ? "completed" : ""}">${task.task}</p>
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
  await getApiData()
  await loadGoal()
  fieldData = obj.detail.fieldData
  console.log(tasks, "tasks loaded")
  tasks.map(task => addTaskToList(task))
  const taskList = document.querySelector(".tasks-list")
  const allInvisible = taskList.querySelectorAll(".invisible")
  totalTasks = taskList.childElementCount
  completedTasks = totalTasks - allInvisible.length
})

window.addEventListener("onEventReceived", async obj => {
  const taskList = document.querySelector(".tasks-list")
  if (obj.detail.event.value === "reset") {
    clearApiData()
    return
  }

  let { listener, event } = obj.detail
  if (event.isCommunityGift) return
  console.log("asdasd")

  const mainCont = document.querySelector("main")
  const task = checkForCommand(event)
  if (!task) return
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
  SE_API.store.set("testTasks", defaultApiData)
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
  const data = await getGoalApiData()
  console.log(goalApiData)
  progression.textContent = `${data.completed ?? 0}/${data.total ?? 0} DONE`
}

const updateGoal = step => {
  progression.textContent = `${completedTasks ?? 0}/${totalTasks ?? 0} DONE`
  progressBar.style.width = `${completedTasks * step}px`
  saveGoalData()
}

const saveGoalData = async () => {
  goalApiData.completed = completedTasks
  goalApiData.total = totalTasks
  console.log(goalApiData, "data saved")
  SE_API.store.set("testGoalTasks", goalApiData)
  console.log(await getGoalApiData())
}

const getGoalApiData = async () => {
  let data = await SE_API.store.get("testGoalTasks")
  if (data === null) {
    goalApiData = defaultGoalApiData
  } else {
    goalApiData = data
  }
  console.log(data, "data loaded")
  return goalApiData
  // if (obj.detail.fieldData.goalFullType === "session") {
  // }
  // goalApiData = defaultGoalApiData
}
