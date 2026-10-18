/**
 * Narzędzie AI (9.3) dla Ekranu 13, Moduł 7 "Stress-test zimowy" — "Test sztywnienia izolacji w
 * niskich temperaturach". `operationType: 'read'`. Materiały i minimalną temperaturę miejsca podaje
 * user — model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSztywnienieIzolacji } from "@/lib/core/modules/stress-test/sztywnienie-izolacji/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SztywnienieIzolacjiToolInput = z.object({
  materialy: z
    .array(z.enum(["PVC", "XLPE", "guma", "aluminium"]))
    .describe("Materiały izolacji kabli/osłon/złączek w instalacji — od usera"),
  temperaturaMinimalnaC: z.number().describe("Minimalna spodziewana temperatura w miejscu montażu [°C] — od usera, nie zgaduj"),
})
export type SztywnienieIzolacjiToolInputT = z.infer<typeof SztywnienieIzolacjiToolInput>

export const SztywnienieIzolacjiToolOutput = z.object({
  status: z.enum(STATUSY),
  oceny: z.array(
    z.object({
      material: z.string(),
      progC: z.number().nullable().describe("Próg materiału [°C]; null = źródło nie podaje liczby"),
      zapasK: z.number().nullable().describe("Temperatura miejsca − próg [K]; ujemny = poniżej progu"),
    }),
  ),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SztywnienieIzolacjiToolOutputT = z.infer<typeof SztywnienieIzolacjiToolOutput>

export const sztywnienieIzolacjiTool: AiToolDefinition<SztywnienieIzolacjiToolInputT, SztywnienieIzolacjiToolOutputT> = {
  name: "sprawdz_sztywnienie_izolacji_na_mrozie",
  description:
    "Sprawdza, czy materiały izolacji kabli, osłon i złączek wytrzymają minimalną temperaturę miejsca montażu " +
    "(Moduł 7, Ekran 13): PVC sztywnieje i pęka poniżej −10°C (twardy stop), XLPE do −40°C. Guma i aluminium — " +
    "bez progu liczbowego w źródle. Strona gorąca (PVC 70°C / XLPE 90°C) to osobne narzędzie doboru izolacji (Moduł 5). " +
    "Użyj, gdy user pyta, czy jego kable lub złączki przetrwają mróz.",
  inputSchema: SztywnienieIzolacjiToolInput,
  outputSchema: SztywnienieIzolacjiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/sztywnienie-izolacji",
  handler: async (input) => {
    const wynik = calculateSztywnienieIzolacji(input)
    return {
      status: wynik.status,
      oceny: wynik.value.oceny,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
