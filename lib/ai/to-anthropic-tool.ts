/**
 * Adapter `AiToolDefinition` (9.3, kontrakt standardu) → surowe narzędzie Anthropic API
 * (`Tool.InputSchema`, JSON Schema). Zod v4 generuje JSON Schema natywnie (`z.toJSONSchema`) —
 * bez dodatkowej zależności/biblioteki helperów.
 */
import { z } from "zod"
import type Anthropic from "@anthropic-ai/sdk"
import type { AiToolDefinition } from "./types"

// Rejestr narzędzi jest z natury heterogeniczny (różne TInput/TOutput per narzędzie); `any` tu
// jest wymazaniem typu na granicy rejestru, nie utratą bezpieczeństwa w definicji pojedynczego
// narzędzia (ta zostaje w pełni typowana).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toAnthropicTool(tool: AiToolDefinition<any, any>): Anthropic.Tool {
  return {
    name: tool.name,
    description: tool.description,
    input_schema: z.toJSONSchema(tool.inputSchema) as Anthropic.Tool.InputSchema,
  }
}
