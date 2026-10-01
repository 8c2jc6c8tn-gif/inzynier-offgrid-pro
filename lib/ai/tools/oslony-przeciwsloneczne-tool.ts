/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 19 "Ochrona przed przegrzaniem latem" (dawne 5.25, Biblia §6.25),
 * część geometryczna (stały okap nad oknem południowym). `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateOslonyPrzeciwsloneczne } from "@/lib/core/modules/ogrzewanie/oslony-przeciwsloneczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OslonyPrzeciwsloneczneToolInput = z.object({
  szerokoscDeg: z.number().describe("Szerokość geograficzna [°N]"),
  wysiegM: z.number().describe("Wysięg okapu od ściany [m]"),
  odstepM: z.number().describe("Odstęp od spodu okapu do górnej krawędzi okna [m]"),
  wysokoscOknaM: z.number().describe("Wysokość przeszklenia [m]"),
})
export type OslonyPrzeciwsloneczneToolInputT = z.infer<typeof OslonyPrzeciwsloneczneToolInput>

export const OslonyPrzeciwsloneczneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wysokoscLatoDeg: z.number(),
  wysokoscZimaDeg: z.number(),
  zacienienieLatoPct: z.number(),
  zacienienieZimaPct: z.number(),
  wysiegPelnyCienLatoM: z.number(),
  wysiegMaxBezCieniaZimaM: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OslonyPrzeciwsloneczneToolOutputT = z.infer<typeof OslonyPrzeciwsloneczneToolOutput>

export const oslonyPrzeciwsloneczneTool: AiToolDefinition<OslonyPrzeciwsloneczneToolInputT, OslonyPrzeciwsloneczneToolOutputT> = {
  name: "sprawdz_okap_nad_oknem",
  description:
    "Geometria stałego okapu nad oknem południowym: wysokość słońca w południe przesilenia letniego i zimowego, " +
    "jaka część okna jest wtedy w cieniu, wysięg dający pełny cień latem i maksymalny bez cienia zimą. Bez zysków " +
    "w kWh. Użyj, gdy user pyta, jak duży daszek/balkon/okap nad oknem południowym zrobić, żeby latem nie przegrzewać " +
    "domu, a zimą nie zabierać słońca.",
  inputSchema: OslonyPrzeciwsloneczneToolInput,
  outputSchema: OslonyPrzeciwsloneczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/oslony-przeciwsloneczne",
  handler: async (input) => {
    const wynik = calculateOslonyPrzeciwsloneczne(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
