/**
 * Narzędzie AI (9.3) — Wampiry energetyczne, podzakładka Katalog urządzeń (dawne 1.24/1.29).
 * `operationType: 'read'`. Echo silnika `zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen`:
 * suma standby → kWh/dobę i kWh/rok. Pusta moc pozycji z katalogu = środek zakresu źródła
 * (`defaultPowerW`, ten sam punkt startowy co ekran — silnik oznacza go jako założenie).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateKatalogUrzadzen } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/calculator"
import { KATALOG_URZADZEN_STANDBY } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/constants"
import type { StandbyDeviceItem } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const ID_KATALOGU = KATALOG_URZADZEN_STANDBY.map((d) => d.id)

export const WampiryKatalogToolInput = z.object({
  urzadzenia: z
    .array(
      z.object({
        id: z
          .enum(["inne", ...ID_KATALOGU])
          .describe(`Pozycja katalogu (${ID_KATALOGU.join(", ")}) albo "inne" dla urządzenia spoza katalogu`),
        nazwa: z.string().describe("Nazwa urządzenia do raportu"),
        mocW: z
          .number()
          .nullable()
          .describe("Moc w trybie czuwania [W]; null = środek zakresu z katalogu (tylko dla pozycji katalogu, nie dla 'inne')"),
      }),
    )
    .describe("Urządzenia stale podłączone w trybie czuwania, które user chce zliczyć"),
})
export type WampiryKatalogToolInputT = z.infer<typeof WampiryKatalogToolInput>

export const WampiryKatalogToolOutput = z.object({
  status: z.enum(STATUSY),
  sumaW: z.number(),
  energiaDobowaKwh: z.number(),
  energiaRocznaKwh: z.number(),
  zakresyKatalogu: z.array(z.object({ nazwa: z.string(), minW: z.number(), maxW: z.number() })),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WampiryKatalogToolOutputT = z.infer<typeof WampiryKatalogToolOutput>

export const wampiryKatalogTool: AiToolDefinition<WampiryKatalogToolInputT, WampiryKatalogToolOutputT> = {
  name: "policz_standby_z_katalogu",
  description:
    "Sumuje pobór w trybie czuwania (standby) wybranych urządzeń i przelicza go na kWh/dobę (×24 h) i kWh/rok " +
    "(×365) — moduł Wampiry energetyczne, Katalog urządzeń. Bez podanej mocy pozycja katalogu dostaje środek " +
    "zakresu ze źródła (zwracany też zakres min–max); realny pomiar zawsze lepszy. Użyj, gdy user pyta, ile " +
    "energii zjadają urządzenia w czuwaniu (TV, router, dekoder, ładowarki…) albo ile to kWh na dobę lub rok.",
  inputSchema: WampiryKatalogToolInput,
  outputSchema: WampiryKatalogToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen",
  handler: async (input) => {
    const items: StandbyDeviceItem[] = input.urzadzenia.map((u, i) => {
      const def = KATALOG_URZADZEN_STANDBY.find((d) => d.id === u.id)
      return {
        id: def ? def.id : `inne-${i}`,
        label: u.nazwa || def?.label || `Urządzenie ${i + 1}`,
        // null for "inne" has no source value — 0 lets the engine reject it (WAMPIR-POZYCJA-NIEDODATNIA).
        powerW: u.mocW ?? def?.defaultPowerW ?? 0,
        selected: true,
      }
    })
    const wynik = calculateKatalogUrzadzen({ items })
    const zakresyKatalogu = KATALOG_URZADZEN_STANDBY.filter((d) => input.urzadzenia.some((u) => u.id === d.id)).map(
      (d) => ({ nazwa: d.label, minW: d.minPowerW, maxW: d.maxPowerW }),
    )
    return {
      status: wynik.status,
      ...wynik.value,
      zakresyKatalogu,
      wzor: wynik.formula,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
