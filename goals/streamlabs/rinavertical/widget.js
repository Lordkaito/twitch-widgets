// Events will be sent when someone followers
// Please use event listeners to run functions.

document.addEventListener("goalLoad", function (obj) {
  // obj.detail will contain information about the current goal
  // this will fire only once when the widget loads
  $("#title").html(obj.detail.title);
  $("#goal-current").text(obj.detail.amount.current);
  $("#goal-total").text(obj.detail.amount.target);
  $("#goal-end-date").text(obj.detail.to_go.ends_at);
});

let animationPlaying = false;

document.addEventListener("goalEvent", function (obj) {
  let colita = document.querySelector(".colita");
  let progression = document.querySelector(".progression");
  let progressBar = document.querySelector(".progress-bar");
  let progressBarContainer = document.querySelector(".progress-bar-container");
  let totalWidth = progressBarContainer.offsetWidth;
  // obj.detail will contain information about the goal
  let step = totalWidth / obj.detail.amount.target;

  if (!animationPlaying) {
    animationPlaying = true;
    colita.style.animationName = "wiggle";
    colita.style.animationDuration = "2s";
    colita.style.animationTimingFunction = "ease-in-out";
    setTimeout(() => {
      colita.style.animationName = "none";
      animationPlaying = false;
    }, 2000);
  }

  if (obj.detail.amount.current >= obj.detail.amount.target) {
    progressBar.style.width = "100%";
    progression.innerHTML = obj.detail.settings.custom_json.customField3.value;
  } else {
    progressBar.style.width = `${obj.detail.amount.current * step}px`;
  }
  $("#goal-current").text(obj.detail.amount.current);
});
