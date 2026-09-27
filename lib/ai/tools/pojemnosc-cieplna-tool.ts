/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 8 "Pojemność cieplna budynku (bezwładność)" (dawne 5.8 + 6.11). `operationType: 'read'`.
 * Warstwy (powierzchnia, grubość, ρ, c) i H tylko od usera (karta materiału, policz_straty_ciepla_budynku) — brak → INCOMPLETE,
 * nigdy wartości zgadnięte przez model. Od 27.09.2026 pojemność czynna wg EN ISO 13786 Zał. A (okres 1 doby) — przybliżenie,
 * adnotacja idzie w `ostrzezenia`; cała masa (C źródła) osobno w `pojemnoscCalkowitaKwhK`.
 */
import { z } from "zod"
import { calculatePojemnoscCieplna } from "@/lib/core/modules/ogrzewanie/pojemnosc-cieplna/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Warstwa = z.object({
  nazwa: z.string(),
  powierzchniaM2: z.number(),
  gruboscCm: z.number(),
  gestoscKgM3: z.number().describe("Gęstość ρ [kg/m³] — z karty materiału, tylko od usera"),
  cieploWlasciweJKgK: z.number().describe("Ciepło właściwe c [J/(kg·K)] — z karty materiału, tylko od usera"),
  strona: z
    .enum(["jedna", "obie", "za-izolacja"])
    .optional()
    .describe("jedna (domyślnie) — jedna powierzchnia do wnętrza; obie — przegroda w całości wewnątrz domu; za-izolacja — warstwa za izolacją"),
  gruboscElementuCm: z.number().optional().describe("Grubość całej przegrody [cm], gdy warstwa jest tylko jej częścią — od usera"),
})

export const PojemnoscCieplnaToolInput = z.object({
  warstwy: z.array(Warstwa).min(1),
  kubaturaM3: z.number().optional(),
  hZewnetrzneWK: z.number().describe("Σ U·A przegród zewnętrznych + H_V [W/K] — z policz_straty_ciepla_budynku"),
  stratyDoInnychStref: z
    .array(z.object({ hWK: z.number(), temperaturaC: z.number() }))
    .optional()
    .describe("U·A przegród do gruntu/strefy nieogrzewanej [W/K] z ich stałą temperaturą"),
  temperaturaPoczatkowaC: z.number(),
  temperaturaZewnetrznaC: z.number(),
  temperaturaGranicznaC: z.number().optional().describe("Temperatura, poniżej której nie wolno zejść — tylko od usera"),
})
export type PojemnoscCieplnaToolInputT = z.infer<typeof PojemnoscCieplnaToolInput>

export const PojemnoscCieplnaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pojemnoscKwhK: z.number().nullable(),
  pojemnoscCalkowitaKwhK: z.number().nullable(),
  stalaCzasowaH: z.number().nullable(),
  temperaturaRownowagiC: z.number().nullable(),
  czasPierwszegoStopniaH: z.number().nullable(),
  czasDoGranicyH: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PojemnoscCieplnaToolOutputT = z.infer<typeof PojemnoscCieplnaToolOutput>

export const pojemnoscCieplnaTool: AiToolDefinition<PojemnoscCieplnaToolInputT, PojemnoscCieplnaToolOutputT> = {
  name: "policz_bezwladnosc_budynku",
  description:
    "Pojemność cieplna budynku — warstwa czynna wg EN ISO 13786 Zał. A dla wahań dobowych (+ powietrze) [kWh/K], stała " +
    "czasowa τ = C/H i wychładzanie po awarii ogrzewania: czas spadku o 1 °C i do temperatury granicznej; cała masa osobno. " +
    "Warstwy, ρ, c i H podaje user — nie zgaduj. Wynik to przybliżenie — zawsze przekaż userowi ostrzeżenie. Użyj, gdy user pyta o bezwładność albo ile ma czasu do zamarznięcia.",
  inputSchema: PojemnoscCieplnaToolInput,
  outputSchema: PojemnoscCieplnaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/pojemnosc-cieplna",
  handler: async (input) => {
    const wynik = calculatePojemnoscCieplna({
      warstwy: input.warstwy,
      kubaturaM3: input.kubaturaM3 ?? null,
      hZewnetrzneWK: input.hZewnetrzneWK,
      stratyDoInnychStref: input.stratyDoInnychStref ?? [],
      temperaturaPoczatkowaC: input.temperaturaPoczatkowaC,
      temperaturaZewnetrznaC: input.temperaturaZewnetrznaC,
      temperaturaGranicznaC: input.temperaturaGranicznaC ?? null,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      pojemnoscKwhK: v?.pojemnoscKwhK ?? null,
      pojemnoscCalkowitaKwhK: v?.pojemnoscCalkowitaKwhK ?? null,
      stalaCzasowaH: v?.stalaCzasowaH ?? null,
      temperaturaRownowagiC: v?.temperaturaRownowagiC ?? null,
      czasPierwszegoStopniaH: v?.czasPierwszegoStopniaH ?? null,
      czasDoGranicyH: v?.czasDoGranicyH ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
