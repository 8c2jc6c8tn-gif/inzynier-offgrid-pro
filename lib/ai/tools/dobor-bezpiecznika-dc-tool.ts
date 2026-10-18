/**
 * Narzędzie AI (9.3) dla Ekranu 24, Moduł 4 "Magazyn energii / baterie" — "Dobór bezpiecznika DC
 * (AIC/Class T/NH)". `operationType: 'read'`. Napięcie baterii, rezystancja wewnętrzna i AIC
 * bezpiecznika MUSZĄ pochodzić z pomiaru/karty katalogowej — jeden z najpoważniejszych twardych
 * stopów bezpieczeństwa (AIC poniżej prądu zwarciowego rozrywa bezpiecznik łukiem plazmowym).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDoborBezpiecznika } from "@/lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborBezpiecznikaDcToolInput = z.object({
  napiecieBateriiV: z.number().describe("Napięcie nominalne baterii/pakietu [V]"),
  rezystancjaWewnetrznaOhm: z.number().describe("Rezystancja wewnętrzna pakietu [Ω] — z pomiaru lub karty katalogowej ogniw"),
  aicBezpiecznikaA: z.number().describe("Zdolność wyłączania (AIC) wybranego bezpiecznika [A], z karty katalogowej — tylko od usera"),
})
export type DoborBezpiecznikaDcToolInputT = z.infer<typeof DoborBezpiecznikaDcToolInput>

export const DoborBezpiecznikaDcToolOutput = z.object({
  status: z.enum(STATUSY),
  pradZwarciowyA: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DoborBezpiecznikaDcToolOutputT = z.infer<typeof DoborBezpiecznikaDcToolOutput>

export const doborBezpiecznikaDcTool: AiToolDefinition<DoborBezpiecznikaDcToolInputT, DoborBezpiecznikaDcToolOutputT> = {
  name: "sprawdz_dobor_bezpiecznika_dc",
  description:
    "Liczy prąd zwarciowy pakietu (V/R_wewn) i sprawdza, czy zdolność wyłączania (AIC) wybranego bezpiecznika " +
    "DC (Class T/NH) wystarcza — twardy stop bezpieczeństwa: AIC poniżej prądu zwarciowego może spowodować " +
    "rozerwanie bezpiecznika łukiem plazmowym (Moduł 4, Ekran 24). Napięcie, rezystancja wewnętrzna i AIC " +
    "MUSZĄ pochodzić z pomiaru/karty katalogowej — nigdy nie zgaduj. Użyj, gdy user pyta o dobór bezpiecznika DC.",
  inputSchema: DoborBezpiecznikaDcToolInput,
  outputSchema: DoborBezpiecznikaDcToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/dobor-bezpiecznika-dc",
  handler: async (input) => {
    const wynik = calculateDoborBezpiecznika({
      napiecieBateriiV: input.napiecieBateriiV,
      rezystancjaWewnetrznaOhm: input.rezystancjaWewnetrznaOhm,
      aicBezpiecznikaA: input.aicBezpiecznikaA,
    })
    return {
      status: wynik.status,
      pradZwarciowyA: wynik.value.pradZwarciowyA,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
