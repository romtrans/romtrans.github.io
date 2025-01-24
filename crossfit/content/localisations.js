document.addEventListener("DOMContentLoaded", () => {

  const systemLang = navigator.language.substring(0, 2); // Wykrywa język systemu (np. "pl")
  const languageSelect = document.getElementById("language");

  // Ustaw język na podstawie systemu lub domyślnie "pl"
  const defaultLang = translations[systemLang] ? systemLang : "pl";
  let preferedUserLang = getSavedUserLanguage();
  if (!preferedUserLang) {
    preferedUserLang = defaultLang;
  }

  translatePage(preferedUserLang);
  languageSelect.value = preferedUserLang;

  // Zmiana języka przez select
  languageSelect.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    translatePage(selectedLang);
    saveUserLanguage(selectedLang);
  });
});

// Funkcja tłumaczenia
function translatePage(lang, useContainer = false) {

  const seriesContainer = document.getElementById("SeriesContainer") ?? document;
  const container = useContainer ? seriesContainer : document;

  const elements = container.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    let text = translations[lang][key];

    if (translations[lang] && text) {
      if (key.endsWith("_number")) {
        const number = el.getAttribute("data-i18n-number");
        if (number) {
          text = text.replace("{number}", number);
        }
      }
      el.innerHTML = text;
    }
  });
}

function updateLocalisation() {
  function updateTranslation() {
    let currentLang = getSavedUserLanguage() ?? "pl";
    translatePage(currentLang, true);
  }
  setTimeout(updateTranslation, 100);
}

function saveUserLanguage(langValue) {
  settingsStorage.setItem('UserLangKey', langValue);
}

function getSavedUserLanguage() {
  return settingsStorage.getItem('UserLangKey');
}

function translateText(key) {
  const languageSelect = document.getElementById("language");
  const userLang = languageSelect.value;

  const langDict = translations[userLang];
  return langDict[key];
}


const translations = {
    pl: {
    title: "Crossfit<br>Planner czasu ćwiczeń",
    language_label: "Język:",
    add_series: "Dodaj serię",
    total_time_label: "Całkowity czas:",
    finish_time_label: "Zakończymy o:",
    calculate_button: "Przelicz",
    seconds_unit: "sekundy",
    secs_unit: "s",
    clock_delay_label: "Ustaw opóźnienie zegara:",
    delay_slider_label: "Aktualnie:",
    copyrights: "Prawa autorskie: &copy; 2024 No More Second",
    version_number: "wersja {number}",

    serie_label_number: "Seria {number}",
    work_time_label: "Czas pracy:",
    break_time_label: "Czas przerwy:",
    repeat_count_label: "Ilość stacji:",
    rest_time_label: "Czas odpoczynku:",
    time_series_label: "Czas serii:",
    finish_time_label: "Zakończymy o:",
    error_message: "Wystąpił błąd.",
  },
  en: {
    title: "Crossfit<br>Exercise Planner",
    language_label: "Language:",
    add_series: "Add Set",
    total_time_label: "Total Time:",
    finish_time_label: "We finish at:",
    calculate_button: "Calculate",
    seconds_unit: "seconds",
    secs_unit: "s",
    clock_delay_label: "Set clock delay:",
    delay_slider_label: "Current:",
    copyrights: "Copyright: &copy; 2024 No More Second",
    version_number: "Version {number}",

    serie_label_number: "Set {number}",
    work_time_label: "Work time:",
    break_time_label: "Break time:",
    repeat_count_label: "Number of repetitions:",
    rest_time_label: "Rest time:",
    time_series_label: "Time of the set:",
    finish_time_label: "We finish at:",
    error_message: "An error occurred.",
  },
  jp: {
    title: "クロスフィット<br>運動時間",
    language_label: "言語:",
    add_series: "シリーズを追加",
    total_time_label: "合計時間:",
    finish_time_label: "終了時間:",
    calculate_button: "計算する",
    seconds_unit: "秒",
    secs_unit: "秒",
    clock_delay_label: "クロック遅延を設定してください",
    delay_slider_label: "現在:",
    copyrights: "著作権: &copy; 2024 No More Second",
    version_number: "バージョン {number}",

    serie_label_number: "シリーズ {number}",
    work_time_label: "作業時間:",
    break_time_label: "休憩時間:",
    repeat_count_label: "ステーション数:",
    rest_time_label: "休憩時間:",
    time_series_label: "シリーズの総時間:",
    finish_time_label: "終了時間:",
    error_message: "エラーが発生しました。",
  },
};
