#!/usr/bin/env node
// Bramka CI dla standardu 11.5 (docs/standards/11-ci-deployment.md).
// `pnpm audit --audit-level=high` blokuje na KAŻDEJ podatności high/critical,
// także w zależnościach tranzytywnych, których projekt nie kontroluje wprost —
// 11.5 mówi wyraźnie "w bezpośredniej zależności", więc filtrujemy po tym,
// czy pakiet jest kluczem w dependencies/devDependencies/optionalDependencies
// tego package.json (pnpm audit --json, w przeciwieństwie do npm, nie ma pola
// `isDirect` na advisory — patrz docs/przyklady/ci/README.md).
//
// Adaptacja docs/przyklady/ci/audit-gate.mjs (źródło: inzynier-szkieletowy-pro,
// PR #230, 16.09.2026) z npm/isDirect na pnpm/package.json.
import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"

const BLOKUJACE_POZIOMY = new Set(["high", "critical"])

function wczytajBezposednieZaleznosci() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"))
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
  ])
}

function uruchomAudytJson() {
  try {
    return execSync("pnpm audit --json", { encoding: "utf8" })
  } catch (blad) {
    // pnpm audit kończy się kodem != 0, gdy znajdzie cokolwiek — JSON i tak jest na stdout.
    return blad.stdout
  }
}

const bezposrednie = wczytajBezposednieZaleznosci()
const raport = JSON.parse(uruchomAudytJson())
const podatnosci = Object.values(raport.advisories ?? {})

const blokujace = podatnosci.filter(
  (p) => bezposrednie.has(p.module_name) && BLOKUJACE_POZIOMY.has(p.severity),
)
const tranzytywne = podatnosci.filter(
  (p) => !bezposrednie.has(p.module_name) && BLOKUJACE_POZIOMY.has(p.severity),
)

if (tranzytywne.length > 0) {
  console.log(
    `Informacyjnie (nie blokuje merge — nie są to bezpośrednie zależności): ${tranzytywne
      .map((p) => `${p.module_name} (${p.severity})`)
      .join(", ")}`,
  )
}

if (blokujace.length > 0) {
  console.error(
    "Podatność high/critical w BEZPOŚREDNIEJ zależności — blokuje merge (standard 11.5):",
  )
  for (const p of blokujace) {
    console.error(
      `  - ${p.module_name} (${p.severity}): łatka ${p.patched_versions ?? "brak automatycznej łatki — wymaga ręcznej decyzji"}`,
    )
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
