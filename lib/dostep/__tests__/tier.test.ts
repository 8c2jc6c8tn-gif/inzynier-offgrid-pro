import { describe, expect, it } from "vitest"
import { KAFLE } from "@/lib/pulpit/registry"
import { MAPA_TIER_KAFLI, tierKafla } from "../tier"

describe("MAPA_TIER_KAFLI (12.1, D2, D37, D79)", () => {
  it("covers exactly the dashboard tiles", () => {
    expect(Object.keys(MAPA_TIER_KAFLI).map(Number).sort((a, b) => a - b)).toEqual(
      KAFLE.map((k) => k.id).sort((a, b) => a - b),
    )
  })

  it("assigns only what D2 decides", () => {
    expect(tierKafla(7)).toBe("PRO")
    expect(tierKafla(13)).toBe("PRO")
    expect(tierKafla(12)).toBe("FREE")
  })

  it("keeps M14 tiles unassigned (D37)", () => {
    expect(tierKafla(15)).toBe("nieprzypisane")
    expect(tierKafla(16)).toBe("nieprzypisane")
  })

  it("treats an unknown tile as unassigned", () => {
    expect(tierKafla(999)).toBe("nieprzypisane")
  })
})
