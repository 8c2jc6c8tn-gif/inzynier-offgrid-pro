/**
 * Narzędzie AI (9.3) dla Ekranu 23, Moduł 7 "Stress-test zimowy" — "Obciążenie dachu lodem i
 * śniegiem". `operationType: 'read'`. Strefę śniegową (mapa NB.1), wysokość n.p.m., kąt dachu i
 * nośność konstrukcji podaje user — model nigdy ich nie zgaduje (nośność pochodzi z projektu
 * budowlanego albo od konstruktora).
 */
import { z } from "zod"
import { calculateObciazenieDachuSniegiem } from "@/lib/core/modules/stress-test/obciazenie-dachu-sniegiem/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ObciazenieDachuSniegiemToolInput = z.object({
  strefa: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
    .describe("Strefa obciążenia śniegiem gruntu z mapy PN-EN 1991-1-3 NB.1 (1–5) — od usera, nie zgaduj"),
  wysokoscNpmM: z.number().describe("Wysokość nad poziomem morza [m] — od usera"),
  katDachuDeg: z.number().describe("Kąt spadku dachu [°], 0 = dach płaski — od usera"),
  ekspozycja: z
    .enum(["wystawiony", "normalny", "osloniety"])
    .describe("Teren wg Tablicy 5.1: wystawiony na wiatr / normalny / osłonięty — domyślnie 'normalny' (norma 5.2(7))"),
  barierkiLubAttyka: z.boolean().describe("Czy na dachu są barierki przeciwśnieżne, przeszkody albo attyka na dolnej krawędzi"),
  nosnoscDachuKnM2: z
    .number()
    .describe("Dopuszczalne obciążenie śniegiem z projektu konstrukcji, wartość charakterystyczna [kN/m²]; 0 = user nie zna"),
  gruboscWarstwyCm: z.number().describe("Zmierzona grubość warstwy śniegu na dachu [cm]; 0 = nie mierzono"),
  rodzajSniegu: z
    .enum(["swiezy", "osiadly", "stary", "mokry"])
    .nullable()
    .describe("Rodzaj śniegu (Tablica E.1) — tylko przy pomiarze grubości; null gdy nie mierzono"),
})
export type ObciazenieDachuSniegiemToolInputT = z.infer<typeof ObciazenieDachuSniegiemToolInput>

export const ObciazenieDachuSniegiemToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  skKnM2: z.number().describe("Obciążenie śniegiem gruntu s_k [kN/m²] (Tablica NB.1)"),
  sKnM2: z.number().describe("Obciążenie śniegiem dachu s = μ1·Ce·Ct·s_k [kN/m²], wartość charakterystyczna"),
  sKgM2: z.number().describe("To samo w kg/m²"),
  wykorzystanieNormowePct: z.number().nullable().describe("s / nośność [%]; null gdy nośność nie podana"),
  aktualneMaxKnM2: z.number().nullable().describe("Ciężar zmierzonej warstwy γ·h (górne γ) [kN/m²]; null bez pomiaru"),
  wykorzystanieAktualnePct: z.number().nullable().describe("γ·h / nośność [%]; null bez pomiaru lub nośności"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ObciazenieDachuSniegiemToolOutputT = z.infer<typeof ObciazenieDachuSniegiemToolOutput>

export const obciazenieDachuSniegiemTool: AiToolDefinition<
  ObciazenieDachuSniegiemToolInputT,
  ObciazenieDachuSniegiemToolOutputT
> = {
  name: "policz_obciazenie_dachu_sniegiem",
  description:
    "Liczy obciążenie dachu śniegiem wg PN-EN 1991-1-3 z Załącznikiem krajowym (Moduł 7, Ekran 23): " +
    "s = μ1·Ce·Ct·s_k, s_k ze strefy NB.1 i wysokości n.p.m. Opcjonalnie ciężar zmierzonej warstwy śniegu " +
    "(γ z Tablicy E.1) i porównanie obu z nośnością dachu podaną przez usera — przekroczenie to twardy stop, od 80% nośności ostrzeżenie „zbliżasz się do granicy” (próg aplikacji, nie normy). " +
    "Tylko dach jedno-/dwupołaciowy, obciążenie równomierne, wartości charakterystyczne. Użyj, gdy user pyta, " +
    "czy dach wytrzyma śnieg albo czy trzeba go odśnieżyć.",
  inputSchema: ObciazenieDachuSniegiemToolInput,
  outputSchema: ObciazenieDachuSniegiemToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/obciazenie-dachu-sniegiem",
  handler: async (input) => {
    const wynik = calculateObciazenieDachuSniegiem(input)
    return {
      status: wynik.status,
      skKnM2: wynik.value.skKnM2,
      sKnM2: wynik.value.sKnM2,
      sKgM2: wynik.value.sKgM2,
      wykorzystanieNormowePct: wynik.value.wykorzystanieNormowePct,
      aktualneMaxKnM2: wynik.value.aktualneMaxKnM2,
      wykorzystanieAktualnePct: wynik.value.wykorzystanieAktualnePct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
