let fieldData = {
  hoursLeft: {
    type: "number",
    value: 0,
    label: "Starting hours",
  },
  minutesLeft: {
    type: "number",
    value: 59,
    label: "Starting minutes",
  },
  secondsLeft: {
    type: "number",
    value: 55,
    label: "Starting seconds",
  },
  targetHours: {
    type: "number",
    value: 1,
    label: "Finish hours",
  },
  targetMinutes: {
    type: "number",
    value: 0,
    label: "Finish minutes",
  },
  targetSeconds: {
    type: "number",
    value: 0,
    label: "Finish seconds",
  },
  goUp: {
    type: "dropdown",
    value: "true",
    label: "Count up",
    options: {
      true: "Yes",
      False: "No",
    },
  },
  showPomo: {
    type: "dropdown",
    value: "true",
    label: "Show pomo",
    options: {
      true: "Yes",
      False: "No",
    },
  },
  maxPomos: {
    type: "number",
    value: 5,
    label: "Max pomos",
  },
  startButton: {
    type: "button",
    value: "start",
    label: "start",
  },
  breakHours: {
    type: "number",
    value: 0,
    label: "Break hours",
  },
  breakMinutes: {
    type: "number",
    value: 5,
    label: "Break minutes",
  },
  breakSeconds: {
    type: "number",
    value: 0,
    label: "Break seconds",
  },
}
