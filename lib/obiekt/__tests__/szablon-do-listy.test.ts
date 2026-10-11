import { describe, expect, it } from "vitest"
import { SZABLONY } from "@/lib/core/modules/kalkulator-mobilny/szablony-zestawow/constants"
import { pozycjeZSzablonu } from "../szablon-do-listy"

const nazwa = (klucz: string) => `PL:${klucz}`
let n = 0
const id = () => `id-${++n}`

describe("pozycjeZSzablonu", () => {
  it("adds every load of the template as an empty row: no power, no hours, no cyclic flag", () => {
    const wiersze = pozycjeZSzablonu("kamper", nazwa, [], id)
    expect(wiersze.map((w) => w.nazwa)).toEqual(SZABLONY.kamper.map((p) => `PL:${p.nazwa}`))
    expect(wiersze.every((w) => w.mocW === 0 && w.godzinNaDobe === 0 && !w.cykliczne && w.wspolczynnikPracyPct === 0)).toBe(true)
    expect(new Set(wiersze.map((w) => w.id)).size).toBe(wiersze.length)
  })

  it("skips loads already on the list (also with different case or spaces), so a second click adds nothing", () => {
    const pierwsze = SZABLONY.kamper[0]!
    const istniejace = [{ nazwa: `  ${`PL:${pierwsze.nazwa}`.toUpperCase()} ` }]
    const wiersze = pozycjeZSzablonu("kamper", nazwa, istniejace, id)
    expect(wiersze).toHaveLength(SZABLONY.kamper.length - 1)
    expect(pozycjeZSzablonu("kamper", nazwa, wiersze.concat(pozycjeZSzablonu("kamper", nazwa, [], id)), id)).toEqual([])
  })

  it("does not add the same name twice within one template", () => {
    const wiersze = pozycjeZSzablonu("jacht", () => "to samo", [], id)
    expect(wiersze).toHaveLength(1)
  })
})
