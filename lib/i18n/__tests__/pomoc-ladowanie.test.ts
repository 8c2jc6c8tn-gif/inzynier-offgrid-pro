import { describe, expect, it } from "vitest"
import { czesciPomocy } from "../pomoc"
import { LADUJ_MODUL_POMOCY, MODUL_POMOCY_PO_EKRANIE, type ModulPomocy } from "../pomoc/ladowanie"
import { SUPPORTED_LANGUAGES } from "../language"
import { zbuduj } from "../../../scripts/generuj-mape-pomocy.mjs"
import { readFileSync } from "node:fs"
import path from "node:path"

describe("lazy help loading map (generated ladowanie.ts)", () => {
  it("is up to date with the module files (pnpm pomoc:napraw regenerates it)", () => {
    const biezace = readFileSync(path.join(__dirname, "../pomoc/ladowanie.ts"), "utf8")
    expect(biezace).toBe(zbuduj())
  })

  it("maps every screen/group id of the help to a module", () => {
    const ids = czesciPomocy.flatMap((c) => Object.keys(c))
    expect(Object.keys(MODUL_POMOCY_PO_EKRANIE).sort()).toEqual([...ids].sort())
  })

  it.each(Object.keys(LADUJ_MODUL_POMOCY) as ModulPomocy[])("module %s loads and defines exactly its mapped screens in all languages", async (modul) => {
    const tresci = await LADUJ_MODUL_POMOCY[modul]()
    const ekrany = Object.entries(MODUL_POMOCY_PO_EKRANIE).filter(([, m]) => m === modul).map(([id]) => id).sort()
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(Object.keys((tresci as Record<string, object>)[lang]).sort(), lang).toEqual(ekrany)
    }
  })
})
