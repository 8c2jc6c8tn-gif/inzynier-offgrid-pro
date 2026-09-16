# Mechanizm strażniczy i18n (17.9)

Źródło: `inzynier-offgrid-pro`, zgłoszenie 16.09.2026.

## Problem, który konkretny przykład rozwiązuje

17.9 mówi: "Mechanizm strażniczy (lint/hook wykrywający nowy twardy string) zapobiega cofaniu się w
trakcie dalszej pracy" — ale nie mówi, jak go zbudować. Naiwne podejście (regex na "czy plik zawiera
polskie znaki") ma dwa realne problemy: (a) łapie fałszywe trafienia w polach, które **świadomie nie
podlegają** i18n (`technicalMessage` — komunikat deweloperski; `formula` symboliczna; `field`/`code`
— identyfikatory, nie tekst dla użytkownika), (b) migracja jest stopniowa (17.9) — reguła musi
sprawdzać TYLKO moduły już zmigrowane, nie blokować pracy nad resztą, która świadomie jeszcze zwraca
gotowy tekst.

## Rozwiązanie: AST, nie regex, plus explicit allowlist zmigrowanych modułów

[`check-i18n-guard.mjs`](check-i18n-guard.mjs) to dosłowna, pełna zawartość skryptu z projektu
źródłowego — nie szkielet, cały działający plik, przetestowany (patrz pułapka niżej) przed
wdrożeniem. `MIGRATED_MODULES`/`FILES_TO_CHECK`/nazwy pól (`message`/`assumptions`) są specyficzne
dla tego projektu — dostosuj do własnego kontraktu `Warning`/`CalcResult` (03/04).

## Pułapka złapana przy budowie (warta zapisania, nie tylko wyniku)

Pierwsza wersja sprawdzała tylko bezpośrednie przypisanie `const assumptions = [...]` (parent
tablicy = `VariableDeclaration`). **Nie wykrywała** `const assumptions = warunek ? [...] : []` —
czyli akurat tego wzorca, który faktycznie występuje w kodzie (warunkowe assumptions to normalna
rzecz, nie brzegowy przypadek). Złapane przez ręczny test przed wdrożeniem (wstrzyknięcie regresji
do prawdziwego pliku, sprawdzenie że guard ją złapał, przywrócenie oryginału) — **nie przez samo
napisanie kodu**.

**Wniosek dla innej sesji budującej to od zera:** zawsze przetestuj guard na prawdziwym pliku z
prawdziwym wzorcem kodu tego projektu, nie na wymyślonym przykładzie — syntetyczny przykład może
przypadkowo trafić akurat w kod ścieżki, którą łatwo napisać poprawnie.

## Integracja z CI

Krok w jobie `quality`, po `typecheck`, przed `test` — patrz [`../ci/ci.yml`](../ci/ci.yml),
`pnpm check:i18n-guard`. Blokuje merge PR, nie tylko lokalne uruchomienie (git hook wymagałby nowej
zależności typu `husky` — poza zakresem tego przykładu; sama bramka w CI już wypełnia "zapobiega
cofaniu się", bo nic nie mergowane bez przejścia przez nią).
