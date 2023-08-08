let index,
  goal,
  fieldData,
  currency,
  userLocale,
  width,
  height,
  prevCount,
  timeout,
  orientacion,
  txtPosition;

window.addEventListener("onWidgetLoad", function (obj) {
  fieldData = obj.detail.fieldData;
  console.log(obj.detail);
  goal = fieldData["goal"];
  orientacion = fieldData["orientacion"];
  userLocale = fieldData["userLocale"];
  txtPosition = fieldData["textPosition"];
  currency = obj["detail"]["currency"]["code"];
  index = fieldData["eventType"] + "-" + fieldData["eventPeriod"];
  if (fieldData["eventType"] === "subscriber-points") {
    index = fieldData["eventType"];
  }
  if (txtPosition == "up") {
    var div = document.getElementById("txt");
    div.parentNode.insertBefore(div, document.getElementById("bar"));
  }
  count = 0;
  if (typeof obj["detail"]["session"]["data"][index] !== "undefined") {
    if (
      fieldData["eventPeriod"] === "goal" ||
      fieldData["eventType"] === "cheer" ||
      fieldData["eventType"] === "tip" ||
      fieldData["eventType"] === "subscriber-points"
    ) {
      count = obj["detail"]["session"]["data"][index]["amount"];
    } else {
      count = obj["detail"]["session"]["data"][index]["count"];
    }
  }
  if (fieldData["eventType"] === "tip") {
    $("#goal").html(
      goal.toLocaleString(userLocale, { style: "currency", currency: currency })
    );
  } else {
    $("#goal").html(goal);
  }
  width = $(".meter").width();
  height = $(".meter").height();
  if (orientacion === "vertical") {
    $(".blank").removeClass("blank-h");
    $(".porcentaje").removeClass("porcentaje-h");
    $(".bar").removeClass("bar-h");
    $(".inside").removeClass("inside-h");

    $(".blank").addClass("blank-v");
    $(".porcentaje").addClass("porcentaje-v");
    $(".bar").addClass("bar-v");
    $(".inside").addClass("inside-v");
  } else if (orientacion === "horizontal") {
    $(".blank").removeClass("blank-v");
    $(".porcentaje").removeClass("porcentaje-v");
    $(".bar").removeClass("bar-v");
    $(".inside").removeClass("inside-v");

    $(".blank").addClass("blank-h");
    $(".porcentaje").addClass("porcentaje-h");
    $(".bar").addClass("bar-h");
    $(".inside").addClass("inside-h");
  }
  updateBar(count);
});

window.addEventListener("onSessionUpdate", function (obj) {
  if (typeof obj["detail"]["session"][index] !== "undefined") {
    if (
      fieldData["eventPeriod"] === "goal" ||
      fieldData["eventType"] === "cheer" ||
      fieldData["eventType"] === "tip" ||
      fieldData["eventType"] === "subscriber-points"
    ) {
      count = obj["detail"]["session"][index]["amount"];
    } else {
      count = obj["detail"]["session"][index]["count"];
    }
  }
  updateBar(count);
});

function updateBar(count) {
  if (count === prevCount) return;
  clearTimeout(timeout);
  prevCount = count;
  console.log(count);
  $("body").fadeTo("slow", 1);
  let percentage = Math.min(100, ((count / goal) * 100).toPrecision(3));
  // if(percentage > 100) percentage = 100;
  $("#bar").css(
    "clip",
    "rect(0px," + width + "px," + (percentage / 100) * height + "px,0px)"
  );
  $("#count").html(count);
  if (fieldData.fadeoutAfter) {
    timeout = setTimeout(() => {
      $("body").fadeTo("slow", 0);
    }, fieldData.fadeoutAfter * 1000);
  }
  console.log(count + " " + goal);
  let p = (count / goal) * 100;
  let blank = 100 - p + "%";
  let por = p + "%";
  if (orientacion === "vertical") {
    $("#blank").height(blank);
    $("#porcentaje").height(por);
    if (fieldData["eventType"] === "tip") {
      count = count.toLocaleString(userLocale, {
        style: "currency",
        currency: currency,
      });
    }
    $("#val").html(count + "/" + goal + "<br> ");
  } else if (orientacion === "horizontal") {
    $("#blank").width(blank);
    $("#porcentaje").width(por);
    if (fieldData["eventType"] === "tip") {
      count = count.toLocaleString(userLocale, {
        style: "currency",
        currency: currency,
      });
    }
    $("#val").html(count + "/" + goal + "  ");
  }
}
