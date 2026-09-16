# PROPOZYCJA dla `new-app-standards` — Referencyjny CI (11.2/11.5) i mechanizm strażniczy i18n (17.9)

> **Status: propozycja, nie standard.** Ten plik to pełny szkic roboczy powiązany ze zgłoszeniem w
> `docs/wklad-do-standardu.md` (wpis z 16.09.2026). **Nie jest częścią `docs/standards/`** i nie ma
> mocy obowiązującej — konsolidacja i decyzja o promocji do faktycznej reguły standardu dzieje się
> wyłącznie w sesji pracującej bezpośrednio nad repo `new-app-standards` (GOD BOOK Część Y.8). Ten
> plik istnieje wyłącznie po to, żeby ta przyszła sesja miała gotowy, sprawdzony materiał do oceny,
> zamiast odtwarzać go od zera.

**Czym to różni się od reszty zgłoszeń w `docs/wklad-do-standardu.md`:** poprzednie zgłoszenia
(logowanie, i18n-strategia, AI w produkcie) sygnalizowały **brakującą regułę**. Tu reguła już
istnieje w standardzie (11.2/11.5 dla CI, 17.9 dla mechanizmu strażniczego i18n) — problem jest inny:
standard mówi **co** ma być prawdą ("CI uruchamia audyt podatności", "mechanizm strażniczy wykrywa
nowy twardy string"), ale nie daje **żadnego konkretnego, sprawdzonego przykładu**, jak to zrobić.
Bez przykładu każdy projekt rodziny wymyśli inny, prawdopodobnie niekompletny wariant od zera —
tak jak stało się w tym projekcie: 11.5 istniało w standardzie od 15.09.2026, ale realny plik
`.github/workflows/` powstał dopiero dzień później, na wyraźne pytanie właściciela projektu.

Stack tego projektu (Next.js/TypeScript/pnpm) jest specyficzny — **transferowalny jest kształt
decyzji, nie dosłowny YAML**. Sekcje niżej rozdzielają jedno od drugiego.

---

## Część 1 — CI referencyjne (11.2 + 11.5)

### Kształt (transferowalny do każdego stacku)

- **Dwa niezależne joby, nie jeden.** `quality` (lint/typecheck/test/build) i `dependency-audit`
  (skaner podatności) — rozdzielone celowo. Podatność w transitive dependency dev-only nie ma
  blokować mergowania niezwiązanego fixa lintera, i odwrotnie. Jeden monolityczny job myli sygnał:
  czerwony status nie mówi, co konkretnie jest zepsute, bez wchodzenia w logi.
- **Bramka na `high`/`critical`, nie na wszystko.** `moderate`/`low` nie blokują merge — inaczej CI
  byłoby czerwone praktycznie zawsze (w tym projekcie: dziesiątki `moderate` w normalnym stanie
  ekosystemu npm), co uczy zespół ignorować czerwony status, dokładnie odwrotny efekt od zamierzonego.
- **Zanim włączysz bramkę, sprawdź, czy przechodzi — nie włączaj "na wiarę".** W tym projekcie
  pierwsze uruchomienie realnego audytu (`pnpm audit --audit-level=high`) **nie przechodziło**: 22
  podatności `high`. Włączenie bramki bez tego sprawdzenia zablokowałoby każdy PR od zera, w tym
  niezwiązane z bezpieczeństwem. Kolejność: (1) uruchom audyt ręcznie, (2) napraw, co się da w
  ramach już zadeklarowanych zakresów wersji (żadnych nowych ryzyk major), (3) dodaj bramkę do CI
  z czystym stanem jako punktem odniesienia.
- **Napraw, nie obniżaj progu.** Rozstrzygnięcie z tej sesji: **nie** dodano wyjątku/allowlisty/
  `--production`. Sprawdzono każdą z 22 pozycji: 1 była w zależności bezpośredniej (`postcss`, miał
  zainstalowaną starszą wersję niż łatka, mimo że zakres semver już to dopuszczał — wystarczyło
  `pnpm update postcss`); reszta to zależności przechodnie przez 2 pakiety dev (`eslint-config-next`,
  `shadcn`) — `pnpm update` bez argumentu (w granicach już zadeklarowanych zakresów `^`) podciągnął
  je do najnowszych dopuszczalnych wersji i to rozwiązało wszystkie pozostałe. Wynik: 0 podatności
  wszystkich poziomów (nie tylko `high`) — sprawdzone pełnym `pnpm audit` bez filtra, nie tylko
  filtrowanym.
- **Zweryfikuj po zmianie zależności, nie tylko sam audyt.** Bump wielu pakietów naraz (nawet w
  granicach deklarowanych zakresów) ma realną szansę złamać coś — pełny łańcuch
  lint→typecheck→test→build musi przejść PO aktualizacji, zanim się ją commituje.

### Plik referencyjny (Next.js/pnpm/GitHub Actions — konkretny przykład, do adaptacji)

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Lint, typecheck, test, build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  dependency-audit:
    name: Dependency vulnerability audit (11.5)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm audit --audit-level=high
```

Odpowiedniki dla innych stacków rodziny: `npm audit --audit-level=high` / `pip-audit` (Python) —
kształt (dwa joby, próg `high`, weryfikacja przed włączeniem bramki) jest tym, co się przenosi, nie
konkretna komenda.

---

## Część 2 — Mechanizm strażniczy i18n (17.9)

### Problem, który konkretny przykład rozwiązuje

17.9 mówi: "Mechanizm strażniczy (lint/hook wykrywający nowy twardy string) zapobiega cofaniu się w
trakcie dalszej pracy" — ale nie mówi, jak go zbudować. Naiwne podejście (regex na "czy plik zawiera
polskie znaki") ma dwa realne problemy: (a) łapie fałszywe trafienia w polach, które **świadomie nie
podlegają** i18n (`technicalMessage` — komunikat deweloperski; `formula` symboliczna; `field`/`code`
— identyfikatory, nie tekst dla użytkownika), (b) migracja jest stopniowa (17.9) — reguła musi
sprawdzać TYLKO moduły już zmigrowane, nie blokować pracy nad resztą, która świadomie jeszcze zwraca
gotowy tekst.

### Rozwiązanie: AST, nie regex, plus explicit allowlist zmigrowanych modułów

```js
// scripts/check-i18n-guard.mjs — pełna wersja w tym repo, tu szkielet decyzji
import ts from "typescript"

const MIGRATED_MODULES = [
  "lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze",
  // dopisz nowy moduł TU, w tej samej sesji, w której go migrujesz — allowlist nie jest
  // wykrywana automatycznie, guard nie chroni modułu, którego tu nie ma.
]

// Dla każdego pliku warnings.ts/calculator.ts modułu z listy: parsuje AST (ts.createSourceFile)
// i blokuje:
//  1. `message: "gotowy tekst"` (string literal) — pole opcjonalne/@deprecated po migracji.
//  2. Element tablicy `assumptions` będący gołym stringiem — także wtedy, gdy tablica jest
//     za `? :`/`??` (warunkowe budowanie assumptions to normalny, częsty wzorzec, nie edge case).
```

**Pułapka złapana przy budowie (warta zapisania, nie tylko wyniku):** pierwsza wersja sprawdzała
tylko bezpośrednie przypisanie `const assumptions = [...]` (parent tablicy = `VariableDeclaration`).
**Nie wykrywała** `const assumptions = warunek ? [...] : []` — czyli akurat tego wzorca, który
faktycznie występuje w kodzie (warunkowe assumptions to normalna rzecz, nie brzegowy przypadek).
Złapane przez ręczny test przed wdrożeniem (wstrzyknięcie regresji do prawdziwego pliku, sprawdzenie
że guard ją złapał, przywrócenie oryginału) — **nie przez samo napisanie kodu**. Wniosek dla innej
sesji budującej to od zera: **zawsze przetestuj guard na prawdziwym pliku z prawdziwym wzorcem
kodu tego projektu, nie na wymyślonym przykładzie** — syntetyczny przykład może przypadkowo trafić
akurat w kod ścieżki, którą łatwo napisać poprawnie.

### Integracja z CI

Krok w jobie `quality`, po `typecheck`, przed `test` — blokuje merge PR, nie tylko lokalne
uruchomienie (git hook wymagałby nowej zależności typu `husky`, poza zakresem tego zgłoszenia; sama
bramka w CI już wypełnia "zapobiega cofaniu się", bo nic nie mergowane bez przejścia przez nią).

---

## PROMPT — gotowy do skopiowania i przekazania dowolnej innej sesji/projektowi

> Skrócony, samodzielny blok — do wklejenia jako pierwsza wiadomość nowej sesji AI budującej CI/
> mechanizm strażniczy od zera w innym projekcie rodziny (albo poza nią). Pełne uzasadnienia i
> przykład kodu są wyżej.

```
PROMPT: CI (lint/typecheck/test/build + audyt podatności) i mechanizm strażniczy i18n

Buduję CI dla tego projektu. Wymagania:

1. Dwa niezależne joby w CI: "quality" (lint, typecheck, testy, build) i "dependency-audit"
   (skaner podatności zależności twojego menedżera pakietów: `npm audit`/`pnpm audit`/`pip-audit`/
   itd., z progiem odcięcia na high/critical, --audit-level=high albo odpowiednik).
2. PRZED włączeniem bramki audytu: uruchom go ręcznie. Jeśli nie przechodzi, NIE obniżaj progu i
   NIE dodawaj wyjątku od razu — sprawdź każdą pozycję, napraw to, co się da w granicach już
   zadeklarowanych zakresów wersji (bump w ramach ^/~, nie zmiana major), włącz bramkę tylko na
   czystym stanie. Po każdej zmianie zależności: pełny lint/typecheck/test/build musi przejść.
3. Jeśli projekt ma już migrację i18n w toku (klucze tłumaczeń zamiast gotowego tekstu w warstwie
   domenowej, migrowane moduł-po-module, nie big bang): zbuduj skrypt weryfikujący AST (nie regex)
   plików domenowych modułów JUŻ zmigrowanych (explicit allowlist, nie automatyczna detekcja),
   który blokuje nowy hardcodowany tekst w polach user-facing (typowo: "message"/"assumptions" czy
   ich odpowiedniki w tym stacku) — ale NIE w polach technicznych (komunikat deweloperski, wzór
   symboliczny, kod/identyfikator). Zanim uznasz skrypt za gotowy: wstrzyknij prawdziwą regresję do
   prawdziwego, już zmigrowanego pliku (nie do wymyślonego przykładu) i sprawdź, że skrypt ją
   złapie — szczególnie dla wzorców warunkowych (`warunek ? tekst1 : tekst2`), nie tylko
   bezpośredniego przypisania.
4. Wpnij oba (audyt + guard i18n, jeśli dotyczy) jako kroki w CI, gating merge PR.
```
