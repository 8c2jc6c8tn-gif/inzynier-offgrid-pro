// English texts of ./m14-przejscie-ekrany.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-przejscie-ekrany"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-RYZ-TYTUL": "Risks of disconnecting from the grid",
  "UI-RYZ-OPIS":
    "Ten risks of full disconnection (scenario D), and three more for a business. Tick each one once you have checked it. The mark next to an item says how certain it is: ✅ law, physics or practice beyond doubt; 🔎A several consistent sources; 🔎B a single source or expert knowledge. M14, screen D9 / F9.",
  "UI-RYZ-SKUTEK": "Consequence: {tekst}",
  "UI-RYZ-CO-ZROBIC": "What to do: {tekst}",
  "UI-RYZ-WSZYSTKIE": "All risks checked",
  "UI-RYZ-NASTEPNY": "Next step:",
  "UI-RYZ-LINK-PROCEDURA": "procedure for giving up the grid connection",
  "UI-RYZ-KROKI-ODWRACALNE": "— steps 1–4 are reversible; start with an island test through a full winter.",
  "UI-RYZ-SPRAWDZONO": "{n} of {wszystkie} risks checked",
  "UI-REZ-TYTUL": "How to give up the grid connection",
  "UI-REZ-OPIS":
    "Seven steps in an order that matters. Steps 1–4 can be undone, 5–7 cannot. At the bottom — what returning to the grid would cost. M14, screen D10 / F10.",
  "UI-REZ-ODWRACALNE": "(reversible)",
  "UI-REZ-NIEODWRACALNE": "(irreversible)",
  "UI-REZ-FIRMA": "Business: {tekst}",
  "UI-REZ-KOSZT-POWROTU": "Cost of returning to the grid",
  "UI-REZ-KOSZT-OPIS":
    "K ≈ DSO connection fee rate [PLN/kW] × connection capacity — groups IV–VI, standard distance. You will find the rate in your DSO's tariff (the chapter on connection fees); the app does not have it yet.",
  "UI-REZ-STAWKA": "Connection fee rate",
  "UI-REZ-J-ZL-KW": "PLN/kW",
  "UI-REZ-MOC": "Connection capacity",
  "UI-REZ-ODLEGLOSC": "Distance from the grid",
  "UI-REZ-ODL-TAK": "Within the standard distance from the DSO tariff",
  "UI-REZ-ODL-NIE": "Further than the standard distance",
  "UI-REZ-UZUPELNIJ": "Complete the data",
  "UI-REZ-POWROT": "Return to the grid",
  "UI-REZ-WYCENA-INDYW": "Individual DSO quote",
  "UI-REZ-OK-NETTO": "approx. {kwota} net",
  "UI-REZ-PRZED-KROKIEM-5": "Before step 5:",
  "UI-REZ-LINK-RYZYKA": "disconnection risks",
  "UI-REZ-LINK-PRZELACZNIK": "grid/island switch",
}
