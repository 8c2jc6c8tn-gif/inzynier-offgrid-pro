/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 12 "Kreator zasilania małego odbiornika" (moduł zbiorczy, Biblia
 * §12.24 + scenariusze dołączone). `operationType: 'read'`. Moce, godziny, sprawności i część użyteczna
 * MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateKreatorMalegoOdbiornika } from "@/lib/core/modules/kalkulator-mobilny/kreator-malego-odbiornika/calculator"
import { SCENARIUSZE } from "@/lib/core/modules/kalkulator-mobilny/kreator-malego-odbiornika/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const ID_SCENARIUSZY = SCENARIUSZE.map((s) => s.id) as [(typeof SCENARIUSZE)[number]["id"], ...(typeof SCENARIUSZE)[number]["id"][]]

export const KreatorMalegoOdbiornikaToolInput = z.object({
  scenariusz: z.enum(ID_SCENARIUSZY).nullable().describe("Scenariusz (np. alarm, brama-wjazdowa, kociol-gazowy, lodowka); null = inny"),
  skladniki: z
    .array(
      z.object({
        nazwa: z.string(),
        mocW: z.number().describe("Moc [W] — od usera"),
        godzinNaDobe: z.number().describe("Godziny pracy na dobę [h] — od usera"),
        krotnoscRozruchu: z.number().describe("Krotność rozruchu; 0 = nie podano"),
      }),
    )
    .describe("Składniki odbiornika"),
  czasPodtrzymaniaH: z.number().describe("Wymagany czas podtrzymania bez ładowania [h]"),
  napiecieV: z.number().describe("Napięcie akumulatora [V]"),
  uzytecznaPct: z.number().describe("Część użyteczna pojemności (DoD) [%] — od usera, nie zgaduj"),
  przezFalownik: z.boolean().nullable().describe("Czy zasilane przez falownik 230 V; null = nie wiadomo"),
  sprawnoscFalownikaPct: z.number().describe("Sprawność falownika [%]; 0 gdy bez falownika"),
  posiadanyAh: z.number().describe("Posiadany akumulator [Ah]; 0 = nie sprawdzaj"),
  mocPaneluW: z.number().describe("Moc panelu [W]; 0 = bez panelu"),
  godzinSlonca: z.number().describe("Równoważne godziny pełnego słońca [h/dobę]; 0 gdy bez panelu"),
  sprawnoscToruPct: z.number().describe("Sprawność toru panel → akumulator [%]; 0 gdy bez panelu"),
})
export type KreatorMalegoOdbiornikaToolInputT = z.infer<typeof KreatorMalegoOdbiornikaToolInput>

export const KreatorMalegoOdbiornikaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zuzycieDobaWh: z.number(),
  sumaMocyW: z.number(),
  szczytW: z.number(),
  energiaPodtrzymaniaWh: z.number(),
  minimalnyAh: z.number(),
  posiadanyStarczyH: z.number(),
  energiaPaneluWh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KreatorMalegoOdbiornikaToolOutputT = z.infer<typeof KreatorMalegoOdbiornikaToolOutput>

export const kreatorMalegoOdbiornikaTool: AiToolDefinition<KreatorMalegoOdbiornikaToolInputT, KreatorMalegoOdbiornikaToolOutputT> = {
  name: "dobierz_zasilanie_malego_odbiornika",
  description:
    "Dobiera minimalny akumulator (i ewentualny falownik, panel) dla jednego małego odbiornika lub zestawu: " +
    "oświetlenie awaryjne, telefony, alarm, brama, ogród, fontanna, wentylator, sterownik C.O., pompka, " +
    "elektronarzędzia, router i monitoring, bojler, praca zdalna, lodówka, kocioł gazowy. Użyj, gdy user pyta, " +
    "jaki akumulator podtrzyma konkretne urządzenie przez zadany czas albo na ile godzin starczy jego akumulator.",
  inputSchema: KreatorMalegoOdbiornikaToolInput,
  outputSchema: KreatorMalegoOdbiornikaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/kreator-malego-odbiornika",
  handler: async (input) => {
    const wynik = calculateKreatorMalegoOdbiornika(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
