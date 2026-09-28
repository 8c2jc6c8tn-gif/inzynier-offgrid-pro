import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { dictionaries } from "@/lib/i18n/dictionaries"

// Every "SIEC-…" key in the M14 engines must exist in all three dictionaries (17.1 — a missing key
// is never a silent fallback). `brakDanych(pole)` builds `SIEC-BRAK-${POLE}` — its fields are listed
// here explicitly, as the calculators pass them.
const POLA_BRAKU = [
  "zuzycie",
  "mocUmowna",
  "cenaEnergii",
  "oplataHandlowa",
  "sieciowaZmienna",
  "sieciowaStala",
  "abonament",
  "jakosciowa",
  "oze",
  "kogeneracyjna",
  "mocowa",
  "energiaMocowa",
  "vat",
]

function zrodla(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.isDirectory()) return e.name === "__tests__" ? [] : zrodla(p)
    return e.name.endsWith(".ts") ? [p] : []
  })
}

describe("M14 — klucze i18n", () => {
  const klucze = new Set<string>(POLA_BRAKU.map((p) => `SIEC-BRAK-${p.toUpperCase()}`))
  for (const plik of zrodla("lib/core/modules/siec")) {
    for (const m of readFileSync(plik, "utf8").matchAll(/"(SIEC-[A-Z0-9-]+[A-Z0-9])"/g)) klucze.add(m[1])
  }

  it.each([...klucze].sort())("%s jest w słownikach PL/EN/RU", (klucz) => {
    for (const jezyk of ["pl", "en", "ru"] as const) expect(dictionaries[jezyk][klucz], jezyk).toBeTypeOf("string")
  })

  it("każde pole brakDanych() w kalkulatorach jest na liście", () => {
    const tresc = readFileSync("lib/core/modules/siec/rachunek-za-prad/calculator.ts", "utf8")
    const uzyte = [
      ...tresc.matchAll(/brak\.(?:push|includes)\("(\w+)"\)/g),
      ...tresc.matchAll(/"(\w+)",?\s*\)\s*$/gm), // last argument of a multi-line wymagaj(…, "pole")
      ...tresc.matchAll(/wymagaj\(.*, "(\w+)"\)/g),
    ].map((m) => m[1])
    expect(uzyte.length).toBeGreaterThan(0)
    for (const pole of uzyte) expect(POLA_BRAKU).toContain(pole)
  })
})
