/**
 * Narzędzie AI (9.3) dla Ekranu 9, Moduł 3 — "Złoty środek" (D27). `operationType: 'read'`.
 * Dane PVGIS TMY pobierane po stronie serwera (`pobierzTmy`, jak M3/E1). Błąd PVGIS → INCOMPLETE.
 * Wysokość n.p.m. — gdy user nie podał, z metadanych PVGIS (dane lokalizacji, nie zgadywanie).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { NadpisanieTmyPola, pobierzTmyZNadpisaniem } from "./nadpisanie-tmy"
import { KATEGORIE_TERENU } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import { obliczTabeleNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import { calculateZlotySrodek } from "@/lib/core/modules/pv/zloty-srodek/calculator"
import { CENA_BALASTU_PODPOWIEDZ_ZL_KG } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZlotySrodekToolInput = z.object({
  ...NadpisanieTmyPola,
  szerokoscGeograficzna: z.number().min(-90).max(90),
  dlugoscGeograficzna: z.number().min(-180).max(180),
  azymutDeg: z.number().describe("Kierunek paneli: S=180 [°]"),
  strefaWiatrowa: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("Strefa wiatrowa z mapy NA.1 PN-EN 1991-1-4 — tylko jeśli user podał"),
  kategoriaTerenu: z.enum(KATEGORIE_TERENU as unknown as [string, ...string[]]).describe("0, I, II, III, IV (Tablica NA.3) — tylko jeśli user podał lub opisał teren jednoznacznie"),
  wysokoscKonstrukcjiM: z.number().describe("Wysokość górnej krawędzi stelaża nad gruntem [m]"),
  powierzchniaPaneliM2: z.number().describe("Powierzchnia paneli na stelażu [m²]"),
  wspolczynnikPhi: z.number().min(0).max(1).describe("Zabudowa pod stelażem: 0 = pusto, 1 = zapełnione do krawędzi"),
  wysokoscNpmM: z.number().optional().describe("Wysokość terenu n.p.m. [m]; brak → z PVGIS"),
  masaPaneliStelazaKg: z.number().optional().describe("Masa paneli i stelaża bez balastu [kg] — tylko z karty katalogowej/wagi podanej przez usera, nigdy nie zgaduj; pomiń → pominięta (po stronie bezpiecznej)"),
  dlugoscWzdluzSpaduM: z.number().optional().describe("Długość pola paneli wzdłuż spadku L [m] — tylko od usera; razem ze współczynnikiem tarcia włącza sprawdzenie przesuwu i przewracania"),
  wspolczynnikTarcia: z.number().optional().describe("Współczynnik tarcia stelaża/balastu o podłoże μ — tylko od usera, nigdy nie zgaduj"),
  glebokoscPodstawyM: z.number().optional().describe("Głębokość podstawy stelaża w kierunku wiatru [m] — tylko od usera; puste = L·cos α; przy 90° konieczna"),
  metodaCf: z.enum(["liniowa", "trend"]).optional().describe("Metoda szacunku współczynnika siły cf dla kątów 31–89° (norma podaje tylko do 30° i 1,80 dla pionu): liniowa (domyślna) albo trend (ostrożniejsza). Użyj, gdy user pyta o inny sposób oszacowania albo chce porównać; pomiń → liniowa"),
  cenaBalastuZlKg: z.number().optional().describe("Cena balastu [zł/kg]; brak → podpowiedź 1 zł/kg (wykonanie własne)"),
  mocInstalacjiKwp: z.number().optional(),
  wspolczynnikPr: z.number().optional().describe("PR (0–1] — tylko jeśli user podał, nie zgaduj"),
  cenaEnergiiZlKwh: z.number().optional(),
  liczbaLat: z.number().optional(),
  nachylenieDeg: z.number().optional().describe("Kąt do porównania [°]"),
})
export type ZlotySrodekToolInputT = z.infer<typeof ZlotySrodekToolInput>

const Punkt = z.object({
  nachylenieDeg: z.number(),
  energiaPctMaksimum: z.number(),
  silaWiatruN: z.number().nullable(),
  balastKg: z.number().nullable(),
  kosztBalastuZl: z.number().nullable(),
  mu1Snieg: z.number(),
  bilansZl: z.number().nullable(),
  szacunekPozaNorma: z.boolean().describe("true = kąt powyżej 30° do 89°: siła wiatru i balast to szacunek aplikacji, nie wynik normy; kąt ustawia użytkownik na własną odpowiedzialność"),
  balastOderwanieKg: z.number().nullable(),
  balastPrzesuwKg: z.number().nullable(),
  balastPrzewracanieKg: z.number().nullable(),
  podejscieEc7Przesuw: z.enum(["PO1-K1", "PO1-K2", "PO2", "PO3"]).nullable().describe("Podejście obliczeniowe PN-EN 1997-1 (p. 2.4.7.3.4), które daje największy balast przesuwu wg p. 6.5.3 — obwiednia czterech kombinacji, bo brak Załącznika krajowego; null bez danych stateczności. Przekaż userowi, że przesuw liczony jest wg Eurokodu 7, a nie wg EQU"),
  warunekRozstrzygajacy: z.enum(["oderwanie", "przesuw", "przewracanie"]).nullable().describe("Który ze sprawdzonych warunków daje największy balast i wyznacza balastKg/balastProjektowyKg — przekaż userowi, który to warunek"),
  statecznosc: z.boolean().describe("true = w balastKg sprawdzono też przesuw i przewracanie (dane usera) — szacunek aplikacji także do 30°"),
})

export const ZlotySrodekToolOutput = z.object({
  status: z.enum(STATUSY),
  rekomendacjaDeg: z.number().nullable().describe("Najlepszy kąt 0–30° (zakres normy); nigdy kąt z szacunkiem"),
  szacunekLepszyDeg: z.number().nullable().describe("Kąt powyżej 30° (szacunek poza normą) z wyższym bilansem niż rekomendacja — tylko informacja, nie rekomendacja"),
  optimumEnergiiDeg: z.number().nullable(),
  cisnienieSzczytowePa: z.number().nullable(),
  punkty: z.array(Punkt).describe("0–30° co 5°, optimum energii, kąt porównywany, 90°; powyżej 30° do 89° siła i balast to szacunek"),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})
export type ZlotySrodekToolOutputT = z.infer<typeof ZlotySrodekToolOutput>

const PUSTY = { rekomendacjaDeg: null, szacunekLepszyDeg: null, optimumEnergiiDeg: null, cisnienieSzczytowePa: null, punkty: [] }

export function utworzZlotySrodekTool(
  fetchImpl: typeof fetch = fetch,
): AiToolDefinition<ZlotySrodekToolInputT, ZlotySrodekToolOutputT> {
  return {
    name: "policz_zloty_srodek_kata_wiatr_balast",
    description:
      "Porównuje kąty pochylenia stelaża naziemnego 0–90°: energia roczna (PVGIS), siła wiatru odrywająca " +
      "stelaż wg PN-EN 1991-1-4 (0–30° z normy, pion 90° jako siła pozioma, kąty powyżej 30° do 89° jako SZACUNEK aplikacji poza normą — użytkownik ustawia taki kąt na własną odpowiedzialność), balast w kg i jego koszt, śnieg μ1. Wskazuje " +
      "najlepszy kąt (wartość energii minus koszt balastu), gdy user podał moc, PR, cenę kWh i liczbę lat. " +
      "Balast projektowy wg PN-EN 1990 (EQU, γQ = 1,5, γG,inf = 0,9) — domyślnie tylko przeciw oderwaniu; " +
      "gdy user poda długość spadku L i współczynnik tarcia μ (a przy 90° także głębokość podstawy), sprawdza też przesuw (wg PN-EN 1997-1 p. 6.5.3, obwiednia podejść) i przewracanie (EQU) — " +
      "(szacunek aplikacji, norma nie podaje tarcia) — zawsze przekaż, co sprawdzono, a czego nie. Użyj, gdy user pyta o kąt " +
      "a wiatr, balast, bloczki betonowe albo kompromis produkcja–bezpieczeństwo.",
    inputSchema: ZlotySrodekToolInput,
    outputSchema: ZlotySrodekToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/zloty-srodek",
    handler: async (input) => {
      const tmy = await pobierzTmyZNadpisaniem(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl, input)
      if (!tmy.ok) {
        return { status: "INCOMPLETE", ...PUSTY, zrodloDanych: null, ostrzezenia: [KOMUNIKAT_PVGIS[tmy.kod]], zalozenia: [] }
      }
      const m = tmy.dane.meta
      const zrodloDanych = `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})`
      const tabela = obliczTabeleNapromieniowania({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        daneGodzinowe: tmy.dane.rekordy,
        azymutDeg: input.azymutDeg,
      })
      if (tabela.status !== "VALID") {
        return { status: tabela.status, ...PUSTY, zrodloDanych, ostrzezenia: tekstyOstrzezen(tabela.warnings), zalozenia: [] }
      }
      const wynik = calculateZlotySrodek({
        tabela: tabela.value,
        strefaWiatrowa: input.strefaWiatrowa,
        wysokoscNpmM: input.wysokoscNpmM ?? m.wysokoscNpmM,
        kategoriaTerenu: input.kategoriaTerenu as (typeof KATEGORIE_TERENU)[number],
        wysokoscKonstrukcjiM: input.wysokoscKonstrukcjiM,
        powierzchniaPaneliM2: input.powierzchniaPaneliM2,
        wspolczynnikPhi: input.wspolczynnikPhi,
        masaPaneliStelazaKg: input.masaPaneliStelazaKg ?? null,
        dlugoscWzdluzSpaduM: input.dlugoscWzdluzSpaduM ?? null,
        wspolczynnikTarcia: input.wspolczynnikTarcia ?? null,
        glebokoscPodstawyM: input.glebokoscPodstawyM ?? null,
        metodaCf: input.metodaCf ?? "liniowa",
        cenaBalastuZlKg: input.cenaBalastuZlKg ?? CENA_BALASTU_PODPOWIEDZ_ZL_KG,
        mocInstalacjiKwp: input.mocInstalacjiKwp ?? null,
        wspolczynnikPr: input.wspolczynnikPr ?? null,
        cenaEnergiiZlKwh: input.cenaEnergiiZlKwh ?? null,
        liczbaLat: input.liczbaLat ?? null,
        nachylenieDeg: input.nachylenieDeg ?? null,
      })
      const r = wynik.value
      const zalozeniaDodatkowe = input.wysokoscNpmM === undefined ? [`Wysokość n.p.m. z PVGIS: ${m.wysokoscNpmM} m.`] : []
      if (!r) {
        return {
          status: wynik.status,
          ...PUSTY,
          zrodloDanych,
          ostrzezenia: tekstyOstrzezen(wynik.warnings),
          zalozenia: zalozeniaDodatkowe,
          wersjaKalkulatora: wynik.calculatorVersion,
        }
      }
      const hMax = r.punkty[r.optimumEnergiiDeg]!.napromieniowanieRoczneKwhM2
      const katy = [...new Set([0, 5, 10, 15, 20, 25, 30, r.optimumEnergiiDeg, ...(r.wybranyDeg === null ? [] : [r.wybranyDeg]), ...(r.szacunekLepszyDeg === null ? [] : [r.szacunekLepszyDeg]), 90])].sort(
        (a, b) => a - b,
      )
      return {
        status: wynik.status,
        rekomendacjaDeg: r.rekomendacjaDeg,
        szacunekLepszyDeg: r.szacunekLepszyDeg,
        optimumEnergiiDeg: r.optimumEnergiiDeg,
        cisnienieSzczytowePa: r.qpPa,
        punkty: katy.map((k) => {
          const p = r.punkty[k]!
          return {
            nachylenieDeg: k,
            energiaPctMaksimum: (100 * p.napromieniowanieRoczneKwhM2) / hMax,
            silaWiatruN: p.silaWiatruN,
            balastKg: p.balastKg,
            kosztBalastuZl: p.kosztBalastuZl,
            mu1Snieg: p.mu1,
            bilansZl: p.bilansZl,
            szacunekPozaNorma: p.szacunek,
            balastOderwanieKg: p.balastOderwanieKg,
            balastPrzesuwKg: p.balastPrzesuwKg,
            balastPrzewracanieKg: p.balastPrzewracanieKg,
            warunekRozstrzygajacy: p.warunekRozstrzygajacy,
            podejscieEc7Przesuw: p.podejscieEc7Przesuw,
            statecznosc: p.statecznosc,
          }
        }),
        zrodloDanych,
        ostrzezenia: tekstyOstrzezen(wynik.warnings),
        zalozenia: [...zalozeniaDodatkowe, ...tekstyZalozen([...tabela.assumptions, ...wynik.assumptions])],
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const zlotySrodekTool = utworzZlotySrodekTool()
