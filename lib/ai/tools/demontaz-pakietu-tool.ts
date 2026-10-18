/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A6 "Demontaż — procedura, SoC, odłączanie BMS"
 * (LiFePO4). `operationType: 'read'`. Napięcie całego pakietu pochodzi wyłącznie z pomiaru usera
 * multimetrem przed demontażem — nie zgaduj. To dane bezpieczeństwa: pakiet wciąż naładowany
 * (>3,2V/ogniwo) jest ostrzeżeniem krytycznym.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDemontazPakietu } from "@/lib/core/modules/montaz-baterii/demontaz-pakietu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DemontazPakietuToolInput = z.object({
  napiecieSystemu: z.union([z.literal(12), z.literal(24), z.literal(48)]),
  napieciePakietuV: z.number().describe("Zmierzone napięcie całego pakietu [V] przed demontażem — tylko od usera, dane bezpieczeństwa"),
  potwierdzoneIds: z.array(z.string()).describe("ID kroków checklisty demontażu, które user faktycznie już wykonał"),
})
export type DemontazPakietuToolInputT = z.infer<typeof DemontazPakietuToolInput>

export const DemontazPakietuToolOutput = z.object({
  status: z.enum(STATUSY),
  napiecieOgniwaV: z.number(),
  potwierdzoneWKolejnosci: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DemontazPakietuToolOutputT = z.infer<typeof DemontazPakietuToolOutput>

export const demontazPakietuTool: AiToolDefinition<DemontazPakietuToolInputT, DemontazPakietuToolOutputT> = {
  name: "sprawdz_demontaz_pakietu",
  description:
    "Demontaż pakietu LiFePO4 (Moduł 11, Ekran A6): napięcie na ogniwo liczone z pakietu i napięcia systemu " +
    "(V_ogniwo = V_pakietu / S) — jeśli pakiet wciąż naładowany (>3,2V/ogniwo), ostrzeżenie krytyczne " +
    "natychmiast; kolejność checklisty demontażu (wymuszona). Napięcie pakietu podaje user z pomiaru " +
    "multimetrem — nie zgaduj. Użyj, gdy user pyta, czy pakiet jest bezpiecznie rozładowany do demontażu.",
  inputSchema: DemontazPakietuToolInput,
  outputSchema: DemontazPakietuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/demontaz-pakietu",
  handler: async (input) => {
    const wynik = calculateDemontazPakietu({
      napiecieSystemu: input.napiecieSystemu,
      napieciePakietuV: input.napieciePakietuV,
      potwierdzoneIds: input.potwierdzoneIds,
    })
    return {
      status: wynik.status,
      napiecieOgniwaV: wynik.value.napiecieOgniwaV,
      potwierdzoneWKolejnosci: wynik.value.potwierdzoneWKolejnosci,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
