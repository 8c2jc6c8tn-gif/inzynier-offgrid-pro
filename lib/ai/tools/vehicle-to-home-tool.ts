/**
 * Narzędzie AI (9.3) dla Ekranu 19, Moduł 4 "Magazyn energii / baterie" — "Vehicle-to-Home
 * (V2H)". `operationType: 'read'`. Wsparcie V2H, pojemność baterii EV, rezerwa na dojazd,
 * sprawność efektywna, koszt wymiany i liczba cykli MUSZĄ pochodzić od usera z danych pojazdu.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateVehicleToHome } from "@/lib/core/modules/baterie/vehicle-to-home/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const VehicleToHomeToolInput = z.object({
  wspieraV2h: z.boolean().describe("Czy falownik i auto wspierają V2H (nie tylko V2L) — tylko od usera"),
  pojemnoscBaterEvKwh: z.number().describe("Pojemność baterii trakcyjnej EV [kWh]"),
  rezerwaNaDojazdKwh: z.number().describe("Rezerwa zostawiana na dojazd (nieoddawana do domu) [kWh] — od usera (0 to legalna wartość)"),
  sprawnoscEfektywnaPct: z.number().describe("Łączna sprawność efektywna (degradacja + straty konwersji) [%] — od usera"),
  kosztWymianyBateriiZl: z.number().describe("Koszt wymiany baterii trakcyjnej [zł] — proxy kosztu zużycia, z oferty"),
  liczbaCykli: z.number().describe("Liczba cykli życia baterii trakcyjnej"),
})
export type VehicleToHomeToolInputT = z.infer<typeof VehicleToHomeToolInput>

export const VehicleToHomeToolOutput = z.object({
  status: z.enum(STATUSY),
  pojemnoscRealnaKwh: z.number(),
  kosztZaKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type VehicleToHomeToolOutputT = z.infer<typeof VehicleToHomeToolOutput>

export const vehicleToHomeTool: AiToolDefinition<VehicleToHomeToolInputT, VehicleToHomeToolOutputT> = {
  name: "policz_vehicle_to_home",
  description:
    "Liczy realną pojemność energetyczną dostępną z Vehicle-to-Home (pojemność EV minus rezerwa na dojazd, " +
    "razy sprawność efektywna) i koszt za kWh z tytułu zużycia baterii trakcyjnej (Moduł 4, Ekran 19). " +
    "Wsparcie V2H, pojemność, rezerwa, sprawność, koszt wymiany i liczba cykli MUSZĄ pochodzić od usera z " +
    "danych pojazdu — nie zgaduj. Użyj, gdy user pyta o opłacalność/pojemność V2H swojego auta.",
  inputSchema: VehicleToHomeToolInput,
  outputSchema: VehicleToHomeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/vehicle-to-home",
  handler: async (input) => {
    const wynik = calculateVehicleToHome({
      wspieraV2h: input.wspieraV2h,
      pojemnoscBaterEvKwh: input.pojemnoscBaterEvKwh,
      rezerwaNaDojazdKwh: input.rezerwaNaDojazdKwh,
      sprawnoscEfektywnaPct: input.sprawnoscEfektywnaPct,
      kosztWymianyBateriiZl: input.kosztWymianyBateriiZl,
      liczbaCykli: input.liczbaCykli,
    })
    return {
      status: wynik.status,
      pojemnoscRealnaKwh: wynik.value.pojemnoscRealnaKwh,
      kosztZaKwh: wynik.value.kosztZaKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
