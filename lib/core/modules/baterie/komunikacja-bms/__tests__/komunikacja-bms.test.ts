import { describe, expect, it } from "vitest"
import { calculateKomunikacjaBms } from "../calculator"

describe("calculateKomunikacjaBms", () => {
  it("VALID — te same protokoły, zgodne", () => {
    const result = calculateKomunikacjaBms({ protokolBms: "can", protokolFalownika: "can" })
    expect(result.status).toBe("VALID")
    expect(result.value.zgodne).toBe(true)
    expect(result.warnings[0].code).toBe("PROTOKOLY-ZGODNE")
  })

  it("VALID_WITH_WARNINGS — różne protokoły, potrzebny konwerter (przykład ze źródła: Pylontech vs inny)", () => {
    const result = calculateKomunikacjaBms({ protokolBms: "pylontech", protokolFalownika: "can" })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zgodne).toBe(false)
    expect(result.warnings[0].code).toBe("PROTOKOLY-NIEZGODNE")
  })

  it("OUT_OF_SCOPE — protokół nieznany (co najmniej jeden 'inny')", () => {
    const result = calculateKomunikacjaBms({ protokolBms: "inny", protokolFalownika: "can" })
    expect(result.status).toBe("OUT_OF_SCOPE")
    expect(result.value.zgodne).toBeNull()
  })

  it("INCOMPLETE — protokoły jeszcze nie wybrane", () => {
    const result = calculateKomunikacjaBms({ protokolBms: "", protokolFalownika: "" })
    expect(result.status).toBe("INCOMPLETE")
  })
})
