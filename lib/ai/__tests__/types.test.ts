import { describe, expect, it } from "vitest"
import { z } from "zod"
import { validateAiToolDefinition, type AiToolDefinition } from "../types"

function tool(overrides: Partial<AiToolDefinition<{ x: number }, { y: number }>>): AiToolDefinition<{ x: number }, { y: number }> {
  return {
    name: "test_tool",
    description: "narzędzie testowe",
    inputSchema: z.object({ x: z.number() }),
    outputSchema: z.object({ y: z.number() }),
    operationType: "read",
    requiresConfirmation: false,
    scope: "test",
    handler: async (input) => ({ y: input.x }),
    ...overrides,
  }
}

describe("validateAiToolDefinition", () => {
  it("przepuszcza operationType 'read' bez requiresConfirmation", () => {
    expect(() => validateAiToolDefinition(tool({ operationType: "read", requiresConfirmation: false }))).not.toThrow()
  })

  it("przepuszcza operationType 'write' z requiresConfirmation: true", () => {
    expect(() =>
      validateAiToolDefinition(tool({ operationType: "write", requiresConfirmation: true })),
    ).not.toThrow()
  })

  it("9.3: rzuca błąd dla operationType 'write' z requiresConfirmation: false", () => {
    expect(() =>
      validateAiToolDefinition(tool({ operationType: "write", requiresConfirmation: false })),
    ).toThrow(/requiresConfirmation: true/)
  })
})
