let fieldData = {
  svg: {
    type: "dropdown",
    label: "SVG",
    value: "star",
    options: { star: "Star", heart: "Heart", flower: "Flower", moon: "Moon" },
    group: "Customization",
  },
  color: { type: "colorpicker", label: "Color", value: "#df9bf0", group: "Customization" },
  theme: {
    type: "dropdown",
    label: "Theme",
    value: "dark",
    group: "Customization",
    options: { light: "Light", dark: "Dark" },
  },
  rainbowMode: { type: "checkbox", label: "Rainbow Mode", value: false, group: "Customization" },
  animationTime: {
    type: "number",
    label: "Animation Time",
    value: 2000,
    group: "Customization",
  },
  animation: { type: "dropdown", label: "Animation", value: "random", options: {
    random: "Random pop-in",
    fromBottom: "From bottom",
  }, group: "Customization" },
}
