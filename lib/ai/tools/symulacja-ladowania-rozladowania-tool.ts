/**
 * Narzędzie AI (9.3) dla Ekranu 3, Moduł 4 "Magazyn energii / baterie" — "Symulacja czasu
 * ładowania/rozładowania". `operationType: 'read'`. Uproszczony model średnich mocy (nie pełny
 * profil godzinowy — Moduł 2/3 jeszcze nie istnieją w kodzie). SoC startowy, moce ładowania i
 * rozładowania oraz długość dnia MUSZĄ pochodzić od usera, nie zgaduj pogody/profilu obciążenia.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSymulacjaLadowania } from "@/lib/core/modules/baterie/symulacja-ladowania-rozladowania/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SymulacjaLadowaniaRozladowaniaToolInput = z.object({
  pojemnoscUzytecznaKwh: z.number().describe("Pojemność użyteczna baterii [kWh]"),
  socStartPct: z.number().describe("Aktualny/zakładany SoC na początku dnia [%], 0–100"),
  mocLadowaniaKw: z.number().describe("Średnia moc ładowania netto z PV w ciągu dnia [kW] — od usera (0 dopuszczalne, dzień bez słońca)"),
  mocRozladowaniaKw: z.number().describe("Średnia moc rozładowania w nocy (profil obciążenia) [kW] — od usera"),
  dlugoscDniaGodz: z.number().describe("Długość dostępnego okna ładowania (naświetlenie) [godz.] — od usera, nie zgaduj pogody"),
  socProgPct: z.number().describe("Próg ostrzegawczy SoC do sprawdzenia przetrwania nocy [%], 0–100"),
})
export type SymulacjaLadowaniaRozladowaniaToolInputT = z.infer<typeof SymulacjaLadowaniaRozladowaniaToolInput>

export const SymulacjaLadowaniaRozladowaniaToolOutput = z.object({
  status: z.enum(STATUSY),
  godzinDoPelna: z.number(),
  zdazyNaladowacPrzedZachodem: z.boolean(),
  socOZachodzieSlonca: z.number(),
  godzinDoProguWNocy: z.number(),
  przetrwaCalaNoc: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SymulacjaLadowaniaRozladowaniaToolOutputT = z.infer<typeof SymulacjaLadowaniaRozladowaniaToolOutput>

export const symulacjaLadowaniaRozladowaniaTool: AiToolDefinition<
  SymulacjaLadowaniaRozladowaniaToolInputT,
  SymulacjaLadowaniaRozladowaniaToolOutputT
> = {
  name: "symuluj_ladowanie_rozladowanie_baterii",
  description:
    "Symuluje czas do pełnego naładowania w ciągu dnia i czas do progu ostrzegawczego SoC w nocy, na " +
    "podstawie uproszczonych średnich mocy ładowania/rozładowania (Moduł 4, Ekran 3). SoC startowy, moce i " +
    "długość dnia MUSZĄ pochodzić od usera — nie zgaduj prognozy pogody ani profilu obciążenia domu. Użyj, " +
    "gdy user pyta, czy bateria naładuje się przed zachodem słońca albo czy przetrwa całą noc.",
  inputSchema: SymulacjaLadowaniaRozladowaniaToolInput,
  outputSchema: SymulacjaLadowaniaRozladowaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/symulacja-ladowania-rozladowania",
  handler: async (input) => {
    const wynik = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
      socStartPct: input.socStartPct,
      mocLadowaniaKw: input.mocLadowaniaKw,
      mocRozladowaniaKw: input.mocRozladowaniaKw,
      dlugoscDniaGodz: input.dlugoscDniaGodz,
      socProgPct: input.socProgPct,
    })
    return {
      status: wynik.status,
      godzinDoPelna: wynik.value.godzinDoPelna,
      zdazyNaladowacPrzedZachodem: wynik.value.zdazyNaladowacPrzedZachodem,
      socOZachodzieSlonca: wynik.value.socOZachodzieSlonca,
      godzinDoProguWNocy: wynik.value.godzinDoProguWNocy,
      przetrwaCalaNoc: wynik.value.przetrwaCalaNoc,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
