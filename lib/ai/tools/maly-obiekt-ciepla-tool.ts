/**
 * Narzędzie AI (9.3) dla Modułu 6, tryb mikroinstalacji: "Bilans ciepła małego obiektu" (kamper, altana lub domek ROD, garaż).
 * `operationType: 'read'`. Wymiary, U, okna, temperatura, wymiana powietrza, COP i dane paliwa MUSZĄ pochodzić od usera —
 * aplikacja nie ma wartości domyślnych, model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMalyObiektCiepla } from "@/lib/core/modules/ogrzewanie/maly-obiekt-bilans-ciepla/calculator"
import { STREFY_KLIMATYCZNE } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MalyObiektCieplaToolInput = z.object({
  dlugoscM: z.number().describe("Długość obiektu [m]"),
  szerokoscM: z.number().describe("Szerokość obiektu [m]"),
  wysokoscM: z.number().describe("Wysokość ogrzewanego wnętrza [m]"),
  uScianWM2K: z.number().describe("U ścian [W/(m²·K)] — od usera"),
  uDachuWM2K: z.number().describe("U dachu [W/(m²·K)] — od usera"),
  uPodlogiWM2K: z.number().describe("U podłogi [W/(m²·K)] — od usera"),
  podlogaNadPowietrzem: z.boolean().describe("true = pod podłogą powietrze zewnętrzne (kamper, obiekt na nóżkach); false = grunt lub nieogrzewane pomieszczenie"),
  temperaturaPodPodlogaC: z.number().optional().describe("Temperatura pod podłogą [°C] — tylko gdy podlogaNadPowietrzem = false; od usera"),
  otworyM2: z.number().describe("Okna i drzwi razem [m²]; 0 = bez otworów"),
  uOtworowWM2K: z.number().describe("U okien i drzwi [W/(m²·K)] — od usera"),
  temperaturaWewnetrznaC: z.number().describe("Temperatura utrzymywana w środku [°C]"),
  strefaKlimatyczna: z.number().int().min(1).max(5).describe("Strefa klimatyczna 1–5 (wyznacza temperaturę obliczeniową na zewnątrz)"),
  wymianyPowietrzaNaH: z.number().describe("Wymiany powietrza [1/h] — od usera"),
  sprawnoscOdzyskuPct: z.number().optional().describe("Odzysk ciepła z wentylacji [%] — opcjonalnie"),
  cop: z.number().optional().describe("COP źródła elektrycznego (grzałka = 1) — razem z temperaturami miesięcy daje prąd na ogrzewanie"),
  paliwo: z
    .object({
      jednostka: z.string(),
      wartoscOpalowaKwh: z.number().describe("Wartość opałowa [kWh na jednostkę] — od usera, bez wartości domyślnej"),
      sprawnoscPct: z.number().describe("Sprawność [%] — z karty nagrzewnicy lub pieca"),
      zapas: z.number().describe("Zapas paliwa [jednostek]"),
    })
    .optional()
    .describe("Źródło na paliwo (np. nagrzewnica typu Webasto) — wtedy cop jest ignorowany; liczę, na ile dni starczy zapasu"),
  srednieTemperaturyMiesieczneC: z.array(z.number().nullable()).length(12).optional().describe("12 średnich temperatur miesięcznych [°C], styczeń pierwszy; null = pomiń miesiąc"),
  miesiaceUzytkowania: z.array(z.boolean()).length(12).optional().describe("12 znaczników: w których miesiącach obiekt jest używany (styczeń pierwszy) — prąd na ogrzewanie sumuję tylko w nich"),
})
export type MalyObiektCieplaToolInputT = z.infer<typeof MalyObiektCieplaToolInput>

export const MalyObiektCieplaToolOutput = z.object({
  status: z.enum(STATUSY),
  obciazenieW: z.number().nullable().describe("Moc grzania przy temperaturze obliczeniowej strefy [W]"),
  temperaturaObliczeniowaC: z.number().nullable(),
  strataPrzenikanieW: z.number().nullable(),
  strataWentylacjaW: z.number().nullable(),
  cieploDobaObliczeniowaKwh: z.number().nullable().describe("Ciepło na dobę w mrozie obliczeniowym [kWh]"),
  cieploSumaMiesiecyKwh: z.number().nullable().describe("Ciepło w roku ze średnich temperatur miesięcy [kWh]; null bez temperatur"),
  energiaElektrycznaUzytkowanieKwh: z.array(z.number()).nullable().describe("Prąd na ogrzewanie w kolejnych miesiącach [kWh] — poza miesiącami użytkowania 0; null bez COP, 12 temperatur lub miesięcy użytkowania"),
  rokUzytkowaniaKwh: z.number().nullable(),
  dniPaliwaPrzyMrozieObliczeniowym: z.number().nullable().describe("Na ile dni starczy zapasu paliwa przy mrozie obliczeniowym (dolna granica)"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MalyObiektCieplaToolOutputT = z.infer<typeof MalyObiektCieplaToolOutput>

export const malyObiektCieplaTool: AiToolDefinition<MalyObiektCieplaToolInputT, MalyObiektCieplaToolOutputT> = {
  name: "policz_bilans_ciepla_malego_obiektu",
  description:
    "Bilans ciepła małego obiektu — kampera, altany lub domku ROD, garażu (Moduł 6, tryb mikroinstalacji). Obiekt to prostopadłościan " +
    "(długość × szerokość × wysokość): ściany bez okien, płaski dach, podłoga i okna z własnymi U. Liczę straty przez przegrody i z wymienianym " +
    "powietrzem w mrozie obliczeniowym strefy (moc grzania, ciepło na dobę), ciepło miesięczne ze średnich temperatur i — z COP — prąd " +
    "na ogrzewanie tylko w miesiącach użytkowania; ze źródłem na paliwo (np. nagrzewnica typu Webasto) podaję, na ile dni starczy zapasu. " +
    "Bez mostków cieplnych i zysków słonecznych; wymiary, U, COP i dane paliwa podaje user — nie zgaduj. " +
    "Użyj, gdy user pyta, ile mocy lub prądu potrzebuje do ogrzania kampera, altany albo garażu zimą, ile paliwa wystarczy " +
    "albo jak ocieplenie obiektu zmienia zapotrzebowanie.",
  inputSchema: MalyObiektCieplaToolInput,
  outputSchema: MalyObiektCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/maly-obiekt-bilans-ciepla",
  handler: async (input) => {
    const wynik = calculateMalyObiektCiepla({
      dlugoscM: input.dlugoscM,
      szerokoscM: input.szerokoscM,
      wysokoscM: input.wysokoscM,
      uScianWM2K: input.uScianWM2K,
      uDachuWM2K: input.uDachuWM2K,
      uPodlogiWM2K: input.uPodlogiWM2K,
      podlogaNadPowietrzem: input.podlogaNadPowietrzem,
      temperaturaPodPodlogaC: input.temperaturaPodPodlogaC ?? null,
      otworyM2: input.otworyM2,
      uOtworowWM2K: input.uOtworowWM2K,
      temperaturaWewnetrznaC: input.temperaturaWewnetrznaC,
      strefaKlimatyczna: STREFY_KLIMATYCZNE.find((s) => s === input.strefaKlimatyczna) ?? null,
      wymianyPowietrzaNaH: input.wymianyPowietrzaNaH,
      sprawnoscOdzyskuPct: input.sprawnoscOdzyskuPct ?? null,
      cop: input.cop ?? null,
      paliwo: input.paliwo ?? null,
      srednieTemperaturyMiesieczneC: input.srednieTemperaturyMiesieczneC ?? Array(12).fill(null),
      miesiaceUzytkowania: input.miesiaceUzytkowania ?? [],
    })
    const v = wynik.value
    const o = v?.obciazenie ?? null
    return {
      status: wynik.status,
      obciazenieW: o?.obciazenieW ?? null,
      temperaturaObliczeniowaC: o?.temperaturaZewnetrznaC ?? null,
      strataPrzenikanieW: o?.strataPrzenikanieW ?? null,
      strataWentylacjaW: o?.strataWentylacjaW ?? null,
      cieploDobaObliczeniowaKwh: o?.cieploDobaObliczeniowaKwh ?? null,
      cieploSumaMiesiecyKwh: o?.cieploSumaMiesiecyKwh ?? null,
      energiaElektrycznaUzytkowanieKwh: v?.energiaElektrycznaUzytkowanieKwh ?? null,
      rokUzytkowaniaKwh: v?.rokUzytkowaniaKwh ?? null,
      dniPaliwaPrzyMrozieObliczeniowym: o?.paliwo?.dniPrzyTemperaturzeObliczeniowej ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
