import { describe, expect, it } from "vitest"
import { calculateNaporWiatru } from "../calculator"

describe("calculateNaporWiatru", () => {
  it("VALID — 120 km/h (33,33 m/s), panel 2 m², Cd=1,3 -> ok. 1769 N (self-konsystentne wartości)", () => {
    const result = calculateNaporWiatru({
      predkoscWiatruMS: 33.333333333333336,
      powierzchniaM2: 2.0,
      cd: 1.3,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.silaNaporuN).toBeCloseTo(1769.4444444444448, 3)
  })

  it("wiatr dwa razy słabszy -> siła 4x mniejsza (F proporcjonalna do v^2)", () => {
    const polowaV = calculateNaporWiatru({ predkoscWiatruMS: 16.666666666666668, powierzchniaM2: 2.0, cd: 1.3 })
    const pelnaV = calculateNaporWiatru({ predkoscWiatruMS: 33.333333333333336, powierzchniaM2: 2.0, cd: 1.3 })
    expect(pelnaV.value.silaNaporuN / polowaV.value.silaNaporuN).toBeCloseTo(4, 6)
  })

  it("brak wiatru -> siła 0", () => {
    const result = calculateNaporWiatru({ predkoscWiatruMS: 0, powierzchniaM2: 2.0, cd: 1.3 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna powierzchnia", () => {
    const result = calculateNaporWiatru({ predkoscWiatruMS: 30, powierzchniaM2: -2, cd: 1.3 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): SILA-NAPORU ma i18nKey+params, assumption to {kod}", () => {
    const result = calculateNaporWiatru({ predkoscWiatruMS: 33.333333333333336, powierzchniaM2: 2.0, cd: 1.3 })
    expect(result.warnings[0].i18nKey).toBe("SILA-NAPORU")
    expect(result.warnings[0].params).toEqual({ sila: "1769" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([{ kod: "TYLKO-SILA-NAPORU-NIE-SSANIE" }])
  })
})
