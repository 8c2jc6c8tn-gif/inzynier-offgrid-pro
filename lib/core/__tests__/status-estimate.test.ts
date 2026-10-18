import { describe, expect, it } from "vitest"
import { isComputed, STATUSY } from "../calc-result"

describe("status ESTIMATE (standard 3.3)", () => {
  it("is one of the result statuses", () => {
    expect(STATUSY).toContain("ESTIMATE")
  })

  it("counts as a computed number but never as plain VALID", () => {
    expect(isComputed("ESTIMATE")).toBe(true)
    expect(isComputed("OUT_OF_SCOPE")).toBe(false)
    expect(isComputed("INCOMPLETE")).toBe(false)
    expect(isComputed("INVALID_INPUT")).toBe(false)
  })
})
