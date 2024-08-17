let fieldData = {
  streamerWidget: {
    type: "dropdown",
    label: "Is streamer only widget?",
    value: "false",
    options: {
      true: "Yes",
      false: "No",
    },
    group: "Customization",
  },
  title: { type: "text", label: "Task list title", value: "Test task list", group: "Customization" },
  width: { type: "number", label: "Width:", value: 30, group: "Customization" },
  height: { type: "number", label: "Height:", value: 70, group: "Customization" },
  pointsTitle: { type: "text", label: "Glow title:", value: "Lurk", group: "Customization" },
  glowColor: { type: "colorpicker", label: "Glow color:", value: "#fef5ec", group: "Customization" },
  glowShadowColor: { type: "colorpicker", label: "Glow shadow color:", value: "#b38cff", group: "Customization" },
  randomTaskTitle: {
    type: "text",
    label: "Random task title:",
    value: "Random task",
    group: "Customization",
  },
  randomTasks: {
    type: "text",
    label: "Random tasks:",
    value: "Take a shower, pet the dog, drink water",
    group: "Customization",
  },
  showScrollBar: {
    type: "dropdown",
    label: "Show scrollbar",
    value: "visible",
    options: {
      visible: "Yes",
      hidden: "No",
    },
    group: "Customization",
  },
  command: { type: "text", label: "Add task command:", value: "!addtask", group: "Customization" },
  removeCommand: {
    type: "text",
    label: "Remove task command:",
    value: "!removetask",
    group: "Customization",
  },
  completeCommand: {
    type: "text",
    label: "Complete task command:",
    value: "!completetask",
    group: "Customization",
  },
  scrollUpCommand: { type: "text", label: "Scroll up command:", value: "!scrollup", group: "Customization" },
  scrollDownCommand: {
    type: "text",
    label: "Scroll down command:",
    value: "!scrolldown",
    group: "Customization",
  },
  removeFromCommand: {
    type: "text",
    label: "Remove from command:",
    value: "!modremove",
    group: "Customization",
  },
  usersBlackList: {
    type: "text",
    label: "Users blacklist (separated by comma)",
    value: "",
    group: "Customization",
  },
  givePowerToMods: {
    type: "dropdown",
    label: "Give power to mods:",
    value: "false",
    group: "Customization",
    options: { true: "Yes", false: "No" },
  },
  theme: {
    type: "dropdown",
    label: "Theme",
    value: "purple",
    group: "Colors",
    options: {
      purple: "Purple",
      green: "Green",
      pink: "Pink",
      brown: "Brown",
    },
  },
  resetGoalData: { type: "button", label: "Reset goal", value: "reset", group: "Customization" },
  showCustomColors: {
    type: "dropdown",
    label: "Use custom colors",
    value: "false",
    group: "Colors",
    options: { true: "Yes", false: "No" },
  },
  titleBackgroundColor: { type: "colorpicker", label: "Title background color", value: "#df9bf0", group: "Colors" },
  titleColor: { type: "colorpicker", label: "Title color", value: "#df9bf0", group: "Colors" },
  tasksBackgroundColor: { type: "colorpicker", label: "Tasks background color", value: "#df9bf0", group: "Colors" },
  tasksBorderColor: { type: "colorpicker", label: "Tasks border color", value: "#ffefe6", group: "Colors" },
  tasksColor: { type: "colorpicker", label: "Tasks color", value: "#df9bf0", group: "Colors" },
  completedTasksColor: { type: "colorpicker", label: "Tasks color (completed)", value: "#df9bf0", group: "Colors" },
  progressBarBackgroundColor: {
    type: "colorpicker",
    label: "Progress bar background color",
    value: "#df9bf0",
    group: "Colors",
  },
  progressBarColor: { type: "colorpicker", label: "Progress bar color", value: "#df9bf0", group: "Colors" },
  progressionColor: { type: "colorpicker", label: "Progression text color", value: "#df9bf0", group: "Colors" },
  scrollbarColor: { type: "colorpicker", label: "Scrollbar color", value: "#df9bf0", group: "Colors" },
  goalImage: {
    type: "dropdown",
    label: "Vase image",
    value: "purple",
    options: { purple: "Purple", green: "Green", pink: "Pink", brown: "Brown" },
    group: "Colors",
  },
}
