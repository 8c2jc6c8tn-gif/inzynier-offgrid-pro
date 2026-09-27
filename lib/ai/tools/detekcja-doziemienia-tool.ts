/**
 * Narzędzie AI (9.3) dla Ekranu 29, Moduł 4 "Magazyn energii / baterie" — "Detekcja doziemienia
 * (Ground Fault & IMD)". `operationType: 'read'`. Obecność monitora izolacji / różnicówki DC to
 * fakt instalacyjny, który podaje wyłącznie user (dane bezpieczeństwa elektrycznego).
 */
import { z } from "zod"
import { calculateDetekcjaDoziemienia } from "@/lib/core/modules/baterie/detekcja-doziemienia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DetekcjaDoziemieniaToolInput = z.object({
  maMonitorIzolacji: z.boolean().describe("Czy instalacja ma monitor izolacji (IMD) — tylko od usera"),
  maRoznicowkeDc: z.boolean().describe("Czy instalacja ma różnicówkę DC — tylko od usera"),
})
export type DetekcjaDoziemieniaToolInputT = z.infer<typeof DetekcjaDoziemieniaToolInput>

export const DetekcjaDoziemieniaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zabezpieczony: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DetekcjaDoziemieniaToolOutputT = z.infer<typeof DetekcjaDoziemieniaToolOutput>

export const detekcjaDoziemieniaTool: AiToolDefinition<DetekcjaDoziemieniaToolInputT, DetekcjaDoziemieniaToolOutputT> = {
  name: "sprawdz_detekcje_doziemienia",
  description:
    "Sprawdza, czy instalacja baterii ma zabezpieczenie przed doziemieniem — monitor izolacji (IMD) lub " +
    "różnicówkę DC (Moduł 4, Ekran 29). Obecność urządzeń podaje wyłącznie user — nie zgaduj. Użyj, gdy " +
    "user pyta o ochronę przed doziemieniem/zwarciem doziemnym w systemie DC.",
  inputSchema: DetekcjaDoziemieniaToolInput,
  outputSchema: DetekcjaDoziemieniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/detekcja-doziemienia",
  handler: async (input) => {
    const wynik = calculateDetekcjaDoziemienia({ maMonitorIzolacji: input.maMonitorIzolacji, maRoznicowkeDc: input.maRoznicowkeDc })
    return {
      status: wynik.status,
      zabezpieczony: wynik.value.zabezpieczony,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
