/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 4 "Liczba domowników". `operationType: 'read'`. Liczy
 * dobowe zapotrzebowanie na C.W.U. (zakres 50-70 l/osobę) — jedyny fragment ekranu z gotowym
 * wzorem. Liczba domowników pochodzi WYŁĄCZNIE od usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateLiczbaDomownikow } from "@/lib/core/modules/zapotrzebowanie/liczba-domownikow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const LiczbaDomownikowToolInput = z.object({
  liczbaDomownikow: z.number().describe("Liczba domowników (1-6 wg suwaka źródła) — od usera, nie zgaduj"),
})
export type LiczbaDomownikowToolInputT = z.infer<typeof LiczbaDomownikowToolInput>

export const LiczbaDomownikowToolOutput = z.object({
  status: z.enum(STATUSY),
  cwuMinLDoba: z.number(),
  cwuMaxLDoba: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type LiczbaDomownikowToolOutputT = z.infer<typeof LiczbaDomownikowToolOutput>

export const liczbaDomownikowTool: AiToolDefinition<LiczbaDomownikowToolInputT, LiczbaDomownikowToolOutputT> = {
  name: "policz_zapotrzebowanie_cwu_z_liczby_domownikow",
  description:
    "Liczy zakres dobowego zapotrzebowania na C.W.U. [l/dobę] (50-70 l/osobę) na podstawie liczby domowników " +
    "— Moduł 2, Ekran 4. Liczbę domowników podaje user — nie zgaduj. Użyj, gdy user pyta o zużycie ciepłej wody " +
    "użytkowej na podstawie liczby mieszkańców.",
  inputSchema: LiczbaDomownikowToolInput,
  outputSchema: LiczbaDomownikowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/liczba-domownikow",
  handler: async (input) => {
    const wynik = calculateLiczbaDomownikow({ liczbaDomownikow: input.liczbaDomownikow })
    return {
      status: wynik.status,
      cwuMinLDoba: wynik.value.cwuMinLDoba,
      cwuMaxLDoba: wynik.value.cwuMaxLDoba,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
