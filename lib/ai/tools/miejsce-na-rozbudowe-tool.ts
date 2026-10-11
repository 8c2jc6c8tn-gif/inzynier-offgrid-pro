/**
 * Narzędzie AI (9.3) dla Modułu 12, ekran "Miejsce na rozbudowę" (dawne 8.58, ograniczenia przestrzenne).
 * `operationType: 'read'`. Wymiary miejsca i elementu oraz odstępy MUSZĄ pochodzić od usera (pomiar, karta urządzenia) —
 * brak odstępów = 0 mm (brak danych, nie zalecenie), model nie zgaduje ani wymiarów, ani luzów wentylacyjnych.
 */
import { z } from "zod"
import { calculateMiejsceNaRozbudowe } from "@/lib/core/modules/kalkulator-mobilny/miejsce-na-rozbudowe/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MiejsceNaRozbudoweToolInput = z.object({
  miejsceDlugoscMm: z.number().describe("Długość wolnego miejsca [mm] — z pomiaru usera"),
  miejsceSzerokoscMm: z.number().describe("Szerokość wolnego miejsca [mm] — z pomiaru usera"),
  miejsceWysokoscMm: z.number().optional().describe("Wysokość wolnego miejsca [mm] — opcjonalnie; potrzebna do piętrowania i kontroli wysokości elementu"),
  elementDlugoscMm: z.number().describe("Długość jednego elementu (panelu albo akumulatora) [mm] — z karty urządzenia"),
  elementSzerokoscMm: z.number().describe("Szerokość jednego elementu [mm] — z karty urządzenia"),
  elementWysokoscMm: z.number().optional().describe("Wysokość (grubość) elementu [mm] — opcjonalnie; potrzebna do piętrowania"),
  odstepMiedzyMm: z.number().optional().describe("Odstęp między elementami [mm] (wentylacja, dostęp) — od usera lub z karty; brak = 0, nie zgaduj"),
  marginesPrzyScianieMm: z.number().optional().describe("Odstęp od ścian miejsca [mm] — od usera; brak = 0, nie zgaduj"),
  moznaPietrowac: z.boolean().optional().describe("true = elementy wolno ustawiać jeden na drugim (akumulatory zwykle tak, panele zwykle nie); brak = false"),
  planowanaLiczba: z.number().optional().describe("Ile elementów user chce dołożyć (liczba całkowita >= 1) — opcjonalnie"),
})
export type MiejsceNaRozbudoweToolInputT = z.infer<typeof MiejsceNaRozbudoweToolInput>

export const MiejsceNaRozbudoweToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  maksSztuk: z.number().nullable().describe("Ile elementów zmieści się łącznie (wszystkie warstwy)"),
  uklad: z.enum(["wzdluz", "wszerz"]).nullable().describe("wzdluz = dłuższy bok elementu wzdłuż długości miejsca; wszerz = obrócony o 90°"),
  kolumny: z.number().nullable(),
  rzedy: z.number().nullable(),
  warstwy: z.number().nullable(),
  wykorzystanieMiejscaPct: z.number().nullable().describe("Jaką część powierzchni podłogi miejsca zakrywa jedna warstwa [%]"),
  zmiesciSiePlan: z.boolean().nullable().describe("Czy planowana liczba się zmieści (null = nie podano planu)"),
  brakujeSztuk: z.number().nullable().describe("Na ile sztuk planu brakuje miejsca"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MiejsceNaRozbudoweToolOutputT = z.infer<typeof MiejsceNaRozbudoweToolOutput>

export const miejsceNaRozbudoweTool: AiToolDefinition<MiejsceNaRozbudoweToolInputT, MiejsceNaRozbudoweToolOutputT> = {
  name: "policz_miejsce_na_rozbudowe",
  description:
    "Ile paneli albo akumulatorów jeszcze fizycznie zmieści się w wolnym miejscu (Moduł 12, ograniczenia przestrzenne rozbudowy): " +
    "układa identyczne elementy w prostokątnej siatce równoległej do ścian, odejmuje odstęp od ścian i dodaje odstęp między elementami, " +
    "sprawdza ustawienie wzdłuż i obrócone o 90° i bierze to, które mieści więcej; przy piętrowaniu i znanych wysokościach liczy warstwy. " +
    "Z planowaną liczbą mówi, czy się zmieści i ile brakuje. To czysta geometria — nie ocenia wentylacji, dostępu serwisowego, masy ani kabli; " +
    "wymiary i odstępy podaje user (pomiar, karta urządzenia), brak odstępów = 0 mm, nie zgaduj. " +
    "Użyj, gdy user pyta, czy dodatkowy panel albo akumulator zmieści się w jego kamperze, skrzyni, altanie lub na półce albo ile sztuk jeszcze się zmieści.",
  inputSchema: MiejsceNaRozbudoweToolInput,
  outputSchema: MiejsceNaRozbudoweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/miejsce-na-rozbudowe",
  handler: async (input) => {
    const wynik = calculateMiejsceNaRozbudowe({
      miejsceDlugoscMm: input.miejsceDlugoscMm,
      miejsceSzerokoscMm: input.miejsceSzerokoscMm,
      miejsceWysokoscMm: input.miejsceWysokoscMm ?? null,
      elementDlugoscMm: input.elementDlugoscMm,
      elementSzerokoscMm: input.elementSzerokoscMm,
      elementWysokoscMm: input.elementWysokoscMm ?? null,
      odstepMiedzyMm: input.odstepMiedzyMm ?? null,
      marginesPrzyScianieMm: input.marginesPrzyScianieMm ?? null,
      moznaPietrowac: input.moznaPietrowac ?? false,
      planowanaLiczba: input.planowanaLiczba ?? null,
    })
    const ma = wynik.status === "VALID" || wynik.status === "VALID_WITH_WARNINGS"
    const v = ma ? wynik.value : null
    return {
      status: wynik.status,
      maksSztuk: v?.maksSztuk ?? null,
      uklad: v?.uklad ?? null,
      kolumny: v?.kolumny ?? null,
      rzedy: v?.rzedy ?? null,
      warstwy: v?.warstwy ?? null,
      wykorzystanieMiejscaPct: v?.wykorzystanieMiejscaPct ?? null,
      zmiesciSiePlan: v?.zmiesciSiePlan ?? null,
      brakujeSztuk: v?.brakujeSztuk ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
