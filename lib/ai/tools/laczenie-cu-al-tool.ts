/**
 * Narzędzie AI (9.3) dla Ekranu 4, Moduł 5 — "Łączenie Cu-Al i ochrona przed korozją".
 * `operationType: 'read'`. Para materiałów, środowisko i sposób połączenia (złączka
 * bimetaliczna/podkładka i smar) MUSZĄ pochodzić od użytkownika (rzeczywiste komponenty
 * instalacji) — model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { calculateLaczenieCuAl } from "@/lib/core/modules/okablowanie/laczenie-cu-al/calculator"
import type { Material, Srodowisko } from "@/lib/core/modules/okablowanie/laczenie-cu-al/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen } from "./teksty-wyniku"

const MATERIALY = ["Cu", "Al", "stal-ocynkowana", "stal-nierdzewna", "mosiadz"] as [Material, ...Material[]]
const SRODOWISKA = ["suche", "wilgotne", "slone"] as [Srodowisko, ...Srodowisko[]]

export const LaczenieCuAlToolInput = z.object({
  material1: z.enum(MATERIALY).nullable().describe("Pierwszy materiał łączonego przewodu/zacisku"),
  material2: z.enum(MATERIALY).nullable().describe("Drugi materiał łączonego przewodu/zacisku"),
  srodowisko: z.enum(SRODOWISKA).describe("Środowisko montażu połączenia"),
  maZlaczkeBimetaliczna: z.boolean().describe("Tylko przy parze Cu+Al: czy zastosowano złączkę bimetaliczną z pastą"),
  maPodkladkeISmar: z.boolean().describe("Tylko przy parze stal ocynkowana+Cu: czy zastosowano podkładkę i smar"),
  przekrojCuMm2: z.number().describe("Opcjonalnie: przekrój Cu do przeliczenia na wymagany przekrój Al [mm²]. 0 = nie liczone"),
})

export type LaczenieCuAlToolInputT = z.infer<typeof LaczenieCuAlToolInput>

export const LaczenieCuAlToolOutput = z.object({
  bezpieczna: z.boolean().nullable(),
  wymaganyPrzekrojAlMm2: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type LaczenieCuAlToolOutputT = z.infer<typeof LaczenieCuAlToolOutput>

export const laczenieCuAlTool: AiToolDefinition<LaczenieCuAlToolInputT, LaczenieCuAlToolOutputT> = {
  name: "policz_laczenie_cu_al",
  description:
    "Ocenia bezpieczeństwo połączenia dwóch metali (Cu+Al, stal ocynkowana+Cu, stal nierdzewna+Al w " +
    "suchym/słonym środowisku) pod kątem korozji galwanicznej, wg konkretnych zabezpieczeń zastosowanych " +
    "przez usera (złączka bimetaliczna, podkładka i smar). Inne kombinacje materiałów są poza zakresem — " +
    "źródło ich nie ocenia. Liczy też wymagany przekrój Al równoważny podanemu przekrojowi Cu (×1,6). " +
    "Użyj, gdy user pyta o łączenie różnych metali w instalacji PV/elektryce niskonapięciowej.",
  inputSchema: LaczenieCuAlToolInput,
  outputSchema: LaczenieCuAlToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/laczenie-cu-al",
  handler: async (input) => {
    const wynik = calculateLaczenieCuAl(input)
    return {
      bezpieczna: wynik.value.bezpieczna,
      wymaganyPrzekrojAlMm2: wynik.value.wymaganyPrzekrojAlMm2,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
