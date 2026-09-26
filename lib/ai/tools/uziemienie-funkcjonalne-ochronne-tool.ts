/**
 * Narzędzie AI (9.3) dla Ekranu 11, Moduł 5 — "Uziemienie funkcjonalne vs ochronne".
 * `operationType: 'read'`. Czy falownik wymaga układu IT, czy biegun DC jest uziemiony, i czy
 * obudowa jest połączona z GSW MUSZĄ pochodzić od użytkownika (dokumentacja producenta falownika,
 * rzeczywisty stan instalacji) — model nigdy tego nie zgaduje.
 */
import { z } from "zod"
import { calculateUziemienieFunkcjonalneOchronne } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/calculator"
import type { UkladSieci } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const UKLADY_SIECI = ["TN-S", "TN-C-S", "TT", "IT"] as [UkladSieci, ...UkladSieci[]]

export const UziemienieFunkcjonalneOchronneToolInput = z.object({
  ukladSieci: z.enum(UKLADY_SIECI).nullable().describe("Układ sieci — informacyjnie, źródło nie wiąże go bezpośrednio z werdyktem"),
  falownikWymagaUkladuIt: z
    .boolean()
    .describe("Czy falownik wymaga/pracuje w układzie izolowanym (bieguny DC nie uziemione) — wg dokumentacji producenta"),
  biegunDcUziemiony: z.boolean().describe("Czy w tej instalacji biegun DC jest uziemiony"),
  obudowaPolaczonaZGsw: z.boolean().describe("Czy obudowa falownika (uziemienie ochronne) jest połączona z Główną Szyną Wyrównawczą (GSW)"),
})

export type UziemienieFunkcjonalneOchronneToolInputT = z.infer<typeof UziemienieFunkcjonalneOchronneToolInput>

export const UziemienieFunkcjonalneOchronneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type UziemienieFunkcjonalneOchronneToolOutputT = z.infer<typeof UziemienieFunkcjonalneOchronneToolOutput>

export const uziemienieFunkcjonalneOchronneTool: AiToolDefinition<
  UziemienieFunkcjonalneOchronneToolInputT,
  UziemienieFunkcjonalneOchronneToolOutputT
> = {
  name: "policz_uziemienie_funkcjonalne_ochronne",
  description:
    "Sprawdza, czy biegun DC nie jest błędnie uziemiony wbrew wymaganiom falownika pracującego w " +
    "układzie izolowanym (IT) — twardy stop, bo ryzyko uszkodzenia MPPT — i czy obudowa falownika jest " +
    "połączona z GSW. Typ falownika (IT/nie-IT) MUSI pochodzić z dokumentacji producenta, nie z bazy " +
    "komponentów (projekt jej nie ma). Użyj, gdy user pyta o różnicę uziemienia funkcjonalnego i " +
    "ochronnego w instalacji off-grid.",
  inputSchema: UziemienieFunkcjonalneOchronneToolInput,
  outputSchema: UziemienieFunkcjonalneOchronneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/uziemienie-funkcjonalne-ochronne",
  handler: async (input) => {
    const wynik = calculateUziemienieFunkcjonalneOchronne(input)
    return {
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
