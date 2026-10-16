import { describe, expect, it } from "vitest"
import { SZABLONY } from "@/lib/core/modules/kalkulator-mobilny/szablony-zestawow/constants"
import { obiektMikroinstalacji, pozycjeZSzablonu } from "../szablon-do-listy"

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

  it("with a micro-installation kind every new row belongs to that site only; without it the rows belong to every site", () => {
    const dla = pozycjeZSzablonu("kamper", nazwa, [], id, "kamper")
    expect(dla.every((w) => w.obiekty?.length === 1 && w.obiekty[0] === "kamper")).toBe(true)
    const bez = pozycjeZSzablonu("kamper", nazwa, [], id)
    expect(bez.every((w) => w.obiekty === undefined)).toBe(true)
  })

  it("obiektMikroinstalacji: kamper, altana i garaż tak; budynek i brak wyboru nie", () => {
    expect(obiektMikroinstalacji("kamper")).toBe("kamper")
    expect(obiektMikroinstalacji("altana-rod")).toBe("altana-rod")
    expect(obiektMikroinstalacji("garaz")).toBe("garaz")
    expect(obiektMikroinstalacji("budynek")).toBeNull()
    expect(obiektMikroinstalacji("")).toBeNull()
    expect(obiektMikroinstalacji(undefined)).toBeNull()
  })
})
