import { describe, expect, it } from "vitest"
import { countFile, isUserText } from "../../../scripts/check-i18n-ui-guard.mjs"
import { dictionaryPl } from "../dictionary-pl"
import { czesciUi } from "../ui"

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe("UI dictionaries (lib/i18n/ui)", () => {
  it("every key starts with UI- and is defined once across all parts and the engine dictionary", () => {
    const seen = new Set<string>()
    for (const czesc of czesciUi) {
      for (const key of Object.keys(czesc.pl)) {
        expect(key.startsWith("UI-"), key).toBe(true)
        expect(seen.has(key), `duplicate ${key}`).toBe(false)
        expect(key in dictionaryPl, `${key} also in dictionary-pl`).toBe(false)
        seen.add(key)
      }
    }
  })

  it("en and ru have the same keys and placeholders as pl, and no empty text", () => {
    for (const czesc of czesciUi) {
      const pl = czesc.pl as Record<string, string>
      for (const lang of [czesc.en, czesc.ru] as Record<string, string>[]) {
        expect(Object.keys(lang).sort()).toEqual(Object.keys(pl).sort())
        for (const [key, text] of Object.entries(pl)) {
          expect(text.trim(), key).not.toBe("")
          expect(lang[key]!.trim(), key).not.toBe("")
          // Formula keys hold LaTeX braces (translated subscripts) — their placeholders are checked in formuly.test.ts.
          if (!key.startsWith("UI-FORMULA-")) expect(placeholders(lang[key]!), key).toEqual(placeholders(text))
        }
      }
    }
  })
})

describe("check-i18n-ui-guard", () => {
  it("isUserText: words and Polish letters are text; keys, symbols, numbers and units are not", () => {
    expect(isUserText("Rodzaj instalacji")).toBe(true)
    expect(isUserText("Moc")).toBe(true)
    expect(isUserText("zł")).toBe(true)
    expect(isUserText("UI-UMI-TYTUL")).toBe(false)
    expect(isUserText("N–PE")).toBe(false)
    expect(isUserText("30 mA")).toBe(false)
    expect(isUserText("kWh")).toBe(false)
    expect(isUserText("  ")).toBe(false)
  })

  it("counts JSX text, text in JSX expressions and text attributes", () => {
    const src = `export const A = ({ ok }) => (
      <div>
        <p>Tekst na ekranie</p>
        {ok ? "Tak" : "Nie wiem"}
        <Pole label="Moc" className="flex gap-2" />
      </div>
    )`
    expect(countFile("a.tsx", src).map((h) => h.text)).toEqual(["Tekst na ekranie", "Tak", "Nie wiem", "Moc"])
  })

  it("does not count code: t() keys, compared values, imports, directives and non-text attributes", () => {
    const src = `"use client"
      import x from "./zażółć"
      export const A = ({ m }) => (
        <div className="text-small" id="pole-mocy">
          {t("UI-UMI-TYTUL")}
          {m === "Wartość z ogonkiem" && t("UI-TAK")}
        </div>
      )`
    expect(countFile("a.tsx", src)).toEqual([])
  })

  it("counts Polish text and TEXT_NAMES properties outside JSX", () => {
    const src = `const MIEJSCA = [{ id: "garaz", label: "Garage" }]
      const OPIS = "Źródło ciepła"
      const KOD = "stan-poczatkowy"`
    expect(countFile("a.ts", src).map((h) => h.text)).toEqual(["Garage", "Źródło ciepła"])
  })
})
