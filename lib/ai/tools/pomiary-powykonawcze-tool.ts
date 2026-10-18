/**
 * Narzędzie AI (9.3) dla Ekranu 29, Moduł 5 — "Pomiary i testy powykonawcze".
 * `operationType: 'read'`. Wszystkie wyniki pomiarów (rezystancja izolacji, rezystancja
 * uziemienia, czas zadziałania RCD) i potwierdzenia testów MUSZĄ pochodzić z rzeczywistych
 * pomiarów wykonanych przez uprawnioną osobę — model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePomiaryPowykonawcze } from "@/lib/core/modules/okablowanie/pomiary-powykonawcze/calculator"
import type { CelUziemienia } from "@/lib/core/modules/okablowanie/pomiary-powykonawcze/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen } from "./teksty-wyniku"

const CELE_UZIEMIENIA = ["odgromowa", "ochronna"] as [CelUziemienia, ...CelUziemienia[]]

export const PomiaryPowykonawczeToolInput = z.object({
  ciagloscPotwierdzona: z.boolean().describe("Czy ciągłość przewodów ochronnych/wyrównawczych została zmierzona i potwierdzona"),
  rezystancjaIzolacjiMohm: z.number().describe("Zmierzona rezystancja izolacji [MΩ]. 0 = jeszcze nie zmierzono"),
  celUziemienia: z.enum(CELE_UZIEMIENIA).describe("Cel uziemienia — reguluje próg rezystancji (10Ω odgromowa / 30Ω ochronna)"),
  rezystancjaUziemieniaOhm: z.number().describe("Zmierzona rezystancja uziemienia [Ω]. 0 = jeszcze nie zmierzono"),
  czasZadzialaniaRcdS: z.number().describe("Zmierzony czas zadziałania RCD [s]. 0 = jeszcze nie zmierzono"),
  testZwarciowyPotwierdzony: z.boolean().describe("Czy test zwarciowy został wykonany i potwierdzony"),
  termowizjaPotwierdzona: z.boolean().describe("Czy kontrola termowizyjna połączeń została wykonana i potwierdzona"),
})

export type PomiaryPowykonawczeToolInputT = z.infer<typeof PomiaryPowykonawczeToolInput>

export const PomiaryPowykonawczeToolOutput = z.object({
  testowPrzeszlo: z.number(),
  testowLacznie: z.number(),
  status: z.enum(STATUSY),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type PomiaryPowykonawczeToolOutputT = z.infer<typeof PomiaryPowykonawczeToolOutput>

export const pomiaryPowykonawczeTool: AiToolDefinition<PomiaryPowykonawczeToolInputT, PomiaryPowykonawczeToolOutputT> = {
  name: "policz_pomiary_powykonawcze",
  description:
    "Sprawdza wynik 6 niezależnych testów powykonawczych instalacji (ciągłość, rezystancja izolacji " +
    "≥1MΩ, rezystancja uziemienia wg celu, czas zadziałania RCD ≤0,4s, test zwarciowy, termowizja) — " +
    "dowolny test poza progiem/nieukończony oznacza brak formalnego odbioru instalacji. Wszystkie wyniki " +
    "MUSZĄ pochodzić z rzeczywistych pomiarów. Użyj, gdy user pyta o odbiór/pomiary powykonawcze instalacji.",
  inputSchema: PomiaryPowykonawczeToolInput,
  outputSchema: PomiaryPowykonawczeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/pomiary-powykonawcze",
  handler: async (input) => {
    const wynik = calculatePomiaryPowykonawcze(input)
    return {
      testowPrzeszlo: wynik.value.testowPrzeszlo,
      testowLacznie: wynik.value.testowLacznie,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
