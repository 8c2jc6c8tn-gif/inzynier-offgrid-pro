#!/usr/bin/env node
/**
 * Mechanizm strażniczy i18n — docs/standards/17-i18n.md, 17.9: "Mechanizm strażniczy (lint/hook
 * wykrywający nowy twardy string) zapobiega cofaniu się w trakcie dalszej pracy."
 *
 * Sprawdza WYŁĄCZNIE moduły z listy MIGRATED_MODULES niżej — nie blokuje pozostałych,
 * jeszcze niezmigrowanych modułów (17.9: migracja stopniowa, nigdy big bang; reszta
 * świadomie zwraca gotowy tekst PL, to nie jest regresja, to jeszcze niewykonana praca).
 * [26.09.2026] Migracja domknięta — każdy moduł z plikiem silnika jest na liście, a skrypt
 * zatrzymuje się także na module spoza niej (sprawdzenie kompletności na końcu pliku).
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
import { readFileSync, existsSync, readdirSync } from "node:fs"
import path from "node:path"

const MIGRATED_MODULES = [
  "lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze",
  "lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia",
  "lib/core/modules/ogrzewanie/cop-pompy-ciepla",
  "lib/core/modules/lokalizacja/lokalizacja-i-klimat",
  "lib/core/modules/lokalizacja/geometria-slonca",
  "lib/core/modules/lokalizacja/skaner-dzialki",
  "lib/core/modules/lokalizacja/analiza-zacienienia",
  "lib/core/modules/lokalizacja/orientacja-powierzchni",
  "lib/core/modules/zapotrzebowanie/liczba-domownikow",
  "lib/core/modules/zapotrzebowanie/dni-autonomii",
  "lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi",
  "lib/core/modules/baterie/chlodzenie-latem",
  "lib/core/modules/baterie/cold-c-rate",
  "lib/core/modules/baterie/cold-cranking-amps",
  "lib/core/modules/baterie/detekcja-doziemienia",
  "lib/core/modules/baterie/detekcja-zwarcia-efuse",
  "lib/core/modules/baterie/dobor-bezpiecznika-dc",
  "lib/core/modules/baterie/dobor-pojemnosci",
  "lib/core/modules/baterie/grzalki-bms-mroz",
  "lib/core/modules/baterie/kalibracja-soc",
  "lib/core/modules/baterie/koniec-ladowania",
  "lib/core/modules/baterie/long-term-storage",
  "lib/core/modules/baterie/mixing-rownolegle",
  "lib/core/modules/baterie/modul-ev",
  "lib/core/modules/baterie/napiecie-systemowe",
  "lib/core/modules/baterie/obwod-precharge",
  "lib/core/modules/baterie/pobor-wlasny-bms",
  "lib/core/modules/baterie/ochrona-wilgoc",
  "lib/core/modules/baterie/oplacalnosc-magazynu",
  "lib/core/modules/baterie/pozycjonowanie-ogniw",
  "lib/core/modules/baterie/second-life",
  "lib/core/modules/baterie/slabe-ogniwo",
  "lib/core/modules/baterie/soh-per-ogniwo",
  "lib/core/modules/baterie/starzenie-degradacja",
  "lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe",
  "lib/core/modules/baterie/topologia-bms",
  "lib/core/modules/baterie/vehicle-to-home",
  "lib/core/modules/okablowanie/analiza-zwarciowa",
  "lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika",
  "lib/core/modules/okablowanie/dobor-izolacji-kabla",
  "lib/core/modules/okablowanie/dobor-mocy-falownika",
  "lib/core/modules/okablowanie/dobor-przekroju-kabla",
  "lib/core/modules/okablowanie/glowna-szyna-wyrownawcza",
  "lib/core/modules/okablowanie/laczenie-cu-al",
  "lib/core/modules/okablowanie/monitorowanie-izolacji-imd",
  "lib/core/modules/okablowanie/normy-i-certyfikaty",
  "lib/core/modules/okablowanie/ochrona-odwrotna-polaryzacja",
  "lib/core/modules/okablowanie/ochrona-przepieciowa-spd",
  "lib/core/modules/okablowanie/ocena-ryzyka-crl",
  "lib/core/modules/okablowanie/optymalizacja-trasy-kabla",
  "lib/core/modules/okablowanie/pomiary-powykonawcze",
  "lib/core/modules/okablowanie/przepust-powietrza",
  "lib/core/modules/okablowanie/projekt-uziemienia",
  "lib/core/modules/okablowanie/string-box",
  "lib/core/modules/okablowanie/zlacza-mc4",
  "lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne",
  "lib/core/modules/okablowanie/wylaczniki-nadpradowe-dc",
  "lib/core/modules/okablowanie/wylaczniki-rcd",
  "lib/core/modules/pv/dopasowanie-tablicy-falownika",
  "lib/core/modules/pv/konfigurator-stringow",
  "lib/core/modules/pv/napor-wiatru",
  "lib/core/modules/pv/niedopasowanie-paneli",
  "lib/core/modules/pv/ochrona-stringow",
  "lib/core/modules/pv/panele-bifacjalne",
  "lib/core/modules/pv/straty-okablowanie-dc",
  "lib/core/modules/pv/straty-zlaczki-mc4",
  "lib/core/modules/pv/stress-test-mppt",
  "lib/core/modules/pv/wplyw-temperatury",
  "lib/core/modules/pv/zacienienie-diody-bocznikujace",
  "lib/core/modules/zapotrzebowanie/agregat-pradotworczy",
  "lib/core/modules/zapotrzebowanie/bojler-cwu",
  "lib/core/modules/zapotrzebowanie/bufor-rozbudowe",
  "lib/core/modules/zapotrzebowanie/load-shedding",
  "lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika",
  "lib/core/modules/zapotrzebowanie/profil-astronomiczny",
  "lib/core/modules/zapotrzebowanie/przetwornice-dcdc",
  "lib/core/modules/zapotrzebowanie/sezonowosc",
  "lib/core/modules/ogrzewanie/bufor-ciepla",
  "lib/core/modules/ogrzewanie/infiltracja-powietrza",
  "lib/core/modules/ogrzewanie/kociol-elektryczny",
  "lib/core/modules/ogrzewanie/koszty-ogrzewania",
  "lib/core/modules/ogrzewanie/obciazenie-cieplne",
  "lib/core/modules/ogrzewanie/zapotrzebowanie-co-cwu",
  "lib/core/modules/ogrzewanie/mostki-termiczne",
  "lib/core/modules/ogrzewanie/optymalizacja-izolacji",
  "lib/core/modules/ogrzewanie/pojemnosc-cieplna",
  "lib/core/modules/ogrzewanie/pompy-cyrkulacyjne",
  "lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia",
  "lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla",
  "lib/core/modules/ogrzewanie/wspolne",
  "lib/core/modules/ogrzewanie/dystrybucja-ciepla",
  "lib/core/modules/ogrzewanie/sterowanie-strefowe",
  "lib/core/modules/ogrzewanie/zasobnik-cwu",
  "lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow",
  "lib/core/modules/montaz-baterii/demontaz-pakietu",
  "lib/core/modules/montaz-baterii/gestosc-elektrolitu",
  "lib/core/modules/montaz-baterii/montaz-mechaniczny",
  "lib/core/modules/montaz-baterii/ocena-zasiarczenia",
  "lib/core/modules/montaz-baterii/pierwsze-uruchomienie",
  "lib/core/modules/montaz-baterii/podlaczenie-bms",
  "lib/core/modules/montaz-baterii/ratowanie-ogniwa",
  "lib/core/modules/montaz-baterii/sekwencja-montazu",
  "lib/core/modules/montaz-baterii/weryfikacja-ogniw",
  "lib/core/modules/montaz-baterii/ocena-zuzycia",
  "lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym",
  "lib/core/modules/bezpieczenstwo/ups-krytyczny",
  "lib/core/modules/kalkulator-mobilny/tryb-uproszczony",
  "lib/core/modules/pv/ryzyko-pid",
  "lib/core/modules/pv/mikropekniecia-termiczne",
  "lib/core/modules/pv/powloki-antyrefleksyjne",
  "lib/core/modules/pv/technologie-paneli",
  "lib/core/modules/pv/mikroinwertery-vs-centralny",
  "lib/core/modules/pv/warunki-nadmorskie-pyliste",
  "lib/core/modules/pv/kat-i-azymut",
  "lib/core/modules/pv/wschod-zachod",
  "lib/core/modules/pv/zloty-srodek",
  "lib/core/modules/pv/liczba-paneli",
  "lib/core/modules/pv/tracker-vs-staly",
  "lib/core/modules/pv/typ-montazu",
  "lib/core/modules/kalkulator-mobilny/dobor-regulatora-pwm-mppt",
  "lib/core/modules/kalkulator-mobilny/dni-bez-slonca",
  "lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem",
  "lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje",
  "lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje",
  "lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio",
  "lib/core/modules/kalkulator-mobilny/panel-do-stacji-zasilania",
  "lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie",
  "lib/core/modules/kalkulator-mobilny/gniazdo-zapalniczki",
  "lib/core/modules/kalkulator-mobilny/ratowanie-akumulatora-maly",
  "lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper",
  "lib/core/modules/kalkulator-mobilny/ladowanie-w-garazu",
  "lib/core/modules/kalkulator-mobilny/kable-bezpieczniki-male",
  "lib/core/modules/kalkulator-mobilny/akumulator-samochodowy",
  "lib/core/modules/kalkulator-mobilny/mam-akumulator",
  "lib/core/modules/kalkulator-mobilny/agregat-paliwo",
  "lib/core/modules/kalkulator-mobilny/solar-vs-przedluzacz",
  "lib/core/modules/kalkulator-mobilny/stacja-vs-diy",
  "lib/core/modules/kalkulator-mobilny/weekend",
  "lib/core/modules/kalkulator-mobilny/panel-dla-urzadzenia",
  "lib/core/modules/kalkulator-mobilny/laczenie-paneli-przenosnych",
  "lib/core/modules/kalkulator-mobilny/powerbank-vs-akumulator",
  "lib/core/modules/kalkulator-mobilny/blackout-minimum",
  "lib/core/modules/kalkulator-mobilny/akumulator-kampera",
  "lib/core/modules/kalkulator-mobilny/panele-dach-kampera",
  "lib/core/modules/kalkulator-mobilny/panel-kampera",
  "lib/core/modules/kalkulator-mobilny/alternator-vs-panele",
  "lib/core/modules/kalkulator-mobilny/przetwornice",
  "lib/core/modules/kalkulator-mobilny/kreator-malego-odbiornika",
  "lib/core/modules/kalkulator-mobilny/lista-kemping",
  "lib/core/modules/kalkulator-mobilny/szybka-diagnoza",
  "lib/core/modules/kalkulator-mobilny/urzadzenia-medyczne",
  "lib/core/modules/kalkulator-mobilny/urzadzenia-zabronione-falownik",
  "lib/core/modules/kalkulator-mobilny/blackout-balkon",
  "lib/core/modules/kalkulator-mobilny/szablony-zestawow",
  "lib/core/modules/kalkulator-mobilny/test-akumulatora",
  "lib/core/modules/kalkulator-mobilny/raport-bezpieczenstwa-maly",
  "lib/core/modules/stress-test/wind-chill",
  "lib/core/modules/stress-test/obciazenie-dachu-sniegiem",
  "lib/core/modules/stress-test/sztywnienie-izolacji",
  "lib/core/modules/stress-test/elektronika-w-mrozie",
  "lib/core/modules/stress-test/pompy-zawory-w-mrozie",
  "lib/core/modules/stress-test/grzalki-dachowe",
  "lib/core/modules/stress-test/ryzyko-zamarzniecia",
  "lib/core/modules/stress-test/agregat-w-mrozie",
  "lib/core/modules/stress-test/blackout",
  "lib/core/modules/stress-test/strategia-zamarzanie",
  "lib/core/modules/stress-test/analiza-spof",
  "lib/core/modules/stress-test/bez-rekuperacji",
  "lib/core/modules/stress-test/pre-heat",
  "lib/core/modules/stress-test/awaria-stringa-zima",
  "lib/core/modules/zapotrzebowanie/urzadzenia-zmienne",
  "lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie",
  "lib/core/modules/zapotrzebowanie/architektura-fazowa",
  "lib/core/modules/zapotrzebowanie/kategorie-specjalne",
  "lib/core/modules/baterie/hierarchia-ladowania",
  "lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc",
  "lib/core/modules/baterie/symulacja-ladowania-rozladowania",
  "lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia",
  "lib/core/modules/zapotrzebowanie/wampiry-energetyczne/automatyzacja",
  "lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen",
  "lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej",
  "lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe",
  "lib/core/modules/zapotrzebowanie/wampiry-energetyczne/symulacje-i-raporty",
  "lib/core/modules/baterie/moment-dokrecania-srub",
  "lib/core/modules/esp32/katalog-czujnikow",
  "lib/core/modules/esp32/zasilanie-esp32",
  "lib/core/modules/esp32/architektura-komunikacji",
  "lib/core/modules/esp32/przydzial-pinow",
  "lib/core/modules/esp32/niezawodnosc-esp32",
  "lib/core/modules/esp32/wybor-plytki",
  "lib/core/modules/esp32/montaz-obudowa",
  "lib/core/modules/esp32/katalog-komponentow",
  "lib/core/modules/montaz-baterii/bezpieczenstwo-kwas",
  "lib/core/modules/montaz-baterii/montaz-mechaniczny-olow",
  "lib/core/modules/montaz-baterii/polaczenia-czyszczenie-olow",
  "lib/core/modules/montaz-baterii/przygotowanie-stanowiska",
  "lib/core/modules/montaz-baterii/uruchomienie-testy-olow",
  "lib/core/modules/montaz-baterii/weryfikacja-wstepna-olow",
  "lib/core/modules/okablowanie/ochrona-przed-gryzoniami",
  "lib/core/modules/okablowanie/peszle-koryta-rurki",
  "lib/core/modules/ai/prognozy",
  "lib/core/modules/baterie/komunikacja-bms",
  "lib/core/modules/baterie/porownanie-technologii",
  "lib/core/modules/bezpieczenstwo/audyt-pozarowy",
  "lib/core/modules/bezpieczenstwo/zamki-drzwi-ewakuacyjnych",
  "lib/core/modules/bezpieczenstwo/modul-gasniczy",
  "lib/core/modules/bezpieczenstwo/awaryjne-zrodlo-ciepla",
  "lib/core/modules/bezpieczenstwo/centrala-ssp",
  "lib/core/modules/bezpieczenstwo/oswietlenie-awaryjne",
  "lib/core/modules/bezpieczenstwo/klapy-pozarowe",
  "lib/core/modules/bezpieczenstwo/powiadomienia-alarmowe",
  "lib/core/modules/montaz-baterii/demontaz-olow",
  "lib/core/modules/montaz-baterii/dobor-kabli-bezpiecznikow-olow",
  "lib/core/modules/montaz-baterii/polaczenia-elektryczne",
  "lib/core/modules/okablowanie/ochrona-przed-dotykiem",
  "lib/core/modules/okablowanie/oznakowanie-obwodow",
  "lib/core/modules/okablowanie/puszki-polaczeniowe",
  "lib/core/modules/okablowanie/szyny-zbiorcze-polaczenia",
  "lib/core/modules/pv/czystosc-i-snieg",
  "lib/core/modules/stress-test/procedura-black-start",
  "lib/core/modules/siec/sciezka-cen-energii",
  "lib/core/modules/siec/rachunek-za-prad",
  "lib/core/modules/siec/porownanie-taryf",
  "lib/core/modules/siec/depozyt-prosumencki",
  "lib/core/modules/siec/test-licznika",
  "lib/core/modules/siec/moc-bierna",
  "lib/core/modules/siec/moc-umowna",
  "lib/core/modules/siec/oplata-mocowa",
  "lib/core/modules/siec/bilans-miesieczny",
  "lib/core/modules/siec/scenariusze-przejscia",
  "lib/core/modules/siec/przelacznik-siec-wyspa",
  "lib/core/modules/siec/koszt-powrotu",
  "lib/core/modules/siec/strumienie-bess",
]

const FILES_TO_CHECK = ["warnings.ts", "calculator.ts", "validation.ts"]

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

    // `assumptions.push("gotowy tekst")` / `` assumptions.push(`… ${x} …`) `` — lokalna tablica
    // budowana warunkowo (luka znaleziona 26.09.2026 w baterie/porownanie-technologii).
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "push" &&
      ts.isIdentifier(node.expression.expression) &&
      isAssumptionsName(node.expression.expression.text)
    ) {
      for (const arg of node.arguments) {
        if (ts.isStringLiteralLike(arg) || ts.isTemplateExpression(arg)) {
          report(arg, `"assumptions.push" z gołym stringiem PL — użyj "{kod, params?}" (17.2).`)
        }
      }
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

// Every module with an engine file must be on the list (26.09.2026: after migrating the last 13,
// all of them are). A new module missing here was the recurring gap — M6/E1 and 19 others were
// fully migrated but unprotected because nobody added them (Y.2).
const listed = new Set(MIGRATED_MODULES)
const unlisted = []
function findModules(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  if (entries.some((e) => e.isFile() && FILES_TO_CHECK.includes(e.name)) && !listed.has(dir)) unlisted.push(dir)
  for (const e of entries) if (e.isDirectory() && e.name !== "__tests__") findModules(path.posix.join(dir, e.name))
}
findModules("lib/core/modules")

if (unlisted.length > 0) {
  console.error("Mechanizm strażniczy i18n (17.9) — moduły spoza listy MIGRATED_MODULES:\n")
  for (const m of unlisted) console.error(`  ${m}`)
  console.error("\nDopisz je do MIGRATED_MODULES w scripts/check-i18n-guard.mjs (nowy moduł zwraca kody i18n, nie gotowy tekst).")
  process.exit(1)
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
