import { describe, expect, it } from "vitest"
import { calculateUruchomienieTestyOlow } from "../calculator"

describe("calculateUruchomienieTestyOlow", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/3", () => {
    const result = calculateUruchomienieTestyOlow({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 3 })
  })

  it("częściowo potwierdzone -> INCOMPLETE", () => {
    const result = calculateUruchomienieTestyOlow({
      potwierdzoneIds: ["napiecie-spoczynkowe"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(1)
  })

  it("wszystkie potwierdzone -> VALID, 3/3", () => {
    const result = calculateUruchomienieTestyOlow({
      potwierdzoneIds: ["napiecie-spoczynkowe", "test-ladowania", "temperatura-ladowania"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 3, razem: 3 })
  })

  it("nieznane id ignorowane", () => {
    const result = calculateUruchomienieTestyOlow({
      potwierdzoneIds: ["napiecie-spoczynkowe", "nieistniejace"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
