/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 29 "Koszt małego zestawu solarnego vs przedłużacz".
 * `operationType: 'read'`. Wszystkie kwoty, zużycie i horyzont MUSZĄ pochodzić od usera — aplikacja
 * nie ma cennika kabli ani zestawów (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateSolarVsPrzedluzacz } from "@/lib/core/modules/kalkulator-mobilny/solar-vs-przedluzacz/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SolarVsPrzedluzaczToolInput = z.object({
  kosztPrzedluzaczaZl: z.number().describe("Jednorazowy koszt przedłużacza/linii [zł] — od usera"),
  zuzycieKwhRok: z.number().describe("Zużycie energii w roku [kWh/rok] — od usera"),
  cenaEnergiiZlKwh: z.number().describe("Cena energii z sieci [zł/kWh] — od usera"),
  oplatyStaleZlRok: z.number().describe("Stałe opłaty sieciowe [zł/rok]; 0 gdy brak"),
  kosztZestawuZl: z.number().describe("Koszt zestawu solarnego [zł] — od usera"),
  eksploatacjaZestawuZlRok: z.number().describe("Roczny koszt utrzymania zestawu [zł/rok]; 0 gdy brak"),
  horyzontLat: z.number().describe("Horyzont porównania [lat] — od usera"),
})
export type SolarVsPrzedluzaczToolInputT = z.infer<typeof SolarVsPrzedluzaczToolInput>

export const SolarVsPrzedluzaczToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  kosztRocznySieciZl: z.number(),
  oszczednoscRocznaZl: z.number(),
  zwrotLat: z.number().nullable().describe("Okres zwrotu dopłaty do zestawu [lat]; 0 = od razu taniej; null = nigdy"),
  tcoPrzedluzaczZl: z.number(),
  tcoZestawZl: z.number(),
  tanszy: z.enum(["przedluzacz", "zestaw"]),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SolarVsPrzedluzaczToolOutputT = z.infer<typeof SolarVsPrzedluzaczToolOutput>

export const solarVsPrzedluzaczTool: AiToolDefinition<SolarVsPrzedluzaczToolInputT, SolarVsPrzedluzaczToolOutputT> = {
  name: "porownaj_zestaw_solarny_z_przedluzaczem",
  description:
    "Porównuje koszt całkowity (TCO) w horyzoncie usera: przedłużacz/linia z sieci + rachunki za prąd kontra " +
    "mały zestaw solarny + jego utrzymanie; liczy okres zwrotu dopłaty do zestawu. Użyj, gdy user zastanawia " +
    "się, czy na działkę, altanę albo warsztat ciągnąć kabel z sieci, czy postawić mały zestaw solarny.",
  inputSchema: SolarVsPrzedluzaczToolInput,
  outputSchema: SolarVsPrzedluzaczToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/solar-vs-przedluzacz",
  handler: async (input) => {
    const wynik = calculateSolarVsPrzedluzacz(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
