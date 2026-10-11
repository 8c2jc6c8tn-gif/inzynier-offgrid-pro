/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 1 "Charakterystyka termiczna budynku" (dawne 5.1).
 * `operationType: 'read'`. Współczynniki U, powierzchnie, temperatury, kubatura i wymiany powietrza
 * tylko od usera — brak → INCOMPLETE, nigdy wartość zgadnięta przez model. U przegrody można podać wprost albo przez
 * warstwy (grubość + λ albo opór R, od usera/z karty produktu) z kierunkiem strumienia; λ materiałów model nie zgaduje.
 */
import { z } from "zod"
import { calculateObciazenieCieplne, uPrzegrody } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import type { StrefaKlimatyczna } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Warstwa = z.object({
  nazwa: z.string(),
  gruboscMm: z.number().optional().describe("Grubość warstwy [mm] — razem z lambdaWmK; od usera"),
  lambdaWmK: z.number().optional().describe("Przewodność cieplna λ [W/(m·K)] z karty produktu — tylko od usera, nigdy zgadnięta"),
  oporM2KW: z.number().optional().describe("Gotowy opór warstwy R [m²·K/W] zamiast grubości i λ (np. szczelina z karty producenta)"),
})

const Przegroda = z.object({
  nazwa: z.string(),
  powierzchniaM2: z.number().describe("Powierzchnia przegrody [m²]"),
  uWM2K: z.number().optional().describe("Współczynnik U [W/(m²·K)] — tylko jeśli user podał; ma pierwszeństwo przed warstwami"),
  warstwy: z.array(Warstwa).optional().describe("Warstwy przegrody zamiast U — każda z grubością i λ albo oporem R; bez mostków cieplnych"),
  kierunekStrumienia: z.enum(["poziomo", "w-gore", "w-dol"]).optional().describe("Wymagany z warstwami: 'poziomo' (ściana), 'w-gore' (dach, strop pod strychem), 'w-dol' (podłoga)"),
  temperaturaPoDrugiejStronieC: z
    .number()
    .optional()
    .describe("Tylko dla gruntu/nieogrzewanego pomieszczenia — temperatura od usera; brak → powietrze zewnętrzne"),
})

export const ObciazenieCieplneToolInput = z.object({
  przegrody: z.array(Przegroda).min(1),
  temperaturaWewnetrznaC: z.number(),
  strefaKlimatyczna: z.number().int().min(1).max(5).describe("Strefa klimatyczna Polski I–V (1–5)"),
  kubaturaM3: z.number().describe("Kubatura ogrzewana [m³]"),
  wymianyPowietrzaNaH: z.number().describe("Wymiany powietrza na godzinę [1/h] — od usera"),
  cop: z.number().optional().describe("COP źródła ciepła (grzałka = 1); brak → bez energii elektrycznej"),
  srednieTemperaturyMiesieczneC: z.array(z.number().nullable()).length(12).optional().describe("Średnie temperatury miesięcy, od stycznia"),
  sprawnoscOdzyskuPct: z.number().optional().describe("Sprawność odzysku ciepła z wentylacji [%] (rekuperator) z karty urządzenia — tylko od usera; brak → bez odzysku"),
  paliwo: z
    .object({
      jednostka: z.string().describe("Jednostka paliwa, np. kg, l, m³ — tylko opis"),
      wartoscOpalowaKwh: z.number().describe("Wartość opałowa [kWh na jednostkę] — od usera/sprzedawcy, nigdy zgadnięta"),
      sprawnoscPct: z.number().describe("Sprawność kotła lub pieca [%] z karty — od usera"),
      zapas: z.number().describe("Zapas paliwa w jednostkach — od usera"),
    })
    .optional()
    .describe("Źródło ciepła na paliwo z zapasem — wtedy liczę, na ile dni i jaką część roku wystarczy (bez cop)"),
})
export type ObciazenieCieplneToolInputT = z.infer<typeof ObciazenieCieplneToolInput>

export const ObciazenieCieplneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  temperaturaZewnetrznaC: z.number().nullable(),
  obciazenieW: z.number().nullable(),
  strataPrzenikanieW: z.number().nullable(),
  strataWentylacjaW: z.number().nullable(),
  cieploDobaObliczeniowaKwh: z.number().nullable(),
  odzyskWentylacjiPct: z.number().nullable(),
  zapasPaliwa: z
    .object({
      zapasCieplaKwh: z.number(),
      zuzycieDobaObliczeniowaJedn: z.number(),
      dniPrzyTemperaturzeObliczeniowej: z.number(),
      zuzycieRokJedn: z.number().nullable(),
      pokrycieRokuPct: z.number().nullable(),
      brakJedn: z.number().nullable(),
    })
    .nullable(),
  energiaElektrycznaDobaKwh: z.number().nullable(),
  przegrody: z.array(z.object({ nazwa: z.string(), uWM2K: z.number().nullable(), strataW: z.number(), udzialPct: z.number() })),
  miesiace: z.array(z.object({ miesiac: z.number(), cieploKwh: z.number(), energiaElektrycznaKwh: z.number().nullable() })),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ObciazenieCieplneToolOutputT = z.infer<typeof ObciazenieCieplneToolOutput>

export const obciazenieCieplneTool: AiToolDefinition<ObciazenieCieplneToolInputT, ObciazenieCieplneToolOutputT> = {
  name: "policz_straty_ciepla_budynku",
  description:
    "Straty ciepła budynku (moc W przy temperaturze obliczeniowej strefy klimatycznej I–V): przez przegrody Σ U·A·ΔT i " +
    "przez wymianę powietrza, ciepło na najzimniejszą dobę, prąd przy danym COP, opcjonalnie ciepło w miesiącach ze " +
    "średnich temperatur; opcjonalnie odzysk ciepła z wentylacji (rekuperator, % od usera) oraz zapas paliwa (drewno, węgiel, gaz — " +
    "wartość opałowa i sprawność od usera): na ile dni i jaką część roku starczy. Okna i drzwi podaj jako osobne przegrody z powierzchnią i U. U przegrody user podaje wprost albo przez warstwy (grubość i λ albo opór R, kierunek strumienia) — U " +
    "liczone z warstw wg PN-EN ISO 6946 jest bez mostków cieplnych, więc dla ściany szkieletowej zbyt optymistyczne. U, λ, powierzchnie, " +
    "kubaturę i wymiany powietrza podaje user — nie zgaduj. Bez mostków cieplnych i zysków z pełnej PN-EN 12831-1 — zawsze to " +
    "przekaż. Użyj, gdy user pyta, ile ciepła traci dom, jaka moc grzania albo jakie U wychodzi z podanych warstw ściany, dachu lub podłogi.",
  inputSchema: ObciazenieCieplneToolInput,
  outputSchema: ObciazenieCieplneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/obciazenie-cieplne",
  handler: async (input) => {
    const przegrody = input.przegrody.map((p) => ({
      nazwa: p.nazwa,
      powierzchniaM2: p.powierzchniaM2,
      uWM2K: p.uWM2K ?? null,
      warstwy: p.warstwy?.map((w) => ({ nazwa: w.nazwa, gruboscMm: w.gruboscMm ?? null, lambdaWmK: w.lambdaWmK ?? null, oporM2KW: w.oporM2KW ?? null })) ?? null,
      kierunekStrumienia: p.kierunekStrumienia ?? null,
      zewnetrzna: p.temperaturaPoDrugiejStronieC === undefined,
      temperaturaPoDrugiejStronieC: p.temperaturaPoDrugiejStronieC ?? null,
    }))
    const wynik = calculateObciazenieCieplne({
      przegrody,
      temperaturaWewnetrznaC: input.temperaturaWewnetrznaC,
      strefaKlimatyczna: input.strefaKlimatyczna as StrefaKlimatyczna,
      kubaturaM3: input.kubaturaM3,
      wymianyPowietrzaNaH: input.wymianyPowietrzaNaH,
      cop: input.cop ?? null,
      sprawnoscOdzyskuPct: input.sprawnoscOdzyskuPct ?? null,
      paliwo: input.paliwo
        ? { jednostka: input.paliwo.jednostka, wartoscOpalowaKwh: input.paliwo.wartoscOpalowaKwh, sprawnoscPct: input.paliwo.sprawnoscPct, zapas: input.paliwo.zapas }
        : null,
      srednieTemperaturyMiesieczneC: input.srednieTemperaturyMiesieczneC ?? Array(12).fill(null),
    })
    const v = wynik.value
    return {
      status: wynik.status,
      temperaturaZewnetrznaC: v?.temperaturaZewnetrznaC ?? null,
      obciazenieW: v?.obciazenieW ?? null,
      strataPrzenikanieW: v?.strataPrzenikanieW ?? null,
      strataWentylacjaW: v?.strataWentylacjaW ?? null,
      cieploDobaObliczeniowaKwh: v?.cieploDobaObliczeniowaKwh ?? null,
      odzyskWentylacjiPct: v?.odzyskWentylacjiPct ?? null,
      zapasPaliwa: v?.paliwo
        ? {
            zapasCieplaKwh: v.paliwo.zapasCieplaKwh,
            zuzycieDobaObliczeniowaJedn: v.paliwo.zuzycieDobaObliczeniowaJedn,
            dniPrzyTemperaturzeObliczeniowej: v.paliwo.dniPrzyTemperaturzeObliczeniowej,
            zuzycieRokJedn: v.paliwo.zuzycieRokJedn,
            pokrycieRokuPct: v.paliwo.pokrycieRokuPct,
            brakJedn: v.paliwo.brakJedn,
          }
        : null,
      energiaElektrycznaDobaKwh: v?.energiaElektrycznaDobaKwh ?? null,
      przegrody: (v?.przegrody ?? []).map((p, i) => ({
        nazwa: p.nazwa,
        uWM2K: uPrzegrody(przegrody[i]!).u,
        strataW: p.strataW,
        udzialPct: p.udzialPct,
      })),
      miesiace: (v?.miesiace ?? []).map((m) => ({ miesiac: m.miesiac, cieploKwh: m.cieploKwh, energiaElektrycznaKwh: m.energiaElektrycznaKwh })),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
