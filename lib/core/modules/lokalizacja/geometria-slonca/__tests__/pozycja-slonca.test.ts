import { describe, expect, it } from "vitest"
import {
  cosKataPadania,
  deklinacjaIRownanieCzasu,
  masaPowietrza,
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "../pozycja-slonca"

const WARSZAWA = { lat: 52.2297, lon: 21.0122 }
const NACHYLENIE_OSI_ZIEMI = 23.44

/** Maksymalna wysokość słońca w danym dniu UTC, próbkowana co minutę. */
function maksimumDnia(lat: number, lon: number, rok: number, miesiac: number, dzien: number) {
  let best = { wysokoscDeg: -90, azymutDeg: 0 }
  const start = Date.UTC(rok, miesiac - 1, dzien)
  for (let m = 0; m < 1440; m++) {
    const p = pozycjaSlonca(lat, lon, start + m * 60_000)
    if (p.wysokoscDeg > best.wysokoscDeg) best = p
  }
  return best
}

describe("deklinacjaIRownanieCzasu — przykłady liczbowe J. Meeus, Astronomical Algorithms", () => {
  it("Przykład 25.a: 1992-10-13 0h TD (JD 2448908.5) → deklinacja −7,78507°", () => {
    const { deklinacjaDeg } = deklinacjaIRownanieCzasu(2448908.5)
    expect(deklinacjaDeg).toBeCloseTo(-7.78507, 3)
  })

  it("Przykład 28.b: ta sama data → równanie czasu 13 min 42,7 s (≈13,71 min)", () => {
    const { rownanieCzasuMin } = deklinacjaIRownanieCzasu(2448908.5)
    expect(Math.abs(rownanieCzasuMin - 13.712)).toBeLessThan(0.05)
  })
})

describe("pozycjaSlonca — kontrole analityczne", () => {
  it("Warszawa, przesilenie letnie: maks. wysokość ≈ 90° − φ + 23,44°, azymut ≈ 180° (południe)", () => {
    const max = maksimumDnia(WARSZAWA.lat, WARSZAWA.lon, 2026, 6, 21)
    expect(Math.abs(max.wysokoscDeg - (90 - WARSZAWA.lat + NACHYLENIE_OSI_ZIEMI))).toBeLessThan(0.1)
    expect(Math.abs(max.azymutDeg - 180)).toBeLessThan(1)
  })

  it("Warszawa, przesilenie zimowe: maks. wysokość ≈ 90° − φ − 23,44°", () => {
    const max = maksimumDnia(WARSZAWA.lat, WARSZAWA.lon, 2026, 12, 21)
    expect(Math.abs(max.wysokoscDeg - (90 - WARSZAWA.lat - NACHYLENIE_OSI_ZIEMI))).toBeLessThan(0.15)
  })

  it("równik, równonoc: słońce w południe prawie w zenicie (> 88°)", () => {
    const max = maksimumDnia(0, 0, 2026, 3, 20)
    expect(max.wysokoscDeg).toBeGreaterThan(88)
  })

  it("półkula południowa (Sydney, grudzień): słońce w południe na północy (azymut ≈ 0°/360°)", () => {
    const max = maksimumDnia(-33.87, 151.21, 2026, 1, 15)
    const odPolnocy = Math.min(max.azymutDeg, 360 - max.azymutDeg)
    expect(odPolnocy).toBeLessThan(15)
  })

  it("rano azymut na wschodzie (< 180°), wieczorem na zachodzie (> 180°)", () => {
    const dzien = Date.UTC(2026, 5, 21)
    // Warszawa ≈ UTC+1h24m czasu słonecznego: 05:00 UTC ≈ 6:24 czasu słonecznego, 17:00 UTC ≈ 18:24.
    expect(pozycjaSlonca(WARSZAWA.lat, WARSZAWA.lon, dzien + 5 * 3_600_000).azymutDeg).toBeLessThan(180)
    expect(pozycjaSlonca(WARSZAWA.lat, WARSZAWA.lon, dzien + 17 * 3_600_000).azymutDeg).toBeGreaterThan(180)
  })

  it("w nocy słońce pod horyzontem", () => {
    const polnocUtc = Date.UTC(2026, 11, 21, 0, 0)
    expect(pozycjaSlonca(WARSZAWA.lat, WARSZAWA.lon, polnocUtc).wysokoscDeg).toBeLessThan(-40)
  })
})

describe("cosKataPadania (Duffie–Beckman 1.6.3)", () => {
  it("płaszczyzna pozioma: cos θ = sin(wysokości słońca)", () => {
    expect(cosKataPadania(30, 123, 0, 180)).toBeCloseTo(Math.sin(Math.PI / 6), 10)
  })

  it("płaszczyzna prostopadła do promieni: cos θ = 1", () => {
    // Słońce 40° nad horyzontem na południu, płaszczyzna nachylona 50° na południe.
    expect(cosKataPadania(40, 180, 50, 180)).toBeCloseTo(1, 10)
  })

  it("słońce za pionową ścianą północną: cos θ < 0", () => {
    expect(cosKataPadania(30, 180, 90, 0)).toBeLessThan(0)
  })
})

describe("masaPowietrza / promieniowanieBezposrednieCzysteNiebo", () => {
  it("słońce w zenicie: AM ≈ 1", () => {
    expect(masaPowietrza(90)).toBeCloseTo(1, 3)
  })

  it("AM rośnie przy niskim słońcu; słońce pod horyzontem → brak promieniowania", () => {
    expect(masaPowietrza(10)).toBeGreaterThan(masaPowietrza(30))
    expect(promieniowanieBezposrednieCzysteNiebo(-1)).toBe(0)
  })

  it("Meinel: zenit → 1,353·0,7^1 ≈ 0,947 kW/m²", () => {
    expect(promieniowanieBezposrednieCzysteNiebo(90)).toBeCloseTo(1.353 * 0.7, 2)
  })
})
