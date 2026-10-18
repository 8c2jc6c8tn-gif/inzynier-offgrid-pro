/**
 * Narzędzie AI (9.3) dla Ekranu 3, Moduł 9 "Elektronika / ESP32" — "Montaż i obudowa w rozdzielni" (dawne 11.3).
 * `operationType: 'read'`. Kontrola IP w miejscu wilgotnym — echo M4/E10 i M12/E23; odstęp, wentylacja, izolacja — 🟡.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMontazObudowa } from "@/lib/core/modules/esp32/montaz-obudowa/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MontazObudowaEsp32ToolInput = z.object({
  miejsce: z.enum(["suche", "wilgotne"]).nullable(),
  ipKod: z.number().nullable().describe("Kod IP obudowy, np. 20, 54, 55, 65 — z karty obudowy"),
  montaz: z.enum(["din", "plyta", "inny"]).nullable(),
  odstepOdSzynCm: z.number().nullable(),
  wentylacja: z.boolean().nullable(),
  izolacjaOdCzesciPodNapieciem: z.boolean().nullable(),
})
export type MontazObudowaEsp32ToolInputT = z.infer<typeof MontazObudowaEsp32ToolInput>

export const MontazObudowaEsp32ToolOutput = z.object({
  status: z.enum(STATUSY),
  zalecaneIp: z.number().nullable(),
  minimalneIp: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MontazObudowaEsp32ToolOutputT = z.infer<typeof MontazObudowaEsp32ToolOutput>

export const montazObudowaEsp32Tool: AiToolDefinition<MontazObudowaEsp32ToolInputT, MontazObudowaEsp32ToolOutputT> = {
  name: "sprawdz_montaz_obudowy_esp32",
  description:
    "Sprawdza obudowę i montaż sterownika ESP32 w rozdzielni: stopień IP wobec miejsca (IP20 sucho; w wilgoci poniżej IP55 " +
    "twardy stop, zalecane IP65), odstęp od szyn prądowych min. 2 cm, wentylację, izolację od części pod napięciem, montaż DIN " +
    "(Moduł 9, Ekran 3). Użyj, gdy user pyta, jak i w jakiej obudowie zamontować ESP32 w rozdzielni, garażu albo piwnicy.",
  inputSchema: MontazObudowaEsp32ToolInput,
  outputSchema: MontazObudowaEsp32ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/montaz-obudowa",
  handler: async (input) => {
    const wynik = calculateMontazObudowa(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
