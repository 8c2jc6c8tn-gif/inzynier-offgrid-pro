/**
 * Narzędzie AI (9.3) dla Ekranu 1, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "Awaryjne źródło ciepła"
 * (dawne 6.19). `operationType: 'read'`. Moc, moc do wody, sprawność i wartość opałowa — z karty urządzenia
 * i od dostawcy paliwa, podane przez usera; model ich nie zgaduje (null, gdy nieznane).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAwaryjneZrodloCiepla } from "@/lib/core/modules/bezpieczenstwo/awaryjne-zrodlo-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const liczbaLubNull = (opis: string) => z.number().nullable().describe(opis)

export const AwaryjneZrodloCieplaToolInput = z.object({
  typZrodla: z.enum(["kominek", "koza", "piec"]).nullable(),
  mocKw: liczbaLubNull("Nominalna moc cieplna z karty [kW]"),
  plaszczWodny: z.boolean().describe("Płaszcz wodny podłączony do bufora/C.O."),
  mocDoWodyKw: liczbaLubNull("Moc oddawana do wody [kW]; null gdy nieznana — nie zgaduj"),
  godzinyPaleniaNaDobe: liczbaLubNull("Czas palenia w dobie [h]"),
  zapotrzebowanieCieplaKwhDoba: liczbaLubNull("Dobowe zapotrzebowanie na ciepło w mroźny dzień [kWh] (z M6)"),
  sprawnoscProc: liczbaLubNull("Sprawność urządzenia [%] z karty; null gdy nieznana"),
  wartoscOpalowaKwhKg: liczbaLubNull("Wartość opałowa paliwa [kWh/kg] od dostawcy; null gdy nieznana — nie zgaduj"),
})
export type AwaryjneZrodloCieplaToolInputT = z.infer<typeof AwaryjneZrodloCieplaToolInput>

export const AwaryjneZrodloCieplaToolOutput = z.object({
  status: z.enum(STATUSY),
  cieploDobaKwh: z.number().nullable(),
  cieploDoInstalacjiKwh: z.number().nullable(),
  pokrycieProc: z.number().nullable(),
  paliwoKgDoba: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AwaryjneZrodloCieplaToolOutputT = z.infer<typeof AwaryjneZrodloCieplaToolOutput>

export const awaryjneZrodloCieplaTool: AiToolDefinition<AwaryjneZrodloCieplaToolInputT, AwaryjneZrodloCieplaToolOutputT> = {
  name: "policz_awaryjne_zrodlo_ciepla",
  description:
    "Liczy, ile ciepła na dobę daje kominek/koza/piec na drewno, jaką część dobowego zapotrzebowania domu pokryje przez " +
    "płaszcz wodny i ile paliwa (kg/dobę) zużyje przy podanej sprawności i wartości opałowej (Moduł 8, Ekran 1). Użyj, gdy user pyta, ile ciepła i opału da kominek/koza/piec na drewno jako zapas przy awarii ogrzewania elektrycznego.",
  inputSchema: AwaryjneZrodloCieplaToolInput,
  outputSchema: AwaryjneZrodloCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/awaryjne-zrodlo-ciepla",
  handler: async (input) => {
    const wynik = calculateAwaryjneZrodloCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
