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
let channel
let autoScroll = false
let autoScrollTime = 0

const taskList = document.querySelector(".tasks-list")
const allInvisible = taskList.querySelectorAll(".invisible")
const progression = document.querySelector("#progression")
const imgGoal = document.querySelector(".img-container")
const title = document.querySelector(".title h1")
const titleContainer = document.querySelector(".title")
const tasksContainer = document.querySelector(".tasks-container")
const mainGoal = document.querySelector(".main-goal")
const container = document.querySelector(".container")
const round = document.querySelector("#round")
const progressBarContainer = document.querySelector(".progress-bar-container")
const progressBar = document.querySelector(".progress-bar")
const progressContainer = document.querySelector(".img-progress")
const goalImg = document.querySelector(".img-container img")
const randomId = () => Math.random().toString(36).substr(2, 9)

const getApiData = async () => {
  // let data = await SE_API.store.get("beniartsCustomWidgetTaskListFirst")
  // if (data === null) {
  //   // tasks = defaultApiData
  //   widgetApiData = defaultWidgetApiData
  // } else {
  //   widgetApiData = data
  //   tasks = widgetApiData.tasks
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
    // SE_API.store.set("beniartsCustomWidgetTaskListFirst", widgetApiData)
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

  // SE_API.store.set("beniartsCustomWidgetTaskListFirst", widgetApiData)
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
  // SE_API.store.set("beniartsCustomWidgetTaskListFirst", removedTask)
}

const addTaskToList = task => {
  if (task === "") return
  let shouldGlow = false
  if (glowedUsers.some(user => user.username === task.username)) {
    shouldGlow = true
  }
  const themeColors = {
    purple: "#a35fb4",
    pink: "#c14b67",
    green: "#736b44",
    brown: "#8e5e42",
  }
  const colorToShow =
    fieldData.showCustomColors === "true"
      ? task.completed
        ? fieldData.completedTasksColor
        : fieldData.tasksColor
      : themeColors[fieldData.theme]
  const regularTaskItem = `
  <div class="flex-wrap" id=${task.id} ${task.completed ? "low-opacity" : ""}>
    <div class="task">
      <svg class="${
        task.completed ? "completed" : ""
      } xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="${colorToShow}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 11l3 3l8 -8" class="${task.completed ? "" : "invisible"}"/>
        <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
      </svg>
      <p class="task-title ${task.completed ? "completed" : ""}" style="color: ${colorToShow}">
        <span class="username-glow ${shouldGlow ? "glow" : ""}">${String(task.username.toLowerCase()).trim()}</span>:
        <span>${task.task.toLowerCase()}</span>
      </p>
    </div>
  </div>`

  const streamerOnlyTaskItem = `
	<div class="flex-wrap" id=${task.id} ${task.completed ? "low-opacity" : ""}>
    <div class="task">
      <svg class="${
        task.completed ? "completed" : ""
      } xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="${colorToShow}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 11l3 3l8 -8" class="${task.completed ? "" : "invisible"}"/>
        <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
      </svg>
      <p class="task-title ${task.completed ? "completed" : ""}" style="color: ${colorToShow}">
        <span>${task.task.toLowerCase()}</span>
      </p>
    </div>
  </div>
`
  const taskList = document.querySelector(".tasks-list")
  if (fieldData.streamerWidget === "true") {
    taskList.innerHTML += streamerOnlyTaskItem
  } else {
    taskList.innerHTML += regularTaskItem
  }
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

const getTask = (task, username) => {
  return tasks.find(item => item.task === task && item.username === username && !item.completed)
}

const isSameCommand = (userCommand, fieldCommand) => {
  return userCommand.toLowerCase() === fieldCommand.toLowerCase()
}

const checkForCommand = event => {
  if (!event.renderedText) return
  const addTaskCommand = fieldData.command
  const removeTaskCommand = fieldData.removeCommand
  const completeTaskCommand = fieldData.completeCommand
  const scrollUpCommand = fieldData.scrollUpCommand
  const scrollDownCommand = fieldData.scrollDownCommand
  const removeFromCommand = fieldData.removeFromCommand
  const completeAllTasksForUserCommand = fieldData.completeAllTasksForUserCommand

  const command = event.renderedText.split(" ")[0]
  const taskArgs = event.renderedText.split(" ").slice(1).join(" ")
  if (isSameCommand(command, addTaskCommand)) {
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

  if (isSameCommand(command, removeTaskCommand)) {
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

  if (isSameCommand(command, removeFromCommand)) {
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

  if (isSameCommand(command, completeTaskCommand)) {
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

  if (isSameCommand(command, completeAllTasksForUserCommand)) {
    console.log("asdfasdf")
    const user = event.data.displayName
    const userTasks = tasks.filter(task => task.username === user && !task.completed)
    let args = {
      command: completeAllTasksForUserCommand,
      tasks: [],
    }
    console.log(user, userTasks, args)

    userTasks.map(task => {
      args.tasks.push({
        streamerTask: event.isTest,
        id: task.id,
        command: completeTaskCommand,
        completed: true,
        task: task.task,
        username: task.username,
      })
    })
    console.log(args)
    return args
  }

  if (isSameCommand(command, scrollUpCommand)) {
    if (autoScroll) return
    smoothScroll(document.querySelector(".tasks-list"), 0, 5000)
    return
  }

  if (isSameCommand(command, scrollDownCommand)) {
    if (autoScroll) return
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
  // SE_API.store.set("beniartsCustomWidgetTaskListFirst", widgetApiData)
}

window.addEventListener("onWidgetLoad", async obj => {
  channel = obj.detail.channel.username
  streamerName = obj.detail.fieldData.username
  title.textContent = obj.detail.fieldData.title?.toUpperCase() ?? "Task List".toUpperCase()
  const width = obj.detail.fieldData.width
  const height = obj.detail.fieldData.height
  tasksContainer.style.width = `${width ?? 30}rem`
  tasksContainer.style.height = `${height ?? 20}rem`
  mainGoal.style.width = `${width}rem`
  if (height > 40) {
    mainGoal.style.marginBottom = "0"
  } else {
    mainGoal.style.marginBottom = "2rem"
  }
  // container.style.width = `${ninetyPercent - 2}rem`
  round.style.width = `${width}rem`
  progressBarContainer.style.width = `${width - 6.5}rem`
  // progressBarContainer.style.height = `${height - 6.5}rem`
  await getApiData()
  tasks = widgetApiData.tasks ?? []
  fieldData = obj.detail.fieldData
  autoScroll = fieldData.autoScroll === "true"
  autoScrollTime = fieldData.autoScrollTime
  glowedUsers = widgetApiData.glowedUsers ?? []
  checkTimeForUserGlow()
  tasks.map(task => addTaskToList(task))
  const taskList = document.querySelector(".tasks-list")
  const allInvisible = taskList.querySelectorAll(".invisible")
  if (fieldData.showCustomColors === "true") {
    titleContainer.style.backgroundColor = fieldData.titleBackgroundColor
    title.style.color = fieldData.titleColor
    tasksContainer.style.backgroundColor = fieldData.tasksBackgroundColor
    tasksContainer.style.borderColor = fieldData.tasksBorderColor
    progressBarContainer.style.backgroundColor = fieldData.progressBarBackgroundColor
    progressBar.style.backgroundColor = fieldData.progressBarColor
    progression.style.color = fieldData.progressionColor
    goalImg.src = fieldData.goalImage
    if (fieldData.goalImage === "purple") {
      goalImg.src = "https://utfs.io/f/aa6876e2-d203-467d-b297-616b82a029e2-nu1eyx.png"
    }
    if (fieldData.goalImage === "pink") {
      goalImg.src = "https://utfs.io/f/6b9d5519-e00d-4a58-a56e-15fe50576a68-ntxgfk.png"
    }
    if (fieldData.goalImage === "green") {
      goalImg.src = "https://utfs.io/f/1b542e97-651a-42e3-8356-d51cff720fa3-sentq9.png"
    }
    if (fieldData.goalImage === "brown") {
      goalImg.src = "https://utfs.io/f/90fd15f6-17af-42df-a96d-4d1d0eec4b5a-wkrf48.png"
    }
  } else {
    if (fieldData.theme === "purple") {
      titleContainer.style.backgroundColor = "#df9bf0"
      title.style.color = "#ffefe6"
      tasksContainer.style.backgroundColor = "#f8e0ff"
      tasksContainer.style.borderColor = "#f4e5db"
      progressBarContainer.style.backgroundColor = "#f2c1fe"
      progressBar.style.backgroundColor = "#df9bf0"
      progression.style.color = "#d79fe6"
      goalImg.src = "https://utfs.io/f/aa6876e2-d203-467d-b297-616b82a029e2-nu1eyx.png"
    }
    if (fieldData.theme === "pink") {
      titleContainer.style.backgroundColor = "#ffa4bb"
      title.style.color = "#ffefe6"
      tasksContainer.style.backgroundColor = "#ffefe6"
      tasksContainer.style.borderColor = "#ffefe5"
      progressBarContainer.style.backgroundColor = "#ffc3d2"
      progressBar.style.backgroundColor = "#f4809d"
      progression.style.color = "#c5566f"
      goalImg.src = "https://utfs.io/f/6b9d5519-e00d-4a58-a56e-15fe50576a68-ntxgfk.png"
    }
    if (fieldData.theme === "green") {
      titleContainer.style.backgroundColor = "#c4bc95"
      title.style.color = "#ffefe6"
      tasksContainer.style.backgroundColor = "#ffefe6"
      tasksContainer.style.borderColor = "#ffefe5"
      progressBarContainer.style.backgroundColor = "#e0d8b1"
      progressBar.style.backgroundColor = "#b0a881"
      progression.style.color = "#736b44"
      goalImg.src = "https://utfs.io/f/1b542e97-651a-42e3-8356-d51cff720fa3-sentq9.png"
    }
    if (fieldData.theme === "brown") {
      titleContainer.style.backgroundColor = "#cb9b7f"
      title.style.color = "#ffefe6"
      tasksContainer.style.backgroundColor = "#ffefe6"
      tasksContainer.style.borderColor = "#ffefe5"
      progressBarContainer.style.backgroundColor = "#fbcbaf"
      progressBar.style.backgroundColor = "#cb9b7f"
      progression.style.color = "#8e5e42"
      goalImg.src = "https://utfs.io/f/90fd15f6-17af-42df-a96d-4d1d0eec4b5a-wkrf48.png"
    }
  }
  totalTasks = taskList.childElementCount
  completedTasks = totalTasks - allInvisible.length
  await loadGoal()

  if (autoScroll) {
    const taskList = document.querySelector(".tasks-list")

    const cycleScroll = () => {
      // if (!autoScrollActive) return
      smoothScroll(taskList, taskList.scrollHeight, autoScrollTime * 1000)
      console.log("scrolling down")

      setTimeout(() => {
        console.log("pause at bottom")

        setTimeout(() => {
          smoothScroll(taskList, 0, autoScrollTime * 1000)
          console.log("scrolling up")

          setTimeout(() => {
            console.log("pause at top")

            setTimeout(() => {
              cycleScroll()
            }, autoScrollTime * 1000)
          }, autoScrollTime * 1000)
        }, autoScrollTime * 1000)
      }, autoScrollTime * 1000)
    }

    cycleScroll()
  }
})

const blacklisted = name => {
  let username = name.toLowerCase().trim()
  let blacklist = []
  let blackListFieldData = fieldData.usersBlackList.split(",")
  blackListFieldData.forEach(nick => {
    blacklist.push(nick.toLowerCase().trim())
  })
  return blacklist.includes(username)
}

window.addEventListener("onEventReceived", async obj => {
  let hasPower = false
  const taskList = document.querySelector(".tasks-list")
  if (obj.detail.event.value === "reset") {
    clearApiData()
    return
  }

  let { event, listener } = obj.detail
  if (listener === "message") {
    let isBlackListed = blacklisted(event.data.displayName)
    if (isBlackListed) return
  }
  const isMod = event.data?.tags?.mod === "1" ?? false
  let isStreamer
  if (event.type === "channelPoints") {
    isStreamer = event.data.username === channel
  } else {
    isStreamer = event.data.displayName.toLowerCase() === channel
  }
  if (fieldData.streamerWidget === "true" && !isStreamer) return
  const givePowerToMods = fieldData.givePowerToMods === "true"
  if ((isMod && givePowerToMods) || isStreamer) hasPower = true
  if (event.isCommunityGift) return
  if (event.type === "channelPoints") {
    redeemChannelPoints(event)
    return
  }

  // this is a single item unless the user wants to delete all tasks, in that case it's an array of items
  const task = checkForCommand(event)
  if (!task || task.task === "") return
  let success = false
  switch (task.command) {
    case fieldData.command:
      addTaskToList(task)
      saveTask(task)
      success = true
      break
    case fieldData.completeCommand:
      completeTask(task)
      saveTask(task)
      success = true
      break
    case fieldData.completeAllTasksForUserCommand:
      task.tasks.map(t => {
        completeTask(t)
        saveTask(t)
      })
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
  if (success) updateGoal(step)
})

const clearApiData = () => {
  // SE_API.store.set("beniartsCustomWidgetTaskListFirst", defaultWidgetApiData)
  window.location.reload()
}
function stringToArray(string = "", separator = ",") {
  return string.split(separator).reduce((acc, value) => {
    const trimmed = value.trim()
    if (trimmed !== "") acc.push(trimmed)
    return acc
  }, [])
}

const getStep = (container, objective) => {
  if (objective === 0) return
  const containerWidth = container.offsetWidth
  const step = containerWidth / objective
  return step
}

const loadGoal = async () => {
  progression.textContent = `${completedTasks ?? 0}/${totalTasks ?? 0} DONE`
  progressBar.style.width = `${completedTasks * getStep(progressContainer, totalTasks)}px`
  imgGoal.style.left = `${completedTasks * getStep(progressContainer, totalTasks) - 28}px`
  if (completedTasks === totalTasks) {
    imgGoal.style.left = `${completedTasks * getStep(progressContainer, totalTasks) - 40}px`
  }
}

const updateGoal = step => {
  progression.textContent = `${completedTasks ?? 0}/${totalTasks ?? 0} DONE`
  // if (totalTasks === 0) return
  // if (completedTasks === 0) return
  progressBar.style.width = `${completedTasks * step}px`
  imgGoal.style.left = `${completedTasks * step - 30}px`
  saveGoalData()
}

const saveGoalData = async () => {
  widgetApiData.completedTasks = completedTasks
  widgetApiData.totalTasks = totalTasks
  // SE_API.store.set("beniartsCustomWidgetTaskListFirst", widgetApiData)
}

const saveGlowedUsers = async () => {
  widgetApiData.glowedUsers = glowedUsers
  // SE_API.store.set("beniartsCustomWidgetTaskListFirst", widgetApiData)
}

const redeemChannelPoints = async event => {
  if (event.data.title === fieldData.pointsTitle) {
    const user = {
      username: event.data.username,
      date: Date.now(),
    }
    glowedUsers.push(user)
    const task = tasks.filter(task => task.username === user.username)
    glowUser(task)
    await saveGlowedUsers()
  }

  if (event.data.title === fieldData.randomTaskTitle) {
    let randomTasks = []
    const username = event.data.username
    let fieldDataRandomTasks = fieldData.randomTasks.split(",")
    fieldDataRandomTasks.forEach(task => {
      randomTasks.push(task.trim())
    })

    // take a random task from the randomrasks list
    const randomTask = randomTasks[Math.floor(Math.random() * randomTasks.length)]
    const taskId = randomId()
    addTaskToList({
      task: randomTask,
      username: username,
      completed: false,
      id: taskId,
    })
    saveTask({
      task: randomTask,
      username: username,
      completed: false,
      id: taskId,
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
