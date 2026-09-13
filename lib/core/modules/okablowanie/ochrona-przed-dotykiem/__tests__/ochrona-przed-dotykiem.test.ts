import { describe, expect, it } from "vitest"
import { calculateOchronaPrzedDotykiem } from "../calculator"

describe("calculateOchronaPrzedDotykiem", () => {
  it("INCOMPLETE — 0/2 potwierdzone", () => {
    const result = calculateOchronaPrzedDotykiem({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 2 })
  })

  it("VALID — 2/2 potwierdzone", () => {
    const result = calculateOchronaPrzedDotykiem({ potwierdzoneIds: ["bezposrednia", "posrednia"] })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 2, razem: 2 })
  })

  it("duplikaty liczone raz", () => {
    const result = calculateOchronaPrzedDotykiem({ potwierdzoneIds: ["bezposrednia", "bezposrednia"] })
    expect(result.value.potwierdzone).toBe(1)
  })
})
