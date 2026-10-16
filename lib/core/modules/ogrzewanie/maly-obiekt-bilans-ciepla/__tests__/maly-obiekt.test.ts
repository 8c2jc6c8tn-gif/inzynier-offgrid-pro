import { describe, expect, it } from "vitest"
import { wspolczynnikStratWentylacyjnychWK } from "../../infiltracja-powietrza/calculator"
import { calculateMalyObiektCiepla, wejscieZMalegoObiektu } from "../calculator"
import type { MalyObiektCieplaInput } from "../input"

/** Camper 4 × 2 × 2 m: walls 2·(4+2)·2 = 24 m² brutto − 2 m² openings = 22 m², roof = floor = 8 m², V = 16 m³; θi 20 °C, zone III (θe −20 °C). */
const kamper = (z: Partial<MalyObiektCieplaInput> = {}): MalyObiektCieplaInput => ({
  dlugoscM: 4,
  szerokoscM: 2,
  wysokoscM: 2,
  uScianWM2K: 0.5,
  uDachuWM2K: 0.4,
  uPodlogiWM2K: 0.6,
  podlogaNadPowietrzem: true,
  temperaturaPodPodlogaC: null,
  otworyM2: 2,
  uOtworowWM2K: 2,
  temperaturaWewnetrznaC: 20,
  strefaKlimatyczna: 3,
  wymianyPowietrzaNaH: 1,
  sprawnoscOdzyskuPct: null,
  cop: null,
  paliwo: null,
  srednieTemperaturyMiesieczneC: Array(12).fill(null),
  miesiaceUzytkowania: [],
  ...z,
})

describe("calculateMalyObiektCiepla — geometria i straty (obliczenie ręczne)", () => {
  it("powierzchnie: ściany 22 m² netto, dach i podłoga 8 m², kubatura 16 m³", () => {
    const w = calculateMalyObiektCiepla(kamper())
    expect(w.value).not.toBeNull()
    expect(w.value!.scianyNettoM2).toBe(22)
    expect(w.value!.dachM2).toBe(8)
    expect(w.value!.podlogaM2).toBe(8)
    expect(w.value!.kubaturaM3).toBe(16)
  })

  it("przenikanie: (22·0,5 + 8·0,4 + 8·0,6 + 2·2) = 23 W/K × 40 K = 920 W; wentylacja z silnika infiltracji", () => {
    const v = calculateMalyObiektCiepla(kamper()).value!.obciazenie
    expect(v.strataPrzenikanieW).toBeCloseTo(920, 6)
    expect(v.hvWK).toBeCloseTo(wspolczynnikStratWentylacyjnychWK(1, 16), 9)
    expect(v.obciazenieW).toBeCloseTo(920 + wspolczynnikStratWentylacyjnychWK(1, 16) * 40, 6)
  })

  it("podłoga nad gruntem w stałej temperaturze: różnica (20 − 5) = 15 K zamiast 40 K", () => {
    const v = calculateMalyObiektCiepla(kamper({ podlogaNadPowietrzem: false, temperaturaPodPodlogaC: 5 })).value!.obciazenie
    // ściany + dach + otwory: (11 + 3,2 + 4) · 40 = 728; podłoga: 4,8 · 15 = 72
    expect(v.strataPrzenikanieW).toBeCloseTo(728 + 72, 6)
  })

  it("brak U albo wymiaru → INCOMPLETE, nic nie jest zgadywane", () => {
    expect(calculateMalyObiektCiepla(kamper({ uDachuWM2K: null })).status).toBe("INCOMPLETE")
    expect(calculateMalyObiektCiepla(kamper({ otworyM2: null })).status).toBe("INCOMPLETE")
    expect(calculateMalyObiektCiepla(kamper({ podlogaNadPowietrzem: null })).status).toBe("INCOMPLETE")
    expect(wejscieZMalegoObiektu(kamper({ dlugoscM: null }))).toBeNull()
  })
})

describe("calculateMalyObiektCiepla — walidacja", () => {
  it("otwory większe niż ściany → INVALID_INPUT z krytycznym ostrzeżeniem", () => {
    const w = calculateMalyObiektCiepla(kamper({ otworyM2: 24 }))
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.code).toBe("MOBIEKT-OTWORY-WIEKSZE-NIZ-SCIANY")
  })

  it("wymiar ≤ 0 albo ujemne otwory → INVALID_INPUT", () => {
    expect(calculateMalyObiektCiepla(kamper({ wysokoscM: 0 })).warnings[0]!.code).toBe("MOBIEKT-WYMIAR-NIEDODATNI")
    expect(calculateMalyObiektCiepla(kamper({ otworyM2: -1 })).warnings[0]!.code).toBe("MOBIEKT-WARTOSC-UJEMNA")
  })
})

describe("calculateMalyObiektCiepla — energia w miesiącach użytkowania", () => {
  const temp = [-3, -2, 2, 8, 13, 16, 18, 18, 13, 8, 3, -1]
  const uzywane = (...m: number[]) => Array.from({ length: 12 }, (_, i) => m.includes(i + 1))

  it("grzałka (COP 1): energia = ciepło miesiąca, tylko w miesiącach użytkowania; poza nimi 0", () => {
    const w = calculateMalyObiektCiepla(kamper({ cop: 1, srednieTemperaturyMiesieczneC: temp, miesiaceUzytkowania: uzywane(1, 2, 12) }))
    const miesiace = w.value!.obciazenie.miesiace!
    const e = w.value!.energiaElektrycznaUzytkowanieKwh!
    expect(e[0]).toBeCloseTo(miesiace[0]!.cieploKwh, 6)
    expect(e[1]).toBeCloseTo(miesiace[1]!.cieploKwh, 6)
    expect(e[11]).toBeCloseTo(miesiace[11]!.cieploKwh, 6)
    expect(e[5]).toBe(0)
    expect(w.value!.rokUzytkowaniaKwh).toBeCloseTo(e[0]! + e[1]! + e[11]!, 6)
    // styczeń: (23 + H_V) W/K × (20 − (−3)) K × 24 h × 31 d / 1000
    const hv = wspolczynnikStratWentylacyjnychWK(1, 16)
    expect(e[0]).toBeCloseTo(((23 + hv) * 23 * 24 * 31) / 1000, 6)
  })

  it("COP 3 dzieli energię przez 3", () => {
    const a = calculateMalyObiektCiepla(kamper({ cop: 1, srednieTemperaturyMiesieczneC: temp, miesiaceUzytkowania: uzywane(1) })).value!.energiaElektrycznaUzytkowanieKwh![0]!
    const b = calculateMalyObiektCiepla(kamper({ cop: 3, srednieTemperaturyMiesieczneC: temp, miesiaceUzytkowania: uzywane(1) })).value!.energiaElektrycznaUzytkowanieKwh![0]!
    expect(b).toBeCloseTo(a / 3, 6)
  })

  it("bez miesięcy użytkowania: brak sumy i informacja; bez 12 temperatur albo bez COP: brak sumy", () => {
    const bezMiesiecy = calculateMalyObiektCiepla(kamper({ cop: 1, srednieTemperaturyMiesieczneC: temp }))
    expect(bezMiesiecy.value!.energiaElektrycznaUzytkowanieKwh).toBeNull()
    expect(bezMiesiecy.warnings.some((x) => x.code === "MOBIEKT-BRAK-MIESIECY-UZYTKOWANIA")).toBe(true)
    expect(calculateMalyObiektCiepla(kamper({ cop: 1, srednieTemperaturyMiesieczneC: temp.map((x, i) => (i === 3 ? null : x)), miesiaceUzytkowania: uzywane(1) })).value!.energiaElektrycznaUzytkowanieKwh).toBeNull()
    expect(calculateMalyObiektCiepla(kamper({ srednieTemperaturyMiesieczneC: temp, miesiaceUzytkowania: uzywane(1) })).value!.energiaElektrycznaUzytkowanieKwh).toBeNull()
  })

  it("źródło na paliwo (np. nagrzewnica): COP ignorowany, zapas liczony przez silnik M6/E1", () => {
    const w = calculateMalyObiektCiepla(
      kamper({ cop: 1, paliwo: { jednostka: "l", wartoscOpalowaKwh: 10, sprawnoscPct: 80, zapas: 20 }, srednieTemperaturyMiesieczneC: temp, miesiaceUzytkowania: uzywane(1) }),
    )
    expect(w.value!.energiaElektrycznaUzytkowanieKwh).toBeNull()
    expect(w.value!.obciazenie.paliwo!.zapasCieplaKwh).toBeCloseTo(20 * 10 * 0.8, 6)
  })
})
