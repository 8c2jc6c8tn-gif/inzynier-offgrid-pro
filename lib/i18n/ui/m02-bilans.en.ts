// English texts of ./m02-bilans.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m02-bilans"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-BIL-TYTUL": "Demand balance",
  "UI-BIL-OPIS": "How much energy per day the whole site needs — the sum of the Module 2 screens you have already filled in. Nothing is typed twice. Module 2.",
  "UI-BIL-POZYCJE": "Balance items",
  "UI-BIL-BRAK-DANYCH": "screen not filled in",
  "UI-BIL-OTWORZ": "Open the screen →",
  "UI-BIL-KWH-DOBA": "{v} kWh/day",
  "UI-BIL-BUFOR": "Expansion buffer: {procent}% (from the „Expansion buffer” screen)",
  "UI-BIL-BUFOR-BRAK": "Expansion buffer: not chosen",
  "UI-BIL-DOBA-TYPOWA": "Typical day",
  "UI-BIL-NAJGORSZY": "Worst month: {miesiac}",
  "UI-BIL-Z-BUFOREM": "With the buffer: {v} kWh/day",
  "UI-BIL-MIESIACE": "Daily consumption month by month [kWh/day]",
  "UI-BIL-DO-PROJEKTU": "Save to the project",
  "UI-BIL-OPCJA-TYPOWA": "the typical day",
  "UI-BIL-OPCJA-NAJGORSZY": "the worst month",
  "UI-BIL-WYPELNIJ": "Fill in at least one screen from the list to calculate the balance.",
  "UI-BIL-POLICZYC": "Cannot calculate — check the data on the screens in the list",
}
