import { describe, expect, it } from "vitest"
import type { CalcResult } from "@/lib/core/calc-result"
import type { AnalizaZacienieniaResult, ScenariuszZacienienia } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import { podsumujPowierzchnie } from "../podsumowanie-zacienienia"

const scen = (roczna: number, udzial: { nazwa: string; procent: number }[], profil = 0): ScenariuszZacienienia => ({
  strataRocznaProcent: roczna,
  strataMiesiecznaProcent: Array.from({ length: 12 }, () => roczna),
  udzialPrzeszkod: udzial,
  profilHoryzontuDeg: Array.from({ length: 360 }, () => profil),
})

const wynik = (
  obecnie: ScenariuszZacienienia,
  prognoza: ScenariuszZacienienia | null = null,
  status: CalcResult<AnalizaZacienieniaResult>["status"] = "VALID",
): CalcResult<AnalizaZacienieniaResult> => ({
  value: { obecnie, prognoza },
  unit: "%",
  status,
  formula: "",
  inputs: {},
  assumptions: [],
  warnings: [],
  calculatorVersion: "test",
})

const punkty = [
  { x: 0, y: 0, z: 3 },
  { x: 5, y: 0, z: 3 },
  { x: 10, y: 0, z: 3 },
]

describe("podsumujPowierzchnie", () => {
  it("średnia z punktów siatki: roczna, miesięczna, udziały przeszkód (bez zerowych, od największego)", () => {
    const p = podsumujPowierzchnie(punkty, [
      wynik(scen(10, [{ nazwa: "Dąb", procent: 10 }, { nazwa: "Brzoza", procent: 0 }])),
      wynik(scen(4, [{ nazwa: "Dąb", procent: 1 }, { nazwa: "Brzoza", procent: 3 }])),
      wynik(scen(1, [{ nazwa: "Dąb", procent: 1 }, { nazwa: "Brzoza", procent: 0 }])),
    ])!
    expect(p.obecnie.strataRocznaProcent).toBeCloseTo(5, 9)
    expect(p.obecnie.strataMiesiecznaProcent[6]).toBeCloseTo(5, 9)
    expect(p.obecnie.udzialPrzeszkod).toEqual([
      { nazwa: "Dąb", procent: 4 },
      { nazwa: "Brzoza", procent: 1 },
    ])
    expect(p.strataPunktow).toEqual([10, 4, 1])
    expect(p.prognoza).toBeNull()
  })

  it("punkt odrzucony przez walidację: pominięty w średniej, null na mapie, policzony w `pominiete`", () => {
    const p = podsumujPowierzchnie(punkty, [wynik(scen(8, [])), wynik(scen(99, []), null, "INVALID_INPUT"), wynik(scen(2, []))])!
    expect(p.obecnie.strataRocznaProcent).toBeCloseTo(5, 9)
    expect(p.strataPunktow).toEqual([8, null, 2])
    expect(p.pominiete).toBe(1)
  })

  it("profil horyzontu z poprawnego punktu najbliższego środkowi", () => {
    const p = podsumujPowierzchnie(punkty, [wynik(scen(0, [], 1)), wynik(scen(0, [], 2)), wynik(scen(0, [], 3))])!
    expect(p.profilHoryzontuDeg[0]).toBe(2)
    const bezSrodka = podsumujPowierzchnie(punkty, [wynik(scen(0, [], 1)), wynik(scen(0, [], 2), null, "INVALID_INPUT"), wynik(scen(0, [], 3))])!
    expect([1, 3]).toContain(bezSrodka.profilHoryzontuDeg[0])
  })

  it("prognoza uśredniona, gdy każdy punkt ją ma", () => {
    const p = podsumujPowierzchnie(punkty.slice(0, 2), [wynik(scen(2, []), scen(6, [])), wynik(scen(4, []), scen(10, []))])!
    expect(p.prognoza!.strataRocznaProcent).toBeCloseTo(8, 9)
  })

  it("żaden punkt poprawny → null", () => {
    expect(podsumujPowierzchnie(punkty.slice(0, 1), [wynik(scen(1, []), null, "INVALID_INPUT")])).toBeNull()
  })
})
