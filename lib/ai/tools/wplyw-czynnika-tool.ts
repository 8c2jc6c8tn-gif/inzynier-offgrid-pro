/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2D — scalony silnik „wpływ czynnika X na dobór mocy/COP” (dawne 5.69,
 * 5.73–5.100). `operationType: 'read'`. Każda liczba pochodzi od usera albo z jego ekranów Części 1 (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { t } from "@/lib/i18n/t"
import { calculateWplywCzynnika, paramsDoWyswietlenia } from "@/lib/core/modules/ogrzewanie/wplyw-czynnika/calculator"
import { CZYNNIKI, POLA_CZYNNIKA } from "@/lib/core/modules/ogrzewanie/wplyw-czynnika/constants"
import type { Czynnik, KluczPola } from "@/lib/core/modules/ogrzewanie/wplyw-czynnika/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const KLUCZE = [...new Set(Object.values(POLA_CZYNNIKA).flatMap((pola) => pola.map((p) => p.klucz)))] as [KluczPola, ...KluczPola[]]

/** Field list per factor, so the model knows what to ask the user for. */
const OPIS_POL = CZYNNIKI.map(
  (c) => `${c}: ${POLA_CZYNNIKA[c].map((p) => (p.wymagane ? p.klucz : `${p.klucz}?`)).join(", ")}`,
).join("; ")

export const WplywCzynnikaToolInput = z.object({
  czynnik: z.enum(CZYNNIKI as [Czynnik, ...Czynnik[]]).describe("Czynnik do policzenia"),
  pola: z
    .partialRecord(z.enum(KLUCZE), z.number())
    .describe(`Wartości pól wybranego czynnika (? = opcjonalne). ${OPIS_POL}`),
})
export type WplywCzynnikaToolInputT = z.infer<typeof WplywCzynnikaToolInput>

export const WplywCzynnikaToolOutput = z.object({
  status: z.enum(STATUSY),
  wynik: z.string().nullable(),
  szczegoly: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WplywCzynnikaToolOutputT = z.infer<typeof WplywCzynnikaToolOutput>

export const wplywCzynnikaTool: AiToolDefinition<WplywCzynnikaToolInputT, WplywCzynnikaToolOutputT> = {
  name: "policz_wplyw_czynnika_na_pompe_ciepla",
  description:
    "Wpływ jednego czynnika na pompę ciepła: okna, docieplenie dachu lub podłogi, mostki, szczelność, wentylacja z " +
    "odzyskiem, wysokość pomieszczeń, izolacja rur, zyski słoneczne i bytowe, temperatura zasilania/źródła/powrotu " +
    "(COP), defrost w sezonie, tryb cichy i ograniczenie mocy, przepływ obiegu, głębokość i liczba odwiertów, bufor " +
    "a starty sprężarki. Liczy zmianę mocy, prądu albo startów i sprawdza, czy pompa dalej wystarcza. Użyj, gdy user " +
    "pyta, o ile mniejszą pompę kupi po wymianie okien lub dociepleniu, ile zaoszczędzi na niższej temperaturze " +
    "zasilania, ile startów sprężarki zabierze bufor albo czy ograniczenie mocy przeciąży falownik.",
  inputSchema: WplywCzynnikaToolInput,
  outputSchema: WplywCzynnikaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/wplyw-czynnika",
  handler: async (input) => {
    const wynik = calculateWplywCzynnika({ czynnik: input.czynnik, pola: input.pola })
    const tekst = (w: { klucz: string; params: Record<string, number> }) => t("pl", w.klucz, paramsDoWyswietlenia(w.params))
    return {
      status: wynik.status,
      wynik: wynik.value.glowny ? tekst(wynik.value.glowny) : null,
      szczegoly: wynik.value.wiersze.map(tekst),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
