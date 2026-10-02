/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2C — rozruch i praca pompy ciepła z falownika albo agregatu (dawne 5.52,
 * 5.61, 5.66). `operationType: 'read'`. Prąd rozruchowy i moce źródła pochodzą z kart katalogowych usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateRozruchPompyCiepla } from "@/lib/core/modules/ogrzewanie/rozruch-pompy-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const RozruchPompyCieplaToolInput = z.object({
  zrodlo: z.enum(["falownik", "agregat"]).describe("Co zasila pompę"),
  fazy: z.union([z.literal(1), z.literal(3)]).describe("Liczba faz zasilania pompy"),
  napiecieV: z.number().describe("Napięcie [V]: fazowe dla 1 fazy, międzyfazowe dla 3 faz"),
  pradRozruchuA: z.number().describe("Prąd rozruchowy sprężarki LRA z karty pompy [A]"),
  pradSoftstartA: z.number().describe("Prąd rozruchu z softstartem [A]; 0 = bez softstartu"),
  poborPracyKw: z.number().describe("Pobór elektryczny pompy w pracy [kW]"),
  inneObciazenieKw: z.number().describe("Inne odbiorniki w tym samym czasie [kW]; 0 = brak"),
  mocCiaglaKw: z.number().describe("Moc ciągła falownika albo znamionowa agregatu [kW]"),
  mocSzczytowaKw: z.number().describe("Moc szczytowa falownika albo maksymalna agregatu [kW]"),
})
export type RozruchPompyCieplaToolInputT = z.infer<typeof RozruchPompyCieplaToolInput>

export const RozruchPompyCieplaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  startKva: z.number(),
  softstartKva: z.number().nullable(),
  szczytWymaganyKva: z.number(),
  pracaKw: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RozruchPompyCieplaToolOutputT = z.infer<typeof RozruchPompyCieplaToolOutput>

export const rozruchPompyCieplaTool: AiToolDefinition<RozruchPompyCieplaToolInputT, RozruchPompyCieplaToolOutputT> = {
  name: "sprawdz_rozruch_pompy_ciepla",
  description:
    "Czy falownik off-grid/hybrydowy albo agregat udźwignie rozruch sprężarki pompy ciepła (prąd LRA → kVA) i jej " +
    "pracę razem z innymi odbiornikami, oraz czy wystarczy softstart. Użyj, gdy user pyta, czy jego falownik lub " +
    "agregat uciągnie pompę ciepła, czy potrzebny jest softstart albo dlaczego falownik wyłącza się przy starcie pompy.",
  inputSchema: RozruchPompyCieplaToolInput,
  outputSchema: RozruchPompyCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/rozruch-pompy-ciepla",
  handler: async (input) => {
    const wynik = calculateRozruchPompyCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
