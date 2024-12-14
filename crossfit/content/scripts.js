
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

class SerieView {
  constructor(workoutSerie, serieId, workTimeId = "WorkTime", breakTimeId = "BreakTime", repeatCountId = "RepeatCount", restTimeId="RestTime") {
    this.serie = workoutSerie;
    this.serieId = serieId;
    this.workTimeId = `${workTimeId}_${serieId}`;
    this.breakTimeId = `${breakTimeId}_${serieId}`;
    this.repeatCountId = `${repeatCountId}_${serieId}`;
    this.restTimeId = `${restTimeId}_${serieId}`;
    this.totalTimeId = `TotalTime_${serieId}`;
    this.finishTimeId = `FinishTime_${serieId}`;
    this.errorId = `error_${serieId}`;
    this.totalTime = 0;
  }

  getErrorLog() {
    return this.errorLog;
  }

  getElementById(id) {
    return document.getElementById(id);
  }

  updateUI() {
    this.errorLog = "";

    var workTime = getInputValue(this.workTimeId);
    var breakTime = getInputValue(this.breakTimeId);
    var repeatCount = getInputValue(this.repeatCountId);
    var restTime = getInputValue(this.restTimeId);
    this.serie.workTime = workTime;
    this.serie.breakTime = breakTime;
    this.serie.repeatCount = repeatCount;
    this.serie.restTime = restTime;

    const summaryTime = this.serie.calculateTime();
    const finishTime  = estimateFinishTime(summaryTime);

    this.totalTime = summaryTime;

    const secondsText = "  ("+summaryTime.toString()+translateText("seconds_unit")+")";
    this.getElementById(this.totalTimeId).value = formatTime(summaryTime) + secondsText;
    //this.getElementById(this.finishTimeId).value = finishTime;
    let error = this.getElementById(this.errorId);
    
    if (this.errorLog) {
      error.textContent = this.errorLog + "<br>";
    } else {
      //error.textContent = summaryTime.toString()+" sekund";
    }

    calculateTime();
  }

  incInpuValue(id, step) {
    const input = this.getElementById(id);
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

  incValue(id) {
    this.incInpuValue(id, +1);
    this.updateUI();
  }

  decValue(id) {
    this.incInpuValue(id, -1);
    this.updateUI();
  }

  generateHTML() {
    return `
      <div class="serie" id="serie_${this.serieId}">
      <h3 data-i18n="serie_label">Seria ${this.serieId+1}</h3>
      
      <label for="${this.workTimeId}" data-i18n="work_time_label">Czas pracy (sekundy):</label><br>
      <button class="inputButton" onclick="serieViews[${this.serieId}].decValue('${this.workTimeId}')">-</button>
      <input type="number" id="${this.workTimeId}" name="czas_pracy" min="5" max="200" step="1" value="25">
      <button class="inputButton" onclick="serieViews[${this.serieId}].incValue('${this.workTimeId}')">+</button>
      <br>
      
      <label for="${this.breakTimeId}" data-i18n="break_time_label">Czas przerwy (sekundy):</label><br>
      <button class="inputButton" onclick="serieViews[${this.serieId}].decValue('${this.breakTimeId}')">-</button>
      <input type="number" id="${this.breakTimeId}" name="przerwa" min="2" max="100" step="1" value="15">
      <button class="inputButton" onclick="serieViews[${this.serieId}].incValue('${this.breakTimeId}')">+</button>
      <br>
      
      <label for="${this.repeatCountId}" data-i18n="repeat_count_label">Ilość stacji:</label><br>
      <button class="inputButton" onclick="serieViews[${this.serieId}].decValue('${this.repeatCountId}')">-</button>
      <input type="number" id="${this.repeatCountId}" name="ilosc_stacji" min="2" max="40" step="1" value="10">
      <button class="inputButton" onclick="serieViews[${this.serieId}].incValue('${this.repeatCountId}')">+</button>
      <br>

      <label for="${this.restTimeId}" data-i18n="rest_time_label">Czas odpoczynku (sekundy):</label><br>
      <button class="inputButton" onclick="serieViews[${this.serieId}].decValue('${this.restTimeId}')">-</button>
      <input type="number" id="${this.restTimeId}" name="ilosc_stacji" min="10" max="360" step="1" value="60">
      <button class="inputButton" onclick="serieViews[${this.serieId}].incValue('${this.restTimeId}')">+</button>
      <br><br>
      
      <label for="${this.totalTimeId}" data-i18n="time_series_label">Czas serii:</label>
      <input type="text" id="${this.totalTimeId}" disabled>
      <br>
      
      <p id="${this.errorId}" data-i18n="error_message"></p>
      <br>
      </div>
    `;
  }

  setupDynamicUpdates() {
    // Pobierz elementy pól input
    const workTimeInput = this.getElementById(this.workTimeId);
    const breakTimeInput = this.getElementById(this.breakTimeId);
    const repeatCountInput = this.getElementById(this.repeatCountId);

    // Nasłuchuj zmiany w polach input
    [workTimeInput, breakTimeInput, repeatCountInput].forEach(input => {
      input.addEventListener("input", () => this.updateUI());
    });

    // Zaktualizuj UI na start
    this.updateUI();
  }
}

let serieViews = []; // Globalna tablica przechowująca instancje SerieView

// Funkcja dodająca nową serię
function addSerie() {
  const container = document.getElementById("SeriesContainer");
  const dynamicSerieId = container.children.length;
  var workout = new WorkoutSerie(25, 15, 10, 60, 1);
  var newSerieView = new SerieView(workout, dynamicSerieId);

  serieViews.push(newSerieView); // Dodajemy nową serię do globalnej tablicy
  container.insertAdjacentHTML('beforeend', newSerieView.generateHTML());
  newSerieView.setupDynamicUpdates();
}

class WorkoutSerie {
  constructor(workTime, breakTime, repeatCount, restTime, delay) {
    this.workTime = workTime; // czas pracy w sekundach
    this.breakTime = breakTime; // czas przerwy w sekundach
    this.repeatCount = repeatCount; // liczba powtórzeń
    this.restTime = restTime;
    this.clockDelay = 1; // opóźnienie zegara w sekundach
  }

  // Metoda obliczająca opóźnienie zegara
  delay(time) {
    return time + this.clockDelay;
  }

  // Oblicza całkowity czas na podstawie parametrów
  calculateTime() {
    // Przypisanie wartości do zmiennych lokalnych
    const { workTime, breakTime, repeatCount, restTime } = this;
    
    // Obliczenie czasu
    return (this.delay(workTime) + this.delay(breakTime)) * repeatCount + this.delay(restTime);
  }
}

function clockDelay(time) {
	var delay = 1 // [sek] clock delay (at the end when timer Bips and then again starts counting down)
	return time + delay
}

function calculateTime() {
  setErrorLog("");

  var totalTime = 0;

  serieViews.forEach((serieView) => {
    totalTime += serieView.totalTime;
  });

  const finishTime = estimateFinishTime(totalTime);
  const secondsText = "  ("+totalTime.toString()+translateText("seconds_unit")+")";
  
  document.getElementById("TotalTime").value = formatTime(totalTime)+secondsText;
  document.getElementById("FinishTime").value = finishTime;
  return totalTime;
}

function calculateAction() {
  serieViews.forEach((serieView) => {
    serieView.updateUI();
  });
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
/*
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
*/
function startWork() {
  addSerie();
}

document.addEventListener("DOMContentLoaded", startWork);
