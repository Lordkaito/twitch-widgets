let fieldData = {
  emotesId: {
    type: "text",
    label: "Set your 7TV ID:",
    value: "",
    group: "Customization",
  },
  subText: {
    type: "text",
    label: "Custom text for SUB (max 40)",
    value: "(user) just suscribed!",
    group: "Events",
  },
  resubText: {
    type: "text",
    label: "Custom text for RESUB (max 40)",
    value: "(user) just resubscribed for (months) months!",
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
    value: "(user) cheered x(amount)!",
    group: "Events",
  },
  tipText: {
    type: "text",
    label: "Custom text for Tips (max 40)",
    value: "(user) tipped $(amount)!",
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
  theme: {
    type: "dropdown",
    label: "Theme",
    value: "pink",
    group: "Customization",
    options: {
      pink: "Light",
      purple: "Dark",
    },
  },
  chatBoxSize: {
    type: "dropdown",
    label: "Chat box size",
    value: "small",
    group: "Customization",
    options: {
      small: "Small",
      regular: "Normal"
    }
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
  }
};
