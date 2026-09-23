import { describe, expect, it } from "vitest"
import {
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import { calculateOrientacjaPowierzchni } from "../calculator"
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
  const start = Date.UTC(2026, 0, 1)
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

  it("płaszczyzna pozioma: napromieniowanie = Σ GHI (tożsamość modelu przy β = 0)", () => {
    const r = calculateOrientacjaPowierzchni({ ...baza, powierzchnie: [{ nazwa: "Płaski dach", nachylenieDeg: 0, azymutDeg: 180 }] })
    const sumaGhiKwh = dane.reduce((a, d) => a + d.ghi, 0) / 1000
    expect(r.value.powierzchnie[0]!.napromieniowanieRoczneKwhM2).toBeCloseTo(sumaGhiKwh, 6)
  })

  it("tylko rozproszone: ściana pionowa = ½·ΣDHI + ½·ρ·ΣGHI (izotropowo, niezależnie od azymutu)", () => {
    const rozproszone = rokSyntetyczny(100, false)
    const r = calculateOrientacjaPowierzchni({
      ...baza,
      daneGodzinowe: rozproszone,
      albedo: 0.3,
      powierzchnie: [
        { nazwa: "Ściana N", nachylenieDeg: 90, azymutDeg: 0 },
        { nazwa: "Ściana S", nachylenieDeg: 90, azymutDeg: 180 },
      ],
    })
    const sDhi = rozproszone.reduce((a, d) => a + d.dhi, 0) / 1000
    const sGhi = rozproszone.reduce((a, d) => a + d.ghi, 0) / 1000
    const oczekiwane = 0.5 * sDhi + 0.5 * 0.3 * sGhi
    expect(r.value.powierzchnie[0]!.napromieniowanieRoczneKwhM2).toBeCloseTo(oczekiwane, 6)
    expect(r.value.powierzchnie[1]!.napromieniowanieRoczneKwhM2).toBeCloseTo(oczekiwane, 6)
  })

  it("optimum na półkuli północnej skierowane na południe (azymut 180° ± 3°), nachylenie w (20°, 70°)", () => {
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

  it("powierzchnia dokładnie w optimum → 100%", () => {
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
