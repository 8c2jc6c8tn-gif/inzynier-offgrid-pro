import { describe, expect, it } from "vitest"
import { calculateRyzykoPid } from "../calculator"

describe("calculateRyzykoPid", () => {
  it("napięcie 600V + wysoka wilgotność -> ryzyko PID, RYZYKO-PID", () => {
    const result = calculateRyzykoPid({ napiecieDcV: 600, wilgotnoscWysoka: true })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.ryzykoPid).toBe(true)
    const w = result.warnings[0]
    expect(w.code).toBe("RYZYKO-PID")
    expect(w.i18nKey).toBe("RYZYKO-PID")
    expect(w.params).toEqual({ napiecie: "600", prog: "400" })
    expect(w.message).toBeUndefined()
  })

  it("napięcie 600V bez wysokiej wilgotności -> brak ryzyka (próg sam w sobie nie wystarcza)", () => {
    const result = calculateRyzykoPid({ napiecieDcV: 600, wilgotnoscWysoka: false })
    expect(result.status).toBe("VALID")
    expect(result.value.ryzykoPid).toBe(false)
    expect(result.warnings[0].code).toBe("BRAK-RYZYKA-PID")
  })

  it("napięcie 350V (poniżej progu 400V) + wysoka wilgotność -> brak ryzyka", () => {
    const result = calculateRyzykoPid({ napiecieDcV: 350, wilgotnoscWysoka: true })
    expect(result.value.ryzykoPid).toBe(false)
    expect(result.warnings[0].code).toBe("BRAK-RYZYKA-PID")
  })

  it("napięcie dokładnie 400V (próg wyłączny, nie włączny) + wilgotność -> brak ryzyka", () => {
    const result = calculateRyzykoPid({ napiecieDcV: 400, wilgotnoscWysoka: true })
    expect(result.value.ryzykoPid).toBe(false)
  })

  it("napięcie ujemne -> INVALID_INPUT, WARTOSC-UJEMNA bez message", () => {
    const result = calculateRyzykoPid({ napiecieDcV: -10, wilgotnoscWysoka: false })
    expect(result.status).toBe("INVALID_INPUT")
    const w = result.warnings[0]
    expect(w.code).toBe("WARTOSC-UJEMNA")
    expect(w.i18nKey).toBe("WARTOSC-UJEMNA")
    expect(w.params).toEqual({ label: "Napięcie systemu DC" })
    expect(w.message).toBeUndefined()
  })

  it("napięcie=0 (jeszcze nie wpisano) -> INCOMPLETE", () => {
    const result = calculateRyzykoPid({ napiecieDcV: 0, wilgotnoscWysoka: false })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("assumptions — PID-PROG-NAPIECIA-ZE-ZRODLA, bez params, bez message", () => {
    const result = calculateRyzykoPid({ napiecieDcV: 600, wilgotnoscWysoka: true })
    expect(result.assumptions).toEqual([{ kod: "PID-PROG-NAPIECIA-ZE-ZRODLA" }])
  })
})
