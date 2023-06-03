let fieldData = {
  emotesId: {
    type: "text",
    label: "Set your 7TV ID:",
    value: "",
    group: "Customization",
  },
  widgetHeight: {
    label: "Widget height (recommended 1080)",
    type: "text",
    group: "Customization",
    value: "1080",
  },
  deleteMessages: {
    label: "Time to delete messages (max 60):",
    type: "number",
    group: "Customization",
    value: 60,
    min: 1,
    max: 60,
    step: 1,
  },
  allowDeleteMessages: {
    type: "dropdown",
    label: "Delete messages on/off:",
    value: "false",
    group: "Customization",
    options: {
      true: "Yes",
      false: "No",
    },
  },
  displayBadges: {
    type: "dropdown",
    label: "Show badges:",
    value: "true",
    group: "Customization",
    options: {
      true: "Yes",
      false: "No",
    },
  },
  allowPronouns: {
    type: "dropdown",
    label: "Show pronouns:",
    value: "true",
    group: "Customization",
    options: {
      true: "Yes",
      false: "No",
    },
  },
  usersBlackList: {
    type: "text",
    label: "Users blacklist (separated by comma)",
    value: "",
    group: "Customization"
  },
  specialCharsBlackList: {
    type: "text",
    label: "Special chars (separated by comma)",
    value: "",
    group: "Customization"
  },
  backgroundColor: {
    type: "colorpicker",
    label: "Background color",
    value: "#0000FF"
  },
  textColor: {
    type: "colorpicker",
    label: "Text color",
    value: "#0000FF"
  },
  userAndPronsColor: {
    type: "colorpicker",
    label: "User and pronouns color",
    value: "#ccc"
  },
  userAndPronsGradientStart: {
    type: "colorpicker",
    label: "Gradient start color (user and pronouns)",
    value: "#0000FF"
  },
  userAndPronsGradientFinish: {
    type: "colorpicker",
    label: "Gradient finish color (user and pronouns)",
    value: "#0000FF"
  },
};
