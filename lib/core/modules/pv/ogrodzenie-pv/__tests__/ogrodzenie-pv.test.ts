import { describe, expect, it } from "vitest"
import { calculateOgrodzeniePv } from "../calculator"
import { glebokoscZagleblenia, wspolczynnikBiernegoParcia } from "../fundament"
import { wlasnosciProfilu } from "../profile"
import type { OgrodzeniePvInput } from "../input"

const BAZA: OgrodzeniePvInput = {
  dlugoscPanelaMm: 1700,
  wysokoscPanelaMm: 1100,
  grubDoscPanelaMm: 30,
  szczelinaPionowaMm: 20,
  szczelinaPoziomaMm: 20,
  przeswitMm: 300,
  liczbaRzedow: null,
  maxWysokoscMm: 2200,
  dlugoscOgrodzeniaM: 20,
  strefaWiatrowa: 2,
  wysokoscNpmM: 100,
  kategoriaTerenu: "II",
  grupaGruntu: "pr-ps",
  stopienZageszczeniaId: 0.5,
  wilgotnoscGruntu: "wilgotne",
  gruntPodWoda: false,
  glebokoscPrzemarzaniaM: 1,
  gatunekStali: "S235",
  metodaOporuGruntu: "zachowawcza",
  ugiecieDopuszczalneMm: null,
}

describe("ogrodzenie PV — rdzeń", () => {
  it("fills the height limit with rows (300 + 1100 + 20 + 1100 = 2520 > 2200 → 1 row)", () => {
    const r = calculateOgrodzeniePv(BAZA)
    expect(r.status).toBe("ESTIMATE")
    expect(r.value.rzedy).toBe(1)
    expect(r.value.wysokoscCalkowitaMm).toBe(1400)
  })

  it("two rows fit under a higher limit", () => {
    const r = calculateOgrodzeniePv({ ...BAZA, maxWysokoscMm: 2600 })
    expect(r.value.rzedy).toBe(2)
    expect(r.value.wysokoscCalkowitaMm).toBe(300 + 1100 + 20 + 1100)
  })

  it("is INCOMPLETE without required data and INVALID_INPUT for I_D outside the chart", () => {
    expect(calculateOgrodzeniePv({ ...BAZA, dlugoscPanelaMm: 0 }).status).toBe("INCOMPLETE")
    expect(calculateOgrodzeniePv({ ...BAZA, liczbaRzedow: null, maxWysokoscMm: null }).status).toBe("INCOMPLETE")
    expect(calculateOgrodzeniePv({ ...BAZA, stopienZageszczeniaId: 0.1 }).status).toBe("INVALID_INPUT")
  })

  it("rejects a height limit lower than clearance + one row", () => {
    const r = calculateOgrodzeniePv({ ...BAZA, maxWysokoscMm: 1000 })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings.map((w) => w.code)).toContain("OG-BRAK-MIEJSCA-NA-PANEL")
  })

  it("warns when the clearance is below 250 mm and when the entered rows exceed the limit", () => {
    const r = calculateOgrodzeniePv({ ...BAZA, przeswitMm: 200, liczbaRzedow: 2 })
    const kody = r.warnings.map((w) => w.code)
    expect(kody).toContain("OG-PRZESWIT-ZA-MALY")
    expect(kody).toContain("OG-WYSOKOSC-PRZEKROCZONA")
  })

  it("wind per 7.4.3: signboard cf 1.80 with ze = z_g + h/2, and the force/moment recompute by hand", () => {
    const r = calculateOgrodzeniePv(BAZA)
    const v = r.value
    expect(v.cf).toBe(1.8)
    expect(v.zeM).toBeCloseTo(0.3 + 1.1 / 2, 9)
    const s = v.rozstawSlupkowMm / 1000
    expect(v.silaNaSlupekN).toBeCloseTo(1.8 * v.qpPa * s * 1.1, 6)
    expect(v.momentProjektowyNm).toBeCloseTo(1.5 * v.silaNaSlupekN * (0.3 + 0.55), 6)
  })

  it("treats panels very low and wide as a free-standing wall (cp,net 3.4, ze = H)", () => {
    const r = calculateOgrodzeniePv({ ...BAZA, przeswitMm: 250, wysokoscPanelaMm: 1600, maxWysokoscMm: null, liczbaRzedow: 1 })
    expect(r.value.cf).toBe(3.4)
    expect(r.warnings.map((w) => w.code)).toContain("OG-SCIANA-WOLNOSTOJACA")
  })

  it("selected post passes the bending check; a stronger steel never gives a heavier post", () => {
    const s235 = calculateOgrodzeniePv(BAZA).value.slupek
    const s355 = calculateOgrodzeniePv({ ...BAZA, gatunekStali: "S355" }).value.slupek
    expect(s235).not.toBeNull()
    expect(s235!.wykorzystanie).toBeLessThanOrEqual(1)
    const pole = (p: { profil: { glebokoscMm: number; szerokoscMm: number; grubosciMm: number } }) =>
      wlasnosciProfilu(p.profil, "S235").poleMm2
    expect(pole(s355!)).toBeLessThanOrEqual(pole(s235!))
  })

  it("section properties of a 60×40×3 tube", () => {
    const w = wlasnosciProfilu({ glebokoscMm: 60, szerokoscMm: 40, grubosciMm: 3 }, "S235")
    expect(w.poleMm2).toBeCloseTo(60 * 40 - 34 * 54, 9)
    expect(w.momentBezwladnosciMm4).toBeCloseTo((40 * 60 ** 3 - 34 * 54 ** 3) / 12, 6)
    expect(w.wskaznikWelMm3).toBeCloseTo((2 * w.momentBezwladnosciMm4) / 60, 9)
  })

  it("pier embedment: the Broms factor needs a shallower pier than the conservative one, and frost depth is a floor", () => {
    const r = calculateOgrodzeniePv(BAZA).value.fundament!
    expect(r.zaglebienieBromsM).toBeLessThan(r.zaglebienieZachowawczaM)
    expect(r.zaglebienieKoncoweMm).toBeGreaterThanOrEqual(1000)
    const glebokie = calculateOgrodzeniePv({ ...BAZA, glebokoscPrzemarzaniaM: 3 }).value.fundament!
    expect(glebokie.zaglebienieKoncoweMm).toBe(3000)
    expect(glebokie.przemarzanieDecyduje).toBe(true)
  })

  it("embedment solves H_u(L) = H_d exactly", () => {
    const kp = wspolczynnikBiernegoParcia(33)
    const l = glebokoscZagleblenia(2000, 0.9, 0.3, 18000, kp, "zachowawcza")
    const hu = (1 / 6) * 18000 * 0.3 * kp * l ** 3 / (0.9 + l)
    expect(hu).toBeCloseTo(2000, 6)
  })

  it("heavier soil below the water table needs a deeper pier", () => {
    const sucho = calculateOgrodzeniePv(BAZA).value.fundament!
    const woda = calculateOgrodzeniePv({ ...BAZA, gruntPodWoda: true }).value.fundament!
    expect(woda.zaglebienieWybraneM).toBeGreaterThan(sucho.zaglebienieWybraneM)
  })

  it("counts posts and panels for the entered fence length", () => {
    const v = calculateOgrodzeniePv(BAZA).value
    expect(v.liczbaPaneliWRzedzie).toBe(Math.ceil(20000 / v.rozstawSlupkowMm))
    expect(v.liczbaSlupkow).toBe((v.liczbaPaneliWRzedzie as number) + 1)
  })
})
