import { describe, expect, it } from "vitest"
import { calculateWeryfikacjaWstepnaOlow } from "../calculator"

describe("calculateWeryfikacjaWstepnaOlow", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/4", () => {
    const result = calculateWeryfikacjaWstepnaOlow({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 4 })
  })

  it("częściowo potwierdzone -> INCOMPLETE", () => {
    const result = calculateWeryfikacjaWstepnaOlow({
      potwierdzoneIds: ["ten-sam-typ-i-wiek", "napiecie-spoczynkowe"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(2)
  })

  it("wszystkie potwierdzone -> VALID, 4/4", () => {
    const result = calculateWeryfikacjaWstepnaOlow({
      potwierdzoneIds: ["ten-sam-typ-i-wiek", "napiecie-spoczynkowe", "poziom-elektrolitu", "ocena-wizualna"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 4, razem: 4 })
  })

  it("nieznane id ignorowane", () => {
    const result = calculateWeryfikacjaWstepnaOlow({
      potwierdzoneIds: ["ten-sam-typ-i-wiek", "nieistniejace"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
