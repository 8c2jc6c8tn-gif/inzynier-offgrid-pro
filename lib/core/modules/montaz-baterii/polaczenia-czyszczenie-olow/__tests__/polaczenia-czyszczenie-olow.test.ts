import { describe, expect, it } from "vitest"
import { calculatePolaczeniaCzyszczenieOlow } from "../calculator"

describe("calculatePolaczeniaCzyszczenieOlow", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/3", () => {
    const result = calculatePolaczeniaCzyszczenieOlow({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 3 })
  })

  it("częściowo potwierdzone -> INCOMPLETE", () => {
    const result = calculatePolaczeniaCzyszczenieOlow({
      potwierdzoneIds: ["oczyszczone-bieguny"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(1)
  })

  it("wszystkie potwierdzone -> VALID, 3/3", () => {
    const result = calculatePolaczeniaCzyszczenieOlow({
      potwierdzoneIds: ["oczyszczone-bieguny", "wazelina-techniczna", "schemat-polaczen"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 3, razem: 3 })
  })

  it("nieznane id ignorowane", () => {
    const result = calculatePolaczeniaCzyszczenieOlow({
      potwierdzoneIds: ["oczyszczone-bieguny", "nieistniejace"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
