/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 25 "Szybka diagnoza problemów" (dawne 8.50, Biblia §12.38).
 * `operationType: 'read'`. Prowadzi krok po kroku — model pyta usera o wynik bieżącego kroku i woła
 * narzędzie ponownie z uzupełnionymi odpowiedziami.
 */
import { z } from "zod"
import { calculateSzybkaDiagnoza } from "@/lib/core/modules/kalkulator-mobilny/szybka-diagnoza/calculator"
import { t } from "@/lib/i18n/t"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SzybkaDiagnozaToolInput = z.object({
  objaw: z.enum(["brak-pradu", "niskie-napiecie", "przegrzewanie", "nie-laduje"]).nullable().describe("Objaw zgłoszony przez usera"),
  odpowiedzi: z.record(z.string(), z.enum(["ok", "problem"])).describe("Wyniki sprawdzonych kroków (id kroku → ok/problem); na start {}"),
})
export type SzybkaDiagnozaToolInputT = z.infer<typeof SzybkaDiagnozaToolInput>

export const SzybkaDiagnozaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  aktualnyKrok: z.object({ id: z.string(), polecenie: z.string() }).nullable().describe("Co user ma teraz sprawdzić"),
  przyczyna: z.object({ id: z.string(), opis: z.string(), link: z.string().nullable() }).nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SzybkaDiagnozaToolOutputT = z.infer<typeof SzybkaDiagnozaToolOutput>

const klucz = (rodzaj: "K" | "P", id: string) => `UI-M12-DG-${rodzaj}-${id.toUpperCase()}`

export const szybkaDiagnozaTool: AiToolDefinition<SzybkaDiagnozaToolInputT, SzybkaDiagnozaToolOutputT> = {
  name: "diagnozuj_problem_malej_instalacji",
  description:
    "Prowadzi krok po kroku diagnozę usterki małej instalacji 12/24 V: brak prądu, niskie napięcie, " +
    "przegrzewanie, akumulator się nie ładuje — zwraca następny krok do sprawdzenia albo znalezioną przyczynę. " +
    "Użyj, gdy user pisze, że coś przestało działać w jego instalacji kempingowej/kamperowej i pyta, co sprawdzić.",
  inputSchema: SzybkaDiagnozaToolInput,
  outputSchema: SzybkaDiagnozaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/szybka-diagnoza",
  handler: async (input) => {
    const wynik = calculateSzybkaDiagnoza(input)
    const { aktualnyKrok, przyczyna, kroki } = wynik.value
    const krokPrzyczyny = kroki.find((k) => k.id === przyczyna)
    return {
      status: wynik.status,
      aktualnyKrok: aktualnyKrok ? { id: aktualnyKrok, polecenie: t("pl", klucz("K", aktualnyKrok)) } : null,
      przyczyna: krokPrzyczyny ? { id: krokPrzyczyny.id, opis: t("pl", klucz("P", krokPrzyczyny.id)), link: krokPrzyczyny.link } : null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
