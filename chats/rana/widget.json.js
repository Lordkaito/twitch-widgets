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
  maxTextWidth: {
    label: "Max text width(in REM):",
    type: "text",
    group: "Customization",
    value: "100",
  },
  deleteMessages: {
    label: "Time to delete messages (max 60):",
    type: "number",
    group: "Customization",
    value: 2,
    min: 1,
    max: 60,
    step: 1,
  },
  allowDeleteMessages: {
    type: "dropdown",
    label: "Delete messages on/off:",
    value: "true",
    group: "Customization",
    options: {
      true: "Yes",
      false: "No",
    },
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
  usersBlackList: {
    type: "text",
    label: "Users blacklist (separated by comma)",
    value: "",
    group: "Customization",
  },
  specialCharsBlackList: {
    type: "text",
    label: "Special chars (separated by comma)",
    value: "",
    group: "Customization",
  },
  subText: {
    type: "text",
    label: "Custom text for SUB (max 40)",
    value: "(user) just suscribed!",
    group: "Events",
  },
  followText: {
    type: "text",
    label: "Custom text for FOLLOW (max 40)",
    value: "(user) just followed!",
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
  limitUsernames: {
    type: "dropdown",
    label: "Limit usernames:",
    value: "true",
    group: "Customization",
    options: {
      true: "Yes",
      false: "No"
    }
  },
  theme: {
    type: "dropdown",
    label: "Theme:",
    value: "pink",
    group: "Customization",
    options: {
      pink: "Pink",
      red: "Red",
    },
  },
  deleteMessagesOption: {
    label: "How to delete messages:",
    type: "dropdown",
    group: "Customization",
    value: "amount",
    options: {
      timer: "Timer",
      amount: "Messages amount",
    },
  },
  maxMessages: {
    label: "Max messages to show:",
    type: "number",
    group: "Customization",
    value: 3,
    min: 1,
    max: 100,
    step: 1,
  },
  deleteMessagesTimer: {
    label: "Delete messages timer (in seconds):",
    type: "number",
    group: "Customization",
    value: 10,
    min: 1,
    max: 60,
    step: 1,
  }
};
