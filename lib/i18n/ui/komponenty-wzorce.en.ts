// English texts of ./komponenty-wzorce.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./komponenty-wzorce"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-EKRCHECHE-AGM-VRLA-SZCZELNY": "AGM (VRLA, sealed)",
  "UI-EKRCHECHE-KWASOWY-ZALEWOWY": "Lead-acid (flooded)",
  "UI-EKRCHECHE-WYBIERZ-TYP-AKUMULATORA": "Choose the battery type to see the checklist.",
  "UI-EKRCHECHE-TYP-AKUMULATORA": "Battery type",
  "UI-EKRCHECHE-POTWIERDZONO": "Confirmed {potwierdzone} / {razem}",
  "UI-EKRCHECHE-POTWIERDZONO-POZYCJI": "Confirmed {potwierdzone} / {razem} items",
  "UI-EKRKABMALINS-SWOBODNIE-SCIANIE-POWIETRZU": "Free air (on a wall, in air)",
  "UI-EKRKABMALINS-PESZLU-RURZE-INSTALACYJNEJ": "In conduit / installation pipe",
  "UI-EKRKABMALINS-ZIEMI": "In the ground",
  "UI-EKRKABMALINS-WIAZCE-INNYMI-KABLAMI": "In a bundle with other cables",
  "UI-EKRKABMALINS-WYPELNIJ-PRAD-NAPIECIE": "Fill in the current, voltage, length, temperature and permissible drop.",
  "UI-EKRKABMALINS-BEZPIECZNIK": "{przekrojMm2} mm² · fuse ≥ {bezpiecznikMinA} A",
  "UI-EKRKABMALINS-OBCIAZALNOSC-SPADEK-NAPIECIA":
    "Current-carrying capacity {obciazalnoscA} A · voltage drop {spadekNapieciaPct}%",
  "UI-EKRKABMALINS-PRAD-OBCIAZENIA": "Load current",
  "UI-EKRKABMALINS-NAPIECIE-INSTALACJI": "Installation voltage",
  "UI-EKRKABMALINS-DLUGOSC-TRASY-JEDNA": "Route length (one way)",
  "UI-EKRKABMALINS-SPOSOB-ULOZENIA": "Installation method",
  "UI-EKRKABMALINS-LICZBA-KABLI-WIAZCE": "Number of cables in the bundle",
  "UI-EKRKABMALINS-TEMPERATURA-OTOCZENIA": "Ambient temperature",
  "UI-EKRKABMALINS-DOPUSZCZALNY-SPADEK-NAPIECIA": "Permissible voltage drop",
  "UI-EKRKABMALINS-SPRAWDZ-MOJ-PRZEKROJ": "Check my cross-section instead of selecting automatically",
  "UI-EKRKABMALINS-MOJ-PRZEKROJ": "My cross-section",
  "UI-EKRKABMALINS-POLICZYC-SPRAWDZ-WPISANE": "Cannot calculate — check the data entered",
  "UI-EKRKABMALINS-POZA-ZAKRESEM-TABLIC": "Outside the table range",
  "UI-EKRKABMALINS-PRZEKROJ-PONIZEJ-MINIMUM": "Cross-section below the minimum",
  "UI-EKRKABMALINS-PRZEKROJ": "Your cross-section",
  "UI-EKRKABMALINS-MINIMALNY-PRZEKROJ": "Minimum cross-section",
  "UI-EKRKABMALINS-MINIMUM": "· minimum {wymaganyMm2} mm²",
  "UI-EKRCHECHE-LIFEPO4": "LiFePO4",
}
