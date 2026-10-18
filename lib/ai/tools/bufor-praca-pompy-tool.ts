/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — praca pompy ciepła z buforem i bez (dawne 5.28, 5.70), dokładka do
 * Ekranu 14. `operationType: 'read'`. Histereza, woda w instalacji, straty postojowe — od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBuforPracaPompy } from "@/lib/core/modules/ogrzewanie/bufor-praca-pompy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BuforPracaPompyToolInput = z.object({
  mocPompyKw: z.number().describe("Moc grzewcza pompy [kW]"),
  obciazenieKw: z.number().describe("Średnie zapotrzebowanie na ciepło w analizowanym okresie [kW]"),
  wodaInstalacjiL: z.number().describe("Woda w instalacji bez bufora [l]"),
  histerezaK: z.number().describe("Histereza sterownika [K]"),
  buforL: z.number().describe("Pojemność bufora [l]"),
  dTMagazynK: z.number().describe("O ile K można naładować bufor ponad najniższą użyteczną temperaturę [K]; 0 = nie podano"),
  stratyPostojoweW: z.number().describe("Straty postojowe bufora z karty [W]; 0 = nie podano"),
  dniPracy: z.number().describe("Dni pracy w sezonie; 0 = bez strat sezonowych"),
})
export type BuforPracaPompyToolInputT = z.infer<typeof BuforPracaPompyToolInput>

const Cykl = z.object({ pracaMin: z.number(), postojMin: z.number(), startyDoba: z.number() }).nullable()

export const BuforPracaPompyToolOutput = z.object({
  status: z.enum(STATUSY),
  bez: Cykl,
  z: Cykl,
  cieploMagazynKwh: z.number().nullable(),
  czasPokryciaH: z.number().nullable(),
  stratyDobaKwh: z.number().nullable(),
  stratySezonKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BuforPracaPompyToolOutputT = z.infer<typeof BuforPracaPompyToolOutput>

export const buforPracaPompyTool: AiToolDefinition<BuforPracaPompyToolInputT, BuforPracaPompyToolOutputT> = {
  name: "porownaj_prace_pompy_z_buforem_i_bez",
  description:
    "Praca pompy ciepła start/stop z buforem i bez: starty na dobę i długość cyklu (praca/postój), ciepło zmagazynowane " +
    "w buforze (np. z nadwyżki PV) i ile godzin pokryje dom, straty postojowe bufora na dobę i w sezonie. Użyj, gdy user " +
    "pyta, czy potrzebuje bufora, ile startów zaoszczędzi bufor, czy pompa taktuje albo ile kosztują straty dużego bufora.",
  inputSchema: BuforPracaPompyToolInput,
  outputSchema: BuforPracaPompyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/bufor-praca-pompy",
  handler: async (input) => {
    const wynik = calculateBuforPracaPompy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
