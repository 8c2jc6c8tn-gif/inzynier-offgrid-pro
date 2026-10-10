import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { dobierzPaneleNaZime, MAKS_PANELI_W_DOBORZE } from "../bilans-godzinowy"
import { calculatePorownywarkaPaneli } from "../calculator"
import type { DanePanelu, PorownywarkaInput } from "../input"
import { domyslnyWyborKryteriow } from "../kryteria"

/** Dwie doby w styczniu (zima): jeden panel daje 1 kWh w godzinach 10–13, zużycie 1 kWh/godz. (24 kWh na dobę). */
function doby() {
  const n = 48
  const jednostkowaKwh = new Float64Array(n)
  const godzinaLokalna = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    godzinaLokalna[i] = i % 24
    if (godzinaLokalna[i]! >= 10 && godzinaLokalna[i]! <= 13) jednostkowaKwh[i] = 1
  }
  return { jednostkowaKwh, miesiac: new Uint8Array(n), godzinaLokalna, zapotrzebowanieMiesiaceKwh: [48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
}
const wspolne = (pojemnoscKwh: number) => {
  const { jednostkowaKwh: _j, ...reszta } = doby()
  return { ...reszta, pojemnoscKwh, sprawnoscCyklu: 1 as number | null }
}

describe("dobierzPaneleNaZime — ręczny rachunek na dobach syntetycznych", () => {
  it("„w sumie”: cel 50% z 48 kWh to 24 kWh, panel daje 8 kWh w dwie doby → 3 panele", () => {
    const d = dobierzPaneleNaZime(doby().jednostkowaKwh, wspolne(0), 50)
    expect(d.zuzycieZimaKwh).toBe(48)
    expect(d.zimaNaPanelKwh).toBe(8)
    expect(d.panelowSumowo).toBe(3)
  })

  it("bez baterii pokrycie nie przekracza 4/24 (tylko godziny słońca): cel 10% daje 1 panel, cel 20% jest nieosiągalny i pokazuje maksimum", () => {
    const a = dobierzPaneleNaZime(doby().jednostkowaKwh, wspolne(0), 10)
    expect(a.panelowGodzinowo).toBe(1)
    const b = dobierzPaneleNaZime(doby().jednostkowaKwh, wspolne(0), 20)
    expect(b.panelowGodzinowo).toBeNull()
    expect(b.pokrycieMaksPct).toBeCloseTo((4 / 24) * 100, 8)
    // „w sumie” jest zbyt optymistyczne: obiecuje pokrycie, którego godzinowo nie ma
    expect(b.panelowSumowo).toBe(Math.ceil((0.2 * 48) / 8))
  })

  it("bateria 10 kWh: pokrycie = (4 + min(10; 4·(n−1)))/24 → cel 50% wymaga 3 paneli, cel 60% jest nieosiągalny (maks. 14/24)", () => {
    const a = dobierzPaneleNaZime(doby().jednostkowaKwh, wspolne(10), 50)
    expect(a.panelowGodzinowo).toBe(3)
    const b = dobierzPaneleNaZime(doby().jednostkowaKwh, wspolne(10), 60)
    expect(b.panelowGodzinowo).toBeNull()
    expect(b.pokrycieMaksPct).toBeCloseTo((14 / 24) * 100, 8)
  })

  it("panel bez energii zimą: brak liczby „w sumie”, brak liczby godzinowej", () => {
    const d = dobierzPaneleNaZime(new Float64Array(48), wspolne(10), 50)
    expect(d.panelowSumowo).toBeNull()
    expect(d.panelowGodzinowo).toBeNull()
    expect(d.pokrycieMaksPct).toBe(0)
  })

  it("granica doboru jest jawna i dodatnia", () => {
    expect(MAKS_PANELI_W_DOBORZE).toBe(200)
  })
})

describe("calculatePorownywarkaPaneli — cel zimowy (spec 34)", () => {
  const rok = (): RekordGodzinowy[] => {
    const start = Date.UTC(2018, 0, 1)
    return Array.from({ length: 8760 }, (_, h) => {
      const czasUtcMs = start + h * 3_600_000
      const m = new Date(czasUtcMs).getUTCMonth()
      const dzien = [9, 10, 11, 12].includes(new Date(czasUtcMs).getUTCHours())
      const g = dzien ? (m === 0 || m === 11 ? 150 : m === 6 ? 600 : 300) : 0
      return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: 5 }
    })
  }
  const panel: DanePanelu = { ...znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!, cenaBruttoZl: null }
  const wejscie = (liczba: number, cel: number | null): PorownywarkaInput => ({
    szerokoscGeograficzna: 52.2,
    dlugoscGeograficzna: 21,
    daneGodzinowe: rok(),
    miejsce: { nachylenieDeg: 40, azymutDeg: 180, albedo: 0.2 },
    liczbaPaneli: liczba,
    panele: [panel],
    zapotrzebowanieMiesiaceKwh: [200, 180, 150, 120, 100, 90, 90, 100, 120, 150, 180, 200],
    bilansGodzinowy: { pojemnoscKwh: 8, sprawnoscCyklu: 0.9, celZimyPct: cel },
    wycena: null,
    kryteria: domyslnyWyborKryteriow(),
  })
  const pokrycieZimy = (n: number) => calculatePorownywarkaPaneli(wejscie(n, null)).value.panele[0]!.bilansGodzinowy!.pokrycieZimaPct!

  it("bez celu: brak doboru i brak założenia; z celem: dobór zgodny z bilansem (n spełnia cel, n−1 nie)", () => {
    expect(calculatePorownywarkaPaneli(wejscie(4, null)).value.panele[0]!.bilansGodzinowy!.doborNaZime).toBeNull()
    const r = calculatePorownywarkaPaneli(wejscie(4, 40))
    const d = r.value.panele[0]!.bilansGodzinowy!.doborNaZime!
    expect(d.celPct).toBe(40)
    expect(r.assumptions.some((a) => typeof a !== "string" && a.kod === "PORP-ZAL-DOBOR-ZIMY")).toBe(true)
    expect(d.panelowGodzinowo).not.toBeNull()
    const n = d.panelowGodzinowo!
    expect(pokrycieZimy(n)).toBeGreaterThanOrEqual(40 - 1e-6)
    if (n > 1) expect(pokrycieZimy(n - 1)).toBeLessThan(40)
    // wynik nie zależy od liczby paneli wpisanej w formularzu
    const inny = calculatePorownywarkaPaneli(wejscie(9, 40)).value.panele[0]!.bilansGodzinowy!.doborNaZime!
    expect(inny).toEqual(d)
  })

  it("„w sumie” nigdy nie obiecuje więcej paneli niż potrzeba godzinowo", () => {
    const d = calculatePorownywarkaPaneli(wejscie(4, 40)).value.panele[0]!.bilansGodzinowy!.doborNaZime!
    expect(d.panelowSumowo!).toBeLessThanOrEqual(d.panelowGodzinowo!)
  })

  it("cel poza (0–100] % → INVALID_INPUT", () => {
    expect(calculatePorownywarkaPaneli(wejscie(4, 0)).status).toBe("INVALID_INPUT")
    expect(calculatePorownywarkaPaneli(wejscie(4, 120)).status).toBe("INVALID_INPUT")
  })
})
