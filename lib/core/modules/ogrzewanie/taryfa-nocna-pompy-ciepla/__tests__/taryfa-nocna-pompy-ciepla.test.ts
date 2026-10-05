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
  profilGodzinowy: [],
  godzinyStrefyNocnej: [],
  stratyBuforaKwhDoba: 0,
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
    expect(r.warnings.map((w) => w.code)).toEqual(["TAN-BUFOR-NIE-POKRYWA-DNIA", "TAN-COP-NOC-NIE-PODANY"])
    expect(r.assumptions).toContainEqual({ kod: "TAN-ZAL-ROWNOMIERNE" })
    expect(r.assumptions).toContainEqual({ kod: "TAN-ZAL-BEZ-STRAT-BUFORA" })
    expect(r.value.udzialNocyPct).toBeCloseTo(50, 9)
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
    expect(r.warnings.map((w) => w.code)).toEqual(["TAN-BEZ-BUFORA", "TAN-COP-NOC-NIE-PODANY"])
  })

  it("noc nie tańsza (cena × COP) → 🟡 brak oszczędności", () => {
    const r = calculateTaryfaNocnaPompyCiepla({ ...baza, cenaNocZlKwh: 1 })
    expect(r.value.oszczednoscDobaZl).toBeCloseTo(0, 9)
    expect(r.warnings.map((w) => `${w.code}:${w.level}`)).toContain("TAN-BRAK-OSZCZEDNOSCI:warning")
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("źródło 5.59: noc z baterii → 🟡 „licz się z rozładowaniem”; z agregatu → ℹ️; z sieci → bez ostrzeżenia", () => {
    const bateria = calculateTaryfaNocnaPompyCiepla({ ...baza, zasilanieNocy: "bateria", pojemnoscBuforaL: 5000 })
    expect(bateria.warnings.map((w) => `${w.code}:${w.level}`)).toEqual(["TAN-NOC-Z-BATERII:warning", "TAN-COP-NOC-NIE-PODANY:info"])
    expect(bateria.status).toBe("VALID_WITH_WARNINGS")
    const agregat = calculateTaryfaNocnaPompyCiepla({ ...baza, zasilanieNocy: "agregat", pojemnoscBuforaL: 5000 })
    expect(agregat.warnings.map((w) => `${w.code}:${w.level}`)).toEqual(["TAN-NOC-Z-AGREGATU:info", "TAN-COP-NOC-NIE-PODANY:info"])
    expect(agregat.status).toBe("VALID")
  })

  it("brak danych → INCOMPLETE; ujemne, godziny > 24, COP < 1 → INVALID_INPUT", () => {
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, cenaNocZlKwh: 0 }).status).toBe("INCOMPLETE")
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, cieploDobaKwh: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, godzinyNocH: 25 }).status).toBe("INVALID_INPUT")
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, copDzien: 0.5 }).status).toBe("INVALID_INPUT")
  })

  it("decyzja 04.10 pkt 3: COP nocy wpisany → bez ℹ️ o COP nocnym; pusty → ℹ️, nie 🟡 (status VALID)", () => {
    const wpisany = calculateTaryfaNocnaPompyCiepla({ ...baza, copNoc: 2.5, pojemnoscBuforaL: 5000 })
    expect(wpisany.warnings.map((w) => w.code)).not.toContain("TAN-COP-NOC-NIE-PODANY")
    const pusty = calculateTaryfaNocnaPompyCiepla({ ...baza, pojemnoscBuforaL: 5000 })
    expect(pusty.warnings.map((w) => `${w.code}:${w.level}`)).toEqual(["TAN-COP-NOC-NIE-PODANY:info"])
    expect(pusty.status).toBe("VALID")
  })

  it("decyzja 04.10 pkt 2: straty bufora doliczone do strefy nocnej tylko przy przesunięciu", () => {
    const bufor = 500 * 20 * WSPOLCZYNNIK_KWH_NA_L_K
    const r = calculateTaryfaNocnaPompyCiepla({ ...baza, stratyBuforaKwhDoba: 3 })
    expect(r.value.stratyBuforaKwh).toBe(3)
    expect(r.value.kosztZPrzesunieciemZl).toBeCloseTo(((24 - bufor) / 3) * 1 + ((24 + bufor + 3) / 3) * 0.5, 9)
    expect(r.value.pradNocKwh).toBeCloseTo((24 + bufor + 3) / 3, 9)
    expect(r.value.oszczednoscDobaZl).toBeCloseTo((bufor / 3) * 0.5 - (3 / 3) * 0.5, 9)
    expect(r.assumptions).toContainEqual({ kod: "TAN-ZAL-STRATY-BUFORA" })
    expect(r.assumptions).not.toContainEqual({ kod: "TAN-ZAL-BEZ-STRAT-BUFORA" })
    // No buffer → nothing shifted → losses not counted.
    const bez = calculateTaryfaNocnaPompyCiepla({ ...baza, pojemnoscBuforaL: 0, stratyBuforaKwhDoba: 3 })
    expect(bez.value.stratyBuforaKwh).toBe(0)
    expect(bez.value.kosztZPrzesunieciemZl).toBeCloseTo(bez.value.kosztBezPrzesuniecaZl, 9)
  })

  it("straty większe niż zysk z różnicy cen → 🟡 brak oszczędności", () => {
    const r = calculateTaryfaNocnaPompyCiepla({ ...baza, stratyBuforaKwhDoba: 20 })
    expect(r.value.oszczednoscDobaZl).toBeLessThan(0)
    expect(r.warnings.map((w) => w.code)).toContain("TAN-BRAK-OSZCZEDNOSCI")
  })

  it("decyzja 04.10 pkt 1: profil godzinowy usera — udział nocy = udział profilu w godzinach strefy", () => {
    // Weight 2 in hours 0–5, 1 elsewhere: sum = 12 + 18 = 30; zone 22–6 (8 h) holds 2·6 + 1·2 = 14 → 14/30.
    const profil = Array.from({ length: 24 }, (_, h) => (h < 6 ? 2 : 1))
    const strefa = [22, 23, 0, 1, 2, 3, 4, 5]
    const r = calculateTaryfaNocnaPompyCiepla({ ...baza, godzinyNocH: 8, profilGodzinowy: profil, godzinyStrefyNocnej: strefa })
    const noc = (48 * 14) / 30
    expect(r.value.udzialNocyPct).toBeCloseTo((14 / 30) * 100, 9)
    expect(r.value.kosztBezPrzesuniecaZl).toBeCloseTo(((48 - noc) / 3) * 1 + (noc / 3) * 0.5, 9)
    expect(r.assumptions).toContainEqual({ kod: "TAN-ZAL-PROFIL-USERA" })
    expect(r.assumptions).not.toContainEqual({ kod: "TAN-ZAL-ROWNOMIERNE" })
    // A flat profile gives the same result as no profile.
    const plaski = calculateTaryfaNocnaPompyCiepla({
      ...baza,
      godzinyNocH: 8,
      profilGodzinowy: Array(24).fill(5),
      godzinyStrefyNocnej: strefa,
    })
    const rowno = calculateTaryfaNocnaPompyCiepla({ ...baza, godzinyNocH: 8 })
    expect(plaski.value.kosztZPrzesunieciemZl).toBeCloseTo(rowno.value.kosztZPrzesunieciemZl, 9)
  })

  it("profil: zła liczba wartości, ujemna waga, suma 0, brak godzin strefy, godziny niezgodne z długością → INVALID_INPUT", () => {
    const strefa = [22, 23, 0, 1, 2, 3, 4, 5]
    const kody = (zmiana: Partial<TaryfaNocnaPompyCieplaInput>) =>
      calculateTaryfaNocnaPompyCiepla({ ...baza, godzinyNocH: 8, ...zmiana }).warnings.map((w) => w.code)
    expect(kody({ profilGodzinowy: [1, 2, 3], godzinyStrefyNocnej: strefa })).toContain("TAN-PROFIL-POZA-ZAKRESEM")
    expect(kody({ profilGodzinowy: [-1, ...Array(23).fill(1)], godzinyStrefyNocnej: strefa })).toContain("TAN-PROFIL-POZA-ZAKRESEM")
    expect(kody({ profilGodzinowy: Array(24).fill(0), godzinyStrefyNocnej: strefa })).toContain("TAN-PROFIL-POZA-ZAKRESEM")
    expect(kody({ profilGodzinowy: Array(24).fill(1) })).toContain("TAN-PROFIL-BEZ-STREFY")
    expect(kody({ profilGodzinowy: Array(24).fill(1), godzinyStrefyNocnej: [22, 23] })).toContain("TAN-STREFA-NIEZGODNA-Z-DLUGOSCIA")
    expect(kody({ profilGodzinowy: Array(24).fill(1), godzinyStrefyNocnej: [24, 1, 1, 2, 3, 4, 5, 6] })).toContain("TAN-STREFA-POZA-ZAKRESEM")
    expect(calculateTaryfaNocnaPompyCiepla({ ...baza, stratyBuforaKwhDoba: -1 }).status).toBe("INVALID_INPUT")
  })
})
