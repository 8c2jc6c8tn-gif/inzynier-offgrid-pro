/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — krzywa grzewcza pompy ciepła (dawne 5.71), dokładka do Ekranu 5.
 * `operationType: 'read'`. Punkty krzywej ze sterownika i COP z karty — od usera; wpływ na COP z reguły źródła 5.69.
 */
import { z } from "zod"
import { calculateKrzywaGrzewcza } from "@/lib/core/modules/ogrzewanie/krzywa-grzewcza/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const temp = (opis: string) => z.number().nullable().describe(`${opis} [°C]; null = nie podano`)

export const KrzywaGrzewczaToolInput = z.object({
  tZewn1C: temp("Temperatura zewnętrzna pierwszego punktu krzywej"),
  tZewn2C: temp("Temperatura zewnętrzna drugiego punktu krzywej"),
  tZasil1C: temp("Obecna krzywa: temperatura zasilania w pierwszym punkcie"),
  tZasil2C: temp("Obecna krzywa: temperatura zasilania w drugim punkcie"),
  tZasilNowa1C: temp("Proponowana krzywa: zasilanie w pierwszym punkcie (opcjonalne)"),
  tZasilNowa2C: temp("Proponowana krzywa: zasilanie w drugim punkcie (opcjonalne)"),
  tOcenyC: temp("Temperatura zewnętrzna, przy której porównać krzywe"),
  copObecny: z.number().describe("COP przy obecnym zasilaniu w tej temperaturze (karta); 0 = nie podano"),
  cieploSezonKwh: z.number().describe("Ciepło w sezonie [kWh]; 0 = nie podano"),
})
export type KrzywaGrzewczaToolInputT = z.infer<typeof KrzywaGrzewczaToolInput>

export const KrzywaGrzewczaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  nachylenie: z.number(),
  zasilanieC: z.number(),
  nachylenieNowe: z.number().nullable(),
  zasilanieNoweC: z.number().nullable(),
  obnizenieK: z.number().nullable(),
  copNowyMin: z.number().nullable(),
  copNowyMax: z.number().nullable(),
  oszczednoscMinKwh: z.number().nullable(),
  oszczednoscMaxKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KrzywaGrzewczaToolOutputT = z.infer<typeof KrzywaGrzewczaToolOutput>

export const krzywaGrzewczaTool: AiToolDefinition<KrzywaGrzewczaToolInputT, KrzywaGrzewczaToolOutputT> = {
  name: "porownaj_krzywe_grzewcze_pompy",
  description:
    "Krzywa grzewcza jako prosta przez dwa punkty (temperatura zewnętrzna → zasilanie): nachylenie, zasilanie przy " +
    "wybranej temperaturze, a dla proponowanej krzywej obniżenie zasilania, widełki COP z reguły źródła 2–3%/°C i " +
    "oszczędność prądu w sezonie. Użyj, gdy user pyta o ustawienie krzywej grzewczej, nachylenie krzywej albo ile " +
    "zaoszczędzi obniżeniem krzywej o kilka stopni.",
  inputSchema: KrzywaGrzewczaToolInput,
  outputSchema: KrzywaGrzewczaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/krzywa-grzewcza",
  handler: async (input) => {
    const wynik = calculateKrzywaGrzewcza(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
