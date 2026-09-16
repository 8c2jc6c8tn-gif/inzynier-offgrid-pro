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

### Plik referencyjny — **dosłowna, pełna zawartość** `.github/workflows/ci.yml` tego repo

Nie szkielet, nie skrócona wersja "do adaptacji" — to jest cały plik, 1:1, dokładnie taki, jaki
faktycznie działa w tym projekcie i gatuje merge na PR-ach (patrz `pnpm check:i18n-guard` w środku
`quality` — to jest ta sama bramka co Część 2 niżej, wpięta jako jeden z kroków, nie osobny,
opisowy przykład):

```yaml
name: CI

# docs/standards/11-ci-deployment.md, 11.2 + 11.5 — sygnał o awarii ma być jawny w repo (PR),
# nie tylko pośrednio przez build hostingu. Dwa niezależne joby: jakość kodu (11.2) i audyt
# podatności zależności (11.5) — rozdzielone, żeby znana, nienaprawialna od razu podatność
# nie blokowała np. mergowania czystego fixa lintera, i odwrotnie.

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
      - run: pnpm check:i18n-guard
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

      # Poziom "high" — krytyczne/wysokie w zależności bezpośredniej blokują merge (11.5).
      # Świadomie zaakceptowane wyjątki: odnotować w docs/memory.md z powodem, nie wyciszać
      # tutaj bez śladu.
      - run: pnpm audit --audit-level=high
```

Odpowiedniki dla innych stacków rodziny: `npm audit --audit-level=high` / `pip-audit` (Python) —
komenda `run:` się zmienia, cała struktura (dwa joby, kroki, `pnpm check:i18n-guard` w środku
`quality` jeśli projekt ma i18n) zostaje identyczna.

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

**Dosłowna, pełna zawartość** `scripts/check-i18n-guard.mjs` tego repo — nie szkielet, cały działający
plik, przetestowany (patrz pułapka niżej) przed wdrożeniem:

```js
#!/usr/bin/env node
/**
 * Mechanizm strażniczy i18n — docs/standards/17-i18n.md, 17.9: "Mechanizm strażniczy (lint/hook
 * wykrywający nowy twardy string) zapobiega cofaniu się w trakcie dalszej pracy."
 *
 * Sprawdza WYŁĄCZNIE moduły z listy MIGRATED_MODULES niżej — nie blokuje pozostałych,
 * jeszcze niezmigrowanych modułów (17.9: migracja stopniowa, nigdy big bang; reszta
 * świadomie zwraca gotowy tekst PL, to nie jest regresja, to jeszcze niewykonana praca).
 *
 * Reguła (04.1/17.2 PATCH): domenowa funkcja w zmigrowanym module nigdy nie zwraca gotowego
 * tekstu dla użytkownika — ani jako `Warning.message` (string literal), ani jako element
 * `assumptions` będący gołym stringiem (zamiast `{kod, params?}`). `technicalMessage`/`formula`
 * (symboliczny wzór) i `field`/`code` nie podlegają tej regule — nie są tekstem dla użytkownika.
 *
 * WAŻNE: dopisz ścieżkę modułu do MIGRATED_MODULES w TEJ SAMEJ sesji, w której go migrujesz —
 * inaczej ten skrypt nie chroni nowo zmigrowanego modułu przed regresją.
 */
import ts from "typescript"
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

const MIGRATED_MODULES = [
  "lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze",
]

const FILES_TO_CHECK = ["warnings.ts", "calculator.ts"]

/** @type {{filePath: string, line: number, message: string}[]} */
const violations = []

function isAssumptionsName(name) {
  return name === "assumptions"
}

/**
 * Przeszukuje wyrażenie (np. całą stronę `? :`/`??`) w poszukiwaniu tablic literałów i
 * zgłasza każdy element będący gołym stringiem — nie schodzi w głąb obiektów zagnieżdżonych
 * (`{ kod: "X" }` jest poprawne, "X" jako wartość `kod` to nie jest tekst dla użytkownika).
 */
function findRawStringArrayElements(expr, report) {
  function visit(node) {
    if (ts.isArrayLiteralExpression(node)) {
      for (const element of node.elements) {
        if (ts.isStringLiteralLike(element)) {
          report(element, `element "assumptions" jest gołym stringiem PL — użyj "{kod, params?}" (17.2).`)
        }
      }
      return // nie wchodzimy w elementy tej tablicy głębiej (obsłużone wyżej)
    }
    // Schodzimy tylko przez "przezroczyste" wyrażenia (warunkowe/nawiasy/??), nie w ogóle
    // w głąb dowolnego kodu — żeby nie złapać niezwiązanej tablicy w innym wyrażeniu.
    if (ts.isConditionalExpression(node)) {
      visit(node.whenTrue)
      visit(node.whenFalse)
    } else if (ts.isParenthesizedExpression(node)) {
      visit(node.expression)
    } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) {
      visit(node.left)
      visit(node.right)
    }
  }
  visit(expr)
}

function checkFile(filePath, source) {
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true)

  function report(node, message) {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart())
    violations.push({ filePath, line: line + 1, message })
  }

  function visit(node) {
    // `message: "gotowy tekst"` — pole opcjonalne/@deprecated po migracji, nie ustawiać na nowo.
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "message" &&
      ts.isStringLiteralLike(node.initializer)
    ) {
      report(node, `"message" z gotowym tekstem PL — użyj "i18nKey"/"params" i słownika (17.2).`)
    }

    // `const assumptions = [...]` / `assumptions: [...]` — wartość bindowana pod nazwą
    // "assumptions", zawierająca gdziekolwiek w swoim wyrażeniu (także za `? :`/`??`, np.
    // `input.x === undefined ? [...] : []`) tablicę z gołym stringiem.
    const isAssumptionsBinding =
      (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && isAssumptionsName(node.name.text)) ||
      (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && isAssumptionsName(node.name.text))

    if (isAssumptionsBinding && node.initializer) {
      findRawStringArrayElements(node.initializer, report)
    }

    ts.forEachChild(node, visit)
  }

  visit(sf)
}

for (const moduleDir of MIGRATED_MODULES) {
  for (const file of FILES_TO_CHECK) {
    const filePath = path.join(moduleDir, file)
    if (!existsSync(filePath)) continue // np. moduł bez calculator.ts — pomiń, nie błąd
    checkFile(filePath, readFileSync(filePath, "utf8"))
  }
}

if (violations.length > 0) {
  console.error("Mechanizm strażniczy i18n (17.9) — znaleziono regresję w module już zmigrowanym:\n")
  for (const v of violations) {
    console.error(`  ${v.filePath}:${v.line} — ${v.message}`)
  }
  console.error(
    "\nTo są moduły z MIGRATED_MODULES w scripts/check-i18n-guard.mjs — jeśli to naprawdę nowy,\n" +
      "jeszcze niezmigrowany moduł, usuń go z tej listy, nie ignoruj tego ostrzeżenia.",
  )
  process.exit(1)
}

console.log(`Mechanizm strażniczy i18n (17.9): OK — ${MIGRATED_MODULES.length} zmigrowany(ch) modułów bez regresji.`)
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
