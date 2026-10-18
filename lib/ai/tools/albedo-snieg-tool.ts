/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 9 "Analiza albedo i wydajność bifacjalna w śniegu" (dawne 6.10, 6.21).
 * `operationType: 'read'`. Procent zysku MUSI pochodzić od usera (Dyrektywa #1) — przykłady ze źródła to ilustracje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAlbedoSnieg } from "@/lib/core/modules/stress-test/albedo-snieg/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AlbedoSniegToolInput = z.object({
  produkcjaOkresKwh: z.number().describe("Produkcja PV w okresie ze śniegiem, bez zysku z albedo [kWh]"),
  typMontazu: z
    .enum(["dach", "stromy", "pionowy-jednostronny", "bifacjalny"])
    .nullable()
    .describe("Typ montażu paneli; null gdy user nie podał"),
  zyskPct: z
    .number()
    .nullable()
    .describe("Dodatkowa produkcja od światła odbitego od śniegu [%] podana przez usera; null gdy nie podał"),
})
export type AlbedoSniegToolInputT = z.infer<typeof AlbedoSniegToolInput>

export const AlbedoSniegToolOutput = z.object({
  status: z.enum(STATUSY),
  zyskKwh: z.number(),
  produkcjaZZyskiemKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AlbedoSniegToolOutputT = z.infer<typeof AlbedoSniegToolOutput>

export const albedoSniegTool: AiToolDefinition<AlbedoSniegToolInputT, AlbedoSniegToolOutputT> = {
  name: "licz_zysk_z_albedo_sniegu",
  description:
    "Liczy dodatkową produkcję PV od światła odbitego od śniegu (albedo) w okresie ze śniegiem: produkcja razy " +
    "procent zysku podany przez usera; przy montażu na dachu ostrzega, że zysk jest bliski zera. " +
    "Użyj, gdy user pyta, ile dadzą panele pionowe albo bifacjalne zimą przy śniegu, czy opłaca się montaż pionowy " +
    "na ogrodzeniu ze względu na śnieg, albo ile kWh doda albedo do zimowej produkcji.",
  inputSchema: AlbedoSniegToolInput,
  outputSchema: AlbedoSniegToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/albedo-snieg",
  handler: async (input) => {
    const wynik = calculateAlbedoSnieg(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
