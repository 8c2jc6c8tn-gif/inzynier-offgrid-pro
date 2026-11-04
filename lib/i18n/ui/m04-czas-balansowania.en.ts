// English texts of ./m04-czas-balansowania.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m04-czas-balansowania"

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
