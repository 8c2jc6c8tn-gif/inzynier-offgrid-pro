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

## Druga, głębsza martwa strefa (znane ograniczenie, nienaprawione w tym przykładzie)

[23.09.2026] Źródło: inzynier-szkieletowy-pro (D108). Wizytator odwiedza `ts.isJsxText` — poprawne
dla `<p>tekst</p>`, ale **ślepe na tekst wewnątrz template-literału osadzonego w wyrażeniu JSX**
(`<p>{`${wartosc} dni`}</p>` — cały `{...}` to jeden węzeł `JsxExpression`/`TemplateExpression`,
nigdy `JsxText`). W przeciwieństwie do pułapki `warunek ? [...] : []` wyżej (luka w zasięgu tego,
co skrypt sprawdza), to luka w SAMYM mechanizmie detekcji — żadne rozszerzenie `MIGRATED_MODULES`
jej nie naprawia. Znalezione dodatkowym, osobnym skanem grep, nie samym strażnikiem: 4 prawdziwe,
nieprzetłumaczone miejsca (słowo zaszyte w `` `${x.toFixed(1)} dni` ``), które ten wzorzec strażnika
nigdy by nie złapał, niezależnie od tego, jak kompletna jest lista modułów.

**Status:** udokumentowane jako znane ograniczenie (patrz komentarz w
[`check-i18n-guard.mjs`](check-i18n-guard.mjs)), nie naprawione tutaj. Rozszerzenie o odwiedzanie
`ts.isTemplateExpression`/`ts.isNoSubstitutionTemplateLiteral` wewnątrz `JsxExpression` jest
możliwe, ale wymaga dodatkowego filtra kontekstu rodzica węzła (inaczej fałszywe trafienia na
atrybuty typu `className`/`aria-label` budowane też template-literałami) — projekt adaptujący ten
przykład, który faktycznie pisze tekst UI jako `` `${x} <słowo>` `` w wyrażeniach JSX, powinien albo
rozszerzyć wizytator o ten przypadek, albo polegać na ręcznej czujności przy review dokładnie tego
wzorca.

## Integracja z CI

Krok w jobie `quality`, po `typecheck`, przed `test` — patrz [`../ci/ci.yml`](../ci/ci.yml),
`pnpm check:i18n-guard`. Blokuje merge PR, nie tylko lokalne uruchomienie (git hook wymagałby nowej
zależności typu `husky` — poza zakresem tego przykładu; sama bramka w CI już wypełnia "zapobiega
cofaniu się", bo nic nie mergowane bez przejścia przez nią).

## Druga warstwa: kompilator TypeScript sprawdza, czy klucz istnieje (17.11, dopisek 07.10.2026)

Źródło: `inzynier-offgrid-pro`, zgłoszenie 05.10.2026 (stan `origin/main` `70e7e65`). [`check-i18n-keys.mjs`](check-i18n-keys.mjs) to dosłowna zawartość skryptu źródłowego (434 linii, bez zmian). Pierwsza warstwa (`check-i18n-guard.mjs`, AST) jest szybkim filtrem, a ta jest źródłem prawdy o tym, który parametr dostaje jaką wartość.

**Luka, którą zamyka.** Strażnik AST rozpoznaje `labelKey: "…"` tylko jako zapis właściwości. Wywołanie pozycyjne `wartoscUjemna("kubatura", "Kubatura", v)` przekazuje polski tekst do parametru `labelKey`, a w drzewie składni nie ma tam żadnej nazwy `*Key`. Kompilator milczy, bo typ to `string`, strażnik jest zielony, a EN/RU pokazują `⚠ [Kubatura]` (w źródle trwało to 3 dni).

**Jak działa.**
- Wywoływaną funkcję ustala `getResolvedSignature`, więc aliasy importu, re-eksporty i metody nie mają znaczenia.
- Każdy argument parametru `*Key` i każda właściwość `xKey:` musi mieć wartość będącą istniejącym kluczem słownika PL, EN **i** RU. Sam format klucza nie wystarcza (literówka `POLE-KUBATRA` ma poprawny format).
- Wartość wyliczana jest z typu (literał, `const`, `as const`, unia), a gdy to nie wystarcza, przez śledzenie źródeł: `let` ze wszystkimi przypisaniami, stałe importowane, `TABELA[x]`, `.find(…).pole`, pętle `for … of`, `Object.entries`, `?:`, `??`, szablony z `.toUpperCase()` i wywołania funkcji.
- Klucz zbudowany z parametru funkcji jest wyliczany osobno w każdym miejscu wywołania (do 4 poziomów).
- **Wartość niewyliczalna to błąd, nigdy ciche „OK”**, chyba że obejmuje ją jedna z trzech jawnych, liczonych w raporcie reguł: (P) goły parametr, którego argumenty są sprawdzane w miejscach wywołań, (D) odczyt `x.fooKey`, o ile każdy zapis `fooKey:` też jest sprawdzany, (W) wyjątek z powodem i ręcznie wypisanymi kluczami, które nadal są sprawdzane w słownikach. Wyjątek, który przestał być potrzebny, jest błędem.
- Raport mówi, ile wartości sprawdzono i którą regułą każdą uzasadniono (to realizuje wymóg „strażnik raportuje swój zasięg”).

**Co jest specyficzne dla projektu źródłowego (zmień przy adaptacji):** ścieżki słowników (`lib/i18n/dictionary-{pl,en,ru}.ts`, `lib/i18n/ui/index.ts` z krotką `czesciUi`), zakres skanu (`lib/`, `app/`, `components/`), lista `NIE_I18N` (nazwy `*Key`, które nie są kluczami tłumaczeń) i tabela `WYJATKI`.

**Znane granice (z opisu źródła):** funkcja bez wywołań w zakresie skanu nie jest sprawdzana; śledzenie ma ograniczoną głębokość; wyjątek (W) wymaga ręcznej aktualizacji listy kluczy przy zmianie danych (nowa pozycja bez wpisu na liście nie zostanie zgłoszona). Test negatywny w źródle: literówka w stałej, alias importu, re-eksport, gałąź warunku i szablon z parametrem zostały zgłoszone na tymczasowej sondzie. Docelowo typ `I18nKey` jako unia kluczy słownika przenosi to sprawdzenie do samego `tsc` i czyni skrypt zbędnym.

**Kolejność w CI:** `check-i18n-guard.mjs` (szybki), potem `check-i18n-keys.mjs` (buduje program TypeScript, wolniejszy), w jednym kroku `check:i18n-guard` w jobie `quality`.

**Sprawdzenie w runtime (poza skryptem).** Skan statyczny nie widzi przepływu wartości. Przed uznaniem migracji za domkniętą zbierz jednorazowo wyniki silników z istniejących testów (`Warning`, `assumptions`, skróty widżetów) i rozwiń je przez `t()` w każdym języku: brakujący klucz, znaki narodowe w nie-PL i tekst identyczny z PL to sygnały błędu. W źródle taki przebieg wykrył regresję, której skan statyczny nie widział.
