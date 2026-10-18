/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B2 "Montaż mechaniczny + mocowanie/wentylacja"
 * (kwasowo-ołowiowa). `operationType: 'read'`. Czysty checklist — jedyny wejściowy fakt to lista
 * ID pozycji faktycznie sprawdzonych przez usera (w tym twardy stop: brak wentylacji).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMontazMechanicznyOlow } from "@/lib/core/modules/montaz-baterii/montaz-mechaniczny-olow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MontazMechanicznyOlowToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty montażu mechanicznego/wentylacji, które user faktycznie sprawdził"),
})
export type MontazMechanicznyOlowToolInputT = z.infer<typeof MontazMechanicznyOlowToolInput>

export const MontazMechanicznyOlowToolOutput = z.object({
  status: z.enum(STATUSY),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MontazMechanicznyOlowToolOutputT = z.infer<typeof MontazMechanicznyOlowToolOutput>

export const montazMechanicznyOlowTool: AiToolDefinition<
  MontazMechanicznyOlowToolInputT,
  MontazMechanicznyOlowToolOutputT
> = {
  name: "sprawdz_montaz_mechaniczny_olow",
  description:
    "Sprawdza montaż mechaniczny i wentylację akumulatorów kwasowo-ołowiowych (Moduł 11, Ekran B2) — obejmuje " +
    "twardy stop źródła: brak wentylacji przy akumulatorach kwasowych oznacza ryzyko wybuchu wodoru. User " +
    "podaje wyłącznie, które pozycje checklisty faktycznie sprawdził. Użyj, gdy user pyta o mocowanie lub " +
    "wentylację akumulatorów kwasowych.",
  inputSchema: MontazMechanicznyOlowToolInput,
  outputSchema: MontazMechanicznyOlowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/montaz-mechaniczny-olow",
  handler: async (input) => {
    const wynik = calculateMontazMechanicznyOlow({ potwierdzoneIds: input.potwierdzoneIds })
    return {
      status: wynik.status,
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
