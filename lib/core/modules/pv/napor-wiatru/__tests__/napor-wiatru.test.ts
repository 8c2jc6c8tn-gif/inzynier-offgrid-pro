import { describe, expect, it } from "vitest"
import { calculateNaporWiatru } from "../calculator"

describe("calculateNaporWiatru", () => {
  it("VALID — 120 km/h (33,33 m/s), panel 2 m², Cd=1,3 -> ok. 1769 N (self-konsystentne wartości)", () => {
    const result = calculateNaporWiatru({
      predkoscWiatruMS: 33.333333333333336,
      powierzchniaM2: 2.0,
      cd: 1.3,
      balastPlanowanyKg: null,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.silaNaporuN).toBeCloseTo(1769.4444444444448, 3)
  })

  it("wiatr dwa razy słabszy -> siła 4x mniejsza (F proporcjonalna do v^2)", () => {
    const polowaV = calculateNaporWiatru({ predkoscWiatruMS: 16.666666666666668, powierzchniaM2: 2.0, cd: 1.3, balastPlanowanyKg: null })
    const pelnaV = calculateNaporWiatru({ predkoscWiatruMS: 33.333333333333336, powierzchniaM2: 2.0, cd: 1.3, balastPlanowanyKg: null })
    expect(pelnaV.value.silaNaporuN / polowaV.value.silaNaporuN).toBeCloseTo(4, 6)
  })

  it("brak wiatru -> siła 0", () => {
    const result = calculateNaporWiatru({ predkoscWiatruMS: 0, powierzchniaM2: 2.0, cd: 1.3, balastPlanowanyKg: null })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna powierzchnia", () => {
    const result = calculateNaporWiatru({ predkoscWiatruMS: 30, powierzchniaM2: -2, cd: 1.3, balastPlanowanyKg: null })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): SILA-NAPORU ma i18nKey+params, assumption to {kod}", () => {
    const result = calculateNaporWiatru({ predkoscWiatruMS: 33.333333333333336, powierzchniaM2: 2.0, cd: 1.3, balastPlanowanyKg: null })
    expect(result.warnings[0].i18nKey).toBe("SILA-NAPORU")
    expect(result.warnings[0].params).toEqual({ sila: "1769" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions[0]).toEqual({ kod: "TYLKO-SILA-NAPORU-NIE-SSANIE" })
  })

  // Reference computed independently in Python (Directive #3): 1.5 × 1769.444 / (0.9 × 9.80665).
  it("PN-EN 1990 EQU: balast projektowy = γQ·F/(γG,inf·g) ≈ 300,72 kg (1,667 × F/g)", () => {
    const r = calculateNaporWiatru({ predkoscWiatruMS: 33.333333333333336, powierzchniaM2: 2.0, cd: 1.3, balastPlanowanyKg: null })
    expect(r.value.balastProjektowyKg).toBeCloseTo(300.7218646606206, 6)
    expect(r.warnings.map((w) => w.code)).toEqual(["SILA-NAPORU", "ZS-BALAST-EQU-TYLKO-ODRYWANIE", "NW-PREDKOSC-SZCZYTOWA"])
    expect(r.assumptions).toContainEqual({ kod: "ZS-ZALOZENIE-BALAST-EQU", params: { gammaQ: 1.5, gammaG: 0.9 } })
  })

  it("twardy stop: planowany balast mniejszy niż projektowy → critical NW-BALAST-NIEWYSTARCZAJACY", () => {
    const r = calculateNaporWiatru({ predkoscWiatruMS: 33.333333333333336, powierzchniaM2: 2.0, cd: 1.3, balastPlanowanyKg: 200 })
    const stop = r.warnings.find((w) => w.code === "NW-BALAST-NIEWYSTARCZAJACY")
    expect(stop?.level).toBe("critical")
    expect(stop?.params).toEqual({ planowany: "200", wymagany: "301" })
  })

  it("planowany balast wystarczający (≥ projektowego) → bez twardego stopu", () => {
    const r = calculateNaporWiatru({ predkoscWiatruMS: 33.333333333333336, powierzchniaM2: 2.0, cd: 1.3, balastPlanowanyKg: 301 })
    expect(r.warnings.some((w) => w.level === "critical")).toBe(false)
  })

  it("INVALID_INPUT — ujemny planowany balast", () => {
    const r = calculateNaporWiatru({ predkoscWiatruMS: 30, powierzchniaM2: 2, cd: 1.3, balastPlanowanyKg: -1 })
    expect(r.status).toBe("INVALID_INPUT")
  })
})
