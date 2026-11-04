// English texts of ./obiekt.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./obiekt"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-OBIEKT-TYTUL": "Type of site",
  "UI-OBIEKT-OPIS": "Choose what you are powering. A camper, a garden-plot cabin (ROD) and a garage are micro-installations: the app calculates them from your list of appliances and months of use, not from building heat losses. No choice = the app works as before.",
  "UI-OBIEKT-RODZAJ": "Type of site",
  "UI-OBIEKT-WYBIERZ": "— not chosen —",
  "UI-OBIEKT-R-BUDYNEK": "Building (year-round house)",
  "UI-OBIEKT-R-KAMPER": "Camper or trailer",
  "UI-OBIEKT-R-ALTANA-ROD": "Garden-plot cabin or summerhouse (ROD, holiday cabin)",
  "UI-OBIEKT-R-GARAZ": "Garage or small shed",
  "UI-OBIEKT-MIESIACE": "Months in which the site is used",
  "UI-OBIEKT-MIKRO-NOTA": "I calculate a micro-installation’s consumption from your list of appliances and the months you tick. Unticked months count as zero consumption.",
  "UI-OBIEKT-LINK-ODBIORNIKI": "Fill in the list of appliances →",
  "UI-OBIEKT-BRAK-MIESIECY": "Tick at least one month of use to calculate the consumption.",
  "UI-OBIEKT-NAPIECIE": "System voltage (optional)",
  "UI-OBIEKT-NAPIECIE-PODPOWIEDZ": "From the site profile: system voltage {v} V.",
  "UI-OBIEKT-NAPIECIE-UZYJ": "Enter {v} V",
  "UI-OBIEKT-UKRYTO-EKRANY": "Some screens about a building are hidden because the site type is a camper. You can still open them from links on other screens.",
  "UI-OBIEKT-UKRYTO-POLA": "Fields about a building are hidden because the site type is a camper.",
  "UI-OBIEKT-UKRYTO-USTAWIENIA": "You can change the site type in Settings.",
}
