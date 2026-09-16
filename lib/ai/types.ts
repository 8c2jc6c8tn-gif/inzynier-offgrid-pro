/**
 * Kontrakt narzędzia AI — docs/standards/09-ai-w-produkcie.md, 9.3. Model językowy nie zna
 * wzorów/reguł na pamięć — korzysta wyłącznie z rejestru jawnie zdefiniowanych narzędzi. Typ
 * dosłownie z 9.3 (nazwy pól zachowane po polsku/angielsku tak jak w standardzie), tylko
 * `Schema<T>` skonkretyzowany na `z.ZodType<T>` (Zod, już zależność projektu).
 *
 * `handler` ZAWSZE deleguje do już istniejącej funkcji domenowej (lib/core) — nigdy własna
 * logika/szacunek modelu językowego wewnątrz handlera (9.2: AI nigdy nie zastępuje logiki
 * domenowej własnym szacunkiem).
 */
import type { z } from "zod"

export type AiOperationType = "read" | "write"

export type AiToolDefinition<TInput, TOutput> = {
  name: string
  description: string
  inputSchema: z.ZodType<TInput>
  outputSchema: z.ZodType<TOutput>
  operationType: AiOperationType
  /** Obowiązkowe `true`, gdy `operationType: 'write'` — patrz `validateAiToolDefinition`. */
  requiresConfirmation: boolean
  /** Zakres uprawnień (np. nazwa modułu/ekranu, którego narzędzie dotyczy). */
  scope: string
  handler: (input: TInput) => Promise<TOutput>
}

/**
 * 9.3: "`requiresConfirmation: false` przy `operationType: 'write'` jest błędem konfiguracji,
 * nie ważną kombinacją — narzędzie rejestrujące taki zapis nie przechodzi testu (10)." Rzuca
 * wyjątek zamiast cicho przepuścić błędną konfigurację — ten sam duch co 3.6 (zero cichych błędów).
 */
// Rejestr narzędzi jest z natury heterogeniczny (różne TInput/TOutput per narzędzie); `any` tu
// jest wymazaniem typu na granicy rejestru, nie utratą bezpieczeństwa w definicji pojedynczego
// narzędzia (ta zostaje w pełni typowana).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateAiToolDefinition(tool: AiToolDefinition<any, any>): void {
  if (tool.operationType === "write" && !tool.requiresConfirmation) {
    throw new Error(
      `AiToolDefinition "${tool.name}": operationType "write" wymaga requiresConfirmation: true (docs/standards/09-ai-w-produkcie.md, 9.3).`,
    )
  }
}

/**
 * Tryby pracy wg dostępności sieci — 9.6. Ten projekt ma dziś wyłącznie asystenta chmurowego
 * (brak lokalnego modelu) — `HYBRID` nie ma dziś zastosowania, zostaje w typie na przyszłość
 * (13.2 — droga mobile może dodać lokalny model), nie usuwany spekulacyjnie z typu, tylko
 * nieużywany dziś w kodzie.
 */
export type AiMode = "OFFLINE" | "HYBRID" | "CLOUD_ASSISTED"
