/**
 * Narzędzie AI (9.3) dla Ekranu 9, Moduł 4 "Magazyn energii / baterie" — "Detekcja zwarcia i
 * e-Fuse". `operationType: 'read'`. Napięcie baterii, rezystancja wewnętrzna i zdolność
 * łączeniowa tranzystorów MUSZĄ pochodzić z pomiaru/karty katalogowej — dane bezpieczeństwa
 * (prąd zwarciowy powyżej zdolności łączeniowej BMS = uszkodzenie/pożar).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDetekcjaZwarciaEFuse } from "@/lib/core/modules/baterie/detekcja-zwarcia-efuse/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DetekcjaZwarciaEFuseToolInput = z.object({
  napiecieBateriiV: z.number().describe("Napięcie nominalne baterii/pakietu [V]"),
  rezystancjaWewnetrznaOhm: z.number().describe("Rezystancja wewnętrzna pakietu [Ω] — z pomiaru/karty katalogowej"),
  zdolnoscLaczeniowaTranzystorowA: z.number().describe("Zdolność łączeniowa pojedynczych tranzystorów BMS [A] — z karty katalogowej, tylko od usera"),
})
export type DetekcjaZwarciaEFuseToolInputT = z.infer<typeof DetekcjaZwarciaEFuseToolInput>

export const DetekcjaZwarciaEFuseToolOutput = z.object({
  status: z.enum(STATUSY),
  pradZwarciowyA: z.number(),
  wymaganyEFuse: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DetekcjaZwarciaEFuseToolOutputT = z.infer<typeof DetekcjaZwarciaEFuseToolOutput>

export const detekcjaZwarciaEFuseTool: AiToolDefinition<DetekcjaZwarciaEFuseToolInputT, DetekcjaZwarciaEFuseToolOutputT> = {
  name: "sprawdz_detekcje_zwarcia_efuse",
  description:
    "Liczy prąd zwarciowy pakietu (V/R_wewn) i sprawdza, czy zdolność łączeniowa tranzystorów BMS " +
    "wystarcza, czy potrzeba dodatkowego e-Fuse (Moduł 4, Ekran 9). Napięcie, rezystancja wewnętrzna i " +
    "zdolność łączeniowa MUSZĄ pochodzić z pomiaru/karty katalogowej — nie zgaduj, to dane bezpieczeństwa. " +
    "Użyj, gdy user pyta o ochronę przed zwarciem wewnętrznym baterii.",
  inputSchema: DetekcjaZwarciaEFuseToolInput,
  outputSchema: DetekcjaZwarciaEFuseToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/detekcja-zwarcia-efuse",
  handler: async (input) => {
    const wynik = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: input.napiecieBateriiV,
      rezystancjaWewnetrznaOhm: input.rezystancjaWewnetrznaOhm,
      zdolnoscLaczeniowaTranzystorowA: input.zdolnoscLaczeniowaTranzystorowA,
    })
    return {
      status: wynik.status,
      pradZwarciowyA: wynik.value.pradZwarciowyA,
      wymaganyEFuse: wynik.value.wymaganyEFuse,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
