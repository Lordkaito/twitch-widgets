let sessionData;
let topTip = {};
let topCheer = {};
let latestSubscriber = {};
let latestCheer = {};
let time;
let topInterval;
let latestInterval;

window.addEventListener("onWidgetLoad", function (obj) {
  sessionData = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  time = fieldData.speed * 1000;

  latestCheer = sessionData["cheer-latest"];
  latestSubscriber = sessionData["subscriber-latest"];

  topCheer = sessionData["cheer-alltime-top-donator"];
  topTip = sessionData["tip-alltime-top-donator"];

  const bitsCurrency = fieldData.bitsCurrency;

  let topText1 = document.querySelector(`.top-text-1`);
  let latestText1 = document.querySelector(`.latest-text-1`);
  let topText2 = document.querySelector(`.top-text-2`);
  let latestText2 = document.querySelector(`.latest-text-2`);

  topText1.innerText = latestSubscriber.name + "\u00A0";
  topText2.innerText = latestSubscriber.name + "\u00A0";

  latestText1.innerText =
    latestCheer.name + " - " + latestCheer.amount + bitsCurrency;
  latestText2.innerText =
    latestCheer.name + " - " + latestCheer.amount + bitsCurrency;
  // setInterval(() => {
  //   toggleTopText();
  // }, time);

  // setInterval(() => {
  //   toggleLatestText();
  // }, time);
});
const topTipText = document.querySelector(`.top-tip-text`);
const topCheerText = document.querySelector(`.top-cheer-text`);
const topText1 = document.querySelector(`.top-text-1`);
const topText2 = document.querySelector(`.top-text-2`);
const latestSubscriberText = document.querySelector(`.latest-tip-text`);
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
  if (latestSubscriberText.classList.contains("active")) {
    latestText1.classList.remove("active");
    latestText1.classList.add("inactive");
    latestText2.classList.add("active");
    latestText2.classList.remove("inactive");
  } else {
    latestText1.classList.add("active");
    latestText1.classList.remove("inactive");
    latestText2.classList.remove("active");
    latestText2.classList.add("inactive");
  }
};

window.addEventListener("onSessionUpdate", function (obj) {
  sessionData = obj.detail.session.session.data;

  if (
    sessionData["cheer-latest"].name !== latestCheer.name ||
    sessionData["cheer-latest"].amount !== latestCheer.amount ||
    sessionData["subscriber-latest"].name !== latestSubscriber.name
  ) {
    updateWidgetData(sessionData);
  }
});

const updateWidgetData = (data) => {
  latestCheer = sessionData["cheer-latest"];
  latestSubscriber = sessionData["tip-latest"];

  topCheer = sessionData["cheer-alltime-top-donator"];
  topTip = sessionData["tip-alltime-top-donator"];

  const currency = fieldData.currency;
  const bitsCurrency = fieldData.bitsCurrency;

  let topText1 = document.querySelector(`.top-text-1`);
  let latestText1 = document.querySelector(`.latest-text-1`);
  let topText2 = document.querySelector(`.top-text-2`);
  let latestText2 = document.querySelector(`.latest-text-2`);

  let animationContainer1 = document.querySelector(`.top-tip-container`);
  let animationContainer2 = document.querySelector(`.top-cheer-container`);
  let animationContainer3 = document.querySelector(`.latest-tip-container`);
  let animationContainer4 = document.querySelector(`.latest-cheer-container`);

  topText1.innerText = latestSubscriber.name + "\u00A0";
  topText2.innerText = latestSubscriber.name + "\u00A0";

  latestText1.innerText =
    latestCheer.name + " - " + latestCheer.amount + bitsCurrency;
  latestText2.innerText =
    latestCheer.name + " - " + latestCheer.amount + bitsCurrency;

  if (data["cheer-latest"] !== latestCheer) {
    animationContainer1.classList.add("animate");
    animationContainer2.classList.add("animate");
    setTimeout(() => {
      animationContainer1.classList.remove("animate");
      animationContainer2.classList.remove("animate");
    }, 1000);
  }

  if (data["subscriber-latest"] !== latestSubscriber) {
    animationContainer3.classList.add("animate2");
    animationContainer4.classList.add("animate2");
    setTimeout(() => {
      animationContainer3.classList.remove("animate2");
      animationContainer4.classList.remove("animate2");
    }, 1000);
  }
};
