import { describe, expect, it } from "vitest"
import { calculateBuforCiepla } from "../calculator"

describe("calculateBuforCiepla", () => {
  it("przykład źródła: pompa 8kW -> zalecany bufor 400l, wystarczający -> info", () => {
    const result = calculateBuforCiepla({ mocPompyKw: 8, pojemnoscBuforaL: 400 })
    expect(result.status).toBe("VALID")
    expect(result.value.zalecanaPojemnoscL).toBe(400)
    expect(result.warnings[0].code).toBe("BUFOR-WYSTARCZAJACY")
    expect(result.warnings[0].level).toBe("info")
  })

  it("bufor za mały -> warning", () => {
    const result = calculateBuforCiepla({ mocPompyKw: 8, pojemnoscBuforaL: 200 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zalecanaPojemnoscL).toBe(400)
    expect(result.warnings[0].code).toBe("BUFOR-ZA-MALY")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("bufor większy niż zalecany -> info", () => {
    const result = calculateBuforCiepla({ mocPompyKw: 5, pojemnoscBuforaL: 500 })
    expect(result.value.zalecanaPojemnoscL).toBe(250)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — pojemność bufora jeszcze nie wpisana", () => {
    const result = calculateBuforCiepla({ mocPompyKw: 8, pojemnoscBuforaL: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc pompy", () => {
    const result = calculateBuforCiepla({ mocPompyKw: -8, pojemnoscBuforaL: 400 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
