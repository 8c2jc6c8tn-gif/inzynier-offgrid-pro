/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 30 "Gniazda zapalniczki
 * samochodowej". `operationType: 'read'`. Prąd bezpiecznika gniazda i moce urządzeń MUSZĄ pochodzić od
 * usera — bezpiecznik zależy od pojazdu, model go nie zgaduje.
 */
import { z } from "zod"
import { calculateGniazdoZapalniczki } from "@/lib/core/modules/kalkulator-mobilny/gniazdo-zapalniczki/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const GniazdoZapalniczkiToolInput = z.object({
  napiecieV: z.union([z.literal(12), z.literal(24)]).describe("Napięcie instalacji pojazdu [V]"),
  pradBezpiecznikaA: z.number().describe("Prąd bezpiecznika gniazda [A] — z instrukcji pojazdu, od usera, nie zgaduj"),
  urzadzenia: z.array(z.object({ nazwa: z.string(), mocW: z.number().describe("Moc [W]") })).describe("Urządzenia włączone jednocześnie"),
})
export type GniazdoZapalniczkiToolInputT = z.infer<typeof GniazdoZapalniczkiToolInput>

export const GniazdoZapalniczkiToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  sumaMocyW: z.number(),
  pradA: z.number().describe("Prąd pobierany z gniazda [A]"),
  mocMaxW: z.number().describe("Największa moc dopuszczalna przez bezpiecznik [W]"),
  obciazeniePct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type GniazdoZapalniczkiToolOutputT = z.infer<typeof GniazdoZapalniczkiToolOutput>

export const gniazdoZapalniczkiTool: AiToolDefinition<GniazdoZapalniczkiToolInputT, GniazdoZapalniczkiToolOutputT> = {
  name: "sprawdz_gniazdo_zapalniczki",
  description:
    "Sprawdza, czy urządzenia podłączone do gniazda zapalniczki samochodowej (Moduł 12) nie przeciążą jego bezpiecznika: " +
    "I = ΣP / U vs prąd bezpiecznika (typowo 10–15 A, np. 10 A × 12 V = 120 W). Twardy stop przy przeciążeniu. Użyj, gdy " +
    "user pyta, czy może zasilić czajnik/lodówkę/kompresor z gniazda zapalniczki.",
  inputSchema: GniazdoZapalniczkiToolInput,
  outputSchema: GniazdoZapalniczkiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/gniazdo-zapalniczki",
  handler: async (input) => {
    const wynik = calculateGniazdoZapalniczki({
      ...input,
      urzadzenia: input.urzadzenia.map((u, i) => ({ ...u, id: String(i) })),
    })
    return {
      ...wynik.value,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
