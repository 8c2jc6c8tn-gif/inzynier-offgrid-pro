import { describe, expect, it } from "vitest"
import { SAMPLE_PROGNOZA_24H } from "../../prognozy/constants"
import { calculatePrzesuwanieZadan, godzinaTekst } from "../calculator"
import type { ZadanieElastyczne } from "../input"

const zad = (id: string, mocKw: number, czasTrwaniaH: number, najwczesniejOdH: number, gotoweDoH: number): ZadanieElastyczne => ({
  id,
  nazwa: id,
  mocKw,
  czasTrwaniaH,
  najwczesniejOdH,
  gotoweDoH,
})

describe("przesuwanie zadań domowych (M10/E5, dawne 12.10)", () => {
  // Sample forecast of Screen 1: surplus 9–12 h 0,9 kW, 12–15 h 2,8 kW, 15–18 h 1,5 kW, elsewhere 0.
  it("nadwyżka doby z prognozy Ekranu 1 (średnia moc w oknie 3 h)", () => {
    const r = calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [zad("pranie", 2, 1.5, 8, 18)] })
    expect(r.value.nadwyzkaDobyKwh).toBeCloseTo((0.9 + 2.8 + 1.5) * 3, 9)
  })

  it("pranie 2 kW × 1,5 h do 18:00 → start 12:00 (szczyt nadwyżki, remis → najwcześniej), całe z PV", () => {
    const r = calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [zad("pranie", 2, 1.5, 8, 18)] })
    expect(r.status).toBe("VALID")
    const p = r.value.zadania[0]!
    expect(p.startH).toBe(12)
    expect(p.koniecH).toBe(13.5)
    expect(p.zPvKwh).toBeCloseTo(3, 9)
    expect(p.pokryciePvPct).toBeCloseTo(100, 9)
  })

  it("drugie zadanie bierze to, co zostało po pierwszym (kolejność listy = priorytet)", () => {
    const r = calculatePrzesuwanieZadan({
      prognoza: SAMPLE_PROGNOZA_24H,
      zadania: [zad("pranie", 2, 1.5, 8, 18), zad("zmywarka", 1.5, 2, 8, 22)],
    })
    const z = r.value.zadania[1]!
    // 12:00–13:30 left 0,8 kW; 13:30–15:00 2,8 kW; 15:00–18:00 1,5 kW → 13:30 and 14:00 both 3,0 kWh, earliest wins.
    expect(z.startH).toBe(13.5)
    expect(z.zPvKwh).toBeCloseTo(3, 9)
    expect(r.value.zPvRazemKwh).toBeCloseTo(6, 9)
  })

  it("termin ogranicza: zadanie musi być gotowe do 12:00 → nie wychodzi poza okno, część z baterii", () => {
    const r = calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [zad("ev", 3, 2, 6, 12)] })
    const z = r.value.zadania[0]!
    expect(z.koniecH).toBeLessThanOrEqual(12)
    expect(z.startH).toBe(9)
    expect(z.zPvKwh).toBeCloseTo(0.9 * 2, 9)
    expect(z.zBateriiKwh).toBeCloseTo(6 - 1.8, 9)
  })

  it("zadanie nie mieści się w oknie → ⚠️, nie przesunięte poza okno", () => {
    const r = calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [zad("piec", 2, 3, 10, 12)] })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value.zadania[0]!.startH).toBeNull()
    expect(r.warnings.map((w) => w.code)).toEqual(["PRZES-ZADANIE-POZA-OKNEM"])
  })

  it("okno bez nadwyżki (noc) → najwcześniejszy start, ℹ️, całe z baterii", () => {
    const r = calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [zad("noc", 1, 2, 0, 6)] })
    expect(r.value.zadania[0]!.startH).toBe(0)
    expect(r.value.zadania[0]!.zBateriiKwh).toBeCloseTo(2, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["PRZES-ZADANIE-BEZ-NADWYZKI"])
    expect(r.status).toBe("VALID")
  })

  it("dane niepełne → INCOMPLETE; poza siatką 30 min / termin przed startem / poza dobą → INVALID_INPUT", () => {
    expect(calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [] }).status).toBe("INCOMPLETE")
    expect(calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [zad("a", 0, 1, 8, 18)] }).status).toBe("INCOMPLETE")
    const blad = (z: ZadanieElastyczne) => calculatePrzesuwanieZadan({ prognoza: SAMPLE_PROGNOZA_24H, zadania: [z] })
    expect(blad(zad("a", 1, 1.25, 8, 18)).warnings.map((w) => w.code)).toEqual(["PRZES-POZA-SIATKA"])
    expect(blad(zad("a", 1, 1, 18, 8)).warnings.map((w) => w.code)).toEqual(["PRZES-TERMIN-PRZED-STARTEM"])
    expect(blad(zad("a", 1, 1, 8, 25)).warnings.map((w) => w.code)).toEqual(["PRZES-GODZINA-POZA-DOBA"])
    expect(blad(zad("a", -1, 1, 8, 18)).status).toBe("INVALID_INPUT")
  })

  it("godzinaTekst", () => {
    expect(godzinaTekst(11.5)).toBe("11:30")
    expect(godzinaTekst(9)).toBe("9:00")
  })
})
