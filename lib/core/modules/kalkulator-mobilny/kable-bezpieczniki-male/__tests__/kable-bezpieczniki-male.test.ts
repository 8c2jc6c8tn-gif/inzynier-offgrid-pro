import { describe, expect, it } from "vitest"
import { calculateKableBezpiecznikiMale } from "../calculator"
import type { KableBezpiecznikiMaleInput } from "../input"

const A: KableBezpiecznikiMaleInput = {
  pradA: 15,
  napiecieV: 12,
  dlugoscTrasyM: 3,
  sposobUlozenia: "swobodnie",
  temperaturaOtoczeniaC: 30,
  liczbaKabliWWiazce: 1,
  dopuszczalnySpadekNapieciaPct: 3,
  sprawdzanyPrzekrojMm2: null,
  pojazd: false,
}

// Iz(2,5 mm², B2, 40 °C) = 23 × 0,87 = 20,01 A ≥ IB 18 A, ale < In 22,5 A → koordynacja podnosi do 4 mm² (26,1 A).
const B: KableBezpiecznikiMaleInput = {
  ...A,
  pradA: 18,
  napiecieV: 24,
  dlugoscTrasyM: 1,
  sposobUlozenia: "w_peszlu",
  temperaturaOtoczeniaC: 40,
  dopuszczalnySpadekNapieciaPct: 10,
}

const kody = (w: { warnings: { code: string }[] }) => w.warnings.map((x) => x.code)

describe("calculateKableBezpiecznikiMale (M12/E2 + E15, echo M5/E1 + M5/E6)", () => {
  it("źródło „15 A, 3 m, 12 V”: przy ρ·2L/S i 3% → 6 mm² (ΔU 2,19%), bezpiecznik min. 18,75 A (źródło: 2,5 mm² — wzór jednostronny)", () => {
    const w = calculateKableBezpiecznikiMale(A)
    expect(w.status).toBe("VALID")
    expect(w.value.przekrojMm2).toBe(6)
    expect(w.value.spadekNapieciaPct).toBeCloseTo(2.1875, 9)
    expect(w.value.bezpiecznikMinA).toBeCloseTo(18.75, 12)
    expect(w.value.obciazalnoscA).toBe(46)
    expect(kody(w)).toEqual(["PRZEKROJ-ZALECANY"])
  })

  it("koordynacja 433.2 (Ib ≤ In ≤ Iz) podnosi 2,5 → 4 mm², info o podniesieniu", () => {
    const w = calculateKableBezpiecznikiMale(B)
    expect(w.value.przekrojMm2).toBe(4)
    expect(w.value.obciazalnoscA).toBeCloseTo(26.1, 9)
    expect(w.value.bezpiecznikMinA).toBeCloseTo(22.5, 12)
    expect(kody(w)).toEqual(["MK-KOORDYNACJA-PODNIOSLA-PRZEKROJ", "PRZEKROJ-ZALECANY"])
    expect(w.status).toBe("VALID")
  })

  it("🔴 sprawdzany 2,5 mm² w przypadku B: silnik M5/E1 go przepuszcza, ale bezpiecznik 22,5 A nie chroni kabla 20,01 A", () => {
    const w = calculateKableBezpiecznikiMale({ ...B, sprawdzanyPrzekrojMm2: 2.5 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.value.wymaganyMm2).toBe(4)
    expect(w.warnings[0]).toMatchObject({ code: "MK-BEZPIECZNIK-NIE-CHRONI-KABLA", level: "critical" })
  })

  it("🔴 sprawdzany 2,5 mm² w przypadku A: za duży spadek — twardy stop z silnika M5/E1", () => {
    const w = calculateKableBezpiecznikiMale({ ...A, sprawdzanyPrzekrojMm2: 2.5 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.level).toBe("critical")
    expect(w.value.wymaganyMm2).toBe(6)
  })

  it("sprawdzany z zapasem → bez twardego stopu", () => {
    const w = calculateKableBezpiecznikiMale({ ...B, sprawdzanyPrzekrojMm2: 6 })
    expect(w.warnings.some((x) => x.level === "critical")).toBe(false)
  })

  it("brak przekroju dla koordynacji: IB 112 A (25 mm² C = 112 A), In 140 A > Iz(35) 138 A → OUT_OF_SCOPE + 🔴", () => {
    const w = calculateKableBezpiecznikiMale({ ...A, pradA: 112, napiecieV: 24, dlugoscTrasyM: 1 })
    expect(w.status).toBe("OUT_OF_SCOPE")
    expect(kody(w)).toEqual(["MK-BRAK-PRZEKROJU-DLA-BEZPIECZNIKA"])
  })

  it("pojazd (E15): info o wibracjach i założenie o przewodach instalacyjnych, wynik bez zmian", () => {
    const w = calculateKableBezpiecznikiMale({ ...A, pojazd: true })
    expect(w.value.przekrojMm2).toBe(6)
    expect(kody(w)).toEqual(["PRZEKROJ-ZALECANY", "MK-POJAZD-WIBRACJE"])
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("MK-ZALOZENIE-PRZEWODY-INSTALACYJNE")
  })

  it("brak danych → INCOMPLETE bez ostrzeżeń; prąd ujemny → INVALID_INPUT", () => {
    const n = calculateKableBezpiecznikiMale({ ...A, napiecieV: 0 })
    expect(n.status).toBe("INCOMPLETE")
    expect(n.warnings).toEqual([])
    expect(calculateKableBezpiecznikiMale({ ...A, pradA: -1 }).status).toBe("INVALID_INPUT")
  })
})

describe("margines silnika M5/E1 przenoszony do wyniku", () => {
  it("przekrój na granicy spadku → 🟡 PRZEKROJ-NA-GRANICY, status VALID_WITH_WARNINGS", () => {
    // 15 A, 12 V, 3 m: 6 mm² daje 2,19% przy progu 2,3% → margines spadku ~5% < 15%.
    const w = calculateKableBezpiecznikiMale({ ...A, dopuszczalnySpadekNapieciaPct: 2.3 })
    expect(w.value.przekrojMm2).toBe(6)
    expect(kody(w)).toEqual(["PRZEKROJ-NA-GRANICY"])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })
})
