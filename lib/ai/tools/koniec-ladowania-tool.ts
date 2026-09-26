/**
 * Narzędzie AI (9.3) dla Ekranu 13, Moduł 4 "Magazyn energii / baterie" — "Algorytm końca
 * ładowania (Tail Current / Absorption)". `operationType: 'read'`. Aktualny prąd i napięcie
 * MUSZĄ pochodzić z live pomiaru/BMS, nigdy zgadywane.
 */
import { z } from "zod"
import { calculateKoniecLadowania } from "@/lib/core/modules/baterie/koniec-ladowania/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KoniecLadowaniaToolInput = z.object({
  pojemnoscAh: z.number().describe("Pojemność baterii [Ah]"),
  napiecieAbsorpcjiV: z.number().describe("Napięcie absorpcji — cel fazy CC [V], z karty katalogowej BMS/ładowarki"),
  progKoncowyC: z.number().describe("Próg prądu końcowego jako ułamek C (np. 0,05 = 0,05C)"),
  aktualnyPradA: z.number().describe("Aktualny (zmierzony/live) prąd ładowania [A] — tylko od usera/BMS, nie zgaduj"),
  aktualneNapiecieV: z.number().describe("Aktualne (zmierzone/live) napięcie [V] — tylko od usera/BMS, nie zgaduj"),
})
export type KoniecLadowaniaToolInputT = z.infer<typeof KoniecLadowaniaToolInput>

export const KoniecLadowaniaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pradKoncowyA: z.number(),
  faza: z.enum(["CC", "CV-koncowka", "zakonczone"]),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KoniecLadowaniaToolOutputT = z.infer<typeof KoniecLadowaniaToolOutput>

export const koniecLadowaniaTool: AiToolDefinition<KoniecLadowaniaToolInputT, KoniecLadowaniaToolOutputT> = {
  name: "sprawdz_algorytm_konca_ladowania",
  description:
    "Liczy prąd końcowy (tail current = C-rate × Ah) i określa fazę ładowania (CC, CV-końcówka, zakończone) " +
    "na podstawie aktualnego prądu i napięcia (Moduł 4, Ekran 13). Aktualny prąd i napięcie MUSZĄ pochodzić z " +
    "live pomiaru/BMS — nie zgaduj. Użyj, gdy user pyta, czy ładowanie jest już zakończone albo w jakiej fazie " +
    "jest teraz bateria.",
  inputSchema: KoniecLadowaniaToolInput,
  outputSchema: KoniecLadowaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/koniec-ladowania",
  handler: async (input) => {
    const wynik = calculateKoniecLadowania({
      pojemnoscAh: input.pojemnoscAh,
      napiecieAbsorpcjiV: input.napiecieAbsorpcjiV,
      progKoncowyC: input.progKoncowyC,
      aktualnyPradA: input.aktualnyPradA,
      aktualneNapiecieV: input.aktualneNapiecieV,
    })
    return {
      status: wynik.status,
      pradKoncowyA: wynik.value.pradKoncowyA,
      faza: wynik.value.faza,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
