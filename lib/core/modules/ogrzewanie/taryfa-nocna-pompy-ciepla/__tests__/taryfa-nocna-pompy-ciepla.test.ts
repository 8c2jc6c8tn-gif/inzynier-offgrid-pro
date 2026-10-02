import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../../zapotrzebowanie/bojler-cwu/constants"
import { calculateTaryfaNocnaPompyCiepla } from "../calculator"
import type { TaryfaNocnaPompyCieplaInput } from "../input"

// Test numbers only (round values chosen to make the arithmetic checkable) — not tariff data.
const baza: TaryfaNocnaPompyCieplaInput = {
  cieploDobaKwh: 48,
  godzinyNocH: 12,
  cenaDzienZlKwh: 1,
  cenaNocZlKwh: 0.5,
  copDzien: 3,
  copNoc: 0,
  pojemnoscBuforaL: 500,
  deltaTBuforaK: 20,
  zasilanieNocy: "siec",
}

describe("pompa ciepła w taryfie nocnej (dawne 5.59)", () => {
  it("bufor przesuwa ciepło strefy dziennej na noc: koszt bez i z przesunięciem, oszczędność", () => {
    const r = calculateTaryfaNocnaPompyCiepla(baza)
    const bufor = 500 * 20 * WSPOLCZYNNIK_KWH_NA_L_K
    expect(r.value.pojemnoscBuforaKwh).toBeCloseTo(bufor, 9)
    expect(r.value.przesunieteKwh).toBeCloseTo(bufor, 9) // 11.63 < 24 kWh of day-zone heat
    // Q = 48 kWh, night half = 24, day half = 24; COP 3 everywhere.
    expect(r.value.kosztBezPrzesuniecaZl).toBeCloseTo((24 / 3) * 1 + (24 / 3) * 0.5, 9)
    expect(r.value.kosztZPrzesunieciemZl).toBeCloseTo(((24 - bufor) / 3) * 1 + ((24 + bufor) / 3) * 0.5, 9)
    expect(r.value.oszczednoscDobaZl).toBeCloseTo((bufor / 3) * (1 - 0.5), 9)
    expect(r.value.oszczednoscPct).toBeCloseTo((r.value.oszczednoscDobaZl / r.value.kosztBezPrzesuniecaZl) * 100, 9)
    expect(r.value.pradNocKwh).toBeCloseTo((24 + bufor) / 3, 9)
    expect(r.value.mocNocSredniaKw).toBeCloseTo((24 + bufor) / 3 / 12, 9)
    expect(r.assumptions).toContainEqual({ kod: "TAN-ZAL-COP-NOC-ROWNY" })
    expect(r.warnings.map((w) => w.code)).toEqual(["TAN-BUFOR-NIE-POKRYWA-DNIA"])
    expect(r.status).toBe("VALID")
  })

  it("bufor większy niż ciepło strefy dziennej: przesuwa tylko to, co jest w dzień; COP nocy niższy od dziennego", () => {
    const r = calculateTaryfaNocnaPompyCiepla({ ...baza, pojemnoscBuforaL: 5000, copNoc: 2.5 })
    expect(r.value.przesunieteKwh).toBeCloseTo(24, 9)
    expect(r.value.kosztZPrzesunieciemZl).toBeCloseTo((48 / 2.5) * 0.5, 9)
    expect(r.assumptions).not.toContainEqual({ kod: "TAN-ZAL-COP-NOC-ROWNY" })
    expect(r.warnings).toEqual([])
  })

  it("bez bufora nic się nie przesuwa → oszczędność 0, ℹ️ brak bufora", () => {
    const r = calculateTaryfaNocnaPompyCiepla({ ...baza, pojemnoscBuforaL: 0 })
    expect(r.value.przesunieteKwh).toBe(0)
    expect(r.value.oszczednoscDobaZl).toBeCloseTo(0, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["TAN-BEZ-BUFORA"])
  })

  it("noc nie tańsza (cena × COP) → 🟡 brak oszczędności", () => {
    const r = calculateTaryfaNocnaPompyCiepla({ ...baza, cenaNocZlKwh: 1 })
    expect(r.value.oszczednoscDobaZl).toBeCloseTo(0, 9)
    expect(r.warnings.map((w) => `${w.code}:${w.level}`)).toContain("TAN-BRAK-OSZCZEDNOSCI:warning")
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("źródło 5.59: noc z baterii → 🟡 „licz się z rozładowaniem”; z agregatu → ℹ️; z sieci → bez ostrzeżenia", () => {
    const bateria = calculateTaryfaNocnaPompyCiepla({ ...baza, zasilanieNocy: "bateria", pojemnoscBuforaL: 5000 })
    expect(bateria.warnings.map((w) => `${w.code}:${w.level}`)).toEqual(["TAN-NOC-Z-BATERII:warning"])
    expect(bateria.status).toBe("VALID_WITH_WARNINGS")
    const agregat = calculateTaryfaNocnaPompyCiepla({ ...baza, zasilanieNocy: "agregat", pojemnoscBuforaL: 5000 })
    expect(agregat.warnings.map((w) => `${w.code}:${w.level}`)).toEqual(["TAN-NOC-Z-AGREGATU:info"])
    expect(agregat.status).toBe("VALID")
  })

  it("brak danych → INCOMPLETE; ujemne, godziny > 24, COP < 1 → INVALID_INPUT", () => {
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, cenaNocZlKwh: 0 }).status).toBe("INCOMPLETE")
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, cieploDobaKwh: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, godzinyNocH: 25 }).status).toBe("INVALID_INPUT")
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, copDzien: 0.5 }).status).toBe("INVALID_INPUT")
  })
})
