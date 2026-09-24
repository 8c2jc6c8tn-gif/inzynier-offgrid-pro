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
  "lib/core/modules/ogrzewanie/pompy-cyrkulacyjne",
  "lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia",
  "lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla",
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
  "lib/core/modules/kalkulator-mobilny/dobor-regulatora-pwm-mppt",
  "lib/core/modules/stress-test/wind-chill",
  "lib/core/modules/zapotrzebowanie/urzadzenia-zmienne",
  "lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie",
  "lib/core/modules/zapotrzebowanie/architektura-fazowa",
  "lib/core/modules/zapotrzebowanie/kategorie-specjalne",
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
