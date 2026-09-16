/**
 * Słownik tłumaczeń — docs/standards/17-i18n.md, 17.1-17.2. Język bazowy treści: polski.
 * Klucze zawsze po angielsku/wielkimi literami z myślnikiem (ta sama konwencja co `Warning.code`
 * dotąd) — to kod, nie treść dla użytkownika (0.7/15.15).
 *
 * Placeholdery `{nazwa}` w wartościach są podstawiane przez `t()` z `params`. Jeden słownik na
 * razie (tylko polski) — gdy pojawi się drugi język, każdy klucz musi mieć odpowiednik w obu
 * słownikach, wymuszane typem (17.1: brakujący klucz = błąd kompilacji, nie cichy fallback).
 *
 * Migracja stopniowa (17.9) — dziś tylko klucze zmigrowanych modułów (patrz docs/memory.md,
 * "Pierwsza implementacja i18n — pilotaż"). Większość modułów nadal zwraca gotowy tekst PL
 * bezpośrednio w `Warning.message`/`assumptions` (pole `string`) — to nie jest błąd, to
 * świadomy, tymczasowy stan przejściowy, nie wolno tu dopisywać kluczy "na przyszłość" bez
 * faktycznej migracji modułu, który ich używa (martwe klucze == dług, nie postęp).
 */
export const dictionaryPl = {
  "WARTOSC-NIEDODATNIA": 'Wartość pola "{label}" musi być większa od zera.',
  "SPRAWNOSC-POZA-ZAKRESEM": "Sprawność musi być liczbą z przedziału (0, 1].",
  "SPRAWNOSC-NISKA": "Podana sprawność jest nietypowo niska — sprawdź, czy nie pomyliłeś jednostek.",
  "MOC-NIETYPOWO-WYSOKA": "To nietypowo wysoka wartość mocy — sprawdź, czy nie pomyliłeś jednostek.",
  "SPRAWNOSC-DOMYSLNA": "Sprawność układu przyjęta jako {efficiency} (wartość domyślna, nie zmierzona).",
} as const

export type KluczTlumaczenia = keyof typeof dictionaryPl
