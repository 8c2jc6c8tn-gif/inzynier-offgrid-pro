#!/usr/bin/env node
// Bramka CI dla standardu 11.5 (docs/standards/11-ci-deployment.md).
// `npm audit --audit-level=high` blokuje na KAŻDEJ podatności high/critical,
// także w zależnościach tranzytywnych, których projekt nie kontroluje wprost —
// standard mówi wyraźnie "w bezpośredniej zależności", więc filtrujemy po
// `isDirect` z JSON-a audytu (npm audit report v2) zamiast używać samego kodu wyjścia.
//
// Źródło: inzynier-szkieletowy-pro (PR #230, 16.09.2026). Ten skrypt zastępuje samo
// `pnpm audit --audit-level=high` z ci.yml w tym katalogu tam, gdzie potrzebne jest
// wierne odwzorowanie zakresu reguły (tylko zależności bezpośrednie) — patrz README.
import { execSync } from "node:child_process"

const BLOKUJACE_POZIOMY = new Set(["high", "critical"])

function uruchomAudytJson() {
  try {
    return execSync("npm audit --json", { encoding: "utf8" })
  } catch (blad) {
    // npm audit kończy się kodem != 0, gdy znajdzie cokolwiek — JSON i tak jest na stdout.
    return blad.stdout
  }
}

const raport = JSON.parse(uruchomAudytJson())
const podatnosci = Object.values(raport.vulnerabilities ?? {})

const blokujace = podatnosci.filter(
  (p) => p.isDirect && BLOKUJACE_POZIOMY.has(p.severity),
)
const tranzytywne = podatnosci.filter(
  (p) => !p.isDirect && BLOKUJACE_POZIOMY.has(p.severity),
)

if (tranzytywne.length > 0) {
  console.log(
    `Informacyjnie (nie blokuje merge — nie są to bezpośrednie zależności): ${tranzytywne
      .map((p) => `${p.name} (${p.severity})`)
      .join(", ")}`,
  )
}

if (blokujace.length > 0) {
  console.error(
    "Podatność high/critical w BEZPOŚREDNIEJ zależności — blokuje merge (standard 11.5):",
  )
  for (const p of blokujace) {
    const naprawa =
      typeof p.fixAvailable === "object"
        ? `npm install ${p.fixAvailable.name}@${p.fixAvailable.version}`
        : p.fixAvailable
          ? "npm audit fix"
          : "brak automatycznej łatki — wymaga ręcznej decyzji"
    console.error(`  - ${p.name} (${p.severity}): ${naprawa}`)
  }
  console.error(
    "\nJeśli podatność jest świadomie zaakceptowana (np. brak łatki, ryzyko nie dotyczy sposobu użycia biblioteki),",
  )
  console.error(
    "odnotuj to z powodem w docs/memory.md i dopiero wtedy zwolnij tę bramkę — nie omijaj jej bez wpisu.",
  )
  process.exit(1)
}

console.log("Brak podatności high/critical w bezpośrednich zależnościach.")
