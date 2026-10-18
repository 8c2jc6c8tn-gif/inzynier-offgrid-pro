/**
 * Narzędzie AI (9.3) dla M14 — F3 „Moc bierna — opłata i kompensacja”. `operationType: 'read'`.
 * Wzór z pierwiastkiem (✏️ K1, taryfy OSD 2026). `C_rk` jest 🔎 — zawsze od usera (z faktury); bez niego
 * narzędzie podaje sam czynnik nadwyżki, bez kwoty.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMocBierna } from "@/lib/core/modules/siec/moc-bierna/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MocBiernaToolInput = z.object({
  tgFi: z.number().describe("Zmierzony tgφ (średni roczny) — od usera"),
  tgFi0: z.number().describe("tgφ₀ z umowy; domyślnie 0,4, nie mniej niż 0,2"),
  energiaCzynnaKwh: z.number().describe("Energia czynna pobrana A [kWh/rok] — od usera"),
  cRkZlKwh: z.number().nullable().describe("C_rk [zł/kWh] z faktury za energię bierną; null gdy user nie zna — nie zgaduj"),
  energiaPojemnosciowaKvarh: z.number().describe("Energia bierna pojemnościowa [kvarh/rok]; 0 gdy brak"),
  mocCzynnaSredniaKw: z.number().describe("Kompensacja: średnia moc czynna w czasie pracy [kW]; 0 = nie liczyć"),
  tgFiCel: z.number().nullable().describe("Kompensacja: docelowy tgφ (wybór usera); null = nie liczyć"),
  kosztBateriiZl: z.number().describe("Koszt baterii kondensatorów [zł] — od usera; 0 = bez zwrotu"),
})
export type MocBiernaToolInputT = z.infer<typeof MocBiernaToolInput>

export const MocBiernaToolOutput = z.object({
  status: z.enum(STATUSY),
  czynnik: z.number(),
  oplataRazemZl: z.number().nullable(),
  mocKompensacjiKvar: z.number().nullable(),
  zwrotLat: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MocBiernaToolOutputT = z.infer<typeof MocBiernaToolOutput>

export const mocBiernaTool: AiToolDefinition<MocBiernaToolInputT, MocBiernaToolOutputT> = {
  name: "policz_oplate_za_moc_bierna",
  description:
    "Liczy roczną opłatę za energię bierną w firmie na niskim napięciu (M14, F3): nadwyżka indukcyjna ponad tgφ₀ " +
    "(wzór z pierwiastkiem jak w taryfach OSD 2026, k = 3,00) i energia pojemnościowa, oraz moc i zwrot baterii " +
    "kondensatorów. C_rk i ceny podaje user — nie zgaduj. Użyj, gdy firma pyta o opłatę za energię bierną albo czy opłaca się bateria kondensatorów.",
  inputSchema: MocBiernaToolInput,
  outputSchema: MocBiernaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/moc-bierna",
  handler: async (input) => {
    const wynik = calculateMocBierna(input)
    return {
      status: wynik.status,
      czynnik: wynik.value.czynnik,
      oplataRazemZl: wynik.value.oplataRazemZl,
      mocKompensacjiKvar: wynik.value.mocKompensacjiKvar,
      zwrotLat: wynik.value.zwrotLat,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
