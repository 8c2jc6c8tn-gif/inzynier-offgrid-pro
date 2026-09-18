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
  "WARTOSC-POZA-ZAKRESEM": 'Wartość pola "{label}" musi być z przedziału {min}–{max}.',
  "POZYCJA-NIEDODATNIA": 'Zaznaczona pozycja "{label}" musi mieć moc większą od zera.',
  "BRAK-ZAZNACZONYCH": "Nie zaznaczono żadnego odbiornika krytycznego.",
  "POZYCJA-WARTOSC-DOMYSLNA": '"{label}" przyjęte z domyślną mocą {value} W (nie edytowane).',
  "COP-POZA-ZAKRESEM": "COP musi być z przedziału {min}–{max} dla typowej pompy ciepła.",
  "MOC-CIEPLNA-NIETYPOWO-WYSOKA":
    "To nietypowo wysoka wartość mocy cieplnej — sprawdź, czy nie pomyliłeś jednostek (kW, nie W).",
  "COP-ZALEZY-OD-TEMPERATURY":
    "COP zależy od temperatury zewnętrznej — podana wartość dotyczy tylko aktualnych warunków, nie jest " +
    "stała przez cały sezon (patrz krzywa COP producenta).",
  "DANE-KLIMATYCZNE-TRYB-OFFLINE":
    "Dane nasłonecznienia/strefy klimatycznej wymagają docelowo integracji z PVGIS/PVWatts (online) — " +
    "w tym kroku dostępny jest tylko tryb offline z ręcznym wpisaniem temperatury minimalnej.",
  "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM": "Liczba domowników musi być z zakresu {min}–{max}.",
  "CWU-ZAKRES-ORIENTACYJNY":
    "Zakres {min}–{max} l C.W.U. na osobę na dobę — wartość orientacyjna ze źródła, nie zmierzona.",
  "ZAPOTRZEBOWANIE-UJEMNE": "Zapotrzebowanie dobowe nie może być ujemne.",
  "SPRAWNOSC-PROCENT-POZA-ZAKRESEM": "Sprawność falownika musi być z przedziału 0–100%.",
  "DOD-POZA-ZAKRESEM": "DoD (głębokość rozładowania) musi być z przedziału 0–100%.",
  "WPLYW-NA-MAGAZYN":
    "Przy {dni} dniach autonomii i wpisanych parametrach magazyn potrzebuje ok. {pojemnosc} kWh " +
    "pojemności użytecznej (szacunek — pełne wyliczenie: Moduł 4, Ekran 1).",
  "COS-FI-POZA-ZAKRESEM": "Współczynnik mocy (cos φ) musi być z przedziału 0–1.",
  "MOC-POZORNA-INFO":
    "Waty na tabliczce znamionowej to nie cała historia — to {va} VA, nie {w} W, realnie obciąża falownik.",
  "SZACUNEK-MAGAZYNU-WYMAGA-DANYCH":
    "Szacunek wpływu na wielkość magazynu wymaga wpisania zapotrzebowania dobowego, sprawności falownika i DoD.",
} as const

export type KluczTlumaczenia = keyof typeof dictionaryPl
