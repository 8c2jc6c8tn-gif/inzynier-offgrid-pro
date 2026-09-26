/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 10 "Optymalizacja izolacji" (dawne 5.10). `operationType: 'read'`.
 * U i powierzchnia przegrody, λ, grubości i ceny tylko od usera (karta produktu, sklep) — brak → INCOMPLETE,
 * nigdy wartości zgadnięte przez model.
 */
import { z } from "zod"
import { calculateOptymalizacjaIzolacji } from "@/lib/core/modules/ogrzewanie/optymalizacja-izolacji/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Wariant = z.object({
  nazwa: z.string().describe("Materiał, np. wełna, styropian, PUR, celuloza"),
  lambdaWmK: z.number().describe("λ deklarowane [W/(m·K)] — z karty produktu, tylko od usera"),
  gruboscCm: z.number().describe("Grubość warstwy [cm]"),
  cenaZlM2: z.number().describe("Cena warstwy tej grubości [zł/m²] — tylko od usera"),
})

export const OptymalizacjaIzolacjiToolInput = z.object({
  nazwaPrzegrody: z.string(),
  powierzchniaM2: z.number(),
  uWM2K: z.number().describe("Obecne U przegrody [W/(m²·K)] — z projektu, świadectwa lub policz_straty_ciepla_budynku"),
  warianty: z.array(Wariant).min(1),
  temperaturaWewnetrznaC: z.number(),
  srednieTemperaturyMiesieczneC: z.array(z.number()).length(12).describe("12 średnich miesięcznych [°C], od stycznia"),
  cenaCieplaZlKwh: z.number().optional().describe("Cena ciepła [zł/kWh] — tylko od usera; bez niej brak oceny grubości"),
})
export type OptymalizacjaIzolacjiToolInputT = z.infer<typeof OptymalizacjaIzolacjiToolInput>

export const OptymalizacjaIzolacjiToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  strataRocznaPrzedKwh: z.number().nullable(),
  warianty: z.array(
    z.object({
      nazwa: z.string(),
      gruboscCm: z.number(),
      uPoWM2K: z.number(),
      oszczednoscKwhRok: z.number(),
      kosztZl: z.number(),
      kosztZaKwhZl: z.number().nullable(),
      kosztKrancowyZaKwhZl: z.number().nullable(),
    }),
  ),
  najtanszy: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OptymalizacjaIzolacjiToolOutputT = z.infer<typeof OptymalizacjaIzolacjiToolOutput>

export const optymalizacjaIzolacjiTool: AiToolDefinition<OptymalizacjaIzolacjiToolInputT, OptymalizacjaIzolacjiToolOutputT> = {
  name: "porownaj_warianty_izolacji",
  description:
    "Opłacalność docieplenia jednej przegrody: U po dociepleniu = 1/(1/U + d/λ), roczna oszczędność ciepła z średnich " +
    "miesięcznych, koszt 1 zaoszczędzonej kWh w 10 lat, najtańszy wariant i koszt dodatkowych centymetrów. λ, grubości, " +
    "ceny i U podaje user — nie zgaduj. Użyj, gdy user pyta, jaką izolację i jak grubą wybrać albo czy docieplenie się opłaca.",
  inputSchema: OptymalizacjaIzolacjiToolInput,
  outputSchema: OptymalizacjaIzolacjiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/optymalizacja-izolacji",
  handler: async (input) => {
    const wynik = calculateOptymalizacjaIzolacji({
      przegroda: { nazwa: input.nazwaPrzegrody, powierzchniaM2: input.powierzchniaM2, uWM2K: input.uWM2K },
      warianty: input.warianty,
      temperaturaWewnetrznaC: input.temperaturaWewnetrznaC,
      srednieTemperaturyMiesieczneC: input.srednieTemperaturyMiesieczneC,
      cenaCieplaZlKwh: input.cenaCieplaZlKwh ?? null,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      strataRocznaPrzedKwh: v?.strataRocznaPrzedKwh ?? null,
      warianty: (v?.warianty ?? []).map((w) => ({
        nazwa: w.nazwa,
        gruboscCm: w.gruboscCm,
        uPoWM2K: w.uPoWM2K,
        oszczednoscKwhRok: w.oszczednoscKwhRok,
        kosztZl: w.kosztZl,
        kosztZaKwhZl: w.kosztZaKwhZl,
        kosztKrancowyZaKwhZl: w.kosztKrancowyZaKwhZl,
      })),
      najtanszy: v && v.najtanszyIndex !== null ? `${v.warianty[v.najtanszyIndex]!.nazwa} ${v.warianty[v.najtanszyIndex]!.gruboscCm} cm` : null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
