let mainObj = {};
const setGoalType = (type) => {
  switch (type) {
    case "sub":
      let subGoal = new Goal("sub");
      return subGoal.init();
    case "follower":
      let followGoal = new Goal("follow");
      return followGoal.init();
    case "cheer":
      let cheerGoal = new Goal("cheer");
      return cheerGoal.init();
    case "tip":
      let tipGoal = new Goal("tip");
      return tipGoal.init();
  }
};

window.addEventListener("onWidgetLoad", function (obj) {
  mainObj.data = obj["detail"]["session"]["data"];
  mainObj.recents = obj["detail"]["recents"];
  mainObj.currency = obj["detail"]["currency"];
  mainObj.channelName = obj["detail"]["channel"]["username"];
  mainObj.apiToken = obj["detail"]["channel"]["apiToken"];
  mainObj.fieldData = obj["detail"]["fieldData"];
  console.log(mainObj);
  const goalType = mainObj.fieldData.goalType;
  setGoalType(goalType);
});
class Goal {
  constructor(type) {
    this.type = type;
  }

  init() {
    return this.type;
  }

  get objective() {
    // let objective = mainObj.fieldData.objective;
    let objective = 20;
    // mainObj.data.type-goal = objective ---- this will set the goal in SE the same as the goal in fieldData, to make it easier to change the goal, instead of going to SE main page you can do this from the overlay
    // maybe we want to allow people to change goal from SE main page, cause not sure if everyone will want to go into the widget to be able to edit this goal
    return objective;
  }

  get current() {
    // if type is cheer or tip, we will use cheer.count, cause this resets on every session (you dont want a cheer/tip goal to count from your starting streaming career)
    // otherwise we will follower/sub-total, which is the total amount of followers/subs you have ever had, great for this kind of goals
    let current = 0;
    return current;
  }
}

const grow = () => {
  let progressBar = document.querySelector(".progress-bar");
  let currentWidth = progressBar.offsetWidth;
  console.log(currentWidth)
  progressBar.style.width = `${currentWidth + 10}px`;
}

const click = document.querySelector(".click");
click.addEventListener("click", grow);