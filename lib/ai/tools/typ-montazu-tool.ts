/**
 * Narzędzie AI (9.3) dla Ekranu 2, Moduł 3 — "Typ montażu". `operationType: 'read'`.
 * Wejście spłaszczone z polem `tryb` (jak `kalkulatory-pomocnicze-tool.ts`) — brakujące pole trybu
 * → `null` → INCOMPLETE w kalkulatorze, bez zgadywania. Tryby z nasłonecznieniem (pionowy, regulowany)
 * pobierają PVGIS TMY po stronie serwera jak M3/E9. Tryby "Dach skośny"/"Wielopołaciowy" wymagają
 * modelu budynku z Modułu 1 — dla asystenta to narzędzie `ocen_orientacje_powierzchni`.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { NadpisanieTmyPola, pobierzTmyZNadpisaniem } from "./nadpisanie-tmy"
import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { KATEGORIE_TERENU, type KategoriaTerenu } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import { obliczTabeleNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { calculateDachPlaski } from "@/lib/core/modules/pv/typ-montazu/dach-plaski"
import { calculatePionowy } from "@/lib/core/modules/pv/typ-montazu/pionowy"
import { calculateRegulowany } from "@/lib/core/modules/pv/typ-montazu/regulowany"
import { calculateWiata } from "@/lib/core/modules/pv/typ-montazu/wiata"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TypMontazuToolInput = z.object({
  ...NadpisanieTmyPola,
  tryb: z
    .enum(["pionowy", "dach_plaski_grunt", "wiata", "regulowany"])
    .describe("pionowy — panele pionowo (ogrodzenie, ściana); dach_plaski_grunt — stelaż pod kątem; wiata — ile paneli na wiacie/carporcie; regulowany — stelaż naziemny z ręczną zmianą kąta"),
  szerokoscGeograficzna: z.number().min(-90).max(90).optional().describe("Wymagana dla trybów pionowy i regulowany"),
  dlugoscGeograficzna: z.number().min(-180).max(180).optional().describe("Wymagana dla trybów pionowy i regulowany"),
  azymutDeg: z.number().optional().describe("Kierunek paneli, S=180 [°] — pionowy, regulowany"),
  wysokoscDolnejKrawedziM: z.number().optional().describe("Dolna krawędź paneli nad terenem [m] (na dachu — razem z wysokością budynku)"),
  wysokoscTrawySnieguCm: z.number().optional().describe("Pionowy: wysokość trawy/zasp w okolicy [cm]"),
  miejsce: z.enum(["grunt", "dach"]).optional().describe("dach_plaski_grunt: gdzie stoi stelaż"),
  nachylenieDeg: z.number().optional().describe("Kąt nachylenia stelaża albo dachu wiaty [°]"),
  dlugoscWzdluzSpaduM: z.number().optional().describe("Długość pola paneli wzdłuż spadku [m]"),
  szerokoscStelazaM: z.number().optional().describe("Szerokość pola paneli w poprzek spadku [m]"),
  masaPaneliStelazaKg: z.number().optional().describe("Masa paneli i stelaża bez balastu [kg] — tylko z karty katalogowej/wagi podanej przez usera, nigdy nie zgaduj; pomiń → pominięta (po stronie bezpiecznej)"),
  strefaWiatrowa: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional().describe("Strefa wiatrowa NA.1 PN-EN 1991-1-4 — tylko jeśli user podał"),
  kategoriaTerenu: z.enum(KATEGORIE_TERENU as unknown as [string, ...string[]]).optional().describe("0, I, II, III, IV — tylko jeśli user podał lub opisał teren jednoznacznie"),
  wysokoscNpmM: z.number().optional().describe("Wysokość terenu n.p.m. [m]; brak → z PVGIS (tylko tryby z PVGIS)"),
  wspolczynnikPhi: z.number().min(0).max(1).optional().describe("Zabudowa pod stelażem: 0 = pusto, 1 = zapełnione do krawędzi"),
  katMinDeg: z.number().optional().describe("regulowany: najmniejszy kąt regulacji stelaża [°]"),
  katMaxDeg: z.number().optional().describe("regulowany: największy kąt regulacji stelaża [°]"),
  dlugoscWiatyM: z.number().optional(),
  szerokoscWiatyM: z.number().optional(),
  dlugoscPaneluM: z.number().optional(),
  szerokoscPaneluM: z.number().optional(),
  mocPaneluW: z.number().optional(),
})
export type TypMontazuToolInputT = z.infer<typeof TypMontazuToolInput>

export const TypMontazuToolOutput = z.object({
  tryb: z.string(),
  status: z.enum(STATUSY),
  pionowy: z
    .object({
      optimumDeg: z.number(),
      roznicaRocznaPct: z.number(),
      roznicaMiesiecznaPct: z.array(z.number().nullable()).describe("styczeń…grudzień: pion vs najlepszy kąt stały"),
      miesiaceZysku: z.array(z.number()).describe("1 = styczeń"),
    })
    .nullable(),
  dachPlaski: z
    .object({ podniesienieM: z.number(), silaWiatruN: z.number().nullable(), balastKg: z.number().nullable(), mu1Snieg: z.number() })
    .nullable(),
  wiata: z
    .object({ liczbaPaneli: z.number(), mocKwp: z.number(), uklad: z.array(z.string()).describe("bloki: kolumny × rzędy, orientacja") })
    .nullable(),
  regulowany: z
    .object({
      katyMiesieczneDeg: z.array(z.number()),
      zyskRegulacjiPct: z.number(),
      katStalyDeg: z.number(),
      balastWymaganyKg: z.number().nullable(),
      liczbaMiesiecyBezDanychWiatru: z.number(),
    })
    .nullable(),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})
export type TypMontazuToolOutputT = z.infer<typeof TypMontazuToolOutput>

const PUSTY = { pionowy: null, dachPlaski: null, wiata: null, regulowany: null, zrodloDanych: null }
const n = (v: number | undefined) => v ?? null

function odpowiedz(
  input: TypMontazuToolInputT,
  wynik: CalcResult<unknown>,
  czesc: Partial<TypMontazuToolOutputT>,
  dodatkowe: { zrodloDanych?: string; zalozenia?: string[]; assumptions?: Assumption[] } = {},
): TypMontazuToolOutputT {
  return {
    ...PUSTY,
    ...czesc,
    tryb: input.tryb,
    status: wynik.status,
    zrodloDanych: dodatkowe.zrodloDanych ?? null,
    ostrzezenia: tekstyOstrzezen(wynik.warnings),
    zalozenia: [...(dodatkowe.zalozenia ?? []), ...tekstyZalozen([...(dodatkowe.assumptions ?? []), ...wynik.assumptions])],
    wersjaKalkulatora: wynik.calculatorVersion,
  }
}

type Tabela = { ok: true; tabela: TabelaNapromieniowania; zrodlo: string; wysokoscNpmM: number; assumptions: Assumption[] } | { ok: false; status: TypMontazuToolOutputT["status"]; ostrzezenia: string[]; zrodlo: string | null }

async function tabelaZPvgis(input: TypMontazuToolInputT, fetchImpl: typeof fetch): Promise<Tabela> {
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, azymutDeg } = input
  if (lat === undefined || lon === undefined || azymutDeg === undefined) return { ok: false, status: "INCOMPLETE", ostrzezenia: [], zrodlo: null }
  const tmy = await pobierzTmyZNadpisaniem(lat, lon, fetchImpl, input)
  if (!tmy.ok) return { ok: false, status: "INCOMPLETE", ostrzezenia: [KOMUNIKAT_PVGIS[tmy.kod]], zrodlo: null }
  const m = tmy.dane.meta
  const zrodlo = `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})`
  const t = obliczTabeleNapromieniowania({ szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, daneGodzinowe: tmy.dane.rekordy, azymutDeg })
  if (t.status !== "VALID" || t.value === null) return { ok: false, status: t.status, ostrzezenia: tekstyOstrzezen(t.warnings), zrodlo }
  return { ok: true, tabela: t.value, zrodlo, wysokoscNpmM: m.wysokoscNpmM, assumptions: t.assumptions }
}

export function utworzTypMontazuTool(fetchImpl: typeof fetch = fetch): AiToolDefinition<TypMontazuToolInputT, TypMontazuToolOutputT> {
  return {
    name: "policz_typ_montazu_paneli",
    description:
      "Ekran 'Typ montażu' paneli PV. Tryby: 'pionowy' (pion vs najlepszy kąt stały miesiąc po miesiącu z PVGIS, " +
      "trawa/zaspy pod panelami), 'dach_plaski_grunt' (podniesienie krawędzi h = L·sin α, siła wiatru i balast wg " +
      "PN-EN 1991-1-4 tylko dla 0–30° i 90°, śnieg), 'wiata' (ile paneli zmieści się na wiacie/carporcie, kWp, kąt " +
      "samooczyszczania 5–10°), 'regulowany' (stelaż z ręczną zmianą kąta: kąt na każdy miesiąc w zakresie regulacji, " +
      "zysk vs kąt stały, balast dla najgorszego ustawienia). Balast projektowy wg PN-EN 1990 (EQU) tylko przeciw oderwaniu, bez przesuwu i wywracania — zawsze to przekaż. " +
      "Dla oceny połaci dachu z modelu budynku użyj 'ocen_orientacje_powierzchni'. Użyj, gdy user wybiera sposób montażu paneli (pionowo, na dachu płaskim/gruncie, na wiacie, stelaż regulowany) i pyta o kąt, uzysk, wiatr lub balast.",
    inputSchema: TypMontazuToolInput,
    outputSchema: TypMontazuToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/typ-montazu",
    handler: async (input) => {
      const wiatr = {
        strefaWiatrowa: input.strefaWiatrowa ?? null,
        kategoriaTerenu: (input.kategoriaTerenu as KategoriaTerenu | undefined) ?? null,
        wspolczynnikPhi: n(input.wspolczynnikPhi),
      }
      const geometria = {
        dlugoscWzdluzSpaduM: n(input.dlugoscWzdluzSpaduM),
        szerokoscStelazaM: n(input.szerokoscStelazaM),
        wysokoscDolnejKrawedziM: n(input.wysokoscDolnejKrawedziM),
        masaPaneliStelazaKg: n(input.masaPaneliStelazaKg),
      }

      if (input.tryb === "wiata") {
        const w = calculateWiata({
          dlugoscM: n(input.dlugoscWiatyM),
          szerokoscM: n(input.szerokoscWiatyM),
          dlugoscPaneluM: n(input.dlugoscPaneluM),
          szerokoscPaneluM: n(input.szerokoscPaneluM),
          mocPaneluW: n(input.mocPaneluW),
          nachylenieDeg: n(input.nachylenieDeg),
        })
        const v = w.value
        return odpowiedz(input, w, {
          wiata: v && {
            liczbaPaneli: v.liczbaPaneli,
            mocKwp: v.mocKwp,
            uklad: v.bloki.map((b) => `${b.kolumny} × ${b.rzedy}, dłuższy bok wzdłuż ${b.orientacja === "wzdluzDlugosci" ? "długości" : "szerokości"} wiaty`),
          },
        })
      }

      if (input.tryb === "dach_plaski_grunt") {
        const w = calculateDachPlaski({ ...wiatr, ...geometria, wysokoscNpmM: n(input.wysokoscNpmM), miejsce: input.miejsce ?? null, nachylenieDeg: n(input.nachylenieDeg) })
        const v = w.value
        return odpowiedz(input, w, {
          dachPlaski: v && { podniesienieM: v.podniesienieM, silaWiatruN: v.silaWiatruN, balastKg: v.balastKg, mu1Snieg: v.mu1 },
        })
      }

      const t = await tabelaZPvgis(input, fetchImpl)
      if (!t.ok) return { ...PUSTY, tryb: input.tryb, status: t.status, zrodloDanych: t.zrodlo, ostrzezenia: t.ostrzezenia, zalozenia: [] }
      const extra = { zrodloDanych: t.zrodlo, assumptions: t.assumptions }

      if (input.tryb === "pionowy") {
        const w = calculatePionowy({ tabela: t.tabela, wysokoscDolnejKrawedziM: geometria.wysokoscDolnejKrawedziM, wysokoscTrawySnieguCm: n(input.wysokoscTrawySnieguCm) })
        const v = w.value
        return odpowiedz(
          input,
          w,
          {
            pionowy: v && {
              optimumDeg: v.optimumDeg,
              roznicaRocznaPct: v.roznicaRocznaPct,
              roznicaMiesiecznaPct: v.miesiace.map((m) => m.roznicaPct),
              miesiaceZysku: v.miesiaceZysku.map((m) => m + 1),
            },
          },
          extra,
        )
      }

      const w = calculateRegulowany({
        ...wiatr,
        ...geometria,
        tabela: t.tabela,
        wysokoscNpmM: input.wysokoscNpmM ?? t.wysokoscNpmM,
        katMinDeg: n(input.katMinDeg),
        katMaxDeg: n(input.katMaxDeg),
      })
      const v = w.value
      return odpowiedz(
        input,
        w,
        {
          regulowany: v && {
            katyMiesieczneDeg: v.miesiace.map((m) => m.katDeg),
            zyskRegulacjiPct: v.zyskRegulacjiPct,
            katStalyDeg: v.katStalyDeg,
            balastWymaganyKg: v.balastWymaganyKg,
            liczbaMiesiecyBezDanychWiatru: v.liczbaMiesiecyBezDanychWiatru,
          },
        },
        { ...extra, zalozenia: input.wysokoscNpmM === undefined ? [`Wysokość n.p.m. z PVGIS: ${t.wysokoscNpmM} m.`] : [] },
      )
    },
  }
}

export const typMontazuTool = utworzTypMontazuTool()
