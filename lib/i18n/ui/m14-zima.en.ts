// English texts of ./m14-zima.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-zima"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-ZIMA-TYTUL": "Winter without the grid",
  "UI-ZIMA-OPIS":
    "The same installation as on the “How much PV and storage” screen, but without the grid: what will be missing in December and January and what will cover it. M14 “Home – grid”, screen D5.",
  "UI-ZIMA-NAJPIERW": "First enter consumption and the installation",
  "UI-ZIMA-NIE-DA-SIE": "Cannot be calculated — fill in the data on the “How much PV and storage” screen",
  "UI-ZIMA-BILANS": "Balance without the grid",
  "UI-ZIMA-BRAKUJE": "December + January: {kwh} kWh short",
  "UI-ZIMA-BEZ-NIEDOBORU": "December and January without a shortfall",
  "UI-ZIMA-ROK":
    "Over the whole year without the grid {brak} kWh is missing, and {nadwyzka} kWh of production is wasted (there is nowhere to export it).",
  "UI-ZIMA-WARUNEK": "Necessary condition before disconnecting — the winter stress test (Module 7)",
  "UI-ZIMA-WARUNEK-OPIS":
    "The monthly balance assumes the storage fills up every day. Winter can be different — several cloudy days in a row, a low storage temperature, a heat pump running longer. Check this before deciding:",
  "UI-ZIMA-L-ZACHMURZENIE": "Cloudy-month simulation",
  "UI-ZIMA-I": " and ",
  "UI-ZIMA-L-DNI-BEZ-SLONCA": "days without sun",
  "UI-ZIMA-L-DNI-AUTONOMII": "Days of autonomy",
  "UI-ZIMA-MODUL-2-I": " (Module 2) and ",
  "UI-ZIMA-L-TEMPERATURA": "effect of temperature on storage",
  "UI-ZIMA-MODUL-4": " (Module 4)",
  "UI-ZIMA-L-POMPA": "Winter heat pump consumption",
  "UI-ZIMA-MODUL-6": " (Module 6)",
  "UI-ZIMA-NIEDOBOR-AGREGAT": "The generator will cover the shortfall:",
  "UI-ZIMA-L-AGREGAT": "Generator as backup",
}
