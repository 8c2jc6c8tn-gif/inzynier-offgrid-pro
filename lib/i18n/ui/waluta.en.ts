// English texts of ./waluta.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./waluta"

export const en: Record<keyof typeof pl, string> = {
  "UI-WAL-TYTUL": "Display currency",
  "UI-WAL-OPIS": "Result amounts (costs, bills, refunds) are shown in the chosen currency, converted from PLN. The rates and fees in the data are Polish PLN rates — only how the result is displayed changes. Amounts typed in fields are converted when you change the currency, at the rate of the fetch date.",
  "UI-WAL-WYBOR": "Currency",
  "UI-WAL-NARZUT": "Rate markup (%)",
  "UI-WAL-NARZUT-OPIS": "Widens the rate like a card or exchange-office spread (rate × (1 + markup)). Default 0 — the plain reference rate.",
  "UI-WAL-KURS-RECZNY": "Own rate: how many {waluta} per 1 PLN (empty = automatic rate)",
  "UI-WAL-ZRODLO": "Automatic rates: European Central Bank reference rates (api.frankfurter.dev). The app server fetches and permanently stores them (with history); when you are online the app downloads the current data and saves it on the device — offline it uses the last saved rates (date of last update below). Want a different rate (e.g. your bank's)? Enter it by hand above (optionally add a markup).",
  "UI-WAL-STAN-KURSOW": "Rates of {data} (fetched {pobrano}).",
  "UI-WAL-BRAK-KURSU": "No rate for {waluta} — amounts are shown in PLN. Go online or enter a rate by hand.",
  "UI-WAL-ODSWIEZ": "Refresh rates",
  "UI-WAL-ODSWIEZONO": "Rates refreshed.",
  "UI-WAL-ODSWIEZ-BLAD": "Could not fetch rates (offline?) — using the last saved ones.",
  "UI-WAL-RECZNY-TYLKO": "There is no automatic rate for {waluta} — enter one by hand.",
  "UI-WAL-PRZELICZONO-ECB": "Amounts in the fields were converted from {z} to {na} at the European Central Bank rate (Frankfurter) of {data}{narzut}.",
  "UI-WAL-PRZELICZONO-RECZNY": "Amounts in the fields were converted from {z} to {na} at your own rate{narzut}.",
  "UI-WAL-NARZUT-DOPISEK": ", with a {narzut}% markup",
}
