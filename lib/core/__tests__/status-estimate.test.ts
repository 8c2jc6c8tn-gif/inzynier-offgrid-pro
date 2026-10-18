import { describe, expect, it } from "vitest"
import { poziomZStatusu } from "@/components/werdykt"
import { isComputed, STATUSY } from "../calc-result"
import { AlbedoSniegToolOutput } from "@/lib/ai/tools/albedo-snieg-tool"

describe("status ESTIMATE (standard 3.3)", () => {
  it("is one of the result statuses", () => {
    expect(STATUSY).toContain("ESTIMATE")
  })

  it("counts as a computed number but never as plain VALID", () => {
    expect(isComputed("ESTIMATE")).toBe(true)
    expect(isComputed("OUT_OF_SCOPE")).toBe(false)
    expect(isComputed("INCOMPLETE")).toBe(false)
  })

  it("is shown as a warning level, not as an error (a number exists, flagged as our interpretation)", () => {
    expect(poziomZStatusu("ESTIMATE")).toBe("uwaga")
    expect(poziomZStatusu("VALID")).toBe("ok")
    expect(poziomZStatusu("OUT_OF_SCOPE")).toBe("blad")
  })

  it("AI tool output schemas built from STATUSY accept it", () => {
    const shape = AlbedoSniegToolOutput.shape.status
    expect(shape.safeParse("ESTIMATE").success).toBe(true)
    expect(shape.safeParse("NIE_ISTNIEJE").success).toBe(false)
  })
})
