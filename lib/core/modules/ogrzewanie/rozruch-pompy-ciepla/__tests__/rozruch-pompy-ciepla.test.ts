import { describe, expect, it } from "vitest"
import { calculateRozruchPompyCiepla } from "../calculator"
import type { RozruchPompyCieplaInput } from "../input"

const baza: RozruchPompyCieplaInput = {
  zrodlo: "falownik",
  fazy: 1,
  napiecieV: 230,
  pradRozruchuA: 40,
  pradSoftstartA: 0,
  poborPracyKw: 2,
  inneObciazenieKw: 0,
  mocCiaglaKw: 5,
  mocSzczytowaKw: 7.5,
}

describe("rozruch pompy ciepła (dawne 5.52, 5.61, 5.66)", () => {
  it("5.52: 40 A × 230 V = 9,2 kVA — falownik 5 kW ze szczytem 7,5 kW nie udźwignie → 🟡", () => {
    const r = calculateRozruchPompyCiepla(baza)
    expect(r.value.startKva).toBeCloseTo(9.2, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["ROZ-START-PONAD-SZCZYT"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("softstart 15 A mieści się w szczycie → ℹ️ softstart wystarczy, status VALID", () => {
    const r = calculateRozruchPompyCiepla({ ...baza, pradSoftstartA: 15 })
    expect(r.value.softstartKva).toBeCloseTo(3.45, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["ROZ-SOFTSTART-WYSTARCZY"])
    expect(r.status).toBe("VALID")
  })

  it("3 fazy: √3 × 400 V × 20 A = 13,86 kVA; agregat; praca z innymi odbiornikami ponad moc → 🟡", () => {
    const r = calculateRozruchPompyCiepla({ ...baza, zrodlo: "agregat", fazy: 3, napiecieV: 400, pradRozruchuA: 20, inneObciazenieKw: 3.5, mocSzczytowaKw: 20 })
    expect(r.value.startKva).toBeCloseTo((Math.sqrt(3) * 400 * 20) / 1000, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["ROZ-PRACA-PONAD-MOC"])
    expect(r.assumptions).toContainEqual({ kod: "ROZ-ZAL-AGREGAT-KOSZT" })
  })

  it("brak źródła albo prądu → INCOMPLETE; ujemny prąd → INVALID_INPUT", () => {
    expect(calculateRozruchPompyCiepla({ ...baza, zrodlo: null }).status).toBe("INCOMPLETE")
    expect(calculateRozruchPompyCiepla({ ...baza, pradRozruchuA: 0 }).status).toBe("INCOMPLETE")
    expect(calculateRozruchPompyCiepla({ ...baza, pradRozruchuA: -1 }).status).toBe("INVALID_INPUT")
  })
})
