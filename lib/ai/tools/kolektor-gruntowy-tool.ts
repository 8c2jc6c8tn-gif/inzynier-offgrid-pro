/**
 * Narzędzie AI (9.3) dla Modułu 6 — ekran dodatkowy "Wymiarowanie kolektora gruntowego" (dawne 5.42).
 * `operationType: 'read'`. Wskaźniki m²/10 kW i W/m oraz głębokość przemarzania MUSZĄ pochodzić od usera
 * (Dyrektywa #1) — źródło podaje tylko widełki, nie wartość dla konkretnego gruntu.
 */
import { z } from "zod"
import { calculateKolektorGruntowy } from "@/lib/core/modules/ogrzewanie/kolektor-gruntowy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Zakres = z.object({ min: z.number(), max: z.number() })

export const KolektorGruntowyToolInput = z.object({
  typ: z.enum(["poziomy", "pionowy", "spiralny"]).nullable().describe("Typ kolektora; spiralny = bez wymiarowania"),
  mocPompyKw: z.number().describe("Moc pompy ciepła [kW]"),
  m2Na10Kw: z.number().describe("Poziomy: powierzchnia na 10 kW [m²/10 kW] z projektu (źródło: 60–120); 0 dla pionowego"),
  glebokoscUlozeniaM: z.number().nullable().describe("Poziomy: głębokość ułożenia rur [m] (źródło: 1,2–1,8); null = nieznana"),
  glebokoscPrzemarzaniaM: z.number().nullable().describe("Poziomy: głębokość przemarzania gruntu [m] z mapy stref; null = nieznana"),
  wNaMetr: z.number().describe("Pionowy: moc z 1 m odwiertu [W/m] (źródło: 50–70); 0 dla poziomego"),
  glebokoscOdwiertuM: z.number().describe("Pionowy: głębokość jednego odwiertu [m] (źródło: 50–100); 0 dla poziomego"),
})
export type KolektorGruntowyToolInputT = z.infer<typeof KolektorGruntowyToolInput>

export const KolektorGruntowyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  powierzchniaM2: z.number().nullable(),
  powierzchniaZakresM2: Zakres.nullable(),
  dlugoscOdwiertowM: z.number().nullable(),
  dlugoscZakresM: Zakres.nullable(),
  liczbaOdwiertow: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KolektorGruntowyToolOutputT = z.infer<typeof KolektorGruntowyToolOutput>

export const kolektorGruntowyTool: AiToolDefinition<KolektorGruntowyToolInputT, KolektorGruntowyToolOutputT> = {
  name: "wymiaruj_kolektor_gruntowy",
  description:
    "Wymiarowanie dolnego źródła gruntowej pompy ciepła: powierzchnia kolektora poziomego (P/10 × m²/10 kW) z " +
    "kontrolą, czy rury leżą poniżej strefy przemarzania, albo łączna długość i liczba odwiertów pionowych (P / W/m), " +
    "z widełkami źródła obok. Użyj, gdy user pyta, ile metrów kwadratowych kolektora albo ile odwiertów potrzebuje " +
    "jego pompa ciepła, na jakiej głębokości ułożyć kolektor poziomy, czy kolektor nie zamarznie, albo co wybrać " +
    "przy małej działce.",
  inputSchema: KolektorGruntowyToolInput,
  outputSchema: KolektorGruntowyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/kolektor-gruntowy",
  handler: async (input) => {
    const wynik = calculateKolektorGruntowy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
