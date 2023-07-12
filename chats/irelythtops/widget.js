let sessionData;
let topTip = {};
let topCheer = {};
let latestTip = {};
let latestCheer = {};
// let fieldData = {};
let time
let topInterval;
let latestInterval;
window.addEventListener("onWidgetLoad", function (obj) {
  sessionData = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  time = fieldData.speed * 1000;

  latestCheer = sessionData["cheer-latest"];
  latestTip = sessionData["tip-latest"];

  topCheer = sessionData["cheer-alltime-top-donator"];
  topTip = sessionData["tip-alltime-top-donator"];

  const currency = fieldData.currency;
  const bitsCurrency = fieldData.bitsCurrency;

  let topText1 = document.querySelector(`.top-text-1`);
  let latestText1 = document.querySelector(`.latest-text-1`);
  let topText2 = document.querySelector(`.top-text-2`);
  let latestText2 = document.querySelector(`.latest-text-2`);

  topText1.innerText =
    topTip.name + " - " + topTip.amount + currency + "\u00A0";

  latestText1.innerText =
    latestTip.name + " - " + latestTip.amount + currency + "\u00A0";

  topText2.innerText = topCheer.name + " - " + topCheer.amount + bitsCurrency;

  latestText2.innerText =
    latestCheer.name + " - " + latestCheer.amount + bitsCurrency;
  setInterval(() => {
    toggleTopText();
  }, time);

  setInterval(() => {
    toggleLatestText();
  }, time);
});
const topTipText = document.querySelector(`.top-tip-text`);
const topCheerText = document.querySelector(`.top-cheer-text`);
const topText1 = document.querySelector(`.top-text-1`);
const topText2 = document.querySelector(`.top-text-2`);
const latestTipText = document.querySelector(`.latest-tip-text`);
const latestCheerText = document.querySelector(`.latest-cheer-text`);
const latestText1 = document.querySelector(`.latest-text-1`);
const latestText2 = document.querySelector(`.latest-text-2`);


const toggleTopText = () => {
  if (topTipText.classList.contains("active")) {
    topTipText.classList.remove("active");
    topTipText.classList.add("inactive");
    topCheerText.classList.add("active");
    topCheerText.classList.remove("inactive");
    topText1.classList.remove("active");
    topText1.classList.add("inactive");
    topText2.classList.add("active");
    topText2.classList.remove("inactive");
  } else {
    topTipText.classList.add("active");
    topTipText.classList.remove("inactive");
    topCheerText.classList.remove("active");
    topCheerText.classList.add("inactive");
    topText1.classList.add("active");
    topText1.classList.remove("inactive");
    topText2.classList.remove("active");
    topText2.classList.add("inactive");
  }
};

const scroller1 = document.querySelector(`.scroller-1`);
const scroller2 = document.querySelector(`.scroller-2`);
const scroller3 = document.querySelector(`.scroller-3`);
const scroller4 = document.querySelector(`.scroller-4`);

const toggleLatestText = () => {
  if (latestTipText.classList.contains("active")) {
    latestCheerText.classList.add("active");
    latestCheerText.classList.remove("inactive");
    latestTipText.classList.remove("active");
    latestTipText.classList.add("inactive");
    latestText1.classList.remove("active");
    latestText1.classList.add("inactive");
    latestText2.classList.add("active");
    latestText2.classList.remove("inactive");
  } else {
    latestCheerText.classList.remove("active");
    latestCheerText.classList.add("inactive");
    latestTipText.classList.add("active");
    latestTipText.classList.remove("inactive");
    latestText1.classList.add("active");
    latestText1.classList.remove("inactive");
    latestText2.classList.remove("active");
    latestText2.classList.add("inactive");
  }
};

window.addEventListener("onSessionUpdate", function (obj) {
  sessionData = obj.detail.session.session.data;
  updateWidgetData(sessionData);
});

const updateWidgetData = (data) => {
  latestCheer = sessionData["cheer-latest"];
  latestTip = sessionData["tip-latest"];

  topCheer = sessionData["cheer-alltime-top-donator"];
  topTip = sessionData["tip-alltime-top-donator"];

  const currency = fieldData.currency;
  const bitsCurrency = fieldData.bitsCurrency;

  let topText1 = document.querySelector(`.top-text-1`);
  let latestText1 = document.querySelector(`.latest-text-1`);
  let topText2 = document.querySelector(`.top-text-2`);
  let latestText2 = document.querySelector(`.latest-text-2`);

  topText1.innerText =
    topTip.name + " - " + topTip.amount + currency + "\u00A0";

  latestText1.innerText =
    latestTip.name + " - " + latestTip.amount + currency + "\u00A0";

  topText2.innerText = topCheer.name + " - " + topCheer.amount + bitsCurrency;

  latestText2.innerText =
    latestCheer.name + " - " + latestCheer.amount + bitsCurrency;
};
