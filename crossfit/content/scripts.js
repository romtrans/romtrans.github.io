
function getInputValue(id) {
  var input = document.getElementById(id);
  var inputValue = input.valueAsNumber;
  
  if (input.value.length === 0) {
    setErrorLog(`Przeprasza mam problem z wartością ${input.name}(${input.value}) = pusta!`);
    inputValue = 0;
  } else if (isNaN(inputValue)) {
    setErrorLog(`Przeprasza mam problem z wartością ${input.name}(${input.value}) = niepoprawna!`);
    inputValue = 10;
  }
  return inputValue;
}

function setErrorLog(failureInfo) {
  document.getElementById("error").innerHTML = failureInfo;
}

function clockDelay(time) {
	var delay = 1 // [sek] clock delay (at the end when timer Bips and then again starts counting down)
	return time + delay
}

function calculateTime() {
  setErrorLog("");

  var workTime = getInputValue("WorkTime");
  var breakTime = getInputValue("BreakTime");
  var repeatCount = getInputValue("RepeatCount");
  

  var summaryTime = (clockDelay(workTime) + clockDelay(breakTime)) * repeatCount;
  const finishTime = estimateFinishTime(summaryTime);
  document.getElementById("TotalTime").value = formatTime(summaryTime);
  document.getElementById("FinishTime").value = finishTime;
  document.getElementById("SummaryTime").innerHTML = summaryTime.toString()+" sekund";
  return summaryTime;
}

function timeComponents(seconds) {
  var hours = Math.floor(seconds / 3600);
  var mins = Math.floor((seconds % 3600) / 60);
  var secs = seconds % 60;
  return {hours, mins, secs}
}

function formatTime(seconds) {
  const time = timeComponents(seconds);

  // Formatowanie jako hh:mm:ss
  var result = `${time.mins.toString().padStart(2, '0')}:${time.secs.toString().padStart(2, '0')}`;
  result = `${time.hours.toString()}:`+result;
  return result;
}

function estimateFinishTime(workoutSec) {
  const now = new Date();
  var comp = timeComponents(workoutSec);

  comp.hours += now.getHours();
  comp.mins += now.getMinutes(); 
  comp.secs += now.getSeconds();

  now.setHours(comp.hours);
  now.setMinutes(comp.mins);
  now.setSeconds(comp.secs);

  const localTime = now.toLocaleTimeString(); // Lokalny czas w formacie hh:mm:ss
  return `${localTime}`;
}

function incInpuValue(id, step) {
  const input = document.getElementById(id);
  const min = parseInt(input.min, 10) || 0;
  const max = parseInt(input.max, 10) || 0;
  const value = parseInt(input.value, 10) || 0;

  if (min == 0 || max == 0 || value == 0) {
    return;
  }

  if (value + step <= max && value + step >= min) {
    input.value = value + step;
  }
}

function incValue(id) {
  incInpuValue(id, +1);
  calculateTime();
}

function decValue(id) {
  incInpuValue(id, -1);
  calculateTime();
}

// Funkcja do dynamicznej reakcji na zmiany w polach
function setupDynamicUpdates() {
const inputs = ["WorkTime", "BreakTime", "RepeatCount"];
inputs.forEach(id => {
  document.getElementById(id).addEventListener("input", calculateTime);
});
// Zaktualizowanie TotalTime przy załadowaniu strony
calculateTime();
}

// Uruchomienie dynamicznego nasłuchiwania po załadowaniu strony
document.addEventListener("DOMContentLoaded", setupDynamicUpdates);
