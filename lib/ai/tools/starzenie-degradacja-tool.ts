/**
 * Narzędzie AI (9.3) dla Ekranu 6, Moduł 4 "Magazyn energii / baterie" — "Starzenie i
 * degradacja ogniw (bufor projektowy)". `operationType: 'read'`. Pojemność użyteczna dziś i
 * roczny spadek pojemności MUSZĄ pochodzić od usera/karty katalogowej ogniw.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateStarzenieDegradacja } from "@/lib/core/modules/baterie/starzenie-degradacja/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StarzenieDegradacjaToolInput = z.object({
  pojemnoscUzytecznaDzisKwh: z.number().describe("Pojemność użyteczna potrzebna dziś [kWh] (docelowo z Ekranu 1 — Dobór pojemności)"),
  horyzontLata: z.union([z.literal(5), z.literal(10), z.literal(15)]).describe("Horyzont projektowy [lata]"),
  degradacjaRocznaPct: z.number().describe("Roczny spadek pojemności [%] — z karty katalogowej ogniw, tylko od usera"),
})
export type StarzenieDegradacjaToolInputT = z.infer<typeof StarzenieDegradacjaToolInput>

export const StarzenieDegradacjaToolOutput = z.object({
  status: z.enum(STATUSY),
  pojemnoscPoczatkowaKwh: z.number(),
  ulamekPozostalyPoHoryzoncie: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type StarzenieDegradacjaToolOutputT = z.infer<typeof StarzenieDegradacjaToolOutput>

export const starzenieDegradacjaTool: AiToolDefinition<StarzenieDegradacjaToolInputT, StarzenieDegradacjaToolOutputT> = {
  name: "policz_bufor_starzeniowy_baterii",
  description:
    "Liczy pojemność początkową baterii potrzebną dziś, żeby po zadanym horyzoncie lat (5/10/15) — po " +
    "uwzględnieniu rocznej degradacji — nadal spełniać dzisiejsze zapotrzebowanie (bufor starzeniowy, " +
    "Moduł 4, Ekran 6). Pojemność dziś i roczna degradacja MUSZĄ pochodzić od usera/karty katalogowej — nie " +
    "zgaduj tempa starzenia. Użyj, gdy user pyta, o ile powiększyć bank baterii z myślą o degradacji.",
  inputSchema: StarzenieDegradacjaToolInput,
  outputSchema: StarzenieDegradacjaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/starzenie-degradacja",
  handler: async (input) => {
    const wynik = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: input.pojemnoscUzytecznaDzisKwh,
      horyzontLata: input.horyzontLata,
      degradacjaRocznaPct: input.degradacjaRocznaPct,
    })
    return {
      status: wynik.status,
      pojemnoscPoczatkowaKwh: wynik.value.pojemnoscPoczatkowaKwh,
      ulamekPozostalyPoHoryzoncie: wynik.value.ulamekPozostalyPoHoryzoncie,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
