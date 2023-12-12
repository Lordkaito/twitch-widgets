let fieldData = {
  emotesId: {
    type: "text",
    label: "Set your 7TV ID:",
    value: "",
    group: "Customization",
  },
  completeGoalText: {
    type: "text",
    label: "Goal text (max 40):",
    value: "GOAL COMPLETED!",
    group: "Customization",
  },
  goalTypeText: {
    type: "text",
    label: "Goal type:",
    value: "sub goal",
    group: "Customization",
  },
  goalObjectiveQuantity: {
    type: "number",
    label: "Goal objective:",
    value: 100,
    group: "Customization",
    step: 1,
  },
  goalStartQuantity: {
    type: "number",
    label: "Goal start:",
    value: 10,
    group: "Customization",
    step: 1,
  },
  goalType: {
    type: "dropdown",
    label: "Goal type:",
    value: "tip",
    group: "Customization",
    options: {
      subscriber: "Sub",
      follower: "Follow",
      cheer: "Cheer",
      tip: "Tip",
    },
  },
  goalFullType: {
    type: "dropdown",
    label: "Goal full type:",
    value: "allTime",
    group: "Customization",
    options: {
      allTime: "All time",
      session: "Stream",
    },
  },
  startFromCero: {
    type: "dropdown",
    label: "Start from 0:",
    value: "false",
    group: "Customization",
    options: {
      true: "Yes",
      false: "No",
    },
  },
  widgetHeight: {
    label: "Widget height (recommended 1080)",
    type: "text",
    group: "Customization",
    value: "1080",
  },
  firstStep: {
    type: "number",
    label: "First step:",
    value: 1500,
    group: "Customization",
    min: 1,
  },
  secondStep: {
    type: "number",
    label: "First step:",
    value: 1750,
    group: "Customization",
    min: 1,
  },
  resetGoalData: {
    type: "button",
    label: "Reset goal",
    value: "reset",
    group: "Customization",
  },
  currency: {
    type: "text",
    label: "Currency:",
    value: "$",
    group: "Customization",
  }
};
