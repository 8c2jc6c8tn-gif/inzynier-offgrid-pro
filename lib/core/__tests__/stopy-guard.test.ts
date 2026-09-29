import { describe, expect, it } from "vitest"
import { collectCriticals, registryCodes } from "../../../scripts/check-stopy-guard.mjs"

const codes = (src: string) => collectCriticals("m/warnings.ts", src).map((f: { code: string | null }) => f.code)

describe("check-stopy-guard — collectCriticals", () => {
  it("finds an object literal with a literal critical level", () => {
    expect(codes(`export const w = () => ({ code: "A-B", level: "critical" })`)).toEqual(["A-B"])
  })

  it("ignores warning/info levels, also behind `as const`", () => {
    expect(codes(`const a = { code: "A-B", level: "warning" as const }; const b = { code: "C-D", level: "info" }`)).toEqual([])
  })

  it("treats a conditional with a critical branch and a non-literal level as critical", () => {
    expect(codes(`const a = { code: "A-B", level: x ? "critical" : "warning" }; const b = { code: "C-D", level: lvl }`)).toEqual([
      "A-B",
      "C-D",
    ])
  })

  it("finds helper calls with a critical argument", () => {
    expect(codes(`export function f() { return ostrzezenie("SIEC-X", "critical", "msg", "pole") }`)).toEqual(["SIEC-X"])
  })

  it("turns a template code into a wildcard and follows a local const", () => {
    const src = `export function n(field: string) { const code = \`\${field.toUpperCase()}-NIEDODATNI\`; return { code, level: "critical" } }`
    expect(codes(src)).toEqual(["*-NIEDODATNI"])
  })

  it("reports a code passed in as a parameter as a dynamic site", () => {
    const found = collectCriticals("m/warnings.ts", `export function f(kod: string) { return { code: kod, level: "critical" } }`)
    expect(found).toEqual([{ code: null, site: "m/warnings.ts#f" }])
  })
})

describe("check-stopy-guard — registryCodes", () => {
  it("reads backticked codes, including wildcards, and skips other backticked text", () => {
    const md = "- stop (kod `UKLAD-IT-BEZ-IMD`), wzorzec `AUDYT-*`, plik `warnings.ts`, funkcja `blokada`"
    expect([...registryCodes(md)]).toEqual(["UKLAD-IT-BEZ-IMD", "AUDYT-*"])
  })
})
