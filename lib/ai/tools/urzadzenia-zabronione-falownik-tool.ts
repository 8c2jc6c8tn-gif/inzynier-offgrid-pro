/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 37 "Urządzenia zabronione dla małych falowników" (dawne 8.64,
 * Biblia §12.52). `operationType: 'read'`. Moc ciągła/szczytowa falownika i krotność rozruchu urządzeń
 * MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateUrzadzeniaZabronione } from "@/lib/core/modules/kalkulator-mobilny/urzadzenia-zabronione-falownik/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const UrzadzeniaZabronioneToolInput = z.object({
  mocFalownikaW: z.number().describe("Moc ciągła falownika [W] z karty"),
  mocSzczytowaW: z.number().describe("Moc szczytowa / przeciążalność falownika [W] z karty"),
  urzadzenia: z
    .array(
      z.object({
        nazwa: z.string(),
        mocW: z.number().describe("Moc pracy urządzenia [W]"),
        krotnoscRozruchu: z.number().describe("Krotność mocy rozruchowej; 0 = nie wiadomo — nie zgaduj"),
      }),
    )
    .describe("Urządzenia do sprawdzenia (każde osobno)"),
})
export type UrzadzeniaZabronioneToolInputT = z.infer<typeof UrzadzeniaZabronioneToolInput>

export const UrzadzeniaZabronioneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  oceny: z.array(z.object({ nazwa: z.string(), ocena: z.enum(["ok", "ryzykowne", "zabronione"]), rozruchW: z.number() })),
  potrzebnaMocCiaglaW: z.number(),
  potrzebnaMocSzczytowaW: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type UrzadzeniaZabronioneToolOutputT = z.infer<typeof UrzadzeniaZabronioneToolOutput>

export const urzadzeniaZabronioneTool: AiToolDefinition<UrzadzeniaZabronioneToolInputT, UrzadzeniaZabronioneToolOutputT> = {
  name: "sprawdz_urzadzenia_dla_malego_falownika",
  description:
    "Ocenia każde urządzenie (OK / ryzykowne / zabronione) wobec mocy ciągłej i szczytowej małego falownika, " +
    "z uwzględnieniem rozruchu (suszarka, czajnik, mikrofalówka, lodówka, elektronarzędzia, kompresor). " +
    "Użyj, gdy user pyta, czy może podłączyć konkretne urządzenie do swojego falownika/przetwornicy albo " +
    "dlaczego falownik wyłącza się przy włączaniu urządzenia.",
  inputSchema: UrzadzeniaZabronioneToolInput,
  outputSchema: UrzadzeniaZabronioneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/urzadzenia-zabronione-falownik",
  handler: async (input) => {
    const wynik = calculateUrzadzeniaZabronione(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
