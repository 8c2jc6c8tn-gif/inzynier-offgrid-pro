/**
 * Narzędzie AI (9.3) dla Porównywarki paneli PV (D81, Moduł 3). `operationType: 'read'`.
 * PVGIS TMY pobierany w handlerze po stronie serwera (jak Ekran 1 M3 / Ekran 4 M1, D22). Handler tylko deleguje do
 * `calculatePorownywarkaPaneli` — parametry paneli pochodzą od użytkownika (karta katalogowa), model ich nie zgaduje.
 */
import { z } from "zod"
import { pobierzTmy } from "@/lib/adapters/pvgis/tmy"
import { MAKS_PANELI_W_ZESTAWIE } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import { calculatePorownywarkaPaneli } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { DanePanelu } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { domyslnyWyborKryteriow } from "@/lib/core/modules/pv/porownywarka-paneli/kryteria"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Panel = z.object({
  nazwa: z.string().min(1).describe("Producent i model"),
  pmaxW: z.number().describe("Moc w STC [W]"),
  cenaBruttoZl: z.number().optional().describe("Cena brutto za sztukę [zł] — bez niej nie policzę kosztu zimowej kWh"),
  gammaPctNaC: z.number().optional().describe("Współczynnik temperaturowy mocy [%/°C], zwykle ujemny — tylko z karty katalogowej"),
  noctC: z.number().optional().describe("NOCT [°C] — tylko z karty katalogowej"),
  sprawnoscWzglednaPrzy200WPct: z.number().optional().describe("Sprawność względna przy 200 W/m² [% sprawności w STC] — tylko z karty"),
  degradacjaPierwszyRokPct: z.number().optional().describe("Degradacja w pierwszym roku [%] z gwarancji mocy"),
  degradacjaLiniowaPctNaRok: z.number().optional().describe("Degradacja w kolejnych latach [%/rok] z gwarancji mocy"),
  dlugoscMm: z.number().optional().describe("Dłuższy bok panelu [mm] z karty — potrzebny, gdy liczbę paneli ma policzyć wymiar miejsca"),
  szerokoscMm: z.number().optional().describe("Krótszy bok panelu [mm] z karty"),
  masaKg: z.number().optional().describe("Masa panelu [kg] z karty"),
  bifacjalny: z.boolean().optional(),
})

const WymiaryMiejsca = z.object({
  dlugoscM: z.number().describe("Długość powierzchni użytkowej [m]"),
  szerokoscM: z.number().describe("Szerokość powierzchni użytkowej [m]"),
  marginesM: z.number().describe("Margines od każdej krawędzi [m]; 0, jeśli user mówi, że nie ma — dopytaj, nie zakładaj"),
  montaz: z
    .enum(["rownolegly", "pochylony-na-konstrukcji"])
    .describe("rownolegly = panele leżą w płaszczyźnie dachu/ściany; pochylony-na-konstrukcji = grunt/płaski dach: ustawię rzędy w odstępie bez cienia w oknie godzin i z tego policzę sztuki"),
  oknoOdH: z.number().optional().describe("Montaż pochylony: początek okna bez cienia [godz. czasu słonecznego, 21 grudnia]; podaj razem z oknoDoH, bez nich okno domyślne 9–15 (praktyka, nie norma — zapytaj usera)"),
  oknoDoH: z.number().optional().describe("Montaż pochylony: koniec okna bez cienia [godz. czasu słonecznego]"),
})

export const PorownajPaneleToolInput = z.object({
  szerokoscGeograficzna: z.number().min(-90).max(90).describe("[°]"),
  dlugoscGeograficzna: z.number().min(-180).max(180).describe("[°]"),
  nachylenieDeg: z.number().describe("Nachylenie paneli [°], 0–90"),
  azymutDeg: z.number().describe("Azymut paneli [°]: N=0, E=90, S=180, W=270"),
  albedo: z.number().optional().describe("Albedo gruntu 0–1; bez niego wartość domyślna silnika"),
  liczbaPaneli: z
    .number()
    .optional()
    .describe("Liczba paneli na miejscu — ta sama dla każdego porównywanego modelu; bez niej podaj wymiaryMiejsca i wymiary paneli, a policzę, ile sztuk każdego modelu się zmieści"),
  wymiaryMiejsca: WymiaryMiejsca.optional().describe("Wymiary miejsca montażu — tylko od usera, nie zgaduj"),
  zuzycieMiesieczneKwh: z
    .array(z.number())
    .length(12)
    .optional()
    .describe("Zużycie energii w miesiącach [kWh], styczeń pierwszy, 12 liczb; z nim wycenię tylko energię wykorzystaną (nadwyżka osobno)"),
  panele: z.array(Panel).min(1).max(MAKS_PANELI_W_ZESTAWIE),
  zlNaKwh: z.number().optional().describe("Wartość 1 kWh [zł] (taryfa całodobowa albo koszt kWh z agregatu) — bez niej wynik w kWh, bez złotówek"),
  cenaDzienZlKwh: z.number().optional().describe("Taryfa dwustrefowa: całkowita cena 1 kWh w strefie dziennej [zł]; podaj razem z ceną nocną i godzinami taniej strefy, zamiast zlNaKwh"),
  cenaNocZlKwh: z.number().optional().describe("Taryfa dwustrefowa: całkowita cena 1 kWh w strefie nocnej (tańszej) [zł]"),
  oknaTanie: z
    .array(z.object({ odH: z.number().describe("Początek okna, godzina 0–24, czas urzędowy"), doH: z.number().describe("Koniec okna; mniejszy niż początek = okno przez północ") }))
    .optional()
    .describe("Godziny taniej strefy z umowy lub faktury — dopytaj usera, nie zakładaj (G12 u różnych operatorów ma różne godziny)"),
})

export type PorownajPaneleToolInputT = z.infer<typeof PorownajPaneleToolInput>

export const PorownajPaneleToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  panele: z.array(
    z.object({
      nazwa: z.string(),
      liczbaPaneli: z.number().describe("Liczba sztuk, dla której policzono wynik (podana albo z wymiarów miejsca)"),
      mieszcaSieSzt: z.number().nullable().describe("Ile sztuk mieści się w podanych wymiarach miejsca; null bez wymiarów"),
      rozmieszczenie: z
        .object({ rzedy: z.number(), panelowNaStole: z.number(), stolowWRzedzie: z.number(), odstepM: z.number() })
        .nullable()
        .describe("Montaż pochylony: liczba rzędów, paneli nad sobą, stołów w rzędzie i odstęp rzędów [m]; null przy montażu równoległym"),
      zimaKwh: z.number().describe("Energia zimą XI–II [kWh] dla podanej liczby paneli"),
      rokKwh: z.number(),
      uzytecznaRokKwh: z.number().nullable().describe("Energia wykorzystana w roku [kWh]; null bez zużycia"),
      nadwyzkaUlamek: z.number().nullable().describe("Ułamek produkcji ponad zużycie 0–1; null bez zużycia"),
      kosztZimowejKwhZl: z.number().nullable().describe("Koszt zimowej kWh w 25 latach [zł/kWh]; null bez ceny"),
      gwiazdki: z.number().nullable().describe("Ocena 0–10 względna w obrębie porównywanego zestawu; null bez kryteriów albo przy jednym panelu"),
    }),
  ),
  liderZimowyNazwa: z.string().nullable(),
  przewagaZimowaKwh: z.number().nullable().describe("O ile kWh lider zimowy wyprzedza drugi panel"),
  przewagaZimowaZl: z.number().nullable().describe("Wartość tej przewagi w zł rocznie przy podanej wartości kWh"),
  uwzglednionaTemperatura: z.boolean(),
  uwzglednioneSlabeSwiatlo: z.boolean(),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})

export type PorownajPaneleToolOutputT = z.infer<typeof PorownajPaneleToolOutput>

const PUSTY = {
  panele: [],
  liderZimowyNazwa: null,
  przewagaZimowaKwh: null,
  przewagaZimowaZl: null,
  uwzglednionaTemperatura: false,
  uwzglednioneSlabeSwiatlo: false,
}

/** Fabryka — `fetchImpl` wstrzykiwany w testach (jak `pobierzTmy`). */
export function utworzPorownajPaneleTool(
  fetchImpl: typeof fetch = fetch,
): AiToolDefinition<PorownajPaneleToolInputT, PorownajPaneleToolOutputT> {
  return {
    name: "porownaj_panele",
    description:
      "Porównuje do czterech paneli PV na jednym miejscu (dane PVGIS): energia w 12 miesiącach, osobno zimą XI–II, " +
      "koszt zimowej kWh w 25 latach, wartość różnicy w zł oraz ocena 0–10 względna w zestawie. Parametry paneli " +
      "(moc, wymiary, γ, NOCT, degradacja, cena) podaje user z karty katalogowej — braków nie zgaduj, zostaw puste. " +
      "Liczbę paneli podaje user albo wynika z wymiarów miejsca (wtedy każdy model ma własną liczbę sztuk); z miesięcznym zużyciem wycenia tylko energię wykorzystaną. " +
      "Przy taryfie dwustrefowej (G12) wycenia energię z godzin taniej strefy po cenie nocnej. " +
      "Użyj, gdy user waha się między dwoma lub więcej modelami paneli albo pyta, który panel da więcej zimą.",
    inputSchema: PorownajPaneleToolInput,
    outputSchema: PorownajPaneleToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/porownywarka-paneli",
    handler: async (input) => {
      const strefowa = input.cenaDzienZlKwh !== undefined || input.cenaNocZlKwh !== undefined
      if (strefowa && (input.cenaDzienZlKwh === undefined || input.cenaNocZlKwh === undefined || !input.oknaTanie?.length)) {
        return {
          status: "INCOMPLETE",
          ...PUSTY,
          zrodloDanych: null,
          ostrzezenia: ["Taryfa dzienna i nocna wymaga trzech rzeczy: ceny w strefie dziennej, ceny w strefie nocnej i godzin taniej strefy z umowy lub faktury. Dopytaj użytkownika o brakujące."],
          zalozenia: [],
        }
      }
      const tmy = await pobierzTmy(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl)
      if (!tmy.ok) return { status: "INCOMPLETE", ...PUSTY, zrodloDanych: null, ostrzezenia: [KOMUNIKAT_PVGIS[tmy.kod]], zalozenia: [] }
      const m = tmy.dane.meta
      const zrodloDanych = `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})`
      const panele: DanePanelu[] = input.panele.map((p, i) => ({
        id: `p${i + 1}`,
        nazwa: p.nazwa,
        pmaxW: p.pmaxW,
        cenaBruttoZl: p.cenaBruttoZl ?? null,
        gammaPctNaC: p.gammaPctNaC ?? null,
        noctC: p.noctC ?? null,
        sprawnoscWzglednaPrzy200WPct: p.sprawnoscWzglednaPrzy200WPct ?? null,
        degradacjaPierwszyRokPct: p.degradacjaPierwszyRokPct ?? null,
        degradacjaLiniowaPctNaRok: p.degradacjaLiniowaPctNaRok ?? null,
        dlugoscMm: p.dlugoscMm ?? null,
        szerokoscMm: p.szerokoscMm ?? null,
        masaKg: p.masaKg ?? null,
        bifacjalny: p.bifacjalny ?? false,
      }))
      const wynik = calculatePorownywarkaPaneli({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        daneGodzinowe: tmy.dane.rekordy,
        miejsce: { nachylenieDeg: input.nachylenieDeg, azymutDeg: input.azymutDeg, ...(input.albedo !== undefined ? { albedo: input.albedo } : {}) },
        liczbaPaneli: input.liczbaPaneli ?? null,
        wymiaryMiejsca: input.wymiaryMiejsca ?? null,
        zapotrzebowanieMiesiaceKwh: input.zuzycieMiesieczneKwh ?? null,
        panele,
        wycena: strefowa
          ? { rodzaj: "dzienNoc", zlKwhDzien: input.cenaDzienZlKwh!, zlKwhNoc: input.cenaNocZlKwh!, oknaTanie: input.oknaTanie! }
          : input.zlNaKwh === undefined
            ? null
            : { rodzaj: "reczna", zlKwh: input.zlNaKwh },
        kryteria: domyslnyWyborKryteriow(),
      })
      const v = wynik.value
      const roznica = v.roznicaZimowa
      return {
        status: wynik.status,
        panele: v.panele.map((p, i) => ({
          nazwa: p.nazwa,
          liczbaPaneli: p.liczbaPaneli,
          mieszcaSieSzt: p.mieszcaSie,
          rozmieszczenie: p.rozmieszczenie === null ? null : { rzedy: p.rozmieszczenie.rzedy, panelowNaStole: p.rozmieszczenie.panelowNaStole, stolowWRzedzie: p.rozmieszczenie.stolowWRzedzie, odstepM: p.rozmieszczenie.odstepM },
          zimaKwh: p.zimaKwh,
          rokKwh: p.rokKwh,
          uzytecznaRokKwh: p.uzytecznaRokKwh,
          nadwyzkaUlamek: p.nadwyzkaUlamek,
          kosztZimowejKwhZl: p.kosztZimowejKwhZl,
          gwiazdki: v.gwiazdki[i] ?? null,
        })),
        liderZimowyNazwa: roznica ? (v.panele.find((p) => p.id === roznica.liderId)?.nazwa ?? null) : null,
        przewagaZimowaKwh: roznica?.roznicaKwh ?? null,
        przewagaZimowaZl: roznica?.roznicaZl ?? null,
        uwzglednionaTemperatura: v.zakresModelu.temperatura,
        uwzglednioneSlabeSwiatlo: v.zakresModelu.slabeSwiatlo,
        zrodloDanych,
        ostrzezenia: tekstyOstrzezen(wynik.warnings),
        zalozenia: tekstyZalozen(wynik.assumptions),
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const porownajPaneleTool = utworzPorownajPaneleTool()
