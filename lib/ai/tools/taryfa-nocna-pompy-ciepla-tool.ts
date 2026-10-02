/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2C — pompa ciepła w taryfie nocnej (dawne 5.59). `operationType: 'read'`.
 * Ceny prądu, długość strefy nocnej, COP i bufor pochodzą od usera (Dyrektywa #1) — narzędzie nie zna żadnej taryfy.
 */
import { z } from "zod"
import { calculateTaryfaNocnaPompyCiepla } from "@/lib/core/modules/ogrzewanie/taryfa-nocna-pompy-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TaryfaNocnaPompyCieplaToolInput = z.object({
  cieploDobaKwh: z.number().describe("Ciepło potrzebne domowi na dobę [kWh ciepła]; 0 = nie podano"),
  godzinyNocH: z.number().describe("Długość strefy nocnej (tańszej) na dobę [h] z taryfy usera; 0 = nie podano"),
  cenaDzienZlKwh: z.number().describe("Cena 1 kWh prądu w strefie dziennej [zł/kWh] podana przez usera; 0 = nie podano"),
  cenaNocZlKwh: z.number().describe("Cena 1 kWh w strefie nocnej [zł/kWh]; przy agregacie koszt 1 kWh z agregatu; 0 = nie podano"),
  copDzien: z.number().describe("COP pompy ciepła w dzień; 0 = nie podano"),
  copNoc: z.number().describe("COP pompy w nocy; 0 = taki sam jak w dzień"),
  pojemnoscBuforaL: z.number().describe("Pojemność bufora ładowanego w nocy [l]; 0 = brak bufora"),
  deltaTBuforaK: z.number().describe("Użyteczna różnica temperatur bufora [K]; 0 = nie podano"),
  zasilanieNocy: z.enum(["siec", "agregat", "bateria"]).describe("Skąd jest energia w nocy: sieć (taryfa nocna), agregat albo bateria off-grid"),
})
export type TaryfaNocnaPompyCieplaToolInputT = z.infer<typeof TaryfaNocnaPompyCieplaToolInput>

export const TaryfaNocnaPompyCieplaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pojemnoscBuforaKwh: z.number(),
  przesunieteKwh: z.number(),
  kosztBezPrzesuniecaZl: z.number(),
  kosztZPrzesunieciemZl: z.number(),
  oszczednoscDobaZl: z.number(),
  oszczednoscPct: z.number(),
  pradNocKwh: z.number(),
  mocNocSredniaKw: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TaryfaNocnaPompyCieplaToolOutputT = z.infer<typeof TaryfaNocnaPompyCieplaToolOutput>

export const taryfaNocnaPompyCieplaTool: AiToolDefinition<TaryfaNocnaPompyCieplaToolInputT, TaryfaNocnaPompyCieplaToolOutputT> = {
  name: "policz_pompe_ciepla_w_taryfie_nocnej",
  description:
    "Czy opłaca się ładować bufor pompą ciepła w nocy (tańsza strefa taryfy, agregat) i oddawać ciepło w dzień: ile ciepła " +
    "przesunie bufor, koszt prądu na dobę bez przesunięcia i z nim, oszczędność w zł i %, oraz ile prądu i jaką średnią " +
    "moc pompa pobierze w nocy. Ceny, godziny strefy i COP podaje user. Użyj, gdy user ma przyłącze do sieci z taryfą " +
    "nocną (dom hybrydowy) albo agregat i pyta, czy grzać pompą w nocy, czy taryfa G12 się opłaca przy pompie ciepła " +
    "albo czy nocna praca pompy z baterii off-grid jest bezpieczna dla jej rozładowania.",
  inputSchema: TaryfaNocnaPompyCieplaToolInput,
  outputSchema: TaryfaNocnaPompyCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/taryfa-nocna-pompy-ciepla",
  handler: async (input) => {
    const wynik = calculateTaryfaNocnaPompyCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
