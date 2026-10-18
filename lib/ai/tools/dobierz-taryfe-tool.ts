/**
 * Narzędzie AI (9.3) dla M14 — D2 „Która taryfa G” / F2 „Porównywarka taryf C”. `operationType: 'read'`.
 * Echo silnika rachunku dla każdej grupy. Grupy bez stawek ✅ albo niedostępne dla mocy umownej są
 * wyłączone (✏️ K8), nie „gorsze”. Podział zużycia na strefy i ceny energii per grupa podaje user.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePorownanieTaryf } from "@/lib/core/modules/siec/porownanie-taryf/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"
import { SiecCenyStrefSchema, SiecGrupaSchema, SiecStrefyKwhSchema, SiecWspolneSchema } from "./siec-schematy"

export const DobierzTaryfeToolInput = SiecWspolneSchema.extend({
  warianty: z
    .array(z.object({ grupa: SiecGrupaSchema, zuzycieStrefKwh: SiecStrefyKwhSchema, cenaEnergiiZlKwh: SiecCenyStrefSchema }))
    .describe("Porównywane grupy — każda z podziałem tego samego zużycia na swoje strefy i cenami energii usera"),
})
export type DobierzTaryfeToolInputT = z.infer<typeof DobierzTaryfeToolInput>

export const DobierzTaryfeToolOutput = z.object({
  status: z.enum(STATUSY),
  najtanszaGrupa: z.string().nullable(),
  ranking: z.array(
    z.object({ grupa: z.string(), bruttoZl: z.number().nullable(), wylaczona: z.string().nullable() }),
  ),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DobierzTaryfeToolOutputT = z.infer<typeof DobierzTaryfeToolOutput>

export const dobierzTaryfeTool: AiToolDefinition<DobierzTaryfeToolInputT, DobierzTaryfeToolOutputT> = {
  name: "dobierz_taryfe",
  description:
    "Porównuje roczny koszt brutto w kilku grupach taryfowych (M14, D2 dom: G11/G12/G12w; F2 firma: C11–C22b) " +
    "i podaje najtańszą. Grupy niedostępne dla mocy umownej (C1x ≤ 40 kW, C2x > 40 kW) albo bez stawek 2026 w " +
    "danych są wyłączone, nie szacowane. Podział zużycia na strefy i ceny energii podaje user — nie zgaduj. Użyj, gdy user pyta, która grupa taryfowa będzie dla niego najtańsza.",
  inputSchema: DobierzTaryfeToolInput,
  outputSchema: DobierzTaryfeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/porownanie-taryf",
  handler: async (input) => {
    const wynik = calculatePorownanieTaryf({ ...input, zuzycieMiesieczneKwh: null })
    return {
      status: wynik.status,
      najtanszaGrupa: wynik.value.najtanszaGrupa,
      ranking: wynik.value.pozycje.map((p) => ({
        grupa: p.grupa,
        bruttoZl: p.rachunek?.bruttoZl ?? null,
        wylaczona: p.wylaczona,
      })),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
