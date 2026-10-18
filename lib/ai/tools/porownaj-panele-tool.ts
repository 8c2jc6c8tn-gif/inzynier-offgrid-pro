/**
 * Narzędzie AI (9.3) dla Porównywarki paneli PV (D81, Moduł 3). `operationType: 'read'`.
 * PVGIS TMY pobierany w handlerze po stronie serwera (jak Ekran 1 M3 / Ekran 4 M1, D22). Handler tylko deleguje do
 * `calculatePorownywarkaPaneli` — parametry paneli pochodzą od użytkownika (karta katalogowa), model ich nie zgaduje.
 */
import { z } from "zod"
import { pobierzTmy } from "@/lib/adapters/pvgis/tmy"
import { profilDobowyZPor } from "@/lib/core/modules/pv/porownywarka-paneli/bilans-godzinowy"
import { MAKS_PANELI_W_ZESTAWIE } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import { calculatePorownywarkaPaneli } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { DanePanelu, WarunkiObciazen } from "@/lib/core/modules/pv/porownywarka-paneli/input"
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
  elektryka: z
    .object({
      vocV: z.number().describe("Napięcie jałowe Voc w STC [V] z karty"),
      vmpV: z.number().describe("Napięcie Vmp w STC [V] z karty"),
      iscA: z.number().describe("Prąd zwarciowy Isc w STC [A] z karty"),
      impA: z.number().describe("Prąd Imp w STC [A] z karty"),
      betaVocPctNaC: z.number().describe("Współczynnik temperaturowy Voc β [%/°C], ujemny — z karty"),
      maxNapieciaSystemuV: z.number().describe("Maksymalne napięcie układu DC z karty [V]"),
      maxBezpiecznikSzeregowyA: z.number().optional().describe("Maks. bezpiecznik szeregowy z karty [A]; pomiń, jeśli karta go nie podaje"),
    })
    .optional()
    .describe("Dane elektryczne z karty (wszystkie z karty, nie zgaduj) — razem z tminC pozwalają ocenić stringi"),
  obciazenie: z
    .object({
      przodPa: z.number().describe("Maks. obciążenie statyczne od przodu z karty [Pa]"),
      tylPa: z.number().optional().describe("Maks. obciążenie od tyłu z karty [Pa]; pomiń, jeśli karta go nie podaje"),
      wiatrPrzodPa: z.number().optional().describe("Tylko gdy karta podaje osobno niższą wartość dla wiatru od przodu niż dla śniegu (np. śnieg 5400, wiatr 4000)"),
      rodzaj: z.enum(["testowe", "obliczeniowe"]).describe("testowe = wartość z badania IEC 61215 (obliczeniowa to 1/1,5 tej liczby); obliczeniowe = karta wprost mówi o wartości obliczeniowej. Gdy karta tego nie rozstrzyga, wybierz testowe"),
    })
    .optional()
    .describe("Obciążenie mechaniczne z karty (nie zgaduj) — razem z obciazenia pozwala porównać panel z Eurokodem"),
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

const Obciazenia = z.object({
  strefaSniegowa: z.number().int().min(1).max(5).optional().describe("Strefa obciążenia śniegiem gruntu 1–5 (mapa NB.1) — tylko od usera, aplikacja nie wyznacza stref z lokalizacji"),
  strefaWiatrowa: z.number().int().min(1).max(3).optional().describe("Strefa wiatrowa 1–3 (rysunek NA.1) — tylko od usera"),
  wysokoscNpmM: z.number().optional().describe("Wysokość miejsca nad poziomem morza [m]"),
  kategoriaTerenu: z.enum(["0", "I", "II", "III", "IV"]).optional().describe("Kategoria terenu wokół (0 morze … IV miasto) — do wiatru"),
  wysokoscKonstrukcjiM: z.number().optional().describe("Wysokość górnej krawędzi paneli nad gruntem [m] — do wiatru"),
  ekspozycjaSniegu: z.enum(["wystawiony", "normalny", "osloniety"]).optional().describe("Otoczenie pod kątem zwiewania śniegu; bez podania „normalny”"),
  montaz: z.enum(["rownolegly", "pochylony-na-konstrukcji"]).describe("Panele pochylone na konstrukcji (0–30°): wiatr z Tablicy 7.6. Równoległe do połaci: wiatr z Tablic 7.3/7.4 po podaniu typDachu (5–75°); ściany — tylko śnieg"),
  typDachu: z.enum(["jednospadowy", "dwuspadowy"]).optional().describe("Rodzaj połaci, na której leżą panele równoległe — bez niego wiatru nie liczę (tylko śnieg). Ciśnienie zewnętrzne połaci jako górne oszacowanie, nie cp,net panelu"),
})

const BilansGodzinowy = z.object({
  pojemnoscKwh: z.number().describe("Pojemność użyteczna baterii [kWh]; 0, jeśli user nie ma baterii — tylko od usera albo z ekranu doboru pojemności"),
  sprawnoscCyklu: z.number().optional().describe("Sprawność cyklu baterii 0–1 (np. 0,92); pomiń, jeśli user nie zna — policzę z 100% i powiem o tym w założeniach"),
  celZimyPct: z
    .number()
    .optional()
    .describe("Cel: jaką część zużycia zimowego (XI–II) mają pokryć panele [%, 0–100] — tylko od usera, nie zgaduj; z nim podam, ile paneli to da (w sumie i godzina po godzinie z baterią)"),
  profilDobowyPct: z
    .object({
      dzienPct: z.number().min(0).describe("Jaka część dobowego zużycia przypada na dzień 6–18 [%]"),
      wieczorPct: z.number().min(0).describe("Jaka część dobowego zużycia przypada na wieczór 18–22 [%]"),
      nocPct: z.number().min(0).describe("Jaka część dobowego zużycia przypada na noc 22–6 [%]"),
    })
    .optional()
    .describe("Profil dobowy zużycia w trzech porach doby (czas polski) — tylko od usera, nie zgaduj; bez niego zużycie jest rozłożone równo na dobę. Udziały są przeliczane proporcjonalnie, więc nie muszą dawać 100"),
  limityMocyKw: z
    .object({
      ladowanieKw: z.number().positive().optional().describe("Maks. moc ładowania baterii [kW]"),
      rozladowanieKw: z.number().positive().optional().describe("Maks. moc rozładowania baterii [kW]"),
      falownikKw: z.number().positive().optional().describe("Moc ciągła falownika [kW]"),
    })
    .optional()
    .describe("Limity mocy sprzętu z kart katalogowych — tylko od usera, nie zgaduj; pominięty limit = bez ograniczenia tej mocy. Limity obcinają ładowanie i rozładowanie baterii oraz moc dla odbiorów w bilansie godzinowym"),
})

/** Profil z trzech pór doby; zera we wszystkich porach przechodzą do silnika jako profil niepoprawny (błąd danych), nie jako ciche „równo na dobę”. */
function profilZWejscia(p: { dzienPct: number; wieczorPct: number; nocPct: number } | undefined): number[] | null {
  if (!p) return null
  return profilDobowyZPor(p.dzienPct, p.wieczorPct, p.nocPct) ?? new Array<number>(24).fill(0)
}

/** Power limits as the engine takes them: a limit that was not given is `null` (unlimited); no object at all when none was given. */
function limityZWejscia(l: { ladowanieKw?: number; rozladowanieKw?: number; falownikKw?: number } | undefined) {
  if (!l || (l.ladowanieKw === undefined && l.rozladowanieKw === undefined && l.falownikKw === undefined)) return null
  return { ladowanieKw: l.ladowanieKw ?? null, rozladowanieKw: l.rozladowanieKw ?? null, falownikKw: l.falownikKw ?? null }
}

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
  testZanizeniaMocyPct: z
    .number()
    .optional()
    .describe("Test „co, jeśli panel ma o tyle % mniej mocy, niż deklaruje karta lub naklejka” (0–100, bez 0 i 100) — tylko od usera, bez wartości domyślnej; nie zmienia głównych wyników, dokłada pole zanizenieMocy"),
  tminC: z.number().optional().describe("Najniższa temperatura powietrza w miejscu [°C] do napięcia stringów zimą — tylko od usera (rok typowy z PVGIS nie jest temperaturą projektową), dopytaj"),
  wymiaryMiejsca: WymiaryMiejsca.optional().describe("Wymiary miejsca montażu — tylko od usera, nie zgaduj"),
  obciazenia: Obciazenia.optional().describe("Warunki śniegu i wiatru miejsca do porównania obciążenia z nośnością paneli z karty (Eurokod) — tylko od usera"),
  zuzycieMiesieczneKwh: z
    .array(z.number())
    .length(12)
    .optional()
    .describe("Zużycie energii w miesiącach [kWh], styczeń pierwszy, 12 liczb; z nim wycenię tylko energię wykorzystaną (nadwyżka osobno)"),
  bilansGodzinowy: BilansGodzinowy.optional().describe("Bilans godzina po godzinie z baterią (wymaga zuzycieMiesieczneKwh): ile energii z paneli zużyte od razu, ile z baterii, ile brakuje. Zużycie rozkładam równo na dobę, bez limitów mocy"),
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
      masaNaM2Kg: z.number().nullable().describe("Masa panelu na m² jego powierzchni [kg/m²]; null bez masy lub wymiarów"),
      elektryka: z
        .object({
          vocZimaPanelaV: z.number().describe("Voc jednego panelu w najniższej temperaturze [V]"),
          maxPaneliWSzeregu: z.number().describe("Maks. liczba paneli w stringu wg limitu napięcia układu z karty (to nie limit falownika)"),
          warianty: z.array(
            z.object({
              panelowWSzeregu: z.number(),
              stringowRownolegle: z.number(),
              vocZimaStringuV: z.number(),
              iscMacierzyA: z.number(),
              ochronaStringowWymagana: z.boolean().nullable().describe("null = karta nie podaje bezpiecznika szeregowego"),
              alternatywaKablowa: z.boolean().nullable().describe("true = bezpiecznik niewymagany, ale norma żąda kabla stringu ≥ (Ns−1)·Isc,max"),
            }),
          ),
        })
        .nullable()
        .describe("Równe układy stringów mieszczące się w limicie napięcia panelu; null bez danych elektrycznych albo bez tminC. Bez falownika nie wskazuję najlepszego układu — okno MPPT i Voc wejścia sprawdza kolejny etap"),
      obciazenia: z
        .object({
          ciezarWlasnyPa: z.number().nullable().describe("Ciężar własny panelu prostopadle do powierzchni [Pa]; null bez masy lub wymiarów"),
          oceny: z.array(
            z.object({
              sytuacja: z.enum(["docisk", "docisk-srodek", "docisk-krawedz", "odrywanie-srodek", "odrywanie-krawedz"]),
              edPa: z.number().describe("Obciążenie obliczeniowe wg Eurokodu (STR, wzór 6.10) [Pa]"),
              rdPa: z.number().nullable().describe("Nośność obliczeniowa z karty [Pa] (testowa ÷ 1,5); null bez karty"),
              wykorzystaniePct: z.number().nullable(),
              przekroczone: z.boolean().nullable(),
            }),
          ),
        })
        .nullable()
        .describe("Porównanie z Eurokodem; null bez warunków miejsca. To nie projekt konstrukcji — nie sprawdza stelaża ani dachu"),
      zimaKwh: z.number().describe("Energia zimą XI–II [kWh] dla podanej liczby paneli"),
      rokKwh: z.number(),
      uzytecznaRokKwh: z.number().nullable().describe("Energia wykorzystana w roku [kWh]; null bez zużycia"),
      nadwyzkaUlamek: z.number().nullable().describe("Ułamek produkcji ponad zużycie 0–1; null bez zużycia"),
      bilansGodzinowy: z
        .object({
          pokrycieRokPct: z.number().nullable().describe("Jaka część rocznego zużycia pokryta z paneli (od razu albo przez baterię) [%]"),
          pokrycieZimaPct: z.number().nullable().describe("To samo dla zimy XI–II [%]"),
          bezposrednioRokKwh: z.number().describe("Zużyte od razu z paneli w roku [kWh]"),
          zBateriiRokKwh: z.number().describe("Dostarczone z baterii w roku [kWh]"),
          brakRokKwh: z.number().describe("Brakująca energia (sieć albo agregat) w roku [kWh]"),
          brakZimaKwh: z.number().describe("Brakująca energia zimą XI–II [kWh]"),
          odcieteRokKwh: z.number().describe("Produkcja, która nie zmieściła się w baterii ani nie miała odbiorcy [kWh/rok]"),
          cykleRok: z.number().nullable().describe("Pełne równoważne cykle baterii w roku; null bez baterii"),
          kosztBrakuRokZl: z.number().nullable().describe("Wartość brakującej energii w roku [zł]; null bez wyceny kWh"),
          doborNaZime: z
            .object({
              celPct: z.number(),
              zimaNaPanelKwh: z.number().describe("Energia jednego panelu zimą XI–II [kWh]"),
              panelowSumowo: z.number().nullable().describe("Liczba paneli, gdy porównujemy tylko sumy energii zimą (bez dopasowania godzin) — zbyt optymistyczna"),
              panelowGodzinowo: z.number().nullable().describe("Najmniejsza liczba paneli, przy której bilans godzinowy z podaną baterią osiąga cel; null = cel nieosiągalny przy dowolnej liczbie paneli"),
              pokrycieMaksPct: z.number().describe("Fizyczne maksimum pokrycia zimy przy dowolnej liczbie paneli [%] — ile najwyżej da się uzyskać z tą baterią"),
              miejsceNaPaneli: z.number().nullable().describe("Ile paneli mieści się w podanym miejscu; null = wymiarów miejsca albo panelu brak"),
              pokrycieNaMiejscuPct: z.number().nullable().describe("Pokrycie zimy przy tylu panelach, ile mieści się w miejscu [%]; null = miejsce nieznane"),
              miesciSieNaMiejscu: z.boolean().nullable().describe("Czy potrzebna liczba paneli mieści się w miejscu; false także gdy cel jest nieosiągalny; null = miejsce nieznane"),
            })
            .nullable()
            .describe("Dobór liczby paneli na cel zimowy; null bez celu"),
        })
        .nullable()
        .describe("Bilans godzinowy; null bez pojemności baterii albo bez zużycia. Model uproszczony — porównuje panele i baterie ze sobą, nie wymiaruje instalacji"),
      kosztZimowejKwhZl: z.number().nullable().describe("Koszt zimowej kWh w 25 latach [zł/kWh]; null bez ceny"),
      zanizenieMocy: z
        .object({
          zanizeniePct: z.number(),
          mocKwp: z.number().describe("Moc zestawu po zaniżeniu [kWp]"),
          zimaKwh: z.number(),
          rokKwh: z.number(),
          cenaZaWpZl: z.number().nullable().describe("Cena za Wp rzeczywistej mocy [zł/Wp]; null bez ceny"),
          kosztZimowejKwhZl: z.number().nullable(),
          okresZwrotuLat: z.number().nullable(),
          wartoscRokZl: z.number().nullable(),
        })
        .nullable()
        .describe("Wynik testu zaniżenia mocy przy tej samej cenie panelu; null, gdy user nie podał testZanizeniaMocyPct"),
      gwiazdki: z.number().nullable().describe("Ocena 0–10 względna w obrębie porównywanego zestawu; null bez kryteriów albo przy jednym panelu"),
    }),
  ),
  wykluczone: z
    .array(z.object({ nazwa: z.string(), brakuje: z.array(z.enum(["gamma", "noct"])) }))
    .describe("Panele wykluczone z porównania, bo karta nie podaje γ albo NOCT, a inne panele je mają (nie ma ich w `panele`); wpisz brakującą wartość z karty"),
  obciazeniaMiejsca: z
    .object({
      sniegNaPaneluPa: z.number().nullable().describe("Śnieg prostopadle do panelu s·cos²α [Pa]; null bez strefy albo wysokości"),
      wiatrQpPa: z.number().nullable().describe("Szczytowe ciśnienie wiatru q_p [Pa]; null, gdy wiatru nie policzono"),
      powodBrakuWiatru: z.enum(["brak-danych", "brak-typu-dachu", "kat-poza-zakresem"]).nullable(),
      wspolczynnikiWiatru: z
        .enum(["wiata-7.6", "polac-7.3-7.4", "wlasne-oszacowanie"])
        .nullable()
        .describe("Skąd współczynniki wiatru: Tablica 7.6 (panele na konstrukcji 0–30°), Tablice 7.3/7.4 (górne oszacowanie dla paneli równoległych do połaci) albo WŁASNE oszacowanie aplikacji dla konstrukcji 30–90° — to ostatnie nie ma podstawy w żadnej normie, powiedz to userowi"),
    })
    .nullable(),
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
  wykluczone: [],
  obciazeniaMiejsca: null,
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
      "Z danymi elektrycznymi z karty i najniższą temperaturą miejsca ocenia też napięcie stringów zimą, limit paneli w szeregu i ochronę stringów. " +
      "Z obciążeniem mechanicznym z karty i warunkami miejsca (strefa śniegowa i wiatrowa, wysokość, teren) porównuje obciążenie śniegiem i wiatrem wg Eurokodu z nośnością panelu. " +
      "Z pojemnością baterii i miesięcznym zużyciem liczy bilans godzinowy: ile energii z paneli zużyte od razu, ile przejdzie przez baterię, ile brakuje zimą i w roku; z celem zimowym podaje też, ile paneli pokryje zimę. " +
      "Użyj, gdy user waha się między dwoma lub więcej modelami paneli, pyta, który panel da więcej zimą, albo ile paneli wolno połączyć w jednym stringu.",
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
        elektryka: p.elektryka ? { ...p.elektryka, maxBezpiecznikSzeregowyA: p.elektryka.maxBezpiecznikSzeregowyA ?? null } : null,
        obciazenie: p.obciazenie ? { ...p.obciazenie, tylPa: p.obciazenie.tylPa ?? null } : null,
      }))
      const o = input.obciazenia
      const wynik = calculatePorownywarkaPaneli({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        daneGodzinowe: tmy.dane.rekordy,
        miejsce: { nachylenieDeg: input.nachylenieDeg, azymutDeg: input.azymutDeg, ...(input.albedo !== undefined ? { albedo: input.albedo } : {}) },
        liczbaPaneli: input.liczbaPaneli ?? null,
        wymiaryMiejsca: input.wymiaryMiejsca ?? null,
        zapotrzebowanieMiesiaceKwh: input.zuzycieMiesieczneKwh ?? null,
        bilansGodzinowy: input.bilansGodzinowy ? { pojemnoscKwh: input.bilansGodzinowy.pojemnoscKwh, sprawnoscCyklu: input.bilansGodzinowy.sprawnoscCyklu ?? null, celZimyPct: input.bilansGodzinowy.celZimyPct ?? null, profilDobowy: profilZWejscia(input.bilansGodzinowy.profilDobowyPct), limityMocyKw: limityZWejscia(input.bilansGodzinowy.limityMocyKw) } : null,
        tminC: input.tminC ?? null,
        testZanizeniaMocyPct: input.testZanizeniaMocyPct ?? null,
        obciazenia: o
          ? {
              strefaSniegowa: (o.strefaSniegowa ?? null) as WarunkiObciazen["strefaSniegowa"],
              strefaWiatrowa: (o.strefaWiatrowa ?? null) as WarunkiObciazen["strefaWiatrowa"],
              wysokoscNpmM: o.wysokoscNpmM ?? null,
              kategoriaTerenu: o.kategoriaTerenu ?? null,
              wysokoscKonstrukcjiM: o.wysokoscKonstrukcjiM ?? null,
              ekspozycjaSniegu: o.ekspozycjaSniegu ?? "normalny",
              montaz: o.montaz,
              typDachu: o.typDachu ?? null,
            }
          : null,
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
          masaNaM2Kg: p.masaNaM2Kg,
          elektryka:
            p.elektryka === null
              ? null
              : {
                  vocZimaPanelaV: p.elektryka.vocZimaPanelaV,
                  maxPaneliWSzeregu: p.elektryka.maxPaneliWSzeregu,
                  warianty: p.elektryka.warianty.map((w) => ({
                    panelowWSzeregu: w.panelowWSzeregu,
                    stringowRownolegle: w.stringowRownolegle,
                    vocZimaStringuV: w.vocZimaStringuV,
                    iscMacierzyA: w.iscMacierzyA,
                    ochronaStringowWymagana: w.ochrona === null ? null : w.ochrona.wymagana,
                    alternatywaKablowa: w.ochrona === null ? null : w.ochrona.alternatywaKablowa,
                  })),
                },
          obciazenia:
            p.obciazenia === null
              ? null
              : {
                  ciezarWlasnyPa: p.obciazenia.ciezarWlasnyPa,
                  oceny: p.obciazenia.oceny.map((x) => ({ sytuacja: x.sytuacja, edPa: x.edPa, rdPa: x.rdPa, wykorzystaniePct: x.wykorzystaniePct, przekroczone: x.przekroczone })),
                },
          zimaKwh: p.zimaKwh,
          rokKwh: p.rokKwh,
          uzytecznaRokKwh: p.uzytecznaRokKwh,
          nadwyzkaUlamek: p.nadwyzkaUlamek,
          bilansGodzinowy:
            p.bilansGodzinowy === null
              ? null
              : {
                  pokrycieRokPct: p.bilansGodzinowy.pokrycieRokPct,
                  pokrycieZimaPct: p.bilansGodzinowy.pokrycieZimaPct,
                  bezposrednioRokKwh: p.bilansGodzinowy.bezposrednioRokKwh,
                  zBateriiRokKwh: p.bilansGodzinowy.zBateriiRokKwh,
                  brakRokKwh: p.bilansGodzinowy.brakRokKwh,
                  brakZimaKwh: p.bilansGodzinowy.brakZimaKwh,
                  odcieteRokKwh: p.bilansGodzinowy.odcieteRokKwh,
                  cykleRok: p.bilansGodzinowy.cykleRok,
                  kosztBrakuRokZl: p.bilansGodzinowy.kosztBrakuRokZl,
                  doborNaZime:
                    p.bilansGodzinowy.doborNaZime === null
                      ? null
                      : {
                          celPct: p.bilansGodzinowy.doborNaZime.celPct,
                          zimaNaPanelKwh: p.bilansGodzinowy.doborNaZime.zimaNaPanelKwh,
                          panelowSumowo: p.bilansGodzinowy.doborNaZime.panelowSumowo,
                          panelowGodzinowo: p.bilansGodzinowy.doborNaZime.panelowGodzinowo,
                          pokrycieMaksPct: p.bilansGodzinowy.doborNaZime.pokrycieMaksPct,
                          miejsceNaPaneli: p.bilansGodzinowy.doborNaZime.miejsceNaPaneli,
                          pokrycieNaMiejscuPct: p.bilansGodzinowy.doborNaZime.pokrycieNaMiejscuPct,
                          miesciSieNaMiejscu: p.bilansGodzinowy.doborNaZime.miesciSieNaMiejscu,
                        },
                },
          kosztZimowejKwhZl: p.kosztZimowejKwhZl,
          zanizenieMocy:
            p.zanizenieMocy === null
              ? null
              : {
                  zanizeniePct: p.zanizenieMocy.zanizeniePct,
                  mocKwp: p.zanizenieMocy.mocKwp,
                  zimaKwh: p.zanizenieMocy.zimaKwh,
                  rokKwh: p.zanizenieMocy.rokKwh,
                  cenaZaWpZl: p.zanizenieMocy.cenaZaWpZl,
                  kosztZimowejKwhZl: p.zanizenieMocy.kosztZimowejKwhZl,
                  okresZwrotuLat: p.zanizenieMocy.okresZwrotuLat,
                  wartoscRokZl: p.zanizenieMocy.wartoscRokZl,
                },
          gwiazdki: v.gwiazdki[i] ?? null,
        })),
        wykluczone: v.wykluczone.map((w) => ({ nazwa: w.nazwa, brakuje: w.brakuje })),
        obciazeniaMiejsca: v.obciazeniaMiejsca
          ? { sniegNaPaneluPa: v.obciazeniaMiejsca.snieg?.sNormalnaPa ?? null, wiatrQpPa: v.obciazeniaMiejsca.wiatr?.qpPa ?? null, powodBrakuWiatru: v.obciazeniaMiejsca.powodBrakuWiatru, wspolczynnikiWiatru: v.obciazeniaMiejsca.wiatr ? ({ wiata: "wiata-7.6", polac: "polac-7.3-7.4", wlasne: "wlasne-oszacowanie" } as const)[v.obciazeniaMiejsca.wiatr.zrodloCp] : null }
          : null,
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
