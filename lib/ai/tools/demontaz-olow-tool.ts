/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B7 "Demontaż — procedura, kolejność, zabezpieczenie"
 * (kwasowo-ołowiowa). `operationType: 'read'`. Checklist z wymuszoną kolejnością — jedyny
 * wejściowy fakt to lista ID kroków faktycznie już wykonanych przez usera.
 */
import { z } from "zod"
import { calculateDemontazOlow } from "@/lib/core/modules/montaz-baterii/demontaz-olow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DemontazOlowToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID kroków checklisty demontażu, które user faktycznie już wykonał"),
})
export type DemontazOlowToolInputT = z.infer<typeof DemontazOlowToolInput>

export const DemontazOlowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  potwierdzoneWKolejnosci: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DemontazOlowToolOutputT = z.infer<typeof DemontazOlowToolOutput>

export const demontazOlowTool: AiToolDefinition<DemontazOlowToolInputT, DemontazOlowToolOutputT> = {
  name: "sprawdz_demontaz_olow",
  description:
    "Sprawdza kolejność demontażu akumulatorów kwasowo-ołowiowych (Moduł 11, Ekran B7) — kolejność kroków " +
    "(minus systemowy → plus systemowy → szereg wewnętrzny) ma znaczenie bezpieczeństwa, krok potwierdzony " +
    "poza kolejnością daje ostrzeżenie. User podaje wyłącznie, które kroki faktycznie wykonał. Użyj, gdy user " +
    "pyta w jakiej kolejności demontować akumulatory kwasowe.",
  inputSchema: DemontazOlowToolInput,
  outputSchema: DemontazOlowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/demontaz-olow",
  handler: async (input) => {
    const wynik = calculateDemontazOlow({ potwierdzoneIds: input.potwierdzoneIds })
    return {
      status: wynik.status,
      potwierdzoneWKolejnosci: wynik.value.potwierdzoneWKolejnosci,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
