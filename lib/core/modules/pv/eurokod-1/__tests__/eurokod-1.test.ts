import { describe, expect, it } from "vitest"
import { wspolczynnikKsztaltuMu1 } from "../snieg"
import { bazoweCisnienieWiatruPa, cfOdrywaniaWiaty, silaWiatruN, szczytoweCisnieniePa, wspolczynnikEkspozycji } from "../wiatr"

describe("PN-EN 1991-1-4 — Tablica NA.1 (qb,0)", () => {
  it("A ≤ 300 m: 300 / 420 / 300 Pa", () => {
    expect(bazoweCisnienieWiatruPa(1, 100)).toBeCloseTo(300, 6)
    expect(bazoweCisnienieWiatruPa(2, 100)).toBeCloseTo(420, 6)
    expect(bazoweCisnienieWiatruPa(3, 300)).toBeCloseTo(300, 6)
  })
  it("A > 300 m: strefa 1 — 0,30·[1+0,0006(A−300)]²; strefa 2 bez zmian; strefa 3 z czynnikiem (20000−A)/(20000+A)", () => {
    expect(bazoweCisnienieWiatruPa(1, 500)).toBeCloseTo(300 * 1.12 ** 2, 6)
    expect(bazoweCisnienieWiatruPa(2, 500)).toBeCloseTo(420, 6)
    expect(bazoweCisnienieWiatruPa(3, 500)).toBeCloseTo((300 * 1.12 ** 2 * 19500) / 20500, 6)
  })
})

describe("PN-EN 1991-1-4 — Tablica NA.3 (ce), wzór 4.8, wzór 5.3", () => {
  it("z < zmin → zmin; z > zmax → zmax", () => {
    expect(wspolczynnikEkspozycji("II", 1)).toBeCloseTo(2.3 * 0.2 ** 0.24, 9)
    expect(wspolczynnikEkspozycji("III", 2)).toBeCloseTo(1.9 * 0.5 ** 0.26, 9)
    expect(wspolczynnikEkspozycji("0", 1000)).toBeCloseTo(3.0 * 20 ** 0.17, 9)
    expect(wspolczynnikEkspozycji("I", 10)).toBeCloseTo(2.8, 9)
  })
  it("qp = ce·qb; Fw = cscd·cf·qp·A", () => {
    expect(szczytoweCisnieniePa(300, 2)).toBe(600)
    expect(silaWiatruN(1, 1.8, 600, 10)).toBeCloseTo(10800, 9)
  })
})

describe("PN-EN 1991-1-4 — Tablica 7.6 (cf odrywania wiaty jednospadowej)", () => {
  it("węzły tablicy dla φ = 0 i φ = 1", () => {
    expect(cfOdrywaniaWiaty(0, 0)).toBeCloseTo(0.5, 9)
    expect(cfOdrywaniaWiaty(30, 0)).toBeCloseTo(1.8, 9)
    expect(cfOdrywaniaWiaty(0, 1)).toBeCloseTo(1.3, 9)
    expect(cfOdrywaniaWiaty(25, 1)).toBeCloseTo(1.4, 9)
  })
  it("φ pośrednie — interpolacja liniowa (7.3 (3))", () => {
    expect(cfOdrywaniaWiaty(30, 0.5)).toBeCloseTo(1.6, 9)
  })
  it("kąt między węzłami — bardziej niekorzystny węzeł, nie interpolacja", () => {
    expect(cfOdrywaniaWiaty(12, 0)).toBeCloseTo(1.1, 9)
    expect(cfOdrywaniaWiaty(27, 1)).toBeCloseTo(1.4, 9)
  })
  it("poza zakresem 0–30° → null (brak danych normy, bez ekstrapolacji)", () => {
    expect(cfOdrywaniaWiaty(31, 0)).toBeNull()
    expect(cfOdrywaniaWiaty(-1, 0)).toBeNull()
  })
})

describe("PN-EN 1991-1-3 — Tablica 5.2 (μ1)", () => {
  it("0,8 do 30°, liniowo do 0 przy 60°, potem 0", () => {
    expect(wspolczynnikKsztaltuMu1(0)).toBe(0.8)
    expect(wspolczynnikKsztaltuMu1(30)).toBe(0.8)
    expect(wspolczynnikKsztaltuMu1(45)).toBeCloseTo(0.4, 9)
    expect(wspolczynnikKsztaltuMu1(60)).toBe(0)
    expect(wspolczynnikKsztaltuMu1(90)).toBe(0)
  })
})
