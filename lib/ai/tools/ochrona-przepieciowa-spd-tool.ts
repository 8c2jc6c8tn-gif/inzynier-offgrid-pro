/**
 * Narzędzie AI (9.3) dla Ekranu 2, Moduł 5 — "Ochrona przeciwprzepięciowa (SPD)".
 * `operationType: 'read'`. Voc max stringu (WARTOŚĆ ZIMOWA, nie STC), odległość od zwodu i Uc
 * rozważanego SPD MUSZĄ pochodzić od użytkownika (karta katalogowa panelu + Ekran 5, Moduł 3
 * "Zimowy stress-test MPPT", pomiar instalacji odgromowej) — model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { calculateOchronaPrzepieciowaSpd } from "@/lib/core/modules/okablowanie/ochrona-przepieciowa-spd/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OchronaPrzepieciowaSpdToolInput = z.object({
  vocMaxStringuV: z
    .number()
    .describe("Napięcie robocze stringu PV (Voc max, WARTOŚĆ ZIMOWA — nie STC) [V]. 0 = jeszcze nie podano"),
  maInstalacjeOdgromowa: z.boolean().describe("Czy budynek ma instalację odgromową"),
  odlegloscOdZwoduM: z
    .number()
    .nullable()
    .describe("Odległość paneli od zwodu piorunochronu [m] — tylko gdy maInstalacjeOdgromowa. null = nie dotyczy/nie podano"),
  maZainstalowanySpdTyp1: z
    .boolean()
    .describe("Czy zainstalowany jest SPD Typu 1 na wejściu do budynku — tylko gdy maInstalacjeOdgromowa"),
  ucSpdV: z.number().describe("Napięcie trwałej pracy (Uc) rozważanego SPD [V], z karty katalogowej. 0 = jeszcze nie podano"),
  uziemienieViaGsw: z.boolean().describe("Czy SPD jest uziemiony przez wspólną Główną Szynę Wyrównawczą (GSW)"),
})

export type OchronaPrzepieciowaSpdToolInputT = z.infer<typeof OchronaPrzepieciowaSpdToolInput>

export const OchronaPrzepieciowaSpdToolOutput = z.object({
  typWymagany: z.enum(["Typ 1", "Typ 2"]),
  ucMinimalneV: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type OchronaPrzepieciowaSpdToolOutputT = z.infer<typeof OchronaPrzepieciowaSpdToolOutput>

export const ochronaPrzepieciowaSpdTool: AiToolDefinition<
  OchronaPrzepieciowaSpdToolInputT,
  OchronaPrzepieciowaSpdToolOutputT
> = {
  name: "policz_ochrone_przepieciowa_spd",
  description:
    "Liczy minimalne wymagane napięcie trwałej pracy (Uc ≥ Voc_max × 1,25) SPD i wymagany typ (Typ 1 " +
    "przy instalacji odgromowej blisko zwodu, inaczej Typ 2), oraz sprawdza uziemienie SPD przez GSW. " +
    "Voc stringu MUSI być wartością zimową (nie STC) — z Ekranu 5, Moduł 3 'Zimowy stress-test MPPT'. " +
    "Użyj, gdy user pyta o dobór ochrony przeciwprzepięciowej (SPD) w instalacji PV.",
  inputSchema: OchronaPrzepieciowaSpdToolInput,
  outputSchema: OchronaPrzepieciowaSpdToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/ochrona-przepieciowa-spd",
  handler: async (input) => {
    const wynik = calculateOchronaPrzepieciowaSpd(input)
    return {
      typWymagany: wynik.value.typWymagany,
      ucMinimalneV: wynik.value.ucMinimalneV,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
