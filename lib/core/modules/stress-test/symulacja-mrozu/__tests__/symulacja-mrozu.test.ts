import { describe, expect, it } from "vitest"
import type { Assumption } from "@/lib/core/calc-result"
import { calculateSymulacjaMrozu } from "../calculator"
import type { SymulacjaMrozuInput } from "../input"

// Reference values calculated by hand (Directive #3). Building of the M6/E1 example: H_zewn = 120.25 W/K, Φ_st = 360 W, θi = 20 °C
// → at −20 °C: (120.25·40 + 360)·24/1000 = 124.08 kWh/day; at −30 °C: (120.25·50 + 360)·24/1000 = 152.94 kWh/day.
const BUDYNEK = { wspolczynnikStratZewnetrznychWK: 120.25, stalyStrumienStratW: 360, temperaturaWewnetrznaC: 20 }

const BAZA: SymulacjaMrozuInput = {
  produkcjaDobowaKwh: [5, 5, 5],
  korektaProdukcjiPct: 0,
  zuzycieBazoweDobaKwh: 10,
  dodatkoweZuzycieDobaKwh: 0,
  budynek: null,
  zrodloCiepla: null,
  cop: null,
  magazyn: null,
  udzialNocyPct: null,
  scenariusze: [{ temperaturaC: -20, cop: null, spadekPojemnosciPct: null }],
}

const kodZalozenia = (a: Assumption) => (typeof a === "string" ? a : a.kod)
const jeden = (i: SymulacjaMrozuInput) => calculateSymulacjaMrozu(i).value!.scenariusze[0]!

describe("calculateSymulacjaMrozu (M7/E1, dawne 6.1)", () => {
  it("bez budynku: ogrzewanie nie wchodzi do popytu, wynik z ostrzeżeniem; 3 dni po 5 kWh PV przy 10 + 2 kWh popytu → deficyt 7 kWh/dobę, 21 kWh", () => {
    const r = calculateSymulacjaMrozu({ ...BAZA, dodatkoweZuzycieDobaKwh: 2 })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.warnings.map((w) => w.i18nKey)).toContain("SYMMR-BEZ-OGRZEWANIA-BRAK-BUDYNKU")
    expect(r.value!.ogrzewanieWPopycie).toBe(false)
    const s = r.value!.scenariusze[0]!
    expect(s.cieploDobaKwh).toBeNull()
    expect(s.pradOgrzewaniaDobaKwh).toBeNull()
    expect(s.zapotrzebowanieDobaKwh).toBe(12)
    expect(s.deficytMiesiacaKwh).toBeCloseTo(21, 9)
    expect(s.dniZDeficytem).toBe(3)
    expect(s.najdluzszaSeriaDni).toBe(3)
    expect(s.pierwszyDzienZDeficytem).toBe(1)
    expect(s.pokrycieEnergetycznePct).toBeCloseTo(100 * (1 - 21 / 36), 9)
  })

  it("ogrzewanie elektryczne: ciepło 124,08 kWh/dobę przy −20 °C, COP 3 → 41,36 kWh prądu; popyt 51,36; deficyt 46,36 × 3 dni = 139,08", () => {
    const s = jeden({ ...BAZA, budynek: BUDYNEK, zrodloCiepla: "prad", cop: 3 })
    expect(s.cieploDobaKwh).toBeCloseTo(124.08, 9)
    expect(s.pradOgrzewaniaDobaKwh).toBeCloseTo(41.36, 9)
    expect(s.copUzyty).toBe(3)
    expect(s.zapotrzebowanieDobaKwh).toBeCloseTo(51.36, 9)
    expect(s.deficytMiesiacaKwh).toBeCloseTo(139.08, 9)
  })

  it("im zimniej, tym większy popyt: −30 °C → 152,94 kWh ciepła; COP własny scenariusza 2 (pierwszeństwo przed ogólnym 3) → 76,47 kWh prądu", () => {
    const r = calculateSymulacjaMrozu({
      ...BAZA,
      budynek: BUDYNEK,
      zrodloCiepla: "prad",
      cop: 3,
      scenariusze: [
        { temperaturaC: -20, cop: null, spadekPojemnosciPct: null },
        { temperaturaC: -30, cop: 2, spadekPojemnosciPct: null },
      ],
    })
    const [a, b] = r.value!.scenariusze
    expect(a!.pradOgrzewaniaDobaKwh).toBeCloseTo(41.36, 9)
    expect(b!.cieploDobaKwh).toBeCloseTo(152.94, 9)
    expect(b!.copUzyty).toBe(2)
    expect(b!.pradOgrzewaniaDobaKwh).toBeCloseTo(76.47, 9)
    expect(b!.deficytMiesiacaKwh).toBeGreaterThan(a!.deficytMiesiacaKwh)
    expect(r.assumptions.map(kodZalozenia)).toContain("SYMMR-ZAL-COP-STALY")
  })

  it("temperatura wyższa niż wewnętrzna: ciepło nie jest ujemne (0 kWh)", () => {
    const s = jeden({ ...BAZA, budynek: BUDYNEK, zrodloCiepla: "prad", cop: 3, scenariusze: [{ temperaturaC: 20, cop: null, spadekPojemnosciPct: null }] })
    // 120.25·0 + 360 = 360 W stałego strumienia → 8.64 kWh; przy +20 °C ciągle jest strata przez grunt.
    expect(s.cieploDobaKwh).toBeCloseTo(8.64, 9)
    const ciepla = jeden({ ...BAZA, budynek: { ...BUDYNEK, stalyStrumienStratW: -5000 }, zrodloCiepla: "prad", cop: 3, scenariusze: [{ temperaturaC: 15, cop: null, spadekPojemnosciPct: null }] })
    // 120.25·5 − 5000 < 0 → obcięte do 0
    expect(ciepla.cieploDobaKwh).toBe(0)
    expect(ciepla.pradOgrzewaniaDobaKwh).toBe(0)
  })

  it("źródło na paliwo: prąd na ogrzewanie 0, ostrzeżenie, ogrzewanie nie wchodzi do popytu elektrycznego", () => {
    const r = calculateSymulacjaMrozu({ ...BAZA, budynek: BUDYNEK, zrodloCiepla: "paliwo" })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.warnings.map((w) => w.i18nKey)).toContain("SYMMR-BEZ-OGRZEWANIA-PALIWO")
    const s = r.value!.scenariusze[0]!
    expect(s.cieploDobaKwh).toBeCloseTo(124.08, 9)
    expect(s.pradOgrzewaniaDobaKwh).toBe(0)
    expect(s.zapotrzebowanieDobaKwh).toBe(10)
    expect(r.value!.ogrzewanieWPopycie).toBe(false)
  })

  it("magazyn 10 kWh, sprawność 90%, start 0%: PV [20, 0, 0], popyt 8 → doba 1 ładuje do 10, doba 2 bierze 8, doba 3 brakuje 6 kWh", () => {
    const s = jeden({
      ...BAZA,
      produkcjaDobowaKwh: [20, 0, 0],
      zuzycieBazoweDobaKwh: 8,
      magazyn: { pojemnoscUzytecznaKwh: 10, sprawnoscPct: 90, stanPoczatkowyPct: 0 },
    })
    expect(s.dni.map((d) => d.deficytKwh)).toEqual([0, 0, 6].map((x) => expect.closeTo(x, 9)))
    expect(s.dniZDeficytem).toBe(1)
    expect(s.pierwszyDzienZDeficytem).toBe(3)
    expect(s.najwiekszyDeficytDobyKwh).toBeCloseTo(6, 9)
  })

  it("spadek pojemności 20% przy mrozie: 10 → 8 kWh, brakuje 8 zamiast 6 kWh", () => {
    const s = jeden({
      ...BAZA,
      produkcjaDobowaKwh: [20, 0, 0],
      zuzycieBazoweDobaKwh: 8,
      magazyn: { pojemnoscUzytecznaKwh: 10, sprawnoscPct: 90, stanPoczatkowyPct: 0 },
      scenariusze: [{ temperaturaC: -20, cop: null, spadekPojemnosciPct: 20 }],
    })
    expect(s.pojemnoscEfektywnaKwh).toBeCloseTo(8, 9)
    expect(s.deficytMiesiacaKwh).toBeCloseTo(8, 9)
  })

  it("serie dni z deficytem: PV [0, 0, 10, 0, 0, 0], popyt 5 bez magazynu → 5 dni z deficytem, najdłuższa seria 3, pierwszy dzień 1", () => {
    const s = jeden({ ...BAZA, produkcjaDobowaKwh: [0, 0, 10, 0, 0, 0], zuzycieBazoweDobaKwh: 5 })
    expect(s.dniZDeficytem).toBe(5)
    expect(s.najdluzszaSeriaDni).toBe(3)
    expect(s.pierwszyDzienZDeficytem).toBe(1)
    expect(s.deficytMiesiacaKwh).toBeCloseTo(25, 9)
  })

  it("brak deficytu: PV wystarcza, pierwszy dzień null, pokrycie 100%", () => {
    const s = jeden({ ...BAZA, produkcjaDobowaKwh: [20, 20], zuzycieBazoweDobaKwh: 5 })
    expect(s.dniZDeficytem).toBe(0)
    expect(s.pierwszyDzienZDeficytem).toBeNull()
    expect(s.pokrycieEnergetycznePct).toBe(100)
  })

  it("udział nocy 50% bez magazynu: PV 10, popyt 8 → część dzienna 4 pokryta, noc 4 kWh to deficyt", () => {
    const s = jeden({ ...BAZA, produkcjaDobowaKwh: [10], zuzycieBazoweDobaKwh: 8, udzialNocyPct: 50 })
    expect(s.deficytMiesiacaKwh).toBeCloseTo(4, 9)
  })

  it("korekta produkcji −50% (szron/śnieg): PV 10 → 5 kWh", () => {
    const r = calculateSymulacjaMrozu({ ...BAZA, produkcjaDobowaKwh: [10], korektaProdukcjiPct: -50, zuzycieBazoweDobaKwh: 8 })
    expect(r.value!.scenariusze[0]!.produkcjaMiesiacaKwh).toBeCloseTo(5, 9)
    expect(r.value!.scenariusze[0]!.deficytMiesiacaKwh).toBeCloseTo(3, 9)
    expect(r.assumptions).toContainEqual({ kod: "SYMMR-ZAL-KOREKTA-PRODUKCJI", params: { proc: -50 } })
  })

  it("brak danych → INCOMPLETE: bez produkcji, bez zużycia bazowego, bez scenariuszy, ogrzewanie elektryczne bez COP", () => {
    expect(calculateSymulacjaMrozu({ ...BAZA, produkcjaDobowaKwh: [] }).status).toBe("INCOMPLETE")
    expect(calculateSymulacjaMrozu({ ...BAZA, zuzycieBazoweDobaKwh: null }).status).toBe("INCOMPLETE")
    expect(calculateSymulacjaMrozu({ ...BAZA, scenariusze: [] }).status).toBe("INCOMPLETE")
    expect(calculateSymulacjaMrozu({ ...BAZA, budynek: BUDYNEK, zrodloCiepla: "prad" }).status).toBe("INCOMPLETE")
    expect(calculateSymulacjaMrozu({ ...BAZA, budynek: BUDYNEK, zrodloCiepla: "prad", cop: 3 }).status).toBe("VALID")
    // Magazyn z pojemnością, ale bez sprawności ładowania — nie zgadujemy.
    expect(calculateSymulacjaMrozu({ ...BAZA, magazyn: { pojemnoscUzytecznaKwh: 10, sprawnoscPct: null, stanPoczatkowyPct: 0 } }).status).toBe("INCOMPLETE")
  })

  it("błędne dane → INVALID_INPUT: ujemna produkcja, temperatura poniżej −60 °C, COP ≤ 0, spadek pojemności ≥ 100%, 32 dni, 7 scenariuszy, udział nocy > 100", () => {
    expect(calculateSymulacjaMrozu({ ...BAZA, produkcjaDobowaKwh: [-1] }).status).toBe("INVALID_INPUT")
    expect(calculateSymulacjaMrozu({ ...BAZA, scenariusze: [{ temperaturaC: -61, cop: null, spadekPojemnosciPct: null }] }).status).toBe("INVALID_INPUT")
    expect(calculateSymulacjaMrozu({ ...BAZA, cop: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateSymulacjaMrozu({ ...BAZA, scenariusze: [{ temperaturaC: -20, cop: null, spadekPojemnosciPct: 100 }] }).status).toBe("INVALID_INPUT")
    expect(calculateSymulacjaMrozu({ ...BAZA, produkcjaDobowaKwh: Array(32).fill(1) }).status).toBe("INVALID_INPUT")
    expect(calculateSymulacjaMrozu({ ...BAZA, scenariusze: Array(7).fill({ temperaturaC: -20, cop: null, spadekPojemnosciPct: null }) }).status).toBe("INVALID_INPUT")
    expect(calculateSymulacjaMrozu({ ...BAZA, udzialNocyPct: 120 }).status).toBe("INVALID_INPUT")
    expect(calculateSymulacjaMrozu({ ...BAZA, produkcjaDobowaKwh: [Number.NaN] }).status).toBe("INVALID_INPUT")
  })

  it("założenia: stała temperatura, doba bez nocy, bez magazynu; z magazynem i ogrzewaniem — odpowiednie kody", () => {
    const k = (i: SymulacjaMrozuInput) => calculateSymulacjaMrozu(i).assumptions.map(kodZalozenia)
    expect(k(BAZA)).toEqual(["SYMMR-ZAL-TEMPERATURA-STALA", "SYMMR-ZAL-DOBA-BEZ-NOCY", "SYMMR-ZAL-BEZ-MAGAZYNU"])
    const pelne = k({
      ...BAZA,
      budynek: BUDYNEK,
      zrodloCiepla: "prad",
      cop: 3,
      udzialNocyPct: 40,
      magazyn: { pojemnoscUzytecznaKwh: 10, sprawnoscPct: 90, stanPoczatkowyPct: 0 },
      scenariusze: [{ temperaturaC: -20, cop: null, spadekPojemnosciPct: 20 }],
    })
    expect(pelne).toEqual(expect.arrayContaining(["SYMMR-ZAL-DOBA-Z-NOCA", "SYMMR-ZAL-MAGAZYN", "SYMMR-ZAL-OGRZEWANIE", "SYMMR-ZAL-COP-STALY", "SYMMR-ZAL-SPADEK-POJEMNOSCI"]))
  })
})
