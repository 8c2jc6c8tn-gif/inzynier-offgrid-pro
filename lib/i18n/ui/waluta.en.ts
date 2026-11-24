// English texts of ./waluta.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./waluta"

export const en: Record<keyof typeof pl, string> = {
  "UI-WAL-TYTUL": "Working currency",
  "UI-WAL-OPIS": "The app shows every result and sum in this currency. Each typed amount remembers its own currency (by default the one from Settings; next to a field you can choose another, e.g. a panel price in euro). An amount in another currency is converted at the NBP average rate, and the conversion is shown next to the field. Changing the currency here does not change typed amounts. Rates and fees from Polish tariffs are in PLN.",
  "UI-WAL-WYBOR": "Currency",
  "UI-WAL-NARZUT": "Rate markup (%)",
  "UI-WAL-NARZUT-OPIS": "Widens the rate like a card or exchange-office spread (rate × (1 + markup)). Default 0 — the plain reference rate.",
  "UI-WAL-KURS-RECZNY": "Own rate: how many {waluta} per 1 PLN (empty = automatic rate)",
  "UI-WAL-ZRODLO": "Automatic rates: National Bank of Poland average rates, table A (api.nbp.pl). The app server fetches and permanently stores them (with history); when you are online the app downloads the current data and saves it on the device — offline it uses the last saved rates (date of last update below). Want a different rate (e.g. your bank's)? Enter it by hand above (optionally add a markup).",
  "UI-WAL-STAN-KURSOW": "Rates of {data} (fetched {pobrano}).",
  "UI-WAL-BRAK-KURSU": "No rate for {waluta} — amounts are shown in PLN. Go online or enter a rate by hand.",
  "UI-WAL-ODSWIEZ": "Refresh rates",
  "UI-WAL-ODSWIEZONO": "Rates refreshed.",
  "UI-WAL-ODSWIEZ-BLAD": "Could not fetch rates (offline?) — using the last saved ones.",
  "UI-WAL-RECZNY-TYLKO": "There is no automatic rate for {waluta} — enter one by hand.",
  "UI-WAL-POLE-WYBOR": "Currency of the amount",
  "UI-WAL-POLE-PRZELICZENIE": "≈ {kwota} (NBP rate of {data})",
  "UI-WAL-POLE-PRZELICZENIE-RECZNY": "≈ {kwota} (your rate from Settings)",
  "UI-WAL-POLE-BRAK-KURSU": "No rate {z} → {na}: go online or enter the rate in Settings. Until then this amount is not counted.",
  "UI-WAL-ROZBICIE": "Typed amounts: {lista}",
}
