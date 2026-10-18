/**
 * Narzędzie AI (9.3) dla Ekranu 14, Moduł 3 "Instalacja PV" — "Dopasowanie tablicy PV do
 * falownika". `operationType: 'read'`. Wszystkie parametry (Voc/Vmp/Imp panelu, β, Tmin, liczba
 * paneli w stringu, limity falownika: Vmax, okno MPPT, Imax MPPT, moc AC) MUSZĄ pochodzić z karty
 * katalogowej panelu/falownika i danych lokalizacji użytkownika — model nigdy ich nie zgaduje.
 * Sprawdza tylko 4 z 6 kryteriów źródła (kryterium napięcia startowego w upale świadomie
 * pominięte — patrz `calculator.ts`).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDopasowanieTablicyFalownika } from "@/lib/core/modules/pv/dopasowanie-tablicy-falownika/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DopasowanieTablicyFalownikaToolInput = z.object({
  vocStcV: z.number().describe("Voc panelu w warunkach STC (25°C) [V], z karty katalogowej"),
  vmpStcV: z.number().describe("Vmp panelu w warunkach STC (25°C) [V], z karty katalogowej"),
  impA: z.number().describe("Prąd roboczy panelu (Imp) [A], z karty katalogowej"),
  betaPctNaC: z.number().describe("Współczynnik temperaturowy Voc (β) [%/°C], ujemny, typowo -0,29 do -0,32 — z karty katalogowej"),
  tminC: z.number().describe("Minimalna temperatura w lokalizacji (Tmin) [°C] — dana usera, nie zgaduj"),
  liczbaPaneliWStringu: z.number().describe("Liczba paneli w stringu"),
  vMaxFalownikaV: z.number().describe("Maksymalne dopuszczalne napięcie wejściowe DC falownika [V], z karty katalogowej"),
  mpptMinV: z.number().describe("Dolna granica okna MPPT falownika [V]"),
  mpptMaxV: z.number().describe("Górna granica okna MPPT falownika [V]"),
  iMaxMpptA: z.number().describe("Maksymalny prąd wejściowy na MPPT falownika [A]"),
  mocFalownikaAcW: z.number().describe("Moc znamionowa AC falownika [W]"),
})
export type DopasowanieTablicyFalownikaToolInputT = z.infer<typeof DopasowanieTablicyFalownikaToolInput>

export const DopasowanieTablicyFalownikaToolOutput = z.object({
  status: z.enum(STATUSY),
  vStringColdV: z.number().describe("Napięcie stringu w zimie [V]"),
  vStringStcV: z.number().describe("Napięcie robocze stringu w STC [V]"),
  iStringA: z.number(),
  mocPvW: z.number(),
  dcAcRatio: z.number().describe("Współczynnik przewymiarowania DC/AC, zalecany zakres 1,1-1,3"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DopasowanieTablicyFalownikaToolOutputT = z.infer<typeof DopasowanieTablicyFalownikaToolOutput>

export const dopasowanieTablicyFalownikaTool: AiToolDefinition<
  DopasowanieTablicyFalownikaToolInputT,
  DopasowanieTablicyFalownikaToolOutputT
> = {
  name: "sprawdz_dopasowanie_tablicy_do_falownika",
  description:
    "Sprawdza dopasowanie tablicy PV do falownika (Moduł 3, Ekran 14): napięcie stringu zimą wobec limitu " +
    "falownika, napięcie robocze wobec okna MPPT, prąd roboczy wobec limitu MPPT oraz współczynnik " +
    "przewymiarowania DC/AC (zalecany zakres 1,1-1,3). Wszystkie dane wejściowe (Voc, Vmp, Imp, β, Tmin, " +
    "limity falownika) pochodzą z karty katalogowej i lokalizacji użytkownika — nie zgaduj ich. Użyj, gdy " +
    "user pyta, czy jego panele pasują do falownika albo ile paneli może dać w jednym stringu.",
  inputSchema: DopasowanieTablicyFalownikaToolInput,
  outputSchema: DopasowanieTablicyFalownikaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/dopasowanie-tablicy-falownika",
  handler: async (input) => {
    const wynik = calculateDopasowanieTablicyFalownika(input)
    return {
      status: wynik.status,
      vStringColdV: wynik.value.vStringColdV,
      vStringStcV: wynik.value.vStringStcV,
      iStringA: wynik.value.iStringA,
      mocPvW: wynik.value.mocPvW,
      dcAcRatio: wynik.value.dcAcRatio,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
