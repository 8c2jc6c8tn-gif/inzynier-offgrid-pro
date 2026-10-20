/**
 * Narzędzie AI (9.3) — Moduł 4, „Zestawy ustawień JK BMS od autorów”. `operationType: 'read'`.
 * Echo silnika `baterie/zestawy-ustawien-jk-bms`: parametry wybranego zestawu autora z przeliczeniem
 * na cały pakiet i prąd w C, zgodność ze źródłem aplikacji i spójność progów. Zestaw to dane autora,
 * nie rekomendacja — narzędzie niczego w nim nie poprawia.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateZestawyUstawienJkBms } from "@/lib/core/modules/baterie/zestawy-ustawien-jk-bms/calculator"
import { ZESTAWY } from "@/lib/core/modules/baterie/zestawy-ustawien-jk-bms/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZestawyUstawienJkBmsToolInput = z.object({
  zestawId: z
    .string()
    .describe(
      `Id zestawu ustawień JK BMS od autora. Dostępne: ${ZESTAWY.map((z) => `${z.id} (autor: ${z.autor})`).join("; ")}`,
    ),
})
export type ZestawyUstawienJkBmsToolInputT = z.infer<typeof ZestawyUstawienJkBmsToolInput>

export const ZestawyUstawienJkBmsToolOutput = z.object({
  status: z.enum(STATUSY),
  autor: z.string(),
  zrodlo: z.string(),
  liczbaOgniw: z.number().nullable(),
  pojemnoscAh: z.number().nullable(),
  parametry: z.array(
    z.object({
      nazwaJk: z.string(),
      wartosc: z.number(),
      alternatywa: z.number().nullable(),
      pakietV: z.number().nullable(),
      cRate: z.number().nullable(),
      zgodnoscZeZrodlem: z.enum(["zgodne", "poza-zakresem", "brak-odniesienia", "do-potwierdzenia"]),
    }),
  ),
  ovpPakietV: z.number().nullable(),
  uvpPakietV: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ZestawyUstawienJkBmsToolOutputT = z.infer<typeof ZestawyUstawienJkBmsToolOutput>

export const zestawyUstawienJkBmsTool: AiToolDefinition<ZestawyUstawienJkBmsToolInputT, ZestawyUstawienJkBmsToolOutputT> = {
  name: "pokaz_zestaw_ustawien_jk_bms",
  description:
    "Pokazuje zestaw ustawień JK BMS opublikowany przez autora (Moduł 4): wartości parametrów 1:1, napięcia przeliczone " +
    "na cały pakiet (napięcie ogniwa × liczba ogniw), prąd ciągły w C, zgodność z zakresami ze źródła aplikacji " +
    "(OVP, UVP, prąd ładowania, start balansu) oraz spójność progów i histerezę temperatury. Parametry o niepotwierdzonym " +
    "znaczeniu są oznaczone i nie są porównywane. To dane autora, nie rekomendacja aplikacji. Użyj, gdy user pyta, " +
    "jakie ustawienia JK BMS stosuje dany autor, co oznaczają jego progi dla całego pakietu albo czy skopiowane ustawienia są spójne.",
  inputSchema: ZestawyUstawienJkBmsToolInput,
  outputSchema: ZestawyUstawienJkBmsToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/zestawy-ustawien-jk-bms",
  handler: async (input) => {
    const wynik = calculateZestawyUstawienJkBms(input)
    const w = wynik.value
    return {
      status: wynik.status,
      autor: w.autor,
      zrodlo: w.zrodlo,
      liczbaOgniw: w.liczbaOgniw,
      pojemnoscAh: w.pojemnoscAh,
      parametry: w.wiersze.map((r) => ({
        nazwaJk: r.nazwaJk,
        wartosc: r.wartosc,
        alternatywa: r.alternatywa,
        pakietV: r.pakietV,
        cRate: r.cRate,
        zgodnoscZeZrodlem: r.zgodnosc,
      })),
      ovpPakietV: w.pochodne?.ovpPakietV ?? null,
      uvpPakietV: w.pochodne?.uvpPakietV ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
