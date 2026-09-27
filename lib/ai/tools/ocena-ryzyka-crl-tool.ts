/**
 * Narzędzie AI (9.3) dla Modułu 5, Ekran 2 — „Czy SPD jest wymagany” wg HD 60364-4-443 (443.4 + 443.5, CRL).
 * `operationType: 'read'`. Otoczenie, Ng/Td i długości linii tylko od usera — brak → INCOMPLETE, nigdy wartości
 * zgadnięte przez model (mapy wyładowań nie ma w aplikacji).
 */
import { z } from "zod"
import { calculateOcenaRyzykaCrl } from "@/lib/core/modules/okablowanie/ocena-ryzyka-crl/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OcenaRyzykaCrlToolInput = z.object({
  skutkiKrytyczne: z
    .boolean()
    .optional()
    .describe("true = przepięcie zagroziłoby życiu, usługom publicznym, działalności gospodarczej lub wielu osobom (443.4) — od usera"),
  srodowisko: z.enum(["wiejskie", "miejskie"]).optional().describe("Otoczenie wg Tablicy 443.1 — od usera"),
  gestoscWyladowanNg: z.number().optional().describe("Gęstość wyładowań Ng [1/(km²·rok)] z mapy — tylko od usera"),
  dniBurzoweTd: z.number().optional().describe("Dni burzowe w roku Td — tylko od usera, użyte gdy brak Ng"),
  napowietrznaNnKm: z.number().optional().describe("Długość linii napowietrznej nn zasilającej budynek [km]"),
  kablowaNnKm: z.number().optional().describe("Długość kabla ziemnego nn [km]"),
  napowietrznaSnKm: z.number().optional().describe("Długość linii napowietrznej SN [km]"),
  kablowaSnKm: z.number().optional().describe("Długość kabla ziemnego SN [km]"),
  dlugosciNiepelne: z.boolean().optional().describe("true = user nie zna wszystkich długości sieci"),
  odlegloscDoSpdWSieciKm: z.number().optional().describe("Odległość do pierwszego SPD w sieci [km], jeśli znana"),
})
export type OcenaRyzykaCrlToolInputT = z.infer<typeof OcenaRyzykaCrlToolInput>

export const OcenaRyzykaCrlToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  spdWymagany: z.boolean().nullable(),
  powod: z.enum(["skutki-krytyczne", "crl", "brak-linii"]).nullable(),
  crl: z.number().nullable(),
  lpKm: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OcenaRyzykaCrlToolOutputT = z.infer<typeof OcenaRyzykaCrlToolOutput>

export const ocenaRyzykaCrlTool: AiToolDefinition<OcenaRyzykaCrlToolInputT, OcenaRyzykaCrlToolOutputT> = {
  name: "ocen_wymog_spd_crl",
  description:
    "Czy ochrona przed przepięciami (SPD) jest wymagana wg HD 60364-4-443: 443.4 (skutki krytyczne → zawsze) albo ocena " +
    "ryzyka CRL = f_env/(L_P·N_g), L_P = 2L_PAL + L_PCL + 0,4L_PAH + 0,2L_PCH; CRL < 1000 → wymagana. Dotyczy linii " +
    "zasilających budynek (off-grid bez linii → brak wymogu z tej metody), nie strony DC paneli. Ng, otoczenie i długości " +
    "podaje user — nie zgaduj. Użyj, gdy user pyta, czy musi mieć SPD/ochronnik przepięć.",
  inputSchema: OcenaRyzykaCrlToolInput,
  outputSchema: OcenaRyzykaCrlToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/ocena-ryzyka-crl",
  handler: async (input) => {
    const wynik = calculateOcenaRyzykaCrl({
      skutkiKrytyczne: input.skutkiKrytyczne ?? false,
      srodowisko: input.srodowisko ?? null,
      gestoscWyladowanNg: input.gestoscWyladowanNg ?? null,
      dniBurzoweTd: input.dniBurzoweTd ?? null,
      napowietrznaNnKm: input.napowietrznaNnKm ?? 0,
      kablowaNnKm: input.kablowaNnKm ?? 0,
      napowietrznaSnKm: input.napowietrznaSnKm ?? 0,
      kablowaSnKm: input.kablowaSnKm ?? 0,
      dlugosciNiepelne: input.dlugosciNiepelne ?? false,
      odlegloscDoSpdWSieciKm: input.odlegloscDoSpdWSieciKm ?? null,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      spdWymagany: v?.spdWymagany ?? null,
      powod: v?.powod ?? null,
      crl: v?.crl ?? null,
      lpKm: v?.lpKm ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
