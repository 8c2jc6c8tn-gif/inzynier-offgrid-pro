/**
 * Narzędzie AI (9.3) dla kalkulatora odstępu rzędów paneli PV (D81, Moduł 3). `operationType: 'read'`.
 * PVGIS TMY pobierany w handlerze po stronie serwera (jak `porownaj_panele`); gdy się nie uda, liczymy samą geometrię cienia.
 * Handler tylko deleguje do `calculateOdstepRzedow` — model nie zgaduje ani kątów słońca, ani długości cienia.
 */
import { z } from "zod"
import { NadpisanieTmyPola, pobierzTmyZNadpisaniem } from "./nadpisanie-tmy"
import { calculateOdstepRzedow } from "@/lib/core/modules/pv/odstep-rzedow/calculator"
import { OKNO_PROJEKTOWE_DOMYSLNE } from "@/lib/core/modules/pv/odstep-rzedow/constants"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OdstepRzedowToolInput = z.object({
  ...NadpisanieTmyPola,
  szerokoscGeograficzna: z.number().min(-90).max(90).describe("[°]"),
  dlugoscGeograficzna: z.number().min(-180).max(180).describe("[°]"),
  nachylenieDeg: z.number().describe("Nachylenie paneli [°], 0–90"),
  azymutDeg: z.number().describe("Azymut paneli [°]: N=0, E=90, S=180, W=270"),
  dlugoscWzdluzSpaduM: z.number().describe("Długość stołu wzdłuż spadu [m] = wymiar panelu (długi albo krótki bok, zależnie od układu) × liczba paneli jeden nad drugim"),
  oknoOdH: z.number().optional().describe(`Początek okna „bez cienia” 21 grudnia, czas słoneczny [godz.]; bez niego ${OKNO_PROJEKTOWE_DOMYSLNE.odH}`),
  oknoDoH: z.number().optional().describe(`Koniec okna [godz.]; bez niego ${OKNO_PROJEKTOWE_DOMYSLNE.doH}. Na szerokości Polski szersze okno daje bardzo duże odstępy — to wybór usera, nie norma`),
  odstepM: z.number().optional().describe("Odstęp rzędów, który user ma lub planuje [m]: dolna krawędź do dolnej krawędzi, poziomo — wtedy policzę cień i stratę energii"),
  docelowaStrataZimaPct: z.number().optional().describe("Dopuszczalna strata energii zimą [%] — wynik: najmniejszy odstęp, który ją mieści"),
  liczbaRzedow: z.number().optional().describe("Liczba rzędów w tablicy (pierwszy rząd nie jest zacieniany)"),
  albedo: z.number().optional().describe("Albedo gruntu 0–1; bez niego wartość domyślna silnika"),
})

export type OdstepRzedowToolInputT = z.infer<typeof OdstepRzedowToolInput>

const Strata = z.object({
  zimaPct: z.number().describe("Strata energii zimą XI–II [% energii padającej na płaszczyznę], rząd 2 i kolejne"),
  rokPct: z.number(),
  zimaPoCieniuKwhM2: z.number().describe("Energia padająca zimą na 1 m² panelu po cieniu [kWh/m²]"),
})

export const OdstepRzedowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  odstepWymaganyM: z.number().nullable().describe("Odstęp rzędów bez cienia w całym oknie [m] (dolna krawędź do dolnej krawędzi)"),
  przerwaWymaganaM: z.number().nullable().describe("Ta sama wartość jako przerwa w świetle między rzędami [m]"),
  wspolczynnikZabudowyPct: z.number().nullable().describe("Długość stołu / odstęp rzędów [%]"),
  decydujacaChwila: z
    .object({ czasSlonecznyH: z.number(), wysokoscSloncaDeg: z.number(), azymutSloncaDeg: z.number() })
    .nullable()
    .describe("Chwila okna, która wyznacza odstęp (najdłuższy cień)"),
  zadanyOdstep: z
    .object({
      odstepM: z.number(),
      maksCzescZacieniona: z.number().describe("Największa zacieniona część stołu w oknie, 0–1"),
      czasMaksH: z.number().nullable(),
      strata: Strata.nullable().describe("Null bez danych pogodowych"),
    })
    .nullable(),
  odstepDlaStratyM: z.number().nullable().describe("Najmniejszy odstęp mieszczący docelową stratę zimą [m]"),
  tabelaKatow: z.array(
    z.object({
      katDeg: z.number(),
      odstepWymaganyM: z.number(),
      odstepZaMaly: z.boolean(),
      strataZimaPct: z.number().nullable(),
      zimaNaM2GruntuKwh: z.number().nullable().describe("Energia zimowa po cieniu na 1 m² gruntu rzędu [kWh/m²]"),
    }),
  ),
  najlepszyKatNaGruncieDeg: z.number().nullable(),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})

export type OdstepRzedowToolOutputT = z.infer<typeof OdstepRzedowToolOutput>

/** Fabryka — `fetchImpl` wstrzykiwany w testach (jak `pobierzTmy`). */
export function utworzOdstepRzedowTool(fetchImpl: typeof fetch = fetch): AiToolDefinition<OdstepRzedowToolInputT, OdstepRzedowToolOutputT> {
  return {
    name: "odstep_rzedow_paneli",
    description:
      "Liczy odstęp rzędów paneli PV na gruncie lub płaskim dachu z geometrii słońca (współrzędne, azymut, kąt pochylenia): " +
      "odstęp bez cienia w oknie godzin 21 grudnia, zacienienie przy zadanym odstępie, stratę energii zimą i w roku oraz tabelę kątów " +
      "z energią zimową na m² gruntu. Wymiary stołu, kąt i okno podaje user — nie zgaduj ich. Strata jest geometryczna, dla energii bezpośredniej. " +
      "Użyj, gdy user pyta, jak daleko postawić rzędy paneli, czy rzędy się zacienią zimą, jaki kąt opłaca się na ograniczonym gruncie albo ile energii traci przy ciasnym ustawieniu.",
    inputSchema: OdstepRzedowToolInput,
    outputSchema: OdstepRzedowToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/odstep-rzedow",
    handler: async (input) => {
      const tmy = await pobierzTmyZNadpisaniem(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl, input)
      const wynik = calculateOdstepRzedow({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        nachylenieDeg: input.nachylenieDeg,
        azymutDeg: input.azymutDeg,
        dlugoscWzdluzSpaduM: input.dlugoscWzdluzSpaduM,
        oknoOdH: input.oknoOdH ?? OKNO_PROJEKTOWE_DOMYSLNE.odH,
        oknoDoH: input.oknoDoH ?? OKNO_PROJEKTOWE_DOMYSLNE.doH,
        odstepM: input.odstepM ?? null,
        docelowaStrataZimaPct: input.docelowaStrataZimaPct ?? null,
        liczbaRzedow: input.liczbaRzedow ?? null,
        ...(input.albedo !== undefined ? { albedo: input.albedo } : {}),
        ...(tmy.ok ? { daneGodzinowe: tmy.dane.rekordy } : {}),
      })
      const v = wynik.value
      const m = tmy.ok ? tmy.dane.meta : null
      const ostrzezenia = tekstyOstrzezen(wynik.warnings)
      if (!tmy.ok) ostrzezenia.push(`${KOMUNIKAT_PVGIS[tmy.kod]} Policzyłem samą geometrię cienia, bez strat energii.`)
      return {
        status: wynik.status,
        odstepWymaganyM: v?.odstepWymaganyM ?? null,
        przerwaWymaganaM: v?.przerwaWymaganaM ?? null,
        wspolczynnikZabudowyPct: v ? v.wspolczynnikZabudowy * 100 : null,
        decydujacaChwila: v?.decydujaca ?? null,
        zadanyOdstep: v?.zadanyOdstep
          ? {
              odstepM: v.zadanyOdstep.odstepM,
              maksCzescZacieniona: v.zadanyOdstep.maksCzescZacieniona,
              czasMaksH: v.zadanyOdstep.czasMaksH,
              strata: v.zadanyOdstep.strata
                ? { zimaPct: v.zadanyOdstep.strata.zimaPct, rokPct: v.zadanyOdstep.strata.rokPct, zimaPoCieniuKwhM2: v.zadanyOdstep.strata.zimaPoCieniuKwhM2 }
                : null,
            }
          : null,
        odstepDlaStratyM: v?.odstepDlaStraty?.odstepM ?? null,
        tabelaKatow: (v?.tabelaKatow ?? []).map((w) => ({
          katDeg: w.katDeg,
          odstepWymaganyM: w.odstepWymaganyM,
          odstepZaMaly: w.odstepZaMaly,
          strataZimaPct: w.strata?.zimaPct ?? null,
          zimaNaM2GruntuKwh: w.zimaNaM2GruntuKwh,
        })),
        najlepszyKatNaGruncieDeg: v?.najlepszyKatNaGruncieDeg ?? null,
        zrodloDanych: m ? `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})` : null,
        ostrzezenia,
        zalozenia: tekstyZalozen(wynik.assumptions),
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const odstepRzedowTool = utworzOdstepRzedowTool()
