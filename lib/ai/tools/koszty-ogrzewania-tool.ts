/**
 * Narzędzie AI (9.3) dla ekranu Modułu 6 "Porównanie kosztów ogrzewania" (dawne 5.39 + D28).
 * `operationType: 'read'`. Parametry paliw tylko od usera — brak pola → źródło pominięte (INCOMPLETE
 * dla niego), nigdy wartość zgadnięta przez model. Okres bez podania → 10 lat ze źródła (jak w UI).
 */
import { z } from "zod"
import { calculateKosztyOgrzewania } from "@/lib/core/modules/ogrzewanie/koszty-ogrzewania/calculator"
import { LICZBA_LAT_ZRODLO } from "@/lib/core/modules/ogrzewanie/koszty-ogrzewania/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const RODZAJE = [
  "drewno",
  "wegiel",
  "pellet",
  "gaz",
  "olej",
  "inne-paliwo",
  "nagrzewnica-paliwowa",
  "kociol-elektryczny",
  "grzejniki-ir",
  "pompa-ciepla",
] as const

const Zrodlo = z.object({
  nazwa: z.string(),
  rodzaj: z.enum(RODZAJE).describe("nagrzewnica-paliwowa = typu webasto (dane z karty katalogowej)"),
  jednostka: z.string().optional().describe("Jednostka paliwa: kg, t, mp, m³, l"),
  cenaZl: z.number().optional().describe("zł za jednostkę paliwa albo zł/kWh prądu"),
  wartoscOpalowaKwh: z.number().optional().describe("kWh na jednostkę — paliwa; tylko jeśli user podał"),
  sprawnoscPct: z.number().optional().describe("Sprawność urządzenia % — paliwa; tylko jeśli user podał"),
  mocGrzewczaKw: z.number().optional().describe("Moc grzewcza kW — wymagana dla nagrzewnicy"),
  zuzyciePaliwaNaH: z.number().optional().describe("Zużycie paliwa na godzinę przy mocy grzewczej — nagrzewnica"),
  cop: z.number().optional().describe("COP — tylko pompa ciepła"),
  poborPraduW: z.number().optional().describe("Pobór prądu urządzenia paliwowego w pracy [W]"),
  kosztInwestycjiZl: z.number().optional().describe("0 gdy user już ma urządzenie"),
  kosztSerwisuRocznyZl: z.number().optional(),
})

export const KosztyOgrzewaniaToolInput = z.object({
  zapotrzebowanieSezonKwh: z.number().describe("Ciepło potrzebne w sezonie grzewczym [kWh]"),
  liczbaLat: z.number().optional().describe("Okres analizy; brak → 10 lat (źródło)"),
  zrodla: z.array(Zrodlo).min(1),
})
export type KosztyOgrzewaniaToolInputT = z.infer<typeof KosztyOgrzewaniaToolInput>

export const KosztyOgrzewaniaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ranking: z.array(
    z.object({
      nazwa: z.string(),
      kosztKwhCieplaZl: z.number(),
      iloscPaliwaSezon: z.number().nullable(),
      jednostka: z.string(),
      energiaElektrycznaSezonKwh: z.number().nullable(),
      kosztRocznyZSerwisemZl: z.number(),
      kosztCalkowityZl: z.number(),
      zwrotLat: z.number().nullable(),
    }),
  ),
  pominiete: z.array(z.string()).describe("Źródła bez kompletu danych"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KosztyOgrzewaniaToolOutputT = z.infer<typeof KosztyOgrzewaniaToolOutput>

export const kosztyOgrzewaniaTool: AiToolDefinition<KosztyOgrzewaniaToolInputT, KosztyOgrzewaniaToolOutputT> = {
  name: "porownaj_koszty_ogrzewania",
  description:
    "Porównuje źródła ciepła: drewno, węgiel, pellet, gaz, olej, nagrzewnica paliwowa typu webasto (z karty: moc kW, " +
    "zużycie l/h), kocioł elektryczny, promienniki IR, pompa ciepła. Liczy koszt 1 kWh ciepła, paliwo i prąd na sezon, " +
    "koszt całkowity w okresie (inwestycja + paliwo + serwis), zwrot względem najtańszego w zakupie. Wartości opałowe, " +
    "sprawności, ceny i COP podaje user — nie zgaduj ich; brak → źródło pominięte. Użyj, gdy user pyta, czym najtaniej grzać.",
  inputSchema: KosztyOgrzewaniaToolInput,
  outputSchema: KosztyOgrzewaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/koszty-ogrzewania",
  handler: async (input) => {
    const wynik = calculateKosztyOgrzewania({
      zapotrzebowanieSezonKwh: input.zapotrzebowanieSezonKwh,
      liczbaLat: input.liczbaLat ?? LICZBA_LAT_ZRODLO,
      zrodla: input.zrodla.map((z) => ({
        nazwa: z.nazwa,
        rodzaj: z.rodzaj,
        jednostka: z.jednostka ?? "",
        cenaZl: z.cenaZl ?? null,
        wartoscOpalowaKwh: z.wartoscOpalowaKwh ?? null,
        sprawnoscPct: z.sprawnoscPct ?? null,
        mocGrzewczaKw: z.mocGrzewczaKw ?? null,
        zuzyciePaliwaNaH: z.zuzyciePaliwaNaH ?? null,
        cop: z.cop ?? null,
        poborPraduW: z.poborPraduW ?? null,
        kosztInwestycjiZl: z.kosztInwestycjiZl ?? null,
        kosztSerwisuRocznyZl: z.kosztSerwisuRocznyZl ?? null,
      })),
    })
    const v = wynik.value
    return {
      status: wynik.status,
      ranking: (v?.ranking ?? []).map((r) => ({
        nazwa: r.nazwa,
        kosztKwhCieplaZl: r.kosztKwhCieplaZl,
        iloscPaliwaSezon: r.iloscPaliwaSezon,
        jednostka: r.jednostka,
        energiaElektrycznaSezonKwh: r.energiaElektrycznaSezonKwh,
        kosztRocznyZSerwisemZl: r.kosztRocznyZSerwisemZl,
        kosztCalkowityZl: r.kosztCalkowityZl,
        zwrotLat: r.zwrotLat,
      })),
      pominiete: (v?.niekompletne ?? []).map((i) => input.zrodla[i]!.nazwa),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
