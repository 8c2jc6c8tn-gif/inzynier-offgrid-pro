/**
 * Narzędzie AI (9.3) dla Ekranu 15, Moduł 4 "Magazyn energii / baterie" — "Cold Cranking Amps
 * (zimny start dużych odbiorników)". `operationType: 'read'`. Napięcie otwartego obwodu, prąd
 * rozruchowy i rezystancja wewnętrzna MUSZĄ pochodzić z pomiaru — dane bezpieczeństwa (spadek
 * napięcia poniżej progu falownika = wyłączenie systemu w trakcie rozruchu).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateColdCrankingAmps } from "@/lib/core/modules/baterie/cold-cranking-amps/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ColdCrankingAmpsToolInput = z.object({
  napiecieOtwartegoObwoduV: z.number().describe("Napięcie pakietu bez obciążenia (open-circuit) [V] — z pomiaru"),
  pradRozruchowyA: z.number().describe("Prąd rozruchowy odbiornika [A] — z karty katalogowej/pomiaru"),
  rezystancjaWewnetrznaMOhm: z.number().describe("Rezystancja wewnętrzna całego pakietu [mΩ], zmierzona w bieżącej temperaturze — tylko od usera"),
  minimalneNapiecieFalownikaV: z.number().describe("Minimalne napięcie pracy falownika [V] — z karty katalogowej"),
})
export type ColdCrankingAmpsToolInputT = z.infer<typeof ColdCrankingAmpsToolInput>

export const ColdCrankingAmpsToolOutput = z.object({
  status: z.enum(STATUSY),
  vSagV: z.number(),
  falownikWytrzyma: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ColdCrankingAmpsToolOutputT = z.infer<typeof ColdCrankingAmpsToolOutput>

export const coldCrankingAmpsTool: AiToolDefinition<ColdCrankingAmpsToolInputT, ColdCrankingAmpsToolOutputT> = {
  name: "sprawdz_zimny_rozruch_duzego_odbiornika",
  description:
    "Liczy spadek napięcia (V_sag) baterii przy rozruchu dużego odbiornika (Moduł 4, Ekran 15, Cold Cranking " +
    "Amps) i sprawdza, czy falownik utrzyma napięcie pracy. Napięcie otwartego obwodu, prąd rozruchowy i " +
    "rezystancja wewnętrzna MUSZĄ pochodzić z pomiaru/karty katalogowej — nie zgaduj. Użyj, gdy user pyta, " +
    "czy bateria/falownik wytrzyma rozruch np. kompresora lodówki albo pompy.",
  inputSchema: ColdCrankingAmpsToolInput,
  outputSchema: ColdCrankingAmpsToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/cold-cranking-amps",
  handler: async (input) => {
    const wynik = calculateColdCrankingAmps({
      napiecieOtwartegoObwoduV: input.napiecieOtwartegoObwoduV,
      pradRozruchowyA: input.pradRozruchowyA,
      rezystancjaWewnetrznaMOhm: input.rezystancjaWewnetrznaMOhm,
      minimalneNapiecieFalownikaV: input.minimalneNapiecieFalownikaV,
    })
    return {
      status: wynik.status,
      vSagV: wynik.value.vSagV,
      falownikWytrzyma: wynik.value.falownikWytrzyma,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
