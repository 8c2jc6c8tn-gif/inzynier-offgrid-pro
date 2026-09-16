#!/usr/bin/env node
/**
 * Hash CSP dla inline skryptu liczony automatycznie, nigdy ręcznie — docs/standards/07-
 * bezpieczenstwo.md, 7.3 (wpis AKTUALIZACJE.md 16.09.2026, "Akcja dla inzynier-offgrid-pro").
 *
 * `WYGLAD_INIT_SCRIPT` w `app/layout.tsx` jest dopuszczony w produkcyjnej CSP wyłącznie przez
 * zahardkodowany hash SHA-256 w `next.config.mjs` (`WYGLAD_INIT_SCRIPT_HASH`). Zmiana treści
 * skryptu bez przeliczenia hasha powoduje ciche zablokowanie go przez CSP (błysk domyślnego
 * wyglądu wraca, zero błędu widocznego zwykłemu userowi) — ten skrypt to wykrywa w CI, zamiast
 * polegać na tym, że ktoś pamięta przeliczyć hash ręcznie.
 */
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"

const layoutSource = readFileSync("app/layout.tsx", "utf8")
const configSource = readFileSync("next.config.mjs", "utf8")

const scriptMatch = layoutSource.match(/const WYGLAD_INIT_SCRIPT = `([\s\S]*?)`\n/)
if (!scriptMatch) {
  console.error("check-csp-hash: nie znaleziono `const WYGLAD_INIT_SCRIPT = \\`...\\`` w app/layout.tsx.")
  process.exit(1)
}

const hashMatch = configSource.match(/const WYGLAD_INIT_SCRIPT_HASH = "(sha256-[^"]+)"/)
if (!hashMatch) {
  console.error('check-csp-hash: nie znaleziono `const WYGLAD_INIT_SCRIPT_HASH = "sha256-..."` w next.config.mjs.')
  process.exit(1)
}

const scriptContent = scriptMatch[1]
const configuredHash = hashMatch[1]
const computedHash = "sha256-" + createHash("sha256").update(scriptContent, "utf8").digest("base64")

if (computedHash !== configuredHash) {
  console.error("check-csp-hash: WYGLAD_INIT_SCRIPT_HASH w next.config.mjs jest nieaktualny.\n")
  console.error(`  w next.config.mjs:  ${configuredHash}`)
  console.error(`  policzony z treści: ${computedHash}`)
  console.error(
    "\nTreść WYGLAD_INIT_SCRIPT w app/layout.tsx zmieniła się bez przeliczenia hasha — produkcyjna\n" +
      "CSP po cichu zablokuje ten skrypt (błysk domyślnego wyglądu, bez błędu w konsoli). Zaktualizuj\n" +
      "WYGLAD_INIT_SCRIPT_HASH w next.config.mjs na wartość policzoną wyżej.",
  )
  process.exit(1)
}

console.log(`check-csp-hash: OK — WYGLAD_INIT_SCRIPT_HASH zgodny z treścią skryptu (${computedHash}).`)
