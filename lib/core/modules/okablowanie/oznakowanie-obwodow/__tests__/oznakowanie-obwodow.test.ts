import { describe, expect, it } from "vitest"
import { calculateOznakowanieObwodow } from "../calculator"

describe("calculateOznakowanieObwodow", () => {
  it("INCOMPLETE — 0/5 oznaczonych", () => {
    const result = calculateOznakowanieObwodow({ oznaczoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ oznaczone: 0, razem: 5 })
  })

  it("VALID — 5/5 oznaczonych", () => {
    const result = calculateOznakowanieObwodow({
      oznaczoneIds: ["dc-plus", "dc-minus", "pe", "ac-l", "ac-n"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ oznaczone: 5, razem: 5 })
  })

  it("duplikaty id liczone raz", () => {
    const result = calculateOznakowanieObwodow({ oznaczoneIds: ["pe", "pe", "dc-plus"] })
    expect(result.value.oznaczone).toBe(2)
  })

  it("nieznane id ignorowane", () => {
    const result = calculateOznakowanieObwodow({ oznaczoneIds: ["pe", "nieistniejace-id"] })
    expect(result.value.oznaczone).toBe(1)
  })
})
