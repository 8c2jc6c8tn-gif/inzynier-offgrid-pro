/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 26 "Zasilanie urządzeń medycznych" (dawne 8.51, Biblia §12.39).
 * `operationType: 'read'`. Moc, czas pracy, część użyteczna i sprawność MUSZĄ pochodzić od usera
 * (Dyrektywa #1). Minimum 2 doby i zalecenie źródła zapasowego — decyzja właściciela 30.09.2026.
 */
import { z } from "zod"
import { calculateUrzadzeniaMedyczne } from "@/lib/core/modules/kalkulator-mobilny/urzadzenia-medyczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const UrzadzeniaMedyczneToolInput = z.object({
  urzadzenie: z.enum(["cpap", "koncentrator-tlenu", "inhalator", "inne"]).nullable().describe("Rodzaj urządzenia"),
  mocW: z.number().describe("Moc urządzenia [W] — z tabliczki/instrukcji, od usera"),
  godzinNaDobe: z.number().describe("Godziny pracy na dobę [h] — od usera"),
  napiecieV: z.number().describe("Napięcie akumulatora [V]"),
  uzytecznaPct: z.number().describe("Część użyteczna pojemności (DoD) [%] — od usera, nie zgaduj"),
  przezFalownik: z.boolean().nullable().describe("true = przez falownik 230 V, false = bezpośrednio DC; null = nie wiadomo"),
  sprawnoscFalownikaPct: z.number().describe("Sprawność falownika [%]; 0 gdy DC"),
  posiadanyAh: z.number().describe("Posiadany akumulator [Ah]; 0 = nie sprawdzaj"),
  maZapasoweZrodlo: z.boolean().nullable().describe("Czy jest drugie niezależne źródło zasilania; null = nie wiadomo"),
})
export type UrzadzeniaMedyczneToolInputT = z.infer<typeof UrzadzeniaMedyczneToolInput>

export const UrzadzeniaMedyczneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zuzycieDobaWh: z.number(),
  minimalnyAh: z.number().describe("Minimalny akumulator na 2 doby [Ah]"),
  dobyPosiadany: z.number().describe("Ile dób podtrzyma posiadany akumulator; 0 = nie podano"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type UrzadzeniaMedyczneToolOutputT = z.infer<typeof UrzadzeniaMedyczneToolOutput>

export const urzadzeniaMedyczneTool: AiToolDefinition<UrzadzeniaMedyczneToolInputT, UrzadzeniaMedyczneToolOutputT> = {
  name: "dobierz_zasilanie_urzadzenia_medycznego",
  description:
    "Dobiera akumulator z zapasem minimum 2 dób dla urządzenia medycznego (CPAP, koncentrator tlenu, inhalator) " +
    "i sprawdza, ile dób podtrzyma posiadany akumulator; zawsze zaleca drugie, niezależne źródło. Użyj, gdy user " +
    "pyta, na ile wystarczy akumulator do CPAP-u lub koncentratora tlenu albo jak zabezpieczyć zasilanie sprzętu " +
    "medycznego w czasie braku prądu lub wyjazdu.",
  inputSchema: UrzadzeniaMedyczneToolInput,
  outputSchema: UrzadzeniaMedyczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/urzadzenia-medyczne",
  handler: async (input) => {
    const wynik = calculateUrzadzeniaMedyczne(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
