// Russian texts of ./m02-bilans.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m02-bilans"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-BIL-TYTUL": "Баланс потребности",
  "UI-BIL-OPIS": "Сколько энергии в сутки нужно всему объекту — сумма уже заполненных экранов Модуля 2. Ничего не вводится повторно. Модуль 2.",
  "UI-BIL-POZYCJE": "Позиции баланса",
  "UI-BIL-BRAK-DANYCH": "экран не заполнен",
  "UI-BIL-OTWORZ": "Открыть экран →",
  "UI-BIL-KWH-DOBA": "{v} кВт·ч/сутки",
  "UI-BIL-BUFOR": "Запас на расширение: {procent}% (с экрана «Запас на расширение»)",
  "UI-BIL-BUFOR-BRAK": "Запас на расширение: не выбран",
  "UI-BIL-DOBA-TYPOWA": "Типичные сутки",
  "UI-BIL-NAJGORSZY": "Худший месяц: {miesiac}",
  "UI-BIL-Z-BUFOREM": "С запасом: {v} кВт·ч/сутки",
  "UI-BIL-MIESIACE": "Суточное потребление по месяцам [кВт·ч/сутки]",
  "UI-BIL-DO-PROJEKTU": "Сохранить в проекте",
  "UI-BIL-OPCJA-TYPOWA": "типичные сутки",
  "UI-BIL-OPCJA-NAJGORSZY": "худший месяц",
  "UI-BIL-WYPELNIJ": "Заполните хотя бы один экран из списка, чтобы рассчитать баланс.",
  "UI-BIL-POLICZYC": "Не удаётся рассчитать — проверьте данные на экранах из списка",
}
