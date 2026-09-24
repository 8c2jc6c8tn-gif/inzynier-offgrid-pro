import { describe, expect, it } from "vitest"
import {
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import { calculateOrientacjaPowierzchni, fMuneera, katHoryzontuDeg } from "../calculator"
import type { OrientacjaPowierzchniInput, RekordGodzinowy } from "../input"

const LAT = 52.23
/** Długość 0° — godziny UTC ≈ czas słoneczny, dane symetryczne wokół południa. */
const LON = 0

/**
 * Syntetyczny rok godzinowy (NIE dane klimatyczne): DNI z modelu Meinela, stałe DHI przy słońcu
 * nad horyzontem, GHI = DNI·sin h + DHI (zamknięcie bilansu). Tylko do sprawdzenia matematyki modelu.
 */
function rokSyntetyczny(dhiStale: number, zBezposrednim = true): RekordGodzinowy[] {
  const dane: RekordGodzinowy[] = []
  // Próbki w połowie godziny (HH:30): przy długości 0° leżą niemal symetrycznie wokół południa
  // słonecznego — próbki HH:00 dają sztuczną asymetrię rano/po południu, wzmacnianą przez człon
  // okołosłoneczny Muneera (optimum przesunięte do ~184° bez tej zmiany).
  const start = Date.UTC(2026, 0, 1, 0, 30)
  for (let h = 0; h < 8760; h++) {
    const t = start + h * 3_600_000
    const p = pozycjaSlonca(LAT, LON, t)
    const nad = p.wysokoscDeg > 0
    const dni = nad && zBezposrednim ? 1000 * promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) : 0
    const dhi = nad ? dhiStale : 0
    dane.push({ czasUtcMs: t, dni, dhi, ghi: dni * Math.sin((p.wysokoscDeg * Math.PI) / 180) * (nad ? 1 : 0) + dhi })
  }
  return dane
}

const dane = rokSyntetyczny(80)
const baza: OrientacjaPowierzchniInput = { szerokoscGeograficzna: LAT, dlugoscGeograficzna: LON, daneGodzinowe: dane }

describe("calculateOrientacjaPowierzchni", () => {
  it("brak danych → INCOMPLETE", () => {
    expect(calculateOrientacjaPowierzchni({}).status).toBe("INCOMPLETE")
  })

  it("płaszczyzna pozioma: napromieniowanie ≈ Σ GHI (tożsamość modelu przy β = 0; odchylenie < 1% tylko z korekty niskiego słońca, równ. 30)", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "Płaski dach", nachylenieDeg: 0, azymutDeg: 180 }] })
    const sumaGhiKwh = dane.reduce((a, d) => a + d.ghi, 0) / 1000
    const h = r.value.powierzchnie[0]!.napromieniowanieRoczneKwhM2
    expect(h).toBeLessThanOrEqual(sumaGhiKwh + 1e-9)
    expect(h / sumaGhiKwh).toBeGreaterThan(0.99)
  })

  it("F(β) Muneera — wartości z wzoru EUR 26075: β = 0 → 1; ściana pionowa, N = 0,25227 → 0,5 + 0,25227·(1 − π/2)", () => {
    expect(fMuneera(0, 0.25227)).toBeCloseTo(1, 12)
    expect(fMuneera(90, 0.25227)).toBeCloseTo(0.5 + 0.25227 * (1 - Math.PI / 2), 12)
    // N = 0 → czysto izotropowy (1 + cos β)/2.
    expect(fMuneera(35, 0)).toBeCloseTo((1 + Math.cos((35 * Math.PI) / 180)) / 2, 12)
  })

  it("dach południowy 35° przy czystym niebie: Muneer > izotropowy (anizotropia okołosłoneczna, EUR 26075)", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "S35", nachylenieDeg: 35, azymutDeg: 180 }] })
    const b = (35 * Math.PI) / 180
    let izoWh = 0
    for (const d of dane) {
      const p = pozycjaSlonca(LAT, LON, d.czasUtcMs)
      const z = ((90 - p.wysokoscDeg) * Math.PI) / 180
      const cosT = Math.cos(z) * Math.cos(b) + Math.sin(z) * Math.sin(b) * Math.cos(((p.azymutDeg - 180) * Math.PI) / 180)
      izoWh += (p.wysokoscDeg > 0 && cosT > 0 ? d.dni * cosT : 0) + (d.dhi * (1 + Math.cos(b))) / 2 + (d.ghi * 0.2 * (1 - Math.cos(b))) / 2
    }
    expect(r.value.powierzchnie[0]!.napromieniowanieRoczneKwhM2).toBeGreaterThan(izoWh / 1000)
  })

  it("optimum na półkuli północnej skierowane na południe (azymut 180° ± 3°), nachylenie w (20°, 70°)", { timeout: 30_000 }, () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "x", nachylenieDeg: 35, azymutDeg: 180 }] })
    expect(Math.abs(r.value.optimum.azymutDeg - 180)).toBeLessThanOrEqual(3)
    expect(r.value.optimum.nachylenieDeg).toBeGreaterThan(20)
    expect(r.value.optimum.nachylenieDeg).toBeLessThan(70)
  })

  it("ranking: dach południowy > elewacja wschodnia > ściana północna; żaden wskaźnik > 100%", () => {
    const r = calculateOrientacjaPowierzchni({
      ...baza,
      powierzchnie: [
        { nazwa: "Dach południowy", nachylenieDeg: 35, azymutDeg: 180 },
        { nazwa: "Elewacja wschodnia", nachylenieDeg: 90, azymutDeg: 90 },
        { nazwa: "Ściana północna", nachylenieDeg: 90, azymutDeg: 0 },
      ],
    })
    const [s, e, n] = r.value.powierzchnie.map((p) => p.wskaznikProcent)
    expect(s!).toBeGreaterThan(e!)
    expect(e!).toBeGreaterThan(n!)
    for (const p of r.value.powierzchnie) expect(p.wskaznikProcent).toBeLessThanOrEqual(100)
    expect(r.status).toBe("VALID")
  })

  it("powierzchnia dokładnie w optimum → 100%", { timeout: 30_000 }, () => {
    const r0 = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "x", nachylenieDeg: 0, azymutDeg: 0 }] })
    const { nachylenieDeg, azymutDeg } = r0.value.optimum
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "opt", nachylenieDeg, azymutDeg }] })
    expect(r.value.powierzchnie[0]!.wskaznikProcent).toBeCloseTo(100, 9)
  })

  it("niepełny rok danych → INVALID_INPUT", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, daneGodzinowe: dane.slice(0, 100), powierzchnie: [{ nazwa: "x", nachylenieDeg: 30, azymutDeg: 180 }] })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.code).toBe("ORIENTACJA-DANE-NIEPELNY-ROK")
  })

  it("ujemne promieniowanie → INVALID_INPUT", () => {
    const zle = dane.map((d, i) => (i === 5 ? { ...d, ghi: -1 } : d))
    const r = calculateOrientacjaPowierzchni({ ...baza, daneGodzinowe: zle, powierzchnie: [{ nazwa: "x", nachylenieDeg: 30, azymutDeg: 180 }] })
    expect(r.status).toBe("INVALID_INPUT")
  })

  it("nachylenie powierzchni poza [0, 90] → INVALID_INPUT", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "x", nachylenieDeg: 95, azymutDeg: 180 }] })
    expect(r.status).toBe("INVALID_INPUT")
  })

  it("albedo raportowane jako założenie (domyślne 0,2)", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "x", nachylenieDeg: 30, azymutDeg: 180 }] })
    expect(r.assumptions).toContainEqual({ kod: "ORIENTACJA-ZALOZENIE-ALBEDO", params: { albedo: 0.2 } })
  })
})

describe("zacienienie z profilu horyzontu (TD15 punkt 2)", () => {
  const S35 = { nazwa: "S35", nachylenieDeg: 35, azymutDeg: 180 }
  const plaski = (kat: number) => new Array<number>(360).fill(kat)
  /** Przeszkoda tylko w sektorze południowym (150°–210°) o zadanym kącie. */
  const poludnie = (kat: number) => plaski(0).map((_, az) => (az >= 150 && az <= 210 ? kat : 0))

  it("interpolacja profilu: liniowo między próbkami, zawinięcie przez 360°", () => {
    const profil = [0, 10, 20, 30]
    expect(katHoryzontuDeg(profil, 45)).toBeCloseTo(5, 12)
    expect(katHoryzontuDeg(profil, 315)).toBeCloseTo(15, 12)
    expect(katHoryzontuDeg(profil, 360)).toBeCloseTo(0, 12)
  })

  it("horyzont zerowy → wynik identyczny jak bez profilu, strata 0%", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [S35, { ...S35, nazwa: "z0", horyzontyDeg: [plaski(0)] }] })
    const [bez, z0] = r.value.powierzchnie
    expect(z0!.napromieniowanieRoczneKwhM2).toBeCloseTo(bez!.napromieniowanieRoczneKwhM2, 9)
    expect(z0!.strataZacienieniaProcent).toBe(0)
    expect(bez!.strataZacienieniaProcent).toBeNull()
  })

  it("horyzont 90° dookoła → tożsamość: tylko rozproszone jak dla powierzchni zacienionej (równ. 28) + odbite", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ ...S35, horyzontyDeg: [plaski(90)] }] })
    const b = (35 * Math.PI) / 180
    const f = fMuneera(35, 0.25227)
    const oczekiwaneWh = dane.reduce((a, d) => a + d.dhi * f + (d.ghi * 0.2 * (1 - Math.cos(b))) / 2, 0)
    expect(r.value.powierzchnie[0]!.napromieniowanieRoczneKwhM2).toBeCloseTo(oczekiwaneWh / 1000, 6)
  })

  it("przeszkoda od południa: strata > 0, wskaźnik niższy niż bez przeszkód; optimum lokalizacji bez zmian", () => {
    const r0 = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [S35] })
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ ...S35, horyzontyDeg: [poludnie(20)] }] })
    const o = r.value.powierzchnie[0]!
    expect(o.strataZacienieniaProcent!).toBeGreaterThan(0)
    expect(o.napromieniowanieBezZacienieniaKwhM2).toBeCloseTo(r0.value.powierzchnie[0]!.napromieniowanieRoczneKwhM2, 9)
    expect(o.wskaznikProcent).toBeLessThan(r0.value.powierzchnie[0]!.wskaznikProcent)
    expect(r.value.optimum).toEqual(r0.value.optimum)
    // Wyższa przeszkoda → większa strata.
    const wyzsza = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ ...S35, horyzontyDeg: [poludnie(40)] }] })
    expect(wyzsza.value.powierzchnie[0]!.strataZacienieniaProcent!).toBeGreaterThan(o.strataZacienieniaProcent!)
  })

  it("kilka punktów powierzchni → średnia napromieniowania punktów", () => {
    const jeden = (h: number[]) =>
      calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ ...S35, horyzontyDeg: [h] }] }).value.powierzchnie[0]!
        .napromieniowanieRoczneKwhM2
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ ...S35, horyzontyDeg: [plaski(0), poludnie(30)] }] })
    expect(r.value.powierzchnie[0]!.napromieniowanieRoczneKwhM2).toBeCloseTo((jeden(plaski(0)) + jeden(poludnie(30))) / 2, 9)
  })

  it("założenia: model horyzontu dla powierzchni z profilem, lista powierzchni bez profilu", () => {
    const r = calculateOrientacjaPowierzchni({
      ...baza,
      powierzchnie: [{ ...S35, horyzontyDeg: [poludnie(10)] }, { nazwa: "Elewacja S", nachylenieDeg: 90, azymutDeg: 180 }],
    })
    expect(r.assumptions).toContainEqual({ kod: "ORIENTACJA-ZALOZENIE-ZACIENIENIE-HORYZONT" })
    expect(r.assumptions).toContainEqual({ kod: "ORIENTACJA-ZALOZENIE-ZACIENIENIE-BRAK", params: { nazwy: "Elewacja S" } })
  })

  it("profil pusty albo kąt poza [0, 90] → INVALID_INPUT", () => {
    for (const h of [[], plaski(95), [Number.NaN]]) {
      const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ ...S35, horyzontyDeg: [h] }] })
      expect(r.status).toBe("INVALID_INPUT")
      expect(r.warnings[0]!.code).toBe("ORIENTACJA-HORYZONT-NIEPOPRAWNY")
    }
  })
})
