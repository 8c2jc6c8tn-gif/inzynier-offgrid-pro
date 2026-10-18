/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 4 "Mam akumulator — co mogę podłączyć?".
 * `operationType: 'read'`. Pojemność, napięcie, DoD, sprawność przetwornicy i moce urządzeń MUSZĄ
 * pochodzić od usera (Dyrektywa #1, D33 — przykładowe moce to tylko podpowiedź, nie dane).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMamAkumulator } from "@/lib/core/modules/kalkulator-mobilny/mam-akumulator/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MamAkumulatorToolInput = z.object({
  chemia: z.enum(["agm", "lifepo4", "kwasowy"]).describe("Typ akumulatora: AGM, LiFePO4, kwasowy zalewany"),
  pojemnoscAh: z.number().describe("Pojemność znamionowa [Ah] — od usera"),
  napiecieV: z.number().describe("Napięcie akumulatora [V] — od usera"),
  dodPct: z.number().describe("Dopuszczalna głębokość rozładowania [%] — od usera (karta akumulatora), nie zgaduj"),
  sprawnoscPct: z.number().describe("Sprawność przetwornicy [%]; 100 gdy urządzenia 12/24 V wprost z akumulatora"),
  maksPradA: z.number().describe("Maksymalny prąd ciągły akumulatora/BMS [A]; 0 gdy user nie podał"),
  urzadzenia: z
    .array(z.object({ nazwa: z.string(), mocW: z.number().describe("Moc urządzenia [W] — od usera") }))
    .describe("Lista urządzeń do sprawdzenia"),
})
export type MamAkumulatorToolInputT = z.infer<typeof MamAkumulatorToolInput>

export const MamAkumulatorToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaUzytecznaWh: z.number().describe("Energia do wykorzystania [Wh] = C × U × DoD × η"),
  urzadzenia: z
    .array(z.object({ nazwa: z.string(), mocW: z.number(), czasH: z.number(), pradA: z.number() }))
    .describe("Czas pracy [h] i prąd [A] każdego urządzenia osobno, od najdłuższego"),
  czasRazemH: z.number().describe("Czas pracy wszystkich urządzeń naraz [h]"),
  pradRazemA: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MamAkumulatorToolOutputT = z.infer<typeof MamAkumulatorToolOutput>

export const mamAkumulatorTool: AiToolDefinition<MamAkumulatorToolInputT, MamAkumulatorToolOutputT> = {
  name: "sprawdz_co_podlaczyc_do_akumulatora",
  description:
    "Dla posiadanego akumulatora liczy energię do wykorzystania (C × U × DoD × η) i czas pracy każdego " +
    "urządzenia z listy osobno oraz wszystkich naraz; ostrzega, gdy prąd urządzenia przekracza maksymalny " +
    "prąd akumulatora. Użyj, gdy user ma już akumulator i pyta, co może do niego podłączyć albo jak długo " +
    "popracuje na nim lodówka, oświetlenie czy inne urządzenia.",
  inputSchema: MamAkumulatorToolInput,
  outputSchema: MamAkumulatorToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/mam-akumulator",
  handler: async (input) => {
    const wynik = calculateMamAkumulator(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
