// English texts of ./m14-agregat.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-agregat"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-AGZ-TYTUL": "Generator as backup",
  "UI-AGZ-OPIS":
    "How many hours and how much fuel the generator needs to cover the shortfall of the worst month without the grid — and how to connect it safely. The same engine as the “Power generator” screen (Module 2). M14 “Home – grid”, screen D6.",
  "UI-AGZ-NAJPIERW": "First calculate winter without the grid",
  "UI-AGZ-L-ZIMA": "Winter without the grid →",
  "UI-AGZ-BEZ-NIEDOBORU": "No shortfall",
  "UI-AGZ-BEZ-NIEDOBORU-OPIS":
    "The monthly balance shows no energy shortfall in any month. A series of cloudy days may still require a backup — check the winter stress test (Module 7).",
  "UI-AGZ-NAJGORSZY": "Worst month without the grid:",
  "UI-AGZ-BRAKUJE": ", {kwh} kWh short.",
  "UI-AGZ-MOC": "Generator power",
  "UI-AGZ-ZUZYCIE": "Fuel consumption at 80% load",
  "UI-AGZ-CENA": "Fuel price",
  "UI-AGZ-BMS": "The BMS / inverter has an output for automatic generator start",
  "UI-AGZ-SPRAWDZ": "Check the entered data",
  "UI-AGZ-BEZPIECZENSTWO": "Generator safety",
  "UI-AGZ-W-MIESIACU": "Generator in month {miesiac}",
  "UI-AGZ-GODZINY": "{h} h of running",
  "UI-AGZ-PALIWO": "Fuel {litry} l, cost {koszt}. Grid/island switch and generator:",
  "UI-AGZ-L-STYK": "safety of the connection point →",
}
