/**
 * Narzędzie AI (9.3) — Wampiry energetyczne, podzakładka Rekomendacje sprzętowe (dawne 1.32 + 1.33 +
 * 1.39 + 1.44). `operationType: 'read'`. Echo silnika `zapotrzebowanie/wampiry-energetyczne/
 * rekomendacje-sprzetowe`: okres zwrotu metod odłączania + dobór metody per kategoria urządzenia.
 * Koszt zakupu i roczną oszczędność podaje user — źródło nie daje norm cenowych, model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import {
  calculatePorownanieMetod,
  wybierzMetodeDlaKategorii,
} from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/calculator"
import { METODY_ODLACZANIA } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WampiryRekomendacjeToolInput = z.object({
  metody: z
    .array(
      z.object({
        id: z
          .enum(["wylacznik-reczny", "listwa-z-wylacznikiem", "gniazdo-wifi", "przekaznik-zigbee"])
          .describe("Metoda odłączania standby"),
        kosztZakupuZl: z.number().describe("Koszt zakupu/montażu [zł] — od usera, nie zgaduj"),
        rocznaOszczednoscZl: z.number().describe("Roczna oszczędność z eliminacji standby tą metodą [zł] — od usera"),
      }),
    )
    .describe("Metody do porównania okresu zwrotu; pusta lista = tylko dobór metody dla kategorii"),
  kategoria: z
    .enum(["tv-konsola", "router", "ladowarki", "agd-inne"])
    .nullable()
    .describe("Kategoria urządzenia, dla której dobrać metodę odłączania; null = bez doboru"),
})
export type WampiryRekomendacjeToolInputT = z.infer<typeof WampiryRekomendacjeToolInput>

export const WampiryRekomendacjeToolOutput = z.object({
  status: z.enum(STATUSY),
  metody: z.array(
    z.object({
      id: z.string(),
      nazwa: z.string(),
      poborWlasny: z.string(),
      kosztZakupuZl: z.number(),
      rocznaOszczednoscZl: z.number(),
      okresZwrotuMiesiecy: z.number().nullable(),
    }),
  ),
  rekomendowanaMetoda: z.string().nullable(),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WampiryRekomendacjeToolOutputT = z.infer<typeof WampiryRekomendacjeToolOutput>

export const wampiryRekomendacjeTool: AiToolDefinition<WampiryRekomendacjeToolInputT, WampiryRekomendacjeToolOutputT> =
  {
    name: "porownaj_metody_odlaczania_standby",
    description:
      "Porównuje metody odłączania standby (wyłącznik ręczny, listwa z wyłącznikiem, gniazdo Wi-Fi, przekaźnik " +
      "Zigbee): okres zwrotu = koszt / roczna oszczędność × 12 miesięcy, plus pobór własny metody; opcjonalnie " +
      "dobiera metodę dla kategorii urządzenia (TV/konsola, router, ładowarki, AGD) — moduł Wampiry energetyczne, " +
      "Rekomendacje. Ceny i oszczędności podaje user. Użyj, gdy user pyta, czym najlepiej odłączać urządzenia " +
      "w czuwaniu albo po ilu miesiącach zwróci się listwa, gniazdo smart lub przekaźnik.",
    inputSchema: WampiryRekomendacjeToolInput,
    outputSchema: WampiryRekomendacjeToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe",
    handler: async (input) => {
      const wynik = calculatePorownanieMetod({ metody: input.metody })
      const rekomendowanaMetoda = input.kategoria ? wybierzMetodeDlaKategorii({ kategoria: input.kategoria }).metoda : null
      return {
        // Method choice alone (no costs) is a complete answer, not INCOMPLETE.
        status: wynik.status === "INCOMPLETE" && rekomendowanaMetoda !== null ? "VALID" : wynik.status,
        metody: wynik.value.metody.map((m) => {
          const def = METODY_ODLACZANIA.find((d) => d.id === m.id)
          return { ...m, nazwa: def?.label ?? m.id, poborWlasny: def?.poborWlasnyOpis ?? "" }
        }),
        rekomendowanaMetoda,
        wzor: wynik.formula,
        ostrzezenia: tekstyOstrzezen(wynik.warnings),
        zalozenia: tekstyZalozen(wynik.assumptions),
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
