/**
 * Narzędzie AI (9.3) — Moduł 3, Ekran 24 „Czystość i śnieg na panelach” (dawne 2.40 + 2.44).
 * `operationType: 'read'`. Echo dwóch funkcji silnika `pv/czystosc-i-snieg`: pasmo samooczyszczania
 * wg kąta oraz rekomendacja mycia wg spadku produkcji i prognozy deszczu. Każda część opcjonalna.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import {
  CALCULATOR_VERSION,
  classifyKatSamooczyszczania,
  ocenHarmonogramCzyszczenia,
} from "@/lib/core/modules/pv/czystosc-i-snieg/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"
import { t } from "@/lib/i18n/t"

export const CzystoscISniegToolInput = z.object({
  katStopni: z.number().nullable().describe("Kąt nachylenia paneli [°]; null = bez oceny samooczyszczania"),
  spadekProdukcjiPct: z
    .number()
    .nullable()
    .describe("Zmierzony spadek produkcji względem oczekiwanej dla warunków [%]; null = bez oceny mycia"),
  deszczWCiaguKilkuDni: z
    .boolean()
    .nullable()
    .describe("Czy prognoza przewiduje deszcz w najbliższych dniach (wymagane razem ze spadkiem produkcji)"),
})
export type CzystoscISniegToolInputT = z.infer<typeof CzystoscISniegToolInput>

const STATUS = z.enum(STATUSY)

export const CzystoscISniegToolOutput = z.object({
  samooczyszczanie: z
    .object({ status: STATUS, pasmo: z.string(), opis: z.string(), ostrzezenia: z.array(z.string()) })
    .nullable(),
  mycie: z
    .object({
      status: STATUS,
      rekomendacjaMycia: z.boolean(),
      powod: z.string(),
      ostrzezenia: z.array(z.string()),
      zalozenia: z.array(z.string()),
    })
    .nullable(),
  uwagi: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type CzystoscISniegToolOutputT = z.infer<typeof CzystoscISniegToolOutput>

export const czystoscISniegTool: AiToolDefinition<CzystoscISniegToolInputT, CzystoscISniegToolOutputT> = {
  name: "ocen_czystosc_i_snieg_paneli",
  description:
    "Ocenia samooczyszczanie paneli wg kąta (<10° brud i woda zalegają, 15–30° deszcz spłukuje, >30° śnieg " +
    "i liście zsuwają się same; 10–15° — źródło nie klasyfikuje) oraz czy myć panele: rekomendacja przy spadku " +
    "produkcji >7,5% (środek przedziału źródła 5–10%), odroczona, gdy wkrótce pada deszcz (Moduł 3, Ekran 24). " +
    "Użyj, gdy user pyta, czy i kiedy myć panele, czy przy jego kącie deszcz je umyje albo czy śnieg sam zejdzie.",
  inputSchema: CzystoscISniegToolInput,
  outputSchema: CzystoscISniegToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/czystosc-i-snieg",
  handler: async (input) => {
    const uwagi: string[] = []

    let samooczyszczanie: CzystoscISniegToolOutputT["samooczyszczanie"] = null
    if (input.katStopni !== null) {
      const w = classifyKatSamooczyszczania({ katStopni: input.katStopni })
      samooczyszczanie = {
        status: w.status,
        pasmo: w.value.band,
        opis: w.value.opisKey ? t("pl", w.value.opisKey, w.value.opisParams) : "",
        ostrzezenia: tekstyOstrzezen(w.warnings),
      }
    }

    let mycie: CzystoscISniegToolOutputT["mycie"] = null
    if (input.spadekProdukcjiPct !== null && input.deszczWCiaguKilkuDni === null) {
      uwagi.push("Ocena mycia wymaga też informacji, czy w najbliższych dniach ma padać (deszczWCiaguKilkuDni).")
    } else if (input.spadekProdukcjiPct !== null && input.deszczWCiaguKilkuDni !== null) {
      const w = ocenHarmonogramCzyszczenia({
        spadekProdukcjiPct: input.spadekProdukcjiPct,
        deszczWCiaguKilkuDni: input.deszczWCiaguKilkuDni,
      })
      mycie = {
        status: w.status,
        rekomendacjaMycia: w.value.rekomendacjaMycia,
        powod: w.value.powodKey ? t("pl", w.value.powodKey, w.value.powodParams) : "",
        ostrzezenia: tekstyOstrzezen(w.warnings),
        zalozenia: tekstyZalozen(w.assumptions),
      }
    }

    if (samooczyszczanie === null && mycie === null && uwagi.length === 0) {
      uwagi.push("Podaj kąt nachylenia paneli albo spadek produkcji z informacją o deszczu.")
    }
    return { samooczyszczanie, mycie, uwagi, wersjaKalkulatora: CALCULATOR_VERSION }
  },
}
