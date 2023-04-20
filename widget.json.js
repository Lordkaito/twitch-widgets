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
    value: "(sender) gifted (amount) sub(s)!",
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
  animation: {
    type: "dropdown",
    label: "Turn on animation:",
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
    value: "pink",
    group: "Customization",
    options: {
      pink: "Light",
      purple: "Dark",
    },
  },
};
