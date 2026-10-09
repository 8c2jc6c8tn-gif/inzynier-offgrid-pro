import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV, znajdzPanelKatalogu } from "../index"

const maLiczbe = (tekst: string, liczba: number) => new RegExp(`(?<![0-9])${liczba}(?![0-9])`).test(tekst)

describe("obciążenie mechaniczne w katalogu (spec 32)", () => {
  it("każda liczba Pa wpisu występuje w transkrypcji jego karty (przepisane, nie z pamięci)", () => {
    const z = KATALOG_PANELI_PV.filter((p) => p.obciazenie)
    expect(z.length).toBeGreaterThan(0)
    for (const p of z) {
      const zrodlo = readFileSync(p.zrodlo, "utf8")
      const o = p.obciazenie!
      expect(maLiczbe(zrodlo, o.przodPa), `${p.id} przód ${o.przodPa}`).toBe(true)
      if (o.tylPa !== null) expect(maLiczbe(zrodlo, o.tylPa), `${p.id} tył ${o.tylPa}`).toBe(true)
      if (o.wiatrPrzodPa) expect(maLiczbe(zrodlo, o.wiatrPrzodPa), `${p.id} wiatr ${o.wiatrPrzodPa}`).toBe(true)
    }
  })

  it("wpisy z karty odpowiednika (inna edycja/rynek) nie dostają liczby serii — null", () => {
    const odp = KATALOG_PANELI_PV.filter((p) => p.odpowiednik)
    expect(odp.length).toBeGreaterThan(0)
    for (const p of odp) expect(p.obciazenie, p.id).toBeNull()
  })

  it("JAM54D40 LR podaje wartości obliczeniowe 3600/1600 Pa, pozostałe JA — testowe 5400/2400 Pa; Jinko 48HL4M 6000/4000; Trina śnieg 5400, wiatr 4000", () => {
    expect(znajdzPanelKatalogu("ja-solar-jam54d40-lr-450")!.obciazenie).toEqual({ przodPa: 3600, tylPa: 1600, rodzaj: "obliczeniowe" })
    expect(znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!.obciazenie).toEqual({ przodPa: 5400, tylPa: 2400, rodzaj: "testowe" })
    expect(znajdzPanelKatalogu("jinko-tiger-neo-48hl4m-bdv-470")!.obciazenie).toEqual({ przodPa: 6000, tylPa: 4000, rodzaj: "testowe" })
    expect(znajdzPanelKatalogu("trina-vertex-s-plus-neg9r28-450")!.obciazenie).toEqual({ przodPa: 5400, tylPa: 4000, wiatrPrzodPa: 4000, rodzaj: "testowe" })
  })

  it("liczby są dodatnie, a od tyłu nie większe niż od przodu", () => {
    for (const p of KATALOG_PANELI_PV) {
      const o = p.obciazenie
      if (!o) continue
      expect(o.przodPa).toBeGreaterThan(0)
      if (o.tylPa !== null) expect(o.tylPa, p.id).toBeLessThanOrEqual(o.przodPa)
    }
  })
})
