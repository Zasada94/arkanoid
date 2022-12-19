import { uuid } from "./sendStats";

var timer;
var timerStart;
var timeSpentOnSite = getTimeSpentOnSite();

export function getTimeSpentOnSite() {
  var timeSpentOnSite = parseInt(localStorage.getItem("timeSpentOnSite"));
  timeSpentOnSite = isNaN(timeSpentOnSite) ? 0 : timeSpentOnSite;
  return timeSpentOnSite;
}
export function startCounting() {
  clearInterval(timer);
  localStorage.setItem("timeSpentOnSite", 0);
  timerStart = Date.now();
  timer = setInterval(function () {
    timeSpentOnSite = getTimeSpentOnSite() + (Date.now() - timerStart);
    localStorage.setItem("timeSpentOnSite", timeSpentOnSite);
    timerStart = parseInt(Date.now());
    // console.log(parseInt(timeSpentOnSite / 1000));
  }, 1000);
}
