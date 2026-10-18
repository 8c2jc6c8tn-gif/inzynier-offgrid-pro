import { describe, expect, it } from "vitest"
import { poziomOstrzezen, poziomZStatusu } from "@/components/werdykt"

describe("verdict level from a result status", () => {
  it("shows ESTIMATE (a number that is our interpretation, 3.3) as a warning, never as an error or as plain ok", () => {
    expect(poziomZStatusu("ESTIMATE")).toBe("uwaga")
    expect(poziomOstrzezen("ESTIMATE")).toBe("uwaga")
  })

  it("keeps the other levels", () => {
    expect(poziomZStatusu("VALID")).toBe("ok")
    expect(poziomZStatusu("VALID_WITH_WARNINGS")).toBe("uwaga")
    expect(poziomZStatusu("OUT_OF_SCOPE")).toBe("blad")
    expect(poziomZStatusu("INCOMPLETE")).toBe("blad")
    expect(poziomOstrzezen("VALID")).toBe("ok")
  })
})
