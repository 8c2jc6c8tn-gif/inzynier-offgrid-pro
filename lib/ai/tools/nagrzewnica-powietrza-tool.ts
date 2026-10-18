/**
 * Narzędzie AI (9.3) dla ekranu Modułu 6 "Nagrzewnica powietrza (typu webasto) vs ogrzewanie prądem" (D28 +
 * decyzja właściciela 02.10.2026). `operationType: 'read'`. Dane nagrzewnicy (moc, zużycie, pobór prądu, rozruch)
 * MUSZĄ pochodzić od usera z karty katalogowej (Dyrektywa #1) — brak pola = 0, nigdy wartość zgadnięta przez model.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateNagrzewnicaPowietrza } from "@/lib/core/modules/ogrzewanie/nagrzewnica-powietrza/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const NagrzewnicaPowietrzaToolInput = z.object({
  mocCieplnaKw: z.number().describe("Moc cieplna nagrzewnicy na wybranym ustawieniu [kW] — z karty katalogowej usera"),
  zuzyciePaliwaLH: z.number().describe("Zużycie paliwa przy tej mocy [l/h] — z karty katalogowej usera"),
  cenaPaliwaZlL: z.number().describe("Cena paliwa [zł/l]"),
  poborPraduW: z.number().describe("Własny pobór prądu w pracy [W] (wentylator, pompka, świeca); 0 = nie liczony"),
  energiaRozruchuWh: z.number().describe("Energia jednego rozruchu (świeca żarowa) [Wh]; 0 = nie liczona"),
  rozruchyNaDobe: z.number().describe("Liczba rozruchów na dobę; 0 = nie liczone"),
  cenaPraduZlKwh: z.number().describe("Koszt 1 kWh prądu zimą [zł/kWh]; 0 = brak porównania z ogrzewaniem elektrycznym"),
  copElektryczne: z.number().describe("COP ogrzewania elektrycznego; 0 = grzanie oporowe (COP 1)"),
  zapotrzebowanieCieplaDobaKwh: z.number().describe("Ciepło potrzebne na dobę [kWh]; 0 = tylko wartości na 1 kWh ciepła"),
  dniOgrzewania: z.number().describe("Liczba dni ogrzewania (suma sezonu); 0 = bez sumy"),
  pojemnoscBateriiKwh: z.number().describe("Użyteczna pojemność baterii [kWh]; 0 = bez procentów baterii"),
})
export type NagrzewnicaPowietrzaToolInputT = z.infer<typeof NagrzewnicaPowietrzaToolInput>

export const NagrzewnicaPowietrzaToolOutput = z.object({
  status: z.enum(STATUSY),
  paliwoNaKwhCieplaL: z.number().nullable(),
  kosztPaliwaNaKwhCieplaZl: z.number().nullable(),
  pradPomocniczyNaKwhCieplaKwh: z.number().nullable(),
  kosztCieplaNagrzewnicaZlKwh: z.number().nullable(),
  kosztCieplaElektrycznegoZlKwh: z.number().nullable(),
  taniej: z.enum(["nagrzewnica", "elektryczne", "rowno"]).nullable(),
  cenaPraduRownowagiZlKwh: z.number().nullable(),
  doba: z
    .object({
      godzinyPracy: z.number(),
      paliwoL: z.number(),
      kosztPaliwaZl: z.number(),
      energiaPomocniczaWh: z.number(),
      kosztNagrzewnicaZl: z.number().nullable(),
      energiaElektrycznaKwh: z.number(),
      kosztElektrycznieZl: z.number().nullable(),
      procentBateriiNagrzewnica: z.number().nullable(),
      procentBateriiElektrycznie: z.number().nullable(),
    })
    .nullable(),
  sezon: z
    .object({
      dni: z.number(),
      paliwoL: z.number(),
      kosztNagrzewnicaZl: z.number().nullable(),
      kosztElektrycznieZl: z.number().nullable(),
      energiaPomocniczaKwh: z.number(),
    })
    .nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type NagrzewnicaPowietrzaToolOutputT = z.infer<typeof NagrzewnicaPowietrzaToolOutput>

export const nagrzewnicaPowietrzaTool: AiToolDefinition<NagrzewnicaPowietrzaToolInputT, NagrzewnicaPowietrzaToolOutputT> = {
  name: "porownaj_nagrzewnice_powietrza_z_pradem",
  description:
    "Koszt 1 kWh ciepła z nagrzewnicy powietrza na paliwo (typu webasto) razem z jej własnym, małym poborem prądu " +
    "(wentylator, pompka, świeca, rozruchy) w porównaniu z ogrzewaniem prądem (grzałka COP 1 albo pompa ciepła), cena " +
    "prądu równowagi, a dla ciepła na dobę: godziny pracy, litry paliwa, prąd własny i jaki procent baterii zabiera " +
    "nagrzewnica oraz ogrzewanie elektryczne. Ostrzega o spalinach/CO i montażu poza pojazdem (D28). Wszystkie dane " +
    "urządzenia pochodzą od usera z karty katalogowej. " +
    "Użyj, gdy user pyta, czy dogrzewanie webasto albo nagrzewnicą paliwową wyjdzie taniej niż prądem, ile paliwa i " +
    "prądu z baterii bierze nagrzewnica na dobę, od jakiej ceny prądu opłaca się nagrzewnica albo ile baterii zje " +
    "ogrzewanie elektryczne w porównaniu z nagrzewnicą.",
  inputSchema: NagrzewnicaPowietrzaToolInput,
  outputSchema: NagrzewnicaPowietrzaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/nagrzewnica-powietrza",
  handler: async (input) => {
    const wynik = calculateNagrzewnicaPowietrza(input)
    const v = wynik.value
    return {
      status: wynik.status,
      paliwoNaKwhCieplaL: v?.paliwoNaKwhCieplaL ?? null,
      kosztPaliwaNaKwhCieplaZl: v?.kosztPaliwaNaKwhCieplaZl ?? null,
      pradPomocniczyNaKwhCieplaKwh: v?.pradPomocniczyNaKwhCieplaKwh ?? null,
      kosztCieplaNagrzewnicaZlKwh: v?.kosztCieplaNagrzewnicaZlKwh ?? null,
      kosztCieplaElektrycznegoZlKwh: v?.kosztCieplaElektrycznegoZlKwh ?? null,
      taniej: v?.taniej ?? null,
      cenaPraduRownowagiZlKwh: v?.cenaPraduRownowagiZlKwh ?? null,
      doba: v?.doba ?? null,
      sezon: v?.sezon ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
