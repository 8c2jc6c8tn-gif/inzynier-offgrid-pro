/**
 * m04-czas-balansowania — screen text of "Balancing time" (Module 4). Engine messages: `dictionary-*.ts` (`CB-*`);
 * help: `../pomoc/m04-baterie.ts` (`czas-balansowania`).
 */
export const pl = {
  "UI-CZB-TYTUL": "Czas balansowania",
  "UI-CZB-OPIS": "Ile godzin musi pracować balanser BMS, żeby wyrównać rozjazd ogniw, i ile dób okna powyżej progu startu to zajmie. Rozjazd i prąd balansera wpisujesz sam — aplikacja ich nie zna.",
  "UI-CZB-POJEMNOSC": "Pojemność ogniwa",
  "UI-CZB-ROZJAZD": "Rozjazd ogniw przy górze",
  "UI-CZB-PRAD": "Prąd balansera",
  "UI-CZB-OKNO": "Okno powyżej progu startu (opcjonalnie)",
  "UI-CZB-GODZ-DOBE": "h/dobę",
  "UI-CZB-WYPELNIJ": "Wpisz pojemność ogniwa, rozjazd i prąd balansera, żeby policzyć czas.",
  "UI-CZB-WERDYKT-OK": "Balansowanie mieści się w jednej dobie okna",
  "UI-CZB-WERDYKT-UWAGA": "Wynik z uwagami — przeczytaj poniżej",
  "UI-CZB-WERDYKT-BLAD": "Nie można policzyć — sprawdź wpisane wartości",
  "UI-CZB-CZAS-PRACY": "Czas pracy balansera",
  "UI-CZB-AH": "Ładunek do przeniesienia",
  "UI-CZB-DNI": "Dób okna potrzeba",
  "UI-CZB-SZCZEGOLY": "Szczegóły",
}

export const en: Record<keyof typeof pl, string> = {
  "UI-CZB-TYTUL": "Balancing time",
  "UI-CZB-OPIS": "How many hours the BMS balancer must run to even out the cell mismatch, and how many days of the window above the start voltage that takes. You enter the mismatch and the balancer current yourself — the app does not know them.",
  "UI-CZB-POJEMNOSC": "Cell capacity",
  "UI-CZB-ROZJAZD": "Cell mismatch near the top",
  "UI-CZB-PRAD": "Balancer current",
  "UI-CZB-OKNO": "Window above the start voltage (optional)",
  "UI-CZB-GODZ-DOBE": "h/day",
  "UI-CZB-WYPELNIJ": "Enter the cell capacity, the mismatch and the balancer current to calculate the time.",
  "UI-CZB-WERDYKT-OK": "Balancing fits within one day of the window",
  "UI-CZB-WERDYKT-UWAGA": "Result with remarks — read below",
  "UI-CZB-WERDYKT-BLAD": "Cannot calculate — check the entered values",
  "UI-CZB-CZAS-PRACY": "Balancer run time",
  "UI-CZB-AH": "Charge to move",
  "UI-CZB-DNI": "Days of window needed",
  "UI-CZB-SZCZEGOLY": "Details",
}

export const ru: Record<keyof typeof pl, string> = {
  "UI-CZB-TYTUL": "Время балансировки",
  "UI-CZB-OPIS": "Сколько часов балансир BMS должен работать, чтобы выровнять разброс ячеек, и сколько суток окна выше порога старта на это нужно. Разброс и ток балансира вы вводите сами — приложение их не знает.",
  "UI-CZB-POJEMNOSC": "Ёмкость ячейки",
  "UI-CZB-ROZJAZD": "Разброс ячеек у верхнего предела",
  "UI-CZB-PRAD": "Ток балансира",
  "UI-CZB-OKNO": "Окно выше порога старта (необязательно)",
  "UI-CZB-GODZ-DOBE": "ч/сутки",
  "UI-CZB-WYPELNIJ": "Введите ёмкость ячейки, разброс и ток балансира, чтобы рассчитать время.",
  "UI-CZB-WERDYKT-OK": "Балансировка укладывается в одни сутки окна",
  "UI-CZB-WERDYKT-UWAGA": "Результат с замечаниями — прочитайте ниже",
  "UI-CZB-WERDYKT-BLAD": "Невозможно рассчитать — проверьте введённые значения",
  "UI-CZB-CZAS-PRACY": "Время работы балансира",
  "UI-CZB-AH": "Заряд для переноса",
  "UI-CZB-DNI": "Нужно суток окна",
  "UI-CZB-SZCZEGOLY": "Подробности",
}
