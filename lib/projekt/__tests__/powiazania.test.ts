import { describe, expect, it } from "vitest"
import { kandydaciZPol, kandydaciZWynikow, poEdycji, statusPola, synchronizuj, wartoscDlaPola, type MapaPol } from "../powiazania"
import type { WartosciProjektu } from "../wielkosci"

type Stan = { napiecieV: string; pojemnoscAh: string; sprawnosc: string; inne: string }
const POCZ: Stan = { napiecieV: "", pojemnoscAh: "", sprawnosc: "95", inne: "" }
const MAPA: MapaPol<Stan> = { napiecieV: "napiecieUkladuV", pojemnoscAh: "pojemnoscNominalnaAh", sprawnosc: "sprawnoscFalownikaPct" }
const w = (v: string) => ({ v, zrodlo: "napiecie-systemowe", iso: "2026-11-23T10:00:00Z" })

describe("synchronizuj — the field is filled from the project at once", () => {
  it("fills empty fields and untouched defaults, marks them as following the project", () => {
    const r = synchronizuj(POCZ, POCZ, {}, MAPA, { napiecieUkladuV: w("24"), sprawnoscFalownikaPct: w("93") })
    expect(r.stan).toEqual({ napiecieV: "24", pojemnoscAh: "", sprawnosc: "93", inne: "" })
    expect(r.znaczniki).toEqual({ napiecieV: "projekt", sprawnosc: "projekt" })
  })

  it("never overwrites the user's own value; a value typed before projects existed counts as own", () => {
    const stan = { ...POCZ, napiecieV: "12" }
    const r = synchronizuj(stan, POCZ, {}, MAPA, { napiecieUkladuV: w("24") })
    expect(r.stan.napiecieV).toBe("12")
    expect(r.znaczniki.napiecieV).toBe("wlasna")
    const r2 = synchronizuj(r.stan, POCZ, r.znaczniki, MAPA, { napiecieUkladuV: w("48") })
    expect(r2.stan.napiecieV).toBe("12")
  })

  it("a field following the project follows a later change of the project value (saved on another screen)", () => {
    const r = synchronizuj(POCZ, POCZ, {}, MAPA, { napiecieUkladuV: w("24") })
    const r2 = synchronizuj(r.stan, POCZ, r.znaczniki, MAPA, { napiecieUkladuV: w("48") })
    expect(r2.stan.napiecieV).toBe("48")
  })

  it("returns the same objects when nothing changes (no render loop)", () => {
    const r = synchronizuj(POCZ, POCZ, {}, MAPA, { napiecieUkladuV: w("24") })
    const r2 = synchronizuj(r.stan, POCZ, r.znaczniki, MAPA, { napiecieUkladuV: w("24.0") })
    expect(r2.stan).toBe(r.stan)
    expect(r2.znaczniki).toBe(r.znaczniki)
  })

  it("writes a number into a field whose initial value is a number", () => {
    const p = { napiecieV: 12 }
    const r = synchronizuj(p, p, {}, { napiecieV: "napiecieUkladuV" }, { napiecieUkladuV: w("48") })
    expect(r.stan.napiecieV).toBe(48)
  })
})

describe("poEdycji — typing on the screen", () => {
  it("a typed value different from the project becomes own; the same as the project follows it; clearing removes the marker", () => {
    const wart: WartosciProjektu = { napiecieUkladuV: w("24") }
    const zn1 = poEdycji(POCZ, { ...POCZ, napiecieV: "12" }, {}, MAPA, wart)
    expect(zn1.napiecieV).toBe("wlasna")
    const zn2 = poEdycji({ ...POCZ, napiecieV: "12" }, { ...POCZ, napiecieV: "24,0" }, zn1, MAPA, wart)
    expect(zn2.napiecieV).toBe("projekt")
    const zn3 = poEdycji({ ...POCZ, napiecieV: "24" }, POCZ, zn2, MAPA, wart)
    expect(zn3.napiecieV).toBeUndefined()
  })

  it("ignores fields that are not linked", () => {
    const zn = {}
    expect(poEdycji(POCZ, { ...POCZ, inne: "x" }, zn, MAPA, null)).toBe(zn)
  })
})

describe("statusPola and the save-bar candidates", () => {
  it("statuses", () => {
    expect(statusPola("", undefined, w("24"))).toEqual({ rodzaj: "pusta" })
    expect(statusPola("24", "projekt", w("24"))).toEqual({ rodzaj: "projekt", zrodlo: "napiecie-systemowe" })
    expect(statusPola("12", "wlasna", w("24"))).toEqual({ rodzaj: "wlasna", wProjekcie: "24" })
    expect(statusPola("12", "wlasna", undefined)).toEqual({ rodzaj: "nowa" })
    expect(statusPola("95", undefined, undefined)).toEqual({ rodzaj: "pusta" })
  })

  it("only own values that differ from the project and are valid numbers in range are offered", () => {
    const stan = { napiecieV: "12", pojemnoscAh: "abc", sprawnosc: "150", inne: "" }
    const zn = { napiecieV: "wlasna", pojemnoscAh: "wlasna", sprawnosc: "wlasna" } as const
    expect(kandydaciZPol(stan, zn, MAPA, { napiecieUkladuV: w("24") })).toEqual([
      { wielkosc: "napiecieUkladuV", wartosc: "12", wProjekcie: "24", pole: "napiecieV" },
    ])
    expect(kandydaciZPol(POCZ, {}, MAPA, {})).toEqual([])
  })

  it("an untouched default is never offered (no noise on every screen)", () => {
    expect(kandydaciZPol(POCZ, {}, MAPA, {})).toEqual([])
  })

  it("results: offered when the project lacks them or has another value; null = not offered", () => {
    expect(kandydaciZWynikow({ liczbaPaneli: 12, mocPvKwp: null }, { liczbaPaneli: w("10") })).toEqual([
      { wielkosc: "liczbaPaneli", wartosc: "12", wProjekcie: "10", pole: null },
    ])
    expect(kandydaciZWynikow({ liczbaPaneli: 12 }, { liczbaPaneli: w("12") })).toEqual([])
  })
})

describe("select fields with fixed options (owner decision 26.11.2026)", () => {
  type S = { napiecie: number }
  const P: S = { napiecie: 48 }
  const M: MapaPol<S> = { napiecie: { wielkosc: "napiecieUkladuV", opcje: [12, 24, 48] } }

  it("takes the project value when it is one of the options", () => {
    const r = synchronizuj(P, P, {}, M, { napiecieUkladuV: w("24") })
    expect(r.stan.napiecie).toBe(24)
    expect(r.znaczniki.napiecie).toBe("projekt")
  })

  it("leaves the list alone when the project value is not an option", () => {
    const r = synchronizuj(P, P, {}, M, { napiecieUkladuV: w("51.2") })
    expect(r.stan).toBe(P)
    expect(wartoscDlaPola(M.napiecie!, { napiecieUkladuV: w("51.2") })).toBeUndefined()
  })
})
