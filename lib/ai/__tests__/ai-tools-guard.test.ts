import { describe, expect, it } from "vitest"
import { toolDescription } from "../../../scripts/check-ai-tools-guard.mjs"

describe("check-ai-tools-guard — toolDescription", () => {
  it("joins a description split across concatenated literals", () => {
    const src = `export const t = { name: "x", description: "Liczy X. Użyj, " + "gdy user pyta o X.", inputSchema: s }`
    expect(toolDescription("t.ts", src)).toBe("Liczy X. Użyj, gdy user pyta o X.")
  })

  it("returns null when the tool has no description", () => {
    expect(toolDescription("t.ts", `export const t = { name: "x" }`)).toBeNull()
  })
})
