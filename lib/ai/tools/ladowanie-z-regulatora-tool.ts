/**
 * Narzędzie AI (9.3) dla Modułu 12, tryb mikroinstalacji, etap O2 "Ładowanie akumulatora z regulatora".
 * `operationType: 'read'`. Moc paneli, napięcie akumulatora i limity (regulator, wejście PV, akumulator) MUSZĄ pochodzić od usera
 * z kart katalogowych — brak limitu = limit nieznany, nigdy wartość zgadnięta przez model.
 */
import { z } from "zod"
import { calculateLadowanieZRegulatora } from "@/lib/core/modules/kalkulator-mobilny/ladowanie-z-regulatora/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const LadowanieZRegulatoraToolInput = z.object({
  mocPaneliW: z.number().describe("Łączna moc paneli w STC [W] — z kart paneli"),
  napiecieAkumulatoraV: z.number().describe("Napięcie akumulatora / banku [V] — od usera"),
  pojemnoscAh: z.number().optional().describe("Pojemność akumulatora [Ah] — opcjonalnie; z nią liczę szybkość ładowania (C) i czas"),
  maksPradLadowaniaAkumulatoraA: z.number().optional().describe("Maks. prąd ładowania akumulatora [A] z karty akumulatora — brak = limit nieznany, nie zgaduj"),
  regulatorPradMaxA: z.number().optional().describe("Maks. prąd ładowania regulatora [A] z karty regulatora — brak = limit nieznany, nie zgaduj"),
  regulatorMocPvMaxW: z.number().optional().describe("Maks. moc wejścia PV regulatora [W] z karty — brak = limit nieznany; nadmiar ponad limit jest obcinany"),
  sprawnoscRegulatoraPct: z.number().optional().describe("Sprawność regulatora [%] z karty — brak = liczone bez strat (górna granica prądu)"),
  socOdPct: z.number().optional().describe("Stan naładowania na początku [%] — razem z socDoPct i pojemnością daje czas ładowania"),
  socDoPct: z.number().optional().describe("Stan naładowania na końcu [%]"),
})
export type LadowanieZRegulatoraToolInputT = z.infer<typeof LadowanieZRegulatoraToolInput>

export const LadowanieZRegulatoraToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pradLadowaniaA: z.number().nullable().describe("Prąd ładowania po wszystkich znanych limitach [A] — GÓRNA granica (moc STC)"),
  mocLadowaniaW: z.number().nullable(),
  pradZPaneliA: z.number().nullable().describe("Prąd, jaki dałyby same panele (po limicie wejścia PV regulatora) [A]"),
  ograniczenie: z.enum(["panele", "regulator", "akumulator"]).nullable().describe("Co ustala prąd: panele, limit regulatora albo limit akumulatora"),
  nadmiarMocyW: z.number().nullable().describe("Moc paneli obcięta ponad limit wejścia PV regulatora [W]"),
  wymagaLimituWRegulatorze: z.boolean().nullable().describe("true = możliwy prąd jest większy niż akumulator przyjmie; limit trzeba ustawić w regulatorze"),
  cRate: z.number().nullable().describe("Szybkość ładowania C = prąd ÷ pojemność [1/h]"),
  energiaDoAkumulatoraWh: z.number().nullable(),
  czasLadowaniaH: z.number().nullable().describe("Czas ładowania przy stałym prądzie [h] — DOLNA granica (pod koniec prąd spada)"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type LadowanieZRegulatoraToolOutputT = z.infer<typeof LadowanieZRegulatoraToolOutput>

export const ladowanieZRegulatoraTool: AiToolDefinition<LadowanieZRegulatoraToolInputT, LadowanieZRegulatoraToolOutputT> = {
  name: "policz_ladowanie_z_regulatora",
  description:
    "Ile prądu popłynie z paneli przez regulator MPPT do akumulatora (Moduł 12): moc paneli ÷ napięcie akumulatora, obcięte kolejno " +
    "limitem wejścia PV regulatora, limitem prądu regulatora i prądem ładowania akumulatora; mówi, co faktycznie ogranicza (panele, " +
    "regulator czy akumulator) i czy trzeba ustawić limit prądu w regulatorze. Z pojemnością i zakresem stanu naładowania podaje też " +
    "szybkość ładowania (C), energię i czas. Moc paneli jest w STC, więc prąd to GÓRNA granica (zimą i pod chmurami niższy), a czas " +
    "przy stałym prądzie to DOLNA granica. Limity z kart regulatora i akumulatora podaje user — nie zgaduj; brak limitu = nieznany. " +
    "Użyj, gdy user pyta, jakim prądem naładują się jego panele przez regulator, czy regulator wystarczy do paneli albo jak długo " +
    "potrwa ładowanie akumulatora z paneli.",
  inputSchema: LadowanieZRegulatoraToolInput,
  outputSchema: LadowanieZRegulatoraToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/ladowanie-z-regulatora",
  handler: async (input) => {
    const wynik = calculateLadowanieZRegulatora({
      mocPaneliW: input.mocPaneliW,
      napiecieAkumulatoraV: input.napiecieAkumulatoraV,
      pojemnoscAh: input.pojemnoscAh ?? null,
      maksPradLadowaniaAkumulatoraA: input.maksPradLadowaniaAkumulatoraA ?? null,
      regulatorPradMaxA: input.regulatorPradMaxA ?? null,
      regulatorMocPvMaxW: input.regulatorMocPvMaxW ?? null,
      sprawnoscRegulatoraPct: input.sprawnoscRegulatoraPct ?? null,
      socOdPct: input.socOdPct ?? null,
      socDoPct: input.socDoPct ?? null,
    })
    const ma = wynik.status === "VALID" || wynik.status === "VALID_WITH_WARNINGS"
    const v = ma ? wynik.value : null
    return {
      status: wynik.status,
      pradLadowaniaA: v?.pradLadowaniaA ?? null,
      mocLadowaniaW: v?.mocLadowaniaW ?? null,
      pradZPaneliA: v?.pradZPaneliA ?? null,
      ograniczenie: v?.ograniczenie ?? null,
      nadmiarMocyW: v?.nadmiarMocyW ?? null,
      wymagaLimituWRegulatorze: v?.wymagaLimituWRegulatorze ?? null,
      cRate: v?.cRate ?? null,
      energiaDoAkumulatoraWh: v?.energiaDoAkumulatoraWh ?? null,
      czasLadowaniaH: v?.czasLadowaniaH ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
