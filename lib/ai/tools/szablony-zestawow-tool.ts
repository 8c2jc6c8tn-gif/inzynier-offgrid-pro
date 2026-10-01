/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 3 "Gotowe szablony zestawów" (dawne 8.3 + 8.16, Biblia §12.3).
 * `operationType: 'read'`. Szablon daje tylko nazwy odbiorników — moce, czasy, DoD, słońce i sprawność
 * MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateSzablonyZestawow } from "@/lib/core/modules/kalkulator-mobilny/szablony-zestawow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SzablonyZestawowToolInput = z.object({
  szablon: z.enum(["kamper", "jacht", "domek", "warsztat", "kemping"]).describe("Typ wyjazdu / obiektu"),
  dni: z.number().describe("Liczba dni pobytu"),
  osoby: z.number().describe("Liczba osób"),
  urzadzenia: z
    .array(z.object({ nazwa: z.string(), mocW: z.number(), godzinNaDobe: z.number(), naOsobe: z.boolean().describe("Liczone na każdą osobę") }))
    .describe("Odbiorniki z mocą i czasem od usera"),
  napiecieV: z.number().describe("Napięcie akumulatora [V]"),
  dodPct: z.number().describe("Część użyteczna akumulatora (DoD) [%] — od usera, nie zgaduj"),
  godzinSlonca: z.number().describe("Równoważne godziny pełnego słońca [h/dobę]; 0 = bez panelu"),
  sprawnoscToruPct: z.number().describe("Sprawność toru panel → akumulator [%]; 0 gdy bez panelu"),
})
export type SzablonyZestawowToolInputT = z.infer<typeof SzablonyZestawowToolInput>

export const SzablonyZestawowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zuzycieDobaWh: z.number(),
  zuzyciePobytWh: z.number(),
  szczytW: z.number(),
  minimalnyAhPobyt: z.number().describe("Akumulator na cały pobyt bez słońca [Ah]"),
  minimalnyAhDoba: z.number().describe("Akumulator na dobę, gdy panel pokrywa zużycie [Ah]"),
  minimalnyPanelW: z.number(),
  pradRegulatoraA: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SzablonyZestawowToolOutputT = z.infer<typeof SzablonyZestawowToolOutput>

export const szablonyZestawowTool: AiToolDefinition<SzablonyZestawowToolInputT, SzablonyZestawowToolOutputT> = {
  name: "dobierz_zestaw_z_szablonu",
  description:
    "Dobiera minimalny zestaw (akumulator na pobyt i na dobę, panel, prąd regulatora, szczyt mocy) dla typowego " +
    "wyjazdu lub obiektu: kamper, jacht, domek letniskowy, warsztat, kemping — z listy odbiorników usera. " +
    "Użyj, gdy user pyta, jaki zestaw solarny i akumulator wziąć na kemping/kamper/jacht albo do domku, " +
    "i chce zacząć od typowej listy urządzeń.",
  inputSchema: SzablonyZestawowToolInput,
  outputSchema: SzablonyZestawowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/szablony-zestawow",
  handler: async (input) => {
    const wynik = calculateSzablonyZestawow(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
