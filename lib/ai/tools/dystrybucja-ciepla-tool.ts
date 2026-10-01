/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 13 "Dystrybucja ciepła — wybór systemu" (dawne 5.13, 5.17, 5.18).
 * `operationType: 'read'`. COP z karty pompy MUSI pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateDystrybucjaCiepla } from "@/lib/core/modules/ogrzewanie/dystrybucja-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DystrybucjaCieplaToolInput = z.object({
  zrodloCiepla: z.enum(["pompa-ciepla", "inne"]),
  system: z.enum(["podlogowe", "grzejniki-niskotemperaturowe", "grzejniki-standardowe"]),
  cieploRocznieKwh: z.number().describe("Roczne zapotrzebowanie na ciepło do ogrzewania [kWh/rok]; 0 = nie podano"),
  copSystemu: z.number().describe("COP pompy przy temperaturze zasilania wybranego systemu (karta); 0 = nie podano"),
  copOdniesienia: z.number().describe("COP tej samej pompy przy zasilaniu grzejników standardowych (karta); 0 = nie podano"),
  doplataZl: z.number().describe("Dopłata za wybrany system względem grzejników standardowych [zł]; 0 = nie podano"),
  cenaPraduZlKwh: z.number().describe("Cena prądu [zł/kWh]; 0 = nie podano"),
})
export type DystrybucjaCieplaToolInputT = z.infer<typeof DystrybucjaCieplaToolInput>

export const DystrybucjaCieplaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  dopasowanie: z.enum(["dobre", "zle", "inne-zrodlo"]),
  oszczednoscPct: z.number().nullable().describe("Oszczędność prądu pompy względem grzejników standardowych [%]"),
  energiaSystemuKwh: z.number(),
  energiaOdniesieniaKwh: z.number(),
  oszczednoscKwh: z.number(),
  oszczednoscZlRok: z.number().nullable(),
  zwrotLat: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DystrybucjaCieplaToolOutputT = z.infer<typeof DystrybucjaCieplaToolOutput>

export const dystrybucjaCieplaTool: AiToolDefinition<DystrybucjaCieplaToolInputT, DystrybucjaCieplaToolOutputT> = {
  name: "porownaj_system_dystrybucji_ciepla",
  description:
    "Dopasowanie systemu dystrybucji ciepła (podłogówka, grzejniki niskotemperaturowe, grzejniki standardowe) do źródła " +
    "ciepła; przy pompie ciepła — oszczędność prądu z dwóch COP z karty (niższa vs wysoka temperatura zasilania), " +
    "kWh/rok, zł/rok i zwrot dopłaty. Użyj, gdy user pyta, czy do pompy ciepła wybrać podłogówkę czy grzejniki, " +
    "czy zostawić stare grzejniki albo ile zaoszczędzi na niższej temperaturze zasilania.",
  inputSchema: DystrybucjaCieplaToolInput,
  outputSchema: DystrybucjaCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/dystrybucja-ciepla",
  handler: async (input) => {
    const wynik = calculateDystrybucjaCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
