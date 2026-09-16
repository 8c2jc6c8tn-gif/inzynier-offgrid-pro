/**
 * Słownik tłumaczeń — angielski. Klucze i placeholdery `{nazwa}` muszą dokładnie odpowiadać
 * `dictionary-pl.ts` — `satisfies Record<KluczTlumaczenia, string>` niżej wymusza to typem
 * (brakujący/dodatkowy klucz = błąd kompilacji, nie cichy fallback, docs/standards/17-i18n.md 17.1).
 */
import type { KluczTlumaczenia } from "./dictionary-pl"

export const dictionaryEn = {
  "WARTOSC-NIEDODATNIA": 'The value of "{label}" must be greater than zero.',
  "SPRAWNOSC-POZA-ZAKRESEM": "Efficiency must be a number in the range (0, 1].",
  "SPRAWNOSC-NISKA": "The entered efficiency is unusually low — check that you haven't mixed up units.",
  "MOC-NIETYPOWO-WYSOKA": "This is an unusually high power value — check that you haven't mixed up units.",
  "SPRAWNOSC-DOMYSLNA": "System efficiency assumed as {efficiency} (default value, not measured).",
} satisfies Record<KluczTlumaczenia, string>
