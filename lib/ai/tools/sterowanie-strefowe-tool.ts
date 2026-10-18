/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 16 "Sterowanie strefowe" (dawne 5.16, Biblia §6.16).
 * `operationType: 'read'`. H stref, temperatury, pobory siłowników i COP MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSterowanieStrefowe } from "@/lib/core/modules/ogrzewanie/sterowanie-strefowe/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SterowanieStrefoweToolInput = z.object({
  strefy: z
    .array(
      z.object({
        nazwa: z.string(),
        hWK: z.number().describe("Współczynnik strat ciepła strefy H [W/K] (część H budynku z Ekranu 1)"),
        tKomfortC: z.number().describe("Temperatura komfortowa [°C]"),
        tObnizonaC: z.number().nullable().describe("Temperatura obniżona [°C]; null = bez obniżenia"),
        godzinObnizenia: z.number().describe("Godziny na dobę z temperaturą obniżoną [h]; 0 = bez obniżenia"),
      }),
    )
    .min(1),
  tZewnC: z.number().describe("Średnia temperatura zewnętrzna doby, dla której liczymy [°C]"),
  liczbaSilownikow: z.number(),
  mocSilownikaW: z.number().describe("Pobór jednego siłownika z karty [W] (źródło: 1–5 W)"),
  godzinPracySilownikow: z.number().describe("Godziny zasilania siłowników na dobę [h]"),
  mocSterownikowW: z.number().describe("Łączny pobór sterownika i termostatów zasilanych całą dobę [W]"),
  copOgrzewania: z.number().describe("COP ogrzewania (1 = grzałka/kocioł elektryczny); 0 = ogrzewanie nieelektryczne"),
})
export type SterowanieStrefoweToolInputT = z.infer<typeof SterowanieStrefoweToolInput>

export const SterowanieStrefoweToolOutput = z.object({
  status: z.enum(STATUSY),
  cieploBezStrefKwh: z.number(),
  cieploZeStrefamiKwh: z.number(),
  oszczednoscCieplaKwh: z.number(),
  oszczednoscPct: z.number(),
  pradSterowaniaKwh: z.number(),
  oszczednoscPraduKwh: z.number().nullable(),
  bilansPraduKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SterowanieStrefoweToolOutputT = z.infer<typeof SterowanieStrefoweToolOutput>

export const sterowanieStrefoweTool: AiToolDefinition<SterowanieStrefoweToolInputT, SterowanieStrefoweToolOutputT> = {
  name: "policz_sterowanie_strefowe",
  description:
    "Zysk ciepła ze sterowania strefowego (obniżanie temperatury w nieużywanych strefach, Q = H·ΔT·t per strefa, stan " +
    "ustalony) i bilans z prądem siłowników i sterowników (kWh/dobę). Użyj, gdy user pyta, czy opłaca się sterowanie " +
    "strefowe, ile da obniżenie temperatury w sypialni/pustych pokojach albo czy siłowniki nie zjedzą zysku w off-gridzie.",
  inputSchema: SterowanieStrefoweToolInput,
  outputSchema: SterowanieStrefoweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/sterowanie-strefowe",
  handler: async (input) => {
    const wynik = calculateSterowanieStrefowe(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
