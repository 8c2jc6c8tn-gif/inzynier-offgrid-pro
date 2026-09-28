/**
 * Narzędzie AI (9.3) dla Ekranu 4, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "Moduł gaśniczy / elektrozawór
 * gazu" (dawne 11.52 + 12.51). `operationType: 'read'` — sprawdza konfigurację, niczego nie uruchamia. Środek
 * gaśniczy, chemia magazynu w strefie, liczba czujników, odcięcie wentylacji i stan modułu — WYŁĄCZNIE od usera.
 */
import { z } from "zod"
import { calculateModulGasniczy } from "@/lib/core/modules/bezpieczenstwo/modul-gasniczy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ModulGasniczyToolInput = z.object({
  srodek: z.enum(["gaz-obojetny", "mgla-wodna", "aerozol", "proszek", "co2", "specjalny-magazyn-energii"]).nullable(),
  magazynWStrefie: z
    .enum(["brak", "lifepo4", "inna"])
    .nullable()
    .describe("Czy strefa gaśnicza obejmuje magazyn energii i jakiej chemii — od usera"),
  liczbaCzujnikowPotwierdzenia: z.number().nullable().describe("Ile niezależnych czujników musi potwierdzić alarm (liczba całkowita ≥ 1)"),
  odcinaWentylacjeIKlapy: z.boolean().describe("Czy gaszenie odcina wentylację i zamyka klapy — tylko deklaracja usera"),
  stanModulu: z.enum(["sprawny", "rozladowany"]).nullable(),
})
export type ModulGasniczyToolInputT = z.infer<typeof ModulGasniczyToolInput>

export const ModulGasniczyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  srodekWlasciwyDlaLifepo4: z.boolean().nullable(),
  liczbaBrakow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ModulGasniczyToolOutputT = z.infer<typeof ModulGasniczyToolOutput>

export const modulGasniczyTool: AiToolDefinition<ModulGasniczyToolInputT, ModulGasniczyToolOutputT> = {
  name: "sprawdz_modul_gasniczy",
  description:
    "Sprawdza konfigurację stałego urządzenia gaśniczego: czy środek nadaje się do strefy magazynu LiFePO4 (proszek i CO2 " +
    "nie gaszą ogniwa — twardy stop), potwierdzenie alarmu co najmniej dwoma czujnikami, odcięcie wentylacji i klap oraz " +
    "stan modułu (rozładowany — twardy stop). Moduł 8, Ekran 4.",
  inputSchema: ModulGasniczyToolInput,
  outputSchema: ModulGasniczyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/modul-gasniczy",
  handler: async (input) => {
    const wynik = calculateModulGasniczy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
