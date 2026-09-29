/**
 * Narzędzie AI (9.3) dla M14 — D10/F10 „Koszt powrotu do sieci” (ryzyko R1). `operationType: 'read'`.
 * Echo silnika `siec/koszt-powrotu`: stawkę opłaty przyłączeniowej podaje user z taryfy swojego OSD —
 * aplikacja jej nie ma i nie zgaduje (przykład 51,49/36,12 zł/kW z opracowania §5.3 to 🔎B, nie do kodu).
 */
import { z } from "zod"
import { calculateKosztPowrotu } from "@/lib/core/modules/siec/koszt-powrotu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KosztPowrotuToolInput = z.object({
  stawkaZlKw: z.number().nullable().describe("Stawka opłaty przyłączeniowej OSD [zł/kW netto] z taryfy usera; null gdy nie zna — nie zgaduj"),
  mocPrzylaczeniowaKw: z.number().describe("Moc przyłączeniowa [kW] z umowy albo warunków przyłączenia"),
  odlegloscStandardowa: z
    .boolean()
    .nullable()
    .describe("Czy odległość od sieci mieści się w standardowej odległości z taryfy OSD; false = wycena indywidualna OSD"),
})
export type KosztPowrotuToolInputT = z.infer<typeof KosztPowrotuToolInput>

export const KosztPowrotuToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  kosztNettoZl: z.number().nullable(),
  wycenaIndywidualna: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KosztPowrotuToolOutputT = z.infer<typeof KosztPowrotuToolOutput>

export const kosztPowrotuTool: AiToolDefinition<KosztPowrotuToolInputT, KosztPowrotuToolOutputT> = {
  name: "oszacuj_koszt_powrotu_do_sieci",
  description:
    "Szacuje koszt powrotu do sieci po pełnym odłączeniu (M14, D10/F10, ryzyko R1): stawka opłaty przyłączeniowej OSD " +
    "[zł/kW] × moc przyłączeniowa, grupy IV–VI, odległość standardowa. Powyżej standardowej odległości — tylko wzór i " +
    "„wycena indywidualna OSD”. Czas powrotu opisowo (miesiące), bez liczby. Stawkę podaje user — nie zgaduj.",
  inputSchema: KosztPowrotuToolInput,
  outputSchema: KosztPowrotuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/koszt-powrotu",
  handler: async (input) => {
    const wynik = calculateKosztPowrotu(input)
    return {
      status: wynik.status,
      kosztNettoZl: wynik.value.kosztNettoZl,
      wycenaIndywidualna: wynik.value.wycenaIndywidualna,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
