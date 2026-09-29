/**
 * Narzędzie AI (9.3) — Moduł 4, Ekran 30 „Porównanie technologii magazynów” (dawne 3.34).
 * `operationType: 'read'`. Echo silnika `baterie/porownanie-technologii`: energia oddana w całym
 * cyklu życia (pojemność × cykle × DoD) dla LiFePO4, AGM, GEL i trakcyjnej. Opisowe — bez werdyktu.
 */
import { z } from "zod"
import { calculatePorownanieTechnologii } from "@/lib/core/modules/baterie/porownanie-technologii/calculator"
import { CENA_STARTOWA_LABELS } from "@/lib/core/modules/baterie/porownanie-technologii/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PorownanieTechnologiiToolInput = z.object({
  pojemnoscKwh: z
    .number()
    .nullable()
    .describe("Planowana pojemność nominalna magazynu [kWh]; null = porównanie per 1 kWh"),
})
export type PorownanieTechnologiiToolInputT = z.infer<typeof PorownanieTechnologiiToolInput>

export const PorownanieTechnologiiToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  technologie: z.array(
    z.object({
      nazwa: z.string(),
      cenaStartowa: z.string(),
      cykle: z.string(),
      sprawnoscPct: z.number().nullable(),
      wagaKgNaKwh: z.string(),
      obsluga: z.string(),
      energiaCalkowitaKwh: z.number(),
    }),
  ),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PorownanieTechnologiiToolOutputT = z.infer<typeof PorownanieTechnologiiToolOutput>

export const porownanieTechnologiiTool: AiToolDefinition<
  PorownanieTechnologiiToolInputT,
  PorownanieTechnologiiToolOutputT
> = {
  name: "porownaj_technologie_magazynow",
  description:
    "Zestawia technologie magazynów energii — LiFePO4, kwasowa AGM, żelowa GEL, trakcyjna — z tabeli źródłowej " +
    "(Moduł 4, Ekran 30): cena startowa, cykle przy DoD, sprawność, waga na kWh, obsługa, oraz energię oddaną " +
    "w całym cyklu życia E = pojemność × cykle × DoD. Opisowe porównanie, bez werdyktu. Użyj, gdy user pyta, " +
    "jaką technologię akumulatora wybrać, czym różni się LiFePO4 od AGM/żelu albo co wyjdzie taniej w całym życiu magazynu.",
  inputSchema: PorownanieTechnologiiToolInput,
  outputSchema: PorownanieTechnologiiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/porownanie-technologii",
  handler: async (input) => {
    const wynik = calculatePorownanieTechnologii({ pojemnoscKwh: input.pojemnoscKwh ?? undefined })
    return {
      status: wynik.status,
      technologie: wynik.value.map((t) => ({
        nazwa: t.label,
        cenaStartowa: CENA_STARTOWA_LABELS[t.cenaStartowa],
        cykle: t.cyklePrzyDodOpis,
        sprawnoscPct: t.sprawnoscPct,
        wagaKgNaKwh: t.wagaKgPerKwhOpis,
        obsluga: t.obsluga,
        energiaCalkowitaKwh: t.energiaCalkowitaKwh,
      })),
      wzor: wynik.formula,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
