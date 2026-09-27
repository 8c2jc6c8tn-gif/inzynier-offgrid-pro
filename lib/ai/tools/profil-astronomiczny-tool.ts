/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 5 "Profil dobowy + astronomiczny dzień/noc" — tylko
 * część astronomiczna (długość dnia/nocy z szerokości geograficznej i dnia roku, metoda Coopera).
 * `operationType: 'read'`. Szerokość geograficzna, dzień roku i moc odbiornika nocnego pochodzą
 * WYŁĄCZNIE od usera. Profil godzinowych współczynników zapotrzebowania nie jest liczony
 * (nie zbudowany w jądrze — świadomo pominięta, przykładowa, nie uniwersalna dana źródła).
 */
import { z } from "zod"
import { calculateProfilAstronomiczny } from "@/lib/core/modules/zapotrzebowanie/profil-astronomiczny/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ProfilAstronomicznyToolInput = z.object({
  szerokoscGeograficzna: z
    .number()
    .describe("Szerokość geograficzna [°], -90..90 — od usera (docelowo z Modułu 1), nie zgaduj"),
  dzienRoku: z.number().describe("Dzień roku [1-365] — od usera"),
  mocOdbiornikaNocnegoW: z
    .number()
    .optional()
    .describe("Opcjonalnie: moc odbiornika działającego tylko w nocy [W], np. oświetlenie zewnętrzne"),
})
export type ProfilAstronomicznyToolInputT = z.infer<typeof ProfilAstronomicznyToolInput>

export const ProfilAstronomicznyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  dlugoscDniaH: z.number(),
  dlugoscNocyH: z.number(),
  energiaNocnaKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ProfilAstronomicznyToolOutputT = z.infer<typeof ProfilAstronomicznyToolOutput>

export const profilAstronomicznyTool: AiToolDefinition<
  ProfilAstronomicznyToolInputT,
  ProfilAstronomicznyToolOutputT
> = {
  name: "policz_dlugosc_dnia_i_nocy",
  description:
    "Liczy astronomiczną długość dnia i nocy [h] dla podanej szerokości geograficznej i dnia roku (metoda " +
    "Coopera) oraz opcjonalnie dobową energię odbiornika działającego tylko w nocy — Moduł 2, Ekran 5. " +
    "Szerokość geograficzna i dzień roku pochodzą od usera — nie zgaduj. Nie liczy profilu godzinowego " +
    "zapotrzebowania (nie zbudowany). Użyj, gdy user pyta o długość dnia/nocy w danej lokalizacji i porze roku.",
  inputSchema: ProfilAstronomicznyToolInput,
  outputSchema: ProfilAstronomicznyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/profil-astronomiczny",
  handler: async (input) => {
    const wynik = calculateProfilAstronomiczny({
      szerokoscGeograficzna: input.szerokoscGeograficzna,
      dzienRoku: input.dzienRoku,
      mocOdbiornikaNocnegoW: input.mocOdbiornikaNocnegoW ?? 0,
    })
    return {
      status: wynik.status,
      dlugoscDniaH: wynik.value.dlugoscDniaH,
      dlugoscNocyH: wynik.value.dlugoscNocyH,
      energiaNocnaKwh: wynik.value.energiaNocnaKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
