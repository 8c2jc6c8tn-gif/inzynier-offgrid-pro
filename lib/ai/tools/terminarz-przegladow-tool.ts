/**
 * Narzędzie AI (9.3) dla Modułu 13: „Terminarz przeglądów i serwisu" (7.32 bez telemetrii). `operationType: 'read'`.
 * Interwały i daty podaje user z instrukcji swoich urządzeń — model nie zna zaleceń producentów i nie zgaduje interwałów.
 */
import { z } from "zod"
import { calculateTerminarzPrzegladow } from "@/lib/core/modules/bezpieczenstwo/terminarz-przegladow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TerminarzPrzegladowToolInput = z.object({
  dzisiaj: z.string().describe("Dzień odniesienia RRRR-MM-DD (dzisiejsza data usera)"),
  pozycje: z
    .array(
      z.object({
        nazwa: z.string(),
        ostatniPrzegladData: z.string().optional().describe("Data ostatniego przeglądu RRRR-MM-DD — od usera"),
        interwalMiesiecy: z.number().optional().describe("Odstęp między przeglądami [miesiące, całkowite ≥ 1] — z instrukcji urządzenia usera, nie zgaduj"),
      }),
    )
    .describe("Pozycje do przeglądu"),
})
export type TerminarzPrzegladowToolInputT = z.infer<typeof TerminarzPrzegladowToolInput>

export const TerminarzPrzegladowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  terminy: z.array(
    z.object({
      nazwa: z.string(),
      nastepnyTermin: z.string().nullable(),
      dniDoTerminu: z.number().nullable().describe("Dodatnie = przed terminem, 0 = dziś, ujemne = po terminie"),
      status: z.enum(["po-terminie", "w-terminie", "bez-terminu"]),
    }),
  ),
  poTerminie: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TerminarzPrzegladowToolOutputT = z.infer<typeof TerminarzPrzegladowToolOutput>

export const terminarzPrzegladowTool: AiToolDefinition<TerminarzPrzegladowToolInputT, TerminarzPrzegladowToolOutputT> = {
  name: "policz_terminarz_przegladow",
  description:
    "Terminarz przeglądów i serwisu instalacji (Moduł 13, bez telemetrii): z daty ostatniego przeglądu i odstępu w miesiącach (kalendarzowych) " +
    "liczy następny termin i ile dni zostało albo ile minęło po terminie; pozycje od najpilniejszej. Daty i interwały podaje user z instrukcji " +
    "swoich urządzeń — aplikacja nie zna zaleceń producentów, nie podawaj interwałów od siebie. " +
    "Użyj, gdy user pyta, kiedy ma następny przegląd (akumulatory, złącza, gaśnice, czyszczenie paneli), czy coś jest po terminie " +
    "albo chce uporządkować harmonogram serwisu.",
  inputSchema: TerminarzPrzegladowToolInput,
  outputSchema: TerminarzPrzegladowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/terminarz-przegladow",
  handler: async (input) => {
    const wynik = calculateTerminarzPrzegladow({
      dzisiaj: input.dzisiaj,
      pozycje: input.pozycje.map((p, i) => ({ id: String(i), nazwa: p.nazwa, ostatniPrzegladData: p.ostatniPrzegladData ?? null, interwalMiesiecy: p.interwalMiesiecy ?? null })),
    })
    return {
      status: wynik.status,
      terminy: (wynik.value?.terminy ?? []).map((x) => ({ nazwa: x.nazwa, nastepnyTermin: x.nastepnyTermin, dniDoTerminu: x.dniDoTerminu, status: x.status })),
      poTerminie: wynik.value?.poTerminie ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
