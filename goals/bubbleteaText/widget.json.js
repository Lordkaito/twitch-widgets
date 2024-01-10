let fieldData = {
  emotesId: {
    type: "text",
    label: "Set your 7TV ID:",
    value: "",
    group: "Customization",
  },
  goalObjectiveQuantity: {
    type: "number",
    label: "Goal objective:",
    value: 10,
    group: "Customization",
    min: 1,
    max: 100000,
    step: 1,
  },
  goalStartQuantity: {
    type: "number",
    label: "Goal start:",
    value: 1,
    group: "Customization",
    min: 0,
    max: 100000,
    step: 1,
  },
  goalType: {
    type: "dropdown",
    label: "Goal type:",
    value: "subscriber",
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
    }
  },
  goalText: {
    type: "text",
    label: "Custom text for goal",
    value: "Sub goal",
    group: "Events",
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
  subText: {
    type: "text",
    label: "Custom text for SUB (max 40)",
    value:
      "Supermegalongname gifted a sub to supermegalongnameeeeeeeeeeeeeeeeeex2!",
    group: "Events",
  },
  followText: {
    type: "text",
    label: "Custom text for FOLLOW (max 40)",
    value: "just followed!",
    group: "Events",
  },
  cheerText: {
    type: "text",
    label: "Custom text for Cheers (max 40)",
    value: "cheered x(amount)!",
    group: "Events",
  },
  tipText: {
    type: "text",
    label: "Custom text for Tips (max 40)",
    value: "Tipped $(amount)!",
    group: "Events",
  },
  giftSubText: {
    type: "text",
    label: "Custom text for gifted SUB (max 40)",
    value: "(sender) gifted a sub to (user)!",
    group: "Events",
  },
  bulkGiftText: {
    type: "text",
    label: "Custom text for many gifts at once (max 40)",
    value: "(sender) (amount) sub(s)!",
    group: "Events",
  },
  raidText: {
    type: "text",
    label: "Custom text for raids (max 40)",
    value: "(sender) sent (amount) raiders!",
    group: "Events",
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
  displayBadges: {
    type: "dropdown",
    label: "Show badges:",
    value: "false",
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
  theme: {
    type: "dropdown",
    label: "Theme",
    value: "blue",
    group: "Customization",
    options: {
      blue: "Blue",
      pink: "Pink",
    },
  },
  completeGoalText: {
    type: "text",
    label: "Custom text for goal completed (max 40)",
    value: "Goal completado!",
    group: "Events",
  },
  theme: {
    type: "dropdown",
    label: "Theme",
    value: "hearts",
    group: "Customization",
    options: {
      circles: "Circles",
      hearts: "Hearts",
      stars: "Stars"
    },
  },
  itemsColor: {
    type: "colorpicker",
    label: "Items color",
    value: "#ffffff",
    group: "Customization",
  },
  progressBarColor: {
    type: "colorpicker",
    label: "Progress bar color",
    value: "rgba(255, 255, 255, 0.5)",
    group: "Customization",
  },
  goalTextColor: {
    type: "colorpicker",
    label: "Goal text color",
    value: "#ffffff",
    group: "Customization",
  },
  goalBackgroundColor: {
    type: "colorpicker",
    label: "Goal background color",
    value: "#ffffff",
    group: "Customization",
  }
};
