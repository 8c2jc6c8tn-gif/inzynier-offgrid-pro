// Russian texts of ./m04-czas-balansowania.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m04-czas-balansowania"

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
