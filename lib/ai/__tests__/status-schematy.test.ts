import { describe, expect, it } from "vitest"
import { AlbedoSniegToolOutput } from "@/lib/ai/tools/albedo-snieg-tool"

describe("AI tool output schemas are built from the shared status list", () => {
  it("accept ESTIMATE and reject an unknown status", () => {
    const status = AlbedoSniegToolOutput.shape.status
    expect(status.safeParse("ESTIMATE").success).toBe(true)
    expect(status.safeParse("NIE_ISTNIEJE").success).toBe(false)
  })
})
