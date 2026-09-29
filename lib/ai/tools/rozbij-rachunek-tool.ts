/**
 * Narzędzie AI (9.3) dla M14 — D1/F1 „Mój rachunek dziś”. `operationType: 'read'`. Stawki sieciowe i
 * krajowe pochodzą z pliku `rozliczenia-pl-2026` (tylko ✅) albo z faktury usera; ceny energii i opłata
 * handlowa zawsze od usera. Brakujących danych narzędzie nie zgaduje — zwraca listę braków.
 */
import { z } from "zod"
import { calculateRachunek } from "@/lib/core/modules/siec/rachunek-za-prad/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"
import { SiecCenyStrefSchema, SiecGrupaSchema, SiecStrefyKwhSchema, SiecWspolneSchema } from "./siec-schematy"

export const RozbijRachunekToolInput = SiecWspolneSchema.extend({
  grupa: SiecGrupaSchema,
  zuzycieStrefKwh: SiecStrefyKwhSchema,
  cenaEnergiiZlKwh: SiecCenyStrefSchema,
})
export type RozbijRachunekToolInputT = z.infer<typeof RozbijRachunekToolInput>

export const RozbijRachunekToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  skladniki: z.array(
    z.object({ kod: z.string(), kwotaNettoZl: z.number(), charakter: z.enum(["staly", "zmienny"]), zrodlo: z.enum(["taryfa", "faktura"]) }),
  ),
  nettoZl: z.number(),
  bruttoZl: z.number(),
  staleNettoZl: z.number(),
  zmienneNettoZl: z.number(),
  cenaTrzymaniaSieciBruttoZl: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RozbijRachunekToolOutputT = z.infer<typeof RozbijRachunekToolOutput>

export const rozbijRachunekTool: AiToolDefinition<RozbijRachunekToolInputT, RozbijRachunekToolOutputT> = {
  name: "rozbij_rachunek_za_prad",
  description:
    "Rozbija roczny rachunek za prąd (M14, D1 dom / F1 firma) na składniki: energia, opłata handlowa, sieciowa " +
    "zmienna i stała, abonament, mocowa, jakościowa, OZE, kogeneracyjna; netto, brutto, stałe/zmienne i „cenę " +
    "trzymania sieci” (koszt samego posiadania przyłącza). Stawki OSD 2026 tylko dla Tauron, Energa, Stoen, Enea. Zużycie, " +
    "ceny energii i opłatę handlową podaje user — nie zgaduj.",
  inputSchema: RozbijRachunekToolInput,
  outputSchema: RozbijRachunekToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/rachunek-za-prad",
  handler: async (input) => {
    const wynik = calculateRachunek({ ...input, zuzycieMiesieczneKwh: null, stawkiWlasne: {} })
    return {
      status: wynik.status,
      skladniki: wynik.value.skladniki,
      nettoZl: wynik.value.nettoZl,
      bruttoZl: wynik.value.bruttoZl,
      staleNettoZl: wynik.value.staleNettoZl,
      zmienneNettoZl: wynik.value.zmienneNettoZl,
      cenaTrzymaniaSieciBruttoZl: wynik.value.cenaTrzymaniaSieciBruttoZl,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
