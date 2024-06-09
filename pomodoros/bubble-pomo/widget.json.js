let fieldData = {
  hoursLeft: {
    type: "number",
    value: 0,
    label: "Starting hours",
  },
  minutesLeft: {
    type: "number",
    value: 0,
    label: "Starting minutes",
  },
  secondsLeft: {
    type: "number",
    value: 55,
    label: "Starting seconds",
  },
  targetHours: {
    type: "number",
    value: 0,
    label: "Finish hours",
  },
  targetMinutes: {
    type: "number",
    value: 1,
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
    value: 4,
    label: "Max pomos",
  },
  startButton: {
    type: "button",
    value: "start",
    label: "start",
  },
}
