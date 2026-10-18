/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 2 "Deficyty miesięczne i agregat" (dawne 6.2).
 * `operationType: 'read'`. Deficyty, moc, zużycie i cena paliwa MUSZĄ pochodzić od usera (Dyrektywa #1);
 * historia produkcji z lat — tylko dane podane przez usera albo z jego źródła (nigdy wymyślone).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDeficytyMiesieczne } from "@/lib/core/modules/stress-test/deficyty-miesieczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DeficytyMiesieczneToolInput = z.object({
  deficytyKwh: z
    .array(z.number())
    .length(12)
    .describe(
      "Deficyt energii w każdym miesiącu, styczeń..grudzień [kWh]; 0 = miesiąc bez deficytu (dokładnie 12 liczb). " +
        "Same zera + podana historia = deficyty policzone z historii wielu lat",
    ),
  mocAgregatuKw: z.number().describe("Moc znamionowa (ciągła) agregatu [kW]"),
  zuzyciePaliwaLH: z.number().describe("Zużycie paliwa przy typowym obciążeniu z karty [l/h]"),
  cenaPaliwaZlL: z.number().describe("Cena paliwa [zł/l]"),
  kosztSerwisuZlH: z.number().describe("Koszt serwisu i oleju na motogodzinę [zł/h]; 0 = nie liczony"),
  zapasPaliwaL: z.number().describe("Zapas paliwa na miejscu [l]; 0 = nie wpisany"),
  horyzontDni: z
    .number()
    .optional()
    .describe("Opcjonalnie: stały horyzont zapasu paliwa w dniach (np. 3, 7, 14 albo własna liczba, 1..366); liczony z najgorszego miesiąca"),
  horyzontCalyMiesiac: z.boolean().optional().describe("Opcjonalnie: true = horyzont to cały najgorszy miesiąc (ma pierwszeństwo przed horyzontDni)"),
  zapotrzebowanieDobaKwh: z
    .array(z.number())
    .length(12)
    .optional()
    .describe("Opcjonalnie, do analizy historii: średnie dobowe zapotrzebowanie domu w każdym miesiącu [kWh/dobę] (12 liczb)"),
  historia: z
    .object({
      zrodlo: z.enum(["pvgis-seriescalc", "pomiar-budynku", "pomiar-miejscowosci", "wpisane-reczne"]).describe("Skąd pochodzą dane"),
      rodzaj: z
        .enum(["produkcja-pv-kwh", "naswietlenie-kwh-m2"])
        .describe("produkcja-pv-kwh = dobowa produkcja instalacji [kWh]; naswietlenie-kwh-m2 = dobowe nasłonecznienie [kWh/m²] (wtedy podaj przeliczenie)"),
      lata: z
        .array(
          z.object({
            rok: z.number().describe("Rok kalendarzowy"),
            dni: z.array(z.number().nullable()).describe("Wartości doba po dobie od 1 stycznia; null = brak danych tego dnia"),
          }),
        )
        .describe("Dane z poprzednich lat (tablica lat × dób)"),
      przeliczenie: z
        .object({ mocPvKwp: z.number(), wspolczynnikPr: z.number() })
        .optional()
        .describe("Wymagane dla naswietlenie-kwh-m2: moc instalacji [kWp] i współczynnik PR (0..1) podane przez usera"),
    })
    .optional()
    .describe("Opcjonalnie: wieloletnia historia dobowa do realnego doboru zapasu (zamiast jednego stałego horyzontu)"),
  oknoDni: z.number().optional().describe("Do historii: okno między dostawami paliwa [dni], 1..366"),
  percentylPct: z.number().optional().describe("Do historii: percentyl [%] najgorszych okien rocznych do doboru zapasu, 1..100; 0/brak = tylko min, mediana, max"),
  progSlabegoDniaPct: z.number().optional().describe("Do historii: doba słaba, gdy PV < tyle % zapotrzebowania [%]; 0/brak = bez serii"),
  udzialNocyPct: z
    .number()
    .optional()
    .describe("Do historii: udział dobowego zużycia w godzinach bez produkcji PV [%] z licznika/profilu użytkownika, 0..100; brak = dzień i noc liczone razem (wynik może być zaniżony). Nie zgaduj — tylko wartość podana przez użytkownika"),
  magazynPojemnoscKwh: z
    .number()
    .optional()
    .describe("Do historii: pojemność użyteczna magazynu energii [kWh] przenosząca nadwyżkę PV na kolejne doby; 0/brak = bilans bez magazynu"),
  magazynSprawnoscPct: z.number().optional().describe("Do historii z magazynem: sprawność cyklu magazynu [%] z karty katalogowej, 1..100 (wymagana przy pojemności > 0)"),
  magazynStanPoczatkowyPct: z.number().optional().describe("Do historii z magazynem: stan naładowania 1 stycznia [% pojemności użytecznej]; 0/brak = pusty"),
})
export type DeficytyMiesieczneToolInputT = z.infer<typeof DeficytyMiesieczneToolInput>

export const DeficytyMiesieczneToolOutput = z.object({
  status: z.enum(STATUSY),
  miesiace: z.array(
    z.object({
      miesiac: z.number(),
      deficytKwh: z.number(),
      godzinyPracy: z.number(),
      paliwoL: z.number(),
      kosztPaliwaZl: z.number(),
      kosztSerwisuZl: z.number(),
      kosztZl: z.number(),
    }),
  ),
  sumaDeficytKwh: z.number(),
  sumaGodzin: z.number(),
  sumaPaliwaL: z.number(),
  sumaKosztZl: z.number(),
  miesiacNajdluzszy: z.number().nullable(),
  lancuch: z
    .object({
      mocUzytecznaKw: z.number(),
      litryNaKwh: z.number(),
      kosztPaliwaNaKwhZl: z.number(),
      energiaKwh: z.number(),
      godzinyPracy: z.number(),
      paliwoL: z.number(),
    })
    .nullable(),
  horyzonty: z.array(
    z.object({
      klucz: z.string(),
      dni: z.number(),
      energiaKwh: z.number(),
      godzinyPracy: z.number(),
      paliwoL: z.number(),
      kosztPaliwaZl: z.number(),
      zapasWystarcza: z.boolean().nullable(),
      wybrany: z.boolean(),
    }),
  ),
  deficytyZHistorii: z.boolean(),
  miesiaceBezDanych: z.array(z.number()).describe("Miesiące (1–12) bez pełnych danych w historii — brak wyniku, nie 0"),
  historia: z
    .object({
      zrodlo: z.string(),
      liczbaLat: z.number(),
      liczbaDniZDanymi: z.number(),
      najdluzszaSeriaSlabychDni: z.number().nullable(),
      miesiace: z.array(
        z.object({
          miesiac: z.number(),
          liczbaLat: z.number(),
          minKwh: z.number(),
          medianaKwh: z.number(),
          percentylKwh: z.number().nullable(),
          maxKwh: z.number(),
        }),
      ),
    })
    .nullable(),
  zapasZHistorii: z
    .object({
      oknoDni: z.number(),
      litryMin: z.number(),
      litryMediana: z.number(),
      litryPercentyl: z.number().nullable(),
      percentylPct: z.number(),
      litryMax: z.number(),
      lataPokryte: z.number().nullable(),
      lata: z.number(),
    })
    .nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DeficytyMiesieczneToolOutputT = z.infer<typeof DeficytyMiesieczneToolOutput>

export const deficytyMiesieczneTool: AiToolDefinition<DeficytyMiesieczneToolInputT, DeficytyMiesieczneToolOutputT> = {
  name: "policz_deficyty_miesieczne_agregat",
  description:
    "Zimowe deficyty energii miesiąc po miesiącu przeliczone na pracę agregatu: łańcuch (kW na godzinę pracy przy " +
    "optymalnym obciążeniu 80% mocy, litry na kWh), godziny pracy, litry paliwa, koszt paliwa i serwisu, sumy sezonu, " +
    "paliwo na stały horyzont (3/7/14 dni, miesiąc, własna liczba dni) oraz porównanie z zapasem paliwa. Z wieloletnią " +
    "historią dobową (produkcja PV albo nasłonecznienie z poprzednich lat) liczy realnie: rozkład deficytów, najgorsze " +
    "okno między dostawami w każdym roku, serie słabych dób i zapas z wybranego percentyla; opcjonalnie z magazynem " +
    "energii przenoszącym nadwyżkę PV na kolejne doby (pojemność, sprawność, stan 1 stycznia od usera). " +
    "Użyj, gdy user pyta, ile godzin agregat przepracuje w grudniu/styczniu/lutym, ile paliwa kupić na zimę albo na " +
    "3/7/14 dni, ile kWh daje agregat na godzinę i ile litrów to kosztuje, ile zima kosztuje w paliwie, czy zapas " +
    "paliwa wystarczy na najgorszy miesiąc, jaki zapas wynika z danych z poprzednich lat albo o ile magazyn energii " +
    "zmniejsza zapas paliwa.",
  inputSchema: DeficytyMiesieczneToolInput,
  outputSchema: DeficytyMiesieczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/deficyty-miesieczne",
  handler: async (input) => {
    const {
      horyzontDni,
      horyzontCalyMiesiac,
      oknoDni,
      percentylPct,
      progSlabegoDniaPct,
      udzialNocyPct,
      magazynPojemnoscKwh,
      magazynSprawnoscPct,
      magazynStanPoczatkowyPct,
      ...baza
    } = input
    const wynik = calculateDeficytyMiesieczne({
      ...baza,
      ...(horyzontCalyMiesiac
        ? { horyzont: { rodzaj: "miesiac" as const } }
        : horyzontDni !== undefined
          ? { horyzont: { rodzaj: "dni" as const, dni: horyzontDni } }
          : {}),
      ...(input.historia
        ? {
            analizaHistorii: {
              oknoDni: oknoDni ?? 0,
              percentylPct: percentylPct ?? 0,
              progSlabegoDniaPct: progSlabegoDniaPct ?? 0,
              ...(udzialNocyPct !== undefined ? { udzialNocyPct } : {}),
              ...(magazynPojemnoscKwh
                ? {
                    magazyn: {
                      pojemnoscUzytecznaKwh: magazynPojemnoscKwh,
                      sprawnoscPct: magazynSprawnoscPct ?? 0,
                      stanPoczatkowyPct: magazynStanPoczatkowyPct ?? 0,
                    },
                  }
                : {}),
            },
          }
        : {}),
    })
    const w = wynik.value
    return {
      status: wynik.status,
      miesiace: w.miesiace,
      sumaDeficytKwh: w.sumaDeficytKwh,
      sumaGodzin: w.sumaGodzin,
      sumaPaliwaL: w.sumaPaliwaL,
      sumaKosztZl: w.sumaKosztZl,
      miesiacNajdluzszy: w.miesiacNajdluzszy,
      lancuch: w.lancuch,
      horyzonty: w.horyzonty,
      deficytyZHistorii: w.deficytyZHistorii,
      miesiaceBezDanych: w.miesiaceBezDanych,
      historia: w.historia && {
        zrodlo: w.historia.zrodlo,
        liczbaLat: w.historia.liczbaLat,
        liczbaDniZDanymi: w.historia.liczbaDniZDanymi,
        najdluzszaSeriaSlabychDni: w.historia.serie?.najdluzszaDni ?? null,
        miesiace: w.historia.miesiace.map((m) => ({
          miesiac: m.miesiac,
          liczbaLat: m.liczbaLat,
          minKwh: m.deficytKwh.min,
          medianaKwh: m.deficytKwh.mediana,
          percentylKwh: m.deficytKwh.percentyl,
          maxKwh: m.deficytKwh.max,
        })),
      },
      zapasZHistorii: w.zapasZHistorii,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
