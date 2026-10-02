/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — dobór mocy pompy ciepła do budynku (dawne 5.27) i podział pompa /
 * dogrzewanie (dawne 5.67), dokładka do Ekranu 5. `operationType: 'read'`. Zapotrzebowanie z Ekranu 1, moc pompy
 * z tabeli karty — od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateDoborMocyPompy } from "@/lib/core/modules/ogrzewanie/dobor-mocy-pompy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborMocyPompyToolInput = z.object({
  zapotrzebowanieKw: z.number().describe("Obciążenie cieplne budynku przy temperaturze projektowej [kW] (Ekran 1)"),
  mocPompyProjKw: z.number().describe("Moc grzewcza pompy przy temperaturze projektowej z tabeli karty [kW]"),
  tProjC: z.number().nullable().describe("Temperatura projektowa zewnętrzna [°C]; null = nie podano"),
  tWewnC: z.number().nullable().describe("Temperatura w domu [°C]; null = nie podano (bez punktu biwalentnego)"),
  tDrugiC: z.number().nullable().describe("Drugi punkt karty: temperatura zewnętrzna [°C]; null = nie podano"),
  mocPompyDrugiKw: z.number().describe("Drugi punkt karty: moc grzewcza pompy [kW]; 0 = nie podano"),
  maDogrzew: z
    .boolean()
    .nullable()
    .optional()
    .describe("Czy dom ma zapasowe źródło ciepła (grzałka, kominek, kocioł): true = tak, false = nie, null = nie podano"),
})
export type DoborMocyPompyToolInputT = z.infer<typeof DoborMocyPompyToolInput>

export const DoborMocyPompyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zapasKw: z.number(),
  dogrzewanieKw: z.number(),
  pokryciePompaPct: z.number(),
  pokrycieDogrzewaniePct: z.number(),
  przewymiarowaniePct: z.number().nullable(),
  punktBiwalentnyC: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DoborMocyPompyToolOutputT = z.infer<typeof DoborMocyPompyToolOutput>

export const doborMocyPompyTool: AiToolDefinition<DoborMocyPompyToolInputT, DoborMocyPompyToolOutputT> = {
  name: "dobierz_moc_pompy_ciepla_do_budynku",
  description:
    "Czy pompa ciepła utrzyma dom w największy mróz: zapas albo brak mocy przy temperaturze projektowej, ile kW " +
    "dogrzewania (grzałka, kominek) potrzeba, jaki procent obciążenia pokrywa pompa, a jaki dogrzewanie, oraz punkt " +
    "biwalentny z dwóch punktów karty. Użyj, gdy user pyta, jaką moc pompy ciepła wybrać, czy jego pompa wystarczy przy " +
    "−20 °C, czy pompa jest przewymiarowana albo ile grzałki awaryjnej dołożyć. Brak mocy bez żadnego dogrzewu w domu to stop 🔴; z dogrzewem albo przy nieznanym — ostrzeżenie 🟡.",
  inputSchema: DoborMocyPompyToolInput,
  outputSchema: DoborMocyPompyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/dobor-mocy-pompy",
  handler: async (input) => {
    const wynik = calculateDoborMocyPompy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
