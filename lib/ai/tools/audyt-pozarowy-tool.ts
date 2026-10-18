/**
 * Narzędzie AI (9.3) dla Modułu 8 "Bezpieczeństwo i sytuacje awaryjne", Ekran 11 "Autonomiczny
 * audyt bezpieczeństwa pożarowego" (dawne 12.57). `operationType: 'read'`. Lista pozycji audytu
 * (kategoria, element, status ok/warning/critical, opis problemu) MUSI pochodzić WYŁĄCZNIE
 * z realnych danych o stanie instalacji/urządzeń (odczyt czujników, kontrola wzrokowa,
 * dziennik serwisowy) — model nigdy nie zgaduje statusu żadnej pozycji audytu.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAuditPozarowy } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AudytPozarowyToolInput = z.object({
  items: z
    .array(
      z.object({
        id: z.string().describe("Identyfikator pozycji audytu"),
        kategoria: z
          .enum(["czujniki-dymu", "gasnice", "drogi-ewakuacyjne", "klapy-pozarowe", "przeglady"])
          .describe("Kategoria kontrolowanego elementu (5 kategorii ze źródła, Ekran 11) — od usera/danych instalacji"),
        element: z.string().describe("Nazwa kontrolowanego elementu — od usera/danych instalacji; puste = numer pozycji"),
        status: z
          .enum(["ok", "warning", "critical"])
          .describe(
            "Stan elementu — WYŁĄCZNIE z realnego odczytu/kontroli (czujnik, przegląd), nigdy zgadywany przez model",
          ),
        opis: z.string().describe("Opis problemu — puste, gdy status ok"),
      }),
    )
    .describe("Lista pozycji audytu bezpieczeństwa pożarowego — od usera/danych instalacji"),
})
export type AudytPozarowyToolInputT = z.infer<typeof AudytPozarowyToolInput>

export const AudytPozarowyToolOutput = z.object({
  status: z.enum(STATUSY),
  procentGotowosci: z.number(),
  liczbaOk: z.number(),
  liczbaOstrzezen: z.number(),
  liczbaKrytycznych: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AudytPozarowyToolOutputT = z.infer<typeof AudytPozarowyToolOutput>

export const audytPozarowyTool: AiToolDefinition<AudytPozarowyToolInputT, AudytPozarowyToolOutputT> = {
  name: "policz_audyt_pozarowy",
  description:
    "Podsumowuje autonomiczny audyt bezpieczeństwa pożarowego instalacji off-grid: procent gotowości oraz liczba " +
    "pozycji ok/ostrzeżenie/krytyczne na podstawie listy skontrolowanych elementów. Status każdej pozycji musi " +
    "pochodzić z realnej kontroli/odczytu czujnika, nie z domysłu. Użyj, gdy user pyta o ogólny stan gotowości " +
    "pożarowej instalacji na podstawie listy sprawdzonych elementów.",
  inputSchema: AudytPozarowyToolInput,
  outputSchema: AudytPozarowyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/audyt-pozarowy",
  handler: async (input) => {
    const wynik = calculateAuditPozarowy(input.items)
    return {
      status: wynik.status,
      procentGotowosci: wynik.value.procentGotowosci,
      liczbaOk: wynik.value.liczbaOk,
      liczbaOstrzezen: wynik.value.liczbaOstrzezen,
      liczbaKrytycznych: wynik.value.liczbaKrytycznych,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
