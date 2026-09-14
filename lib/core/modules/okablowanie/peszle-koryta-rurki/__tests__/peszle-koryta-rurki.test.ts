import { describe, expect, it } from "vitest"
import { calculatePeszleKorytaRurki } from "../calculator"

describe("calculatePeszleKorytaRurki", () => {
  it("wewnątrz -> peszel karbowany", () => {
    const result = calculatePeszleKorytaRurki({ miejsceMontazu: "wewnatrz" })
    expect(result.status).toBe("VALID")
    expect(result.value.zalecanaOslona?.id).toBe("peszel-karbowany")
  })

  it("w ziemi -> rura HDPE", () => {
    const result = calculatePeszleKorytaRurki({ miejsceMontazu: "w-ziemi" })
    expect(result.value.zalecanaOslona?.id).toBe("rura-hdpe")
  })

  it("na ścianie zewnątrz -> peszel UV", () => {
    const result = calculatePeszleKorytaRurki({ miejsceMontazu: "na-scianie-zewnatrz" })
    expect(result.value.zalecanaOslona?.id).toBe("peszel-uv")
  })

  it("przemysłowe -> korytko metalowe", () => {
    const result = calculatePeszleKorytaRurki({ miejsceMontazu: "przemyslowe" })
    expect(result.value.zalecanaOslona?.id).toBe("korytko-metalowe")
  })

  it("INCOMPLETE — miejsce niewybrane", () => {
    const result = calculatePeszleKorytaRurki({ miejsceMontazu: null })
    expect(result.status).toBe("INCOMPLETE")
  })
})
