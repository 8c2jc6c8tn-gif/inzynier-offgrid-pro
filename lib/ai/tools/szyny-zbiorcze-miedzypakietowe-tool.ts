/**
 * Narzędzie AI (9.3) dla Ekranu 25, Moduł 4 "Magazyn energii / baterie" — "Szyny zbiorcze i
 * połączenia międzypakietowe". `operationType: 'read'`. Model ograniczony do topologii "gwiazda"
 * (N niezależnych gałęzi do wspólnego węzła) — nie modeluje kaskady ani asymetrii wzdłuż jednej
 * szyny. Prąd całkowity, materiał i wymiary gałęzi MUSZĄ pochodzić od usera z projektu instalacji.
 */
import { z } from "zod"
import { calculateSzynyZbiorczeMiedzypakietowe } from "@/lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Galaz = z.object({
  id: z.string(),
  dlugoscM: z.number().describe("Długość odcinka od gałęzi do wspólnej szyny/węzła [m]"),
  przekrojMm2: z.number().describe("Przekrój przewodu tej gałęzi [mm²]"),
})

export const SzynyZbiorczeMiedzypakietoweToolInput = z.object({
  pradCalkowityA: z.number().describe("Całkowity prąd rozpływający się między gałęziami [A] — od usera"),
  material: z.enum(["Cu", "Al"]).describe("Materiał przewodu"),
  galezie: z.array(Galaz).min(1).describe("Gałęzie topologii gwiazdy — jedna pozycja na ogniwo/pakiet"),
})
export type SzynyZbiorczeMiedzypakietoweToolInputT = z.infer<typeof SzynyZbiorczeMiedzypakietoweToolInput>

const GalazWynik = z.object({
  id: z.string(),
  rezystancjaOhm: z.number(),
  pradA: z.number(),
  udzialPct: z.number(),
})

export const SzynyZbiorczeMiedzypakietoweToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  galezie: z.array(GalazWynik),
  maxOdchylenieOdSredniejPct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SzynyZbiorczeMiedzypakietoweToolOutputT = z.infer<typeof SzynyZbiorczeMiedzypakietoweToolOutput>

export const szynyZbiorczeMiedzypakietoweTool: AiToolDefinition<
  SzynyZbiorczeMiedzypakietoweToolInputT,
  SzynyZbiorczeMiedzypakietoweToolOutputT
> = {
  name: "policz_rozplyw_pradu_szyny_zbiorczej",
  description:
    "Liczy rozpływ prądu między gałęziami połączonymi w topologii gwiazdy do wspólnej szyny zbiorczej (prawo " +
    "Ohma, reguła podziału prądu) — rezystancję, prąd i udział procentowy każdej gałęzi oraz maksymalne " +
    "odchylenie od średniej (Moduł 4, Ekran 25). Nie modeluje topologii kaskadowej ani asymetrii punktu " +
    "zasilania wzdłuż jednej szyny. Prąd całkowity, materiał i wymiary gałęzi MUSZĄ pochodzić z projektu " +
    "instalacji usera — nie zgaduj. Użyj, gdy user pyta o rozpływ prądu między połączeniami międzypakietowymi.",
  inputSchema: SzynyZbiorczeMiedzypakietoweToolInput,
  outputSchema: SzynyZbiorczeMiedzypakietoweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/szyny-zbiorcze-miedzypakietowe",
  handler: async (input) => {
    const wynik = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: input.pradCalkowityA,
      material: input.material,
      galezie: input.galezie,
    })
    return {
      status: wynik.status,
      galezie: wynik.value.galezie,
      maxOdchylenieOdSredniejPct: wynik.value.maxOdchylenieOdSredniejPct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
