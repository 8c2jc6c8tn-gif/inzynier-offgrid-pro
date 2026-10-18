/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A4 "Podłączenie BMS" (+ procedura pre-charge, LiFePO4).
 * `operationType: 'read'`. Pojemność wejściowa falownika [µF] i rezystor pre-charge [Ω] muszą
 * pochodzić z karty katalogowej falownika/pomiaru rezystora użytego przez usera — nigdy zgadywane.
 * Wzór T = 5·R·C jest kanoniczny (Moduł 4/Ekran 7, obwod-precharge), tu tylko reużyty.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePodlaczenieBms } from "@/lib/core/modules/montaz-baterii/podlaczenie-bms/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PodlaczenieBmsToolInput = z.object({
  pojemnoscFalownikaUf: z.number().describe("Pojemność wejściowa DC falownika [µF] — z karty katalogowej falownika, tylko od usera"),
  rezystancjaPreChargeOhm: z.number().describe("Rezystor wstępny użyty do pre-charge [Ω] — z pomiaru/doboru usera, nie zgaduj"),
  potwierdzoneIds: z.array(z.string()).describe("ID kroków checklisty podłączenia BMS, które user faktycznie już wykonał"),
})
export type PodlaczenieBmsToolInputT = z.infer<typeof PodlaczenieBmsToolInput>

export const PodlaczenieBmsToolOutput = z.object({
  status: z.enum(STATUSY),
  czasPreChargeS: z.number(),
  potwierdzoneWKolejnosci: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PodlaczenieBmsToolOutputT = z.infer<typeof PodlaczenieBmsToolOutput>

export const podlaczenieBmsTool: AiToolDefinition<PodlaczenieBmsToolInputT, PodlaczenieBmsToolOutputT> = {
  name: "policz_podlaczenie_bms_precharge",
  description:
    "Podłączenie BMS pakietu LiFePO4 (Moduł 11, Ekran A4): czas obwodu pre-charge T = 5·R_pre·C (kanoniczny " +
    "wzór z Modułu 4/Ekran 7) i postęp checklisty z wymuszoną kolejnością kroków (krok poza kolejnością → " +
    "ostrzeżenie). Pojemność falownika i rezystor pre-charge podaje user z karty katalogowej/pomiaru — nie " +
    "zgaduj. Użyj, gdy user pyta o czas ładowania kondensatorów falownika przed pierwszym podłączeniem BMS.",
  inputSchema: PodlaczenieBmsToolInput,
  outputSchema: PodlaczenieBmsToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/podlaczenie-bms",
  handler: async (input) => {
    const wynik = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: input.pojemnoscFalownikaUf,
      rezystancjaPreChargeOhm: input.rezystancjaPreChargeOhm,
      potwierdzoneIds: input.potwierdzoneIds,
    })
    return {
      status: wynik.status,
      czasPreChargeS: wynik.value.czasPreChargeS,
      potwierdzoneWKolejnosci: wynik.value.potwierdzoneWKolejnosci,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
