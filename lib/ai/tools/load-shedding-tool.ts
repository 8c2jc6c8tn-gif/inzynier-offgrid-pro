/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 12 "Macierz priorytetów odłączania (Smart Load
 * Shedding)". `operationType: 'read'`. Priorytet odbiornika, aktualny SoC i obecność nadwyżki
 * PV pochodzą WYŁĄCZNIE od usera — progi SoC (20%/90%) są ze źródła, ale bieżący stan systemu
 * nigdy nie jest zgadywany.
 */
import { z } from "zod"
import { calculateLoadShedding } from "@/lib/core/modules/zapotrzebowanie/load-shedding/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const LoadSheddingToolInput = z.object({
  priorytet: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("Priorytet odbiornika (1=nigdy nie odłączany, 2=próg SoC 20%, 3=próg SoC 90% lub brak nadwyżki PV) — od usera"),
  socPct: z.number().describe("Aktualny SoC baterii [%], 0-100 — od usera, nie zgaduj (0% jest legalną, krytyczną wartością)"),
  maNadwyzkePv: z.boolean().describe("Czy jest obecnie nadwyżka produkcji PV ponad bieżące zużycie — dotyczy tylko priorytetu 3"),
})
export type LoadSheddingToolInputT = z.infer<typeof LoadSheddingToolInput>

export const LoadSheddingToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  odlaczone: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type LoadSheddingToolOutputT = z.infer<typeof LoadSheddingToolOutput>

export const loadSheddingTool: AiToolDefinition<LoadSheddingToolInputT, LoadSheddingToolOutputT> = {
  name: "sprawdz_czy_odbiornik_odlaczony_load_shedding",
  description:
    "Sprawdza, czy odbiornik o danym priorytecie powinien być odłączony wg macierzy Smart Load Shedding (P1: " +
    "nigdy, P2: SoC<20%, P3: SoC<90% lub brak nadwyżki PV) — Moduł 2, Ekran 12. Priorytet, SoC i nadwyżka PV " +
    "podaje user — nie zgaduj bieżącego stanu systemu. Użyj, gdy user pyta, czy dany odbiornik powinien zostać " +
    "wyłączony przy aktualnym stanie naładowania baterii.",
  inputSchema: LoadSheddingToolInput,
  outputSchema: LoadSheddingToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/load-shedding",
  handler: async (input) => {
    const wynik = calculateLoadShedding({
      priorytet: input.priorytet,
      socPct: input.socPct,
      maNadwyzkePv: input.maNadwyzkePv,
    })
    return {
      status: wynik.status,
      odlaczone: wynik.value.odlaczone,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
