function getClockDelay() {
  let delayValue = 1.0;
  let delay = settingsStorage.getItem('ClockDelayKey');

  if (delay) {
    let delayValue = parseFloat(delay);
    return delayValue;
  } 
  else {
    settingsStorage.setItem('ClockDelayKey', delayValue);
    return delayValue;
  }
}

function setClockDelay(value) {
  const delayValue = parseFloat(value); 
  settingsStorage.setItem('ClockDelayKey', delayValue);
}

document.addEventListener("DOMContentLoaded", () => {

  const popupContainer = document.querySelector(".popup-container");
  const delay = getClockDelay();

  const popupHTML = `
    <div id="clockDelayPopup" class="popup">
      <button id="closePopupButton" class="close-button">&times;</button>
      <h3 data-i18n="clock_delay_label">Ustaw opóźnienie zegara:</h3>
      <input type="range" id="clockDelayRange" min="0" max="10" step="0.1" value="${delay}">
      <div>
        <span data-i18n="delay_slider_label">Aktualnie:</span> 
        <span id="clockDelayValue">${delay}</span>
        <span data-i18n="seconds_unit">sekund</span>
      </div>
    </div>
  `;

  // Dodanie popupu do DOM
  popupContainer.insertAdjacentHTML("beforeend", popupHTML);

  const clockDelayButton = document.getElementById("SettingsButton");
  const clockDelayPopup = document.getElementById("clockDelayPopup");
  const closePopupButton = document.querySelector(".close-button");
  const clockDelayRange = document.getElementById("clockDelayRange");
  const clockDelayValue = document.getElementById("clockDelayValue");

  // Otwieranie popupu
  clockDelayButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Zatrzymaj propagację
    clockDelayPopup.parentElement.classList.toggle("active");
  });

  // Aktualizacja wartości opóźnienia
  clockDelayRange.addEventListener("input", (e) => {
    clockDelayValue.textContent = e.target.value;
    setClockDelay(e.target.value);
    calculateAction();
  });

  // Zamknięcie popupu
  closePopupButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Zatrzymaj propagację
    clockDelayPopup.parentElement.classList.remove("active");
  });

  // Zamknięcie popupu przy kliknięciu poza nim
  document.addEventListener("click", () => {
    clockDelayPopup.parentElement.classList.remove("active");
  });

  // Zatrzymanie propagacji kliknięć wewnątrz popupu
  clockDelayPopup.addEventListener("click", (e) => {
    e.stopPropagation(); // Zatrzymaj propagację
  });
});