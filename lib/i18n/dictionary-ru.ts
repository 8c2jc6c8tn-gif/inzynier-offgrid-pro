/**
 * Słownik tłumaczeń — rosyjski. Klucze i placeholdery `{nazwa}` muszą dokładnie odpowiadać
 * `dictionary-pl.ts` — `satisfies Record<KluczTlumaczenia, string>` niżej wymusza to typem
 * (brakujący/dodatkowy klucz = błąd kompilacji, nie cichy fallback, docs/standards/17-i18n.md 17.1).
 */
import type { KluczTlumaczenia } from "./dictionary-pl"

export const dictionaryRu = {
  "WARTOSC-NIEDODATNIA": 'Значение поля "{label}" должно быть больше нуля.',
  "SPRAWNOSC-POZA-ZAKRESEM": "КПД должен быть числом в диапазоне (0, 1].",
  "SPRAWNOSC-NISKA": "Указанный КПД необычно низкий — проверьте, не перепутали ли вы единицы измерения.",
  "MOC-NIETYPOWO-WYSOKA": "Это необычно высокое значение мощности — проверьте, не перепутали ли вы единицы измерения.",
  "SPRAWNOSC-DOMYSLNA": "КПД системы принят равным {efficiency} (значение по умолчанию, не измерено).",
} satisfies Record<KluczTlumaczenia, string>
