/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 20 "Wentylacja naturalna vs mechaniczna" (dawne 5.26).
 * `operationType: 'read'`. Strumienie, sprawność, pobór wentylatorów i COP MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWentylacjaPorownanie } from "@/lib/core/modules/ogrzewanie/wentylacja-porownanie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WentylacjaPorownanieToolInput = z.object({
  tWewC: z.number().describe("Temperatura wewnątrz [°C]"),
  tZewnC: z.number().describe("Średnia temperatura zewnętrzna doby [°C]"),
  strumienNaturalnyM3H: z.number().describe("Strumień powietrza wentylacji naturalnej [m³/h] (np. wymiany × kubatura)"),
  strumienMechanicznyM3H: z.number().describe("Strumień powietrza wentylacji mechanicznej [m³/h]"),
  sprawnoscOdzyskuPct: z.number().describe("Sprawność odzysku ciepła rekuperatora z karty [%]"),
  mocWentylatorowW: z.number().describe("Pobór wentylatorów centrali z karty [W], praca całą dobę"),
  copOgrzewania: z.number().describe("COP ogrzewania (1 = grzałka/kocioł elektryczny); 0 = ogrzewanie nieelektryczne"),
  dniSezonu: z.number().describe("Dni sezonu grzewczego do wyniku sezonowego; 0 = bez wyniku sezonowego"),
  cenaPraduZlKwh: z.number().describe("Cena prądu [zł/kWh]; 0 = bez kosztu"),
  doplataZl: z.number().describe("Dopłata za wentylację mechaniczną z rekuperacją [zł]; 0 = bez zwrotu"),
  szczelnyDom: z.boolean().describe("Nowy, szczelny dom"),
})
export type WentylacjaPorownanieToolInputT = z.infer<typeof WentylacjaPorownanieToolInput>

export const WentylacjaPorownanieToolOutput = z.object({
  status: z.enum(STATUSY),
  stratyNaturalnaKwh: z.number(),
  stratyMechanicznaKwh: z.number(),
  pradWentylatorowKwh: z.number(),
  oszczednoscCieplaKwh: z.number(),
  oszczednoscNettoKwh: z.number().nullable(),
  oszczednoscSezonKwh: z.number().nullable(),
  oszczednoscZl: z.number().nullable(),
  zwrotLat: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WentylacjaPorownanieToolOutputT = z.infer<typeof WentylacjaPorownanieToolOutput>

export const wentylacjaPorownanieTool: AiToolDefinition<WentylacjaPorownanieToolInputT, WentylacjaPorownanieToolOutputT> = {
  name: "porownaj_wentylacje_naturalna_mechaniczna",
  description:
    "Porównanie wentylacji naturalnej (grawitacyjnej) z mechaniczną z rekuperacją: dobowe straty ciepła obu, prąd " +
    "wentylatorów, bilans prądu po uwzględnieniu COP ogrzewania, wynik sezonowy, oszczędność w zł i prosty zwrot " +
    "dopłaty. Użyj, gdy user pyta, czy opłaca się rekuperacja zamiast wentylacji grawitacyjnej, ile naprawdę " +
    "oszczędzi przy pompie ciepła, czy wentylatory nie zjedzą zysku albo czy w nowym szczelnym domu wystarczy " +
    "wentylacja naturalna.",
  inputSchema: WentylacjaPorownanieToolInput,
  outputSchema: WentylacjaPorownanieToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/wentylacja-porownanie",
  handler: async (input) => {
    const wynik = calculateWentylacjaPorownanie(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
