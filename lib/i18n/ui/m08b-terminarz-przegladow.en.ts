// English texts of ./m08b-terminarz-przegladow.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m08b-terminarz-przegladow"

export const en: Record<keyof typeof pl, string> = {
  "UI-TPRZ-TYTUL": "Inspection and service schedule",
  "UI-TPRZ-OPIS": "Enter what needs periodic inspection (e.g. tightening connectors, checking batteries, fire-extinguisher service, cleaning panels), when you last did it and every how many months. I calculate the next date and how many days are left. Take the intervals from your devices’ manuals — the app does not know manufacturers’ recommendations.",
  "UI-TPRZ-NAZWA": "What you inspect",
  "UI-TPRZ-OSTATNI": "Last inspection",
  "UI-TPRZ-INTERWAL": "Every how many months",
  "UI-TPRZ-DODAJ": "Add an item",
  "UI-TPRZ-USUN": "Remove the item",
  "UI-TPRZ-POZYCJA-NR": "Item {n}",
  "UI-TPRZ-UZUPELNIJ": "Add the first item to see the dates.",
  "UI-TPRZ-SPRAWDZ": "Check the data",
  "UI-TPRZ-MIES": "mo.",
  "UI-TPRZ-WERDYKT-PO": "Overdue: {n}",
  "UI-TPRZ-WERDYKT-OK": "Everything on schedule",
  "UI-TPRZ-PRZYPOMNIENIA": "Remind me about overdue inspections",
  "UI-TPRZ-PRZYPOMNIENIA-OPIS": "A browser notification appears once a day when you open the app and something is overdue. It will not arrive while the app is closed: it works offline and has no background schedule.",
  "UI-TPRZ-PRZYPOMNIENIA-ZABLOKOWANE": "The browser has blocked notifications for this site. Allow them in the browser settings and tick the box again.",
  "UI-TPRZ-PRZYPOMNIENIA-BRAK-OBSLUGI": "This browser does not support notifications. The bell on the dashboard shows the number of overdue inspections.",
  "UI-TPRZ-TERMIN": "Next date: {data}",
  "UI-TPRZ-DNI-PRZED": "in {dni} days",
  "UI-TPRZ-DNI-DZIS": "today",
  "UI-TPRZ-DNI-PO": "{dni} days overdue",
  "UI-TPRZ-BEZ-TERMINU": "Fill in the date and interval to calculate the date.",
}
