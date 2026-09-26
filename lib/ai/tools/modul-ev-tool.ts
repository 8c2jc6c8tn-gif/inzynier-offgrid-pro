/**
 * Narzędzie AI (9.3) dla Ekranu 4, Moduł 4 "Magazyn energii / baterie" — "Moduł EV — ładowanie
 * samochodu elektrycznego". `operationType: 'read'`. Dobowe zapotrzebowanie EV i nadwyżki PV
 * MUSZĄ pochodzić od usera — nie zgaduj zużycia energii EV na km ani produkcji PV.
 */
import { z } from "zod"
import { calculateModulEv } from "@/lib/core/modules/baterie/modul-ev/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ModulEvToolInput = z.object({
  energiaDobowaEvKwh: z.number().describe("Dobowe zapotrzebowanie na ładowanie EV [kWh] — od usera"),
  nadwyzkaPvLatemKwh: z.number().describe("Dostępna nadwyżka produkcji PV latem (ponad bieżące zużycie domu) [kWh/dobę] — od usera"),
  nadwyzkaPvZimaKwh: z.number().describe("Dostępna nadwyżka produkcji PV zimą [kWh/dobę] — od usera"),
})
export type ModulEvToolInputT = z.infer<typeof ModulEvToolInput>

export const ModulEvToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  brakLatemKwh: z.number(),
  brakZimaKwh: z.number(),
  pokryteLatem: z.boolean(),
  pokryteZima: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ModulEvToolOutputT = z.infer<typeof ModulEvToolOutput>

export const modulEvTool: AiToolDefinition<ModulEvToolInputT, ModulEvToolOutputT> = {
  name: "sprawdz_pokrycie_ladowania_ev_z_pv",
  description:
    "Sprawdza, czy nadwyżka produkcji PV (lato/zima) pokrywa dobowe zapotrzebowanie na ładowanie samochodu " +
    "elektrycznego, i liczy ewentualny brak (Moduł 4, Ekran 4). Zapotrzebowanie EV i nadwyżki PV podaje user " +
    "— nie zgaduj zużycia energii EV na km. Użyj, gdy user pyta, czy PV wystarczy do ładowania EV.",
  inputSchema: ModulEvToolInput,
  outputSchema: ModulEvToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/modul-ev",
  handler: async (input) => {
    const wynik = calculateModulEv({
      energiaDobowaEvKwh: input.energiaDobowaEvKwh,
      nadwyzkaPvLatemKwh: input.nadwyzkaPvLatemKwh,
      nadwyzkaPvZimaKwh: input.nadwyzkaPvZimaKwh,
    })
    return {
      status: wynik.status,
      brakLatemKwh: wynik.value.brakLatemKwh,
      brakZimaKwh: wynik.value.brakZimaKwh,
      pokryteLatem: wynik.value.pokryteLatem,
      pokryteZima: wynik.value.pokryteZima,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
