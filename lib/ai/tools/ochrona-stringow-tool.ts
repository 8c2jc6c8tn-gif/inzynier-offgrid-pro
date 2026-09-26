/**
 * Narzędzie AI (9.3) dla Ekranu 22, Moduł 3 "Instalacja PV" — "Ochrona stringów (bezpieczniki,
 * diody blokujące)", wg normy HD 60364-7-712:2016 §712.431-433 + Załącznik B.2.
 * `operationType: 'read'`. Isc, I_MOD_MAX_OCPR MUSZĄ pochodzić z karty katalogowej panelu — model
 * nigdy ich nie zgaduje. Dobór diody blokującej NIE jest tu liczony (poza zakresem kalkulatora).
 */
import { z } from "zod"
import { calculateOchronaStringow } from "@/lib/core/modules/pv/ochrona-stringow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OchronaStringowToolInput = z.object({
  iscStcA: z.number().describe("Prąd zwarciowy panelu w STC (Isc), z karty katalogowej [A]"),
  iModMaxOcprA: z
    .number()
    .describe("Maksymalny prąd zabezpieczenia nadprądowego modułu (I_MOD_MAX_OCPR) wg EN 61730-1, z karty katalogowej [A]"),
  liczbaStringowRownoleglych: z.number().describe("Liczba stringów połączonych równolegle (Ns)"),
  maZabezpieczeniaPerString: z.boolean().describe("Czy zainstalowane jest zabezpieczenie nadprądowe per string"),
  wybranyBezpiecznikA: z
    .number()
    .optional()
    .describe("Prąd znamionowy już wybranego bezpiecznika [A], do sprawdzenia; pomiń, jeśli user jeszcze nie wybrał"),
})
export type OchronaStringowToolInputT = z.infer<typeof OchronaStringowToolInput>

export const OchronaStringowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  iScMaxA: z.number().describe("Prąd maksymalny zwarciowy stringu wg Załącznika B.2"),
  inMinA: z.number().describe("Dolna granica prądu znamionowego zabezpieczenia wg §712.431.102"),
  inMaxA: z.number().describe("Górna granica — I_MOD_MAX_OCPR panelu"),
  zakresPoprawny: z.boolean().describe("false = żaden bezpiecznik nie spełnia wymagań normy dla tej konfiguracji"),
  ochronaWymagana: z.boolean().describe("Wynik testu obowiązkowości zabezpieczenia wg §712.431.101"),
  alternatywaKablowaWymagana: z
    .boolean()
    .describe("Ns>2 i ochrona nie jest wymagana wzorem — wymagana alternatywa kablowa (§712.433.101), nieobjęta tym kalkulatorem"),
  wybranyBezpiecznikOk: z.boolean().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OchronaStringowToolOutputT = z.infer<typeof OchronaStringowToolOutput>

export const ochronaStringowTool: AiToolDefinition<OchronaStringowToolInputT, OchronaStringowToolOutputT> = {
  name: "sprawdz_ochrone_stringow",
  description:
    "Sprawdza zabezpieczenie nadprądowe stringu PV wg normy HD 60364-7-712:2016 §712.431-433 + Załącznik B.2 " +
    "(Moduł 3, Ekran 22): przedział dopuszczalnego prądu znamionowego bezpiecznika, czy zabezpieczenie jest " +
    "obowiązkowe przy danej liczbie stringów równoległych, i czy wybrany bezpiecznik mieści się w zakresie. " +
    "NIE liczy doboru diody blokującej ani alternatywy kablowej (§712.433.101) — tylko sygnalizuje potrzebę. " +
    "Isc i I_MOD_MAX_OCPR podaje user z karty katalogowej — nie zgaduj. Użyj, gdy user pyta o dobór " +
    "bezpiecznika stringu PV.",
  inputSchema: OchronaStringowToolInput,
  outputSchema: OchronaStringowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/ochrona-stringow",
  handler: async (input) => {
    const wynik = calculateOchronaStringow({
      iscStcA: input.iscStcA,
      iModMaxOcprA: input.iModMaxOcprA,
      liczbaStringowRownoleglych: input.liczbaStringowRownoleglych,
      maZabezpieczeniaPerString: input.maZabezpieczeniaPerString,
      wybranyBezpiecznikA: input.wybranyBezpiecznikA ?? null,
    })
    return {
      status: wynik.status,
      iScMaxA: wynik.value.iScMaxA,
      inMinA: wynik.value.inMinA,
      inMaxA: wynik.value.inMaxA,
      zakresPoprawny: wynik.value.zakresPoprawny,
      ochronaWymagana: wynik.value.ochronaWymagana,
      alternatywaKablowaWymagana: wynik.value.alternatywaKablowaWymagana,
      wybranyBezpiecznikOk: wynik.value.wybranyBezpiecznikOk,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
