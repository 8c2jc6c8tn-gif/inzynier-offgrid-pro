/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A5 "Pierwsze uruchomienie + test balansowania"
 * (LiFePO4). `operationType: 'read'`. Pojemność pakietu [Ah] i napięcie najwyżej naładowanego
 * ogniwa podczas testu pochodzą wyłącznie z karty katalogowej/pomiaru usera — nie zgaduj.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePierwszeUruchomienie } from "@/lib/core/modules/montaz-baterii/pierwsze-uruchomienie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PierwszeUruchomienieToolInput = z.object({
  pojemnoscAh: z.number().describe("Pojemność pakietu [Ah] — z karty katalogowej ogniw, tylko od usera"),
  napiecieNajwyzszegoOgniwaV: z
    .number()
    .describe("Napięcie najwyżej naładowanego ogniwa podczas testu [V], zmierzone przez usera — tylko od usera"),
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty (BMS balansuje, weryfikacja parametrów) już potwierdzonych"),
})
export type PierwszeUruchomienieToolInputT = z.infer<typeof PierwszeUruchomienieToolInput>

export const PierwszeUruchomienieToolOutput = z.object({
  status: z.enum(STATUSY),
  pradTestowyA: z.number(),
  osiagnietoTopBalancing: z.boolean(),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PierwszeUruchomienieToolOutputT = z.infer<typeof PierwszeUruchomienieToolOutput>

export const pierwszeUruchomienieTool: AiToolDefinition<
  PierwszeUruchomienieToolInputT,
  PierwszeUruchomienieToolOutputT
> = {
  name: "policz_pierwsze_uruchomienie_pakietu",
  description:
    "Pierwsze uruchomienie pakietu LiFePO4 po montażu (Moduł 11, Ekran A5): prąd testowy 0,1C " +
    "(I_test = 0,1C × C_Ah) do wykonania testu obciążenia, sprawdzenie osiągnięcia napięcia Top Balancing " +
    "(3,55V — kamień milowy informacyjny, nie twardy stop) i postęp checklisty. Pojemność i napięcie ogniwa " +
    "podaje user z karty katalogowej/pomiaru — nie zgaduj. Użyj, gdy user pyta o prąd testowy po montażu " +
    "pakietu albo czy osiągnięto Top Balancing.",
  inputSchema: PierwszeUruchomienieToolInput,
  outputSchema: PierwszeUruchomienieToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/pierwsze-uruchomienie",
  handler: async (input) => {
    const wynik = calculatePierwszeUruchomienie({
      pojemnoscAh: input.pojemnoscAh,
      napiecieNajwyzszegoOgniwaV: input.napiecieNajwyzszegoOgniwaV,
      potwierdzoneIds: input.potwierdzoneIds,
    })
    return {
      status: wynik.status,
      pradTestowyA: wynik.value.pradTestowyA,
      osiagnietoTopBalancing: wynik.value.osiagnietoTopBalancing,
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
