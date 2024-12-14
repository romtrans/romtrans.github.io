document.addEventListener("DOMContentLoaded", () => {
  const userLang = navigator.language.substring(0, 2); // Wykrywa język systemu (np. "pl")
  const languageSelect = document.getElementById("language");

  // Funkcja tłumaczenia
  function translatePage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      let text = translations[lang][key];

      if (translations[lang] && text) {
        if (key === "serie_label") {
          const id = el.parentElement.id
          const serieNumText = String(id).replace("serie_", "");
          const serieNum = parseInt(serieNumText);
          text = text.replace("{number}", serieNum + 1); // Używamy numeru serii
        }
        el.innerHTML = text;
      }
    });
  }

  // Ustaw język na podstawie systemu lub domyślnie "pl"
  const defaultLang = translations[userLang] ? userLang : "pl";
  translatePage(defaultLang);
  languageSelect.value = defaultLang;

  // Zmiana języka przez select
  languageSelect.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    translatePage(selectedLang);
  });
});

function translateText(key) {
  const languageSelect = document.getElementById("language");
  const userLang = languageSelect.value;

  const langDict = translations[userLang];
  return langDict[key];
}


const translations = {
  en: {
    title: "Crossfit<br>Exercise Time",
    language_label: "Language:",
    add_series: "Add Set",
    total_time_label: "Total Time:",
    finish_time_label: "We finish at:",
    calculate_button: "Calculate",
    seconds_unit: "s",
    copyrights: "Copyright: &copy; 2024 No More Second",
    version: "Version 1.1.0",

    serie_label: "Set {number}",
    work_time_label: "Work time (seconds):",
    break_time_label: "Break time (seconds):",
    repeat_count_label: "Number of repetitions:",
    rest_time_label: "Rest time (seconds):",
    time_series_label: "Time of the set:",
    finish_time_label: "We finish at:",
    error_message: "An error occurred.",
  },
  pl: {
    title: "Crossfit<br>Czas ćwiczeń",
    language_label: "Język:",
    add_series: "Dodaj serię",
    total_time_label: "Całkowity czas:",
    finish_time_label: "Zakończymy o:",
    calculate_button: "Przelicz",
    seconds_unit: "s",
    copyrights: "Prawa autorskie: &copy; 2024 No More Second",
    version: "wersja 1.1.0",

    serie_label: "Seria {number}",
    work_time_label: "Czas pracy (sekundy):",
    break_time_label: "Czas przerwy (sekundy):",
    repeat_count_label: "Ilość stacji:",
    rest_time_label: "Czas odpoczynku (sekundy):",
    time_series_label: "Czas serii:",
    finish_time_label: "Zakończymy o:",
    error_message: "Wystąpił błąd.",
  },
  jp: {
    title: "クロスフィット<br>運動時間",
    language_label: "言語:",
    add_series: "シリーズを追加",
    total_time_label: "合計時間:",
    finish_time_label: "終了時間:",
    calculate_button: "計算する",
    seconds_unit: "秒",
    copyrights: "著作権: &copy; 2024 No More Second",
    version: "バージョン 1.1.0",

    serie_label: "シリーズ {number}",
    work_time_label: "作業時間（秒）:",
    break_time_label: "休憩時間（秒）:",
    repeat_count_label: "ステーション数:",
    rest_time_label: "休憩時間（秒）:",
    time_series_label: "シリーズの総時間:",
    finish_time_label: "終了時間:",
    error_message: "エラーが発生しました。",
  },
};
