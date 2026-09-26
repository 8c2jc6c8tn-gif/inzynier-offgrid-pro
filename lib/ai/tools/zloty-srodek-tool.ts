/**
 * Narzędzie AI (9.3) dla Ekranu 9, Moduł 3 — "Złoty środek" (D27). `operationType: 'read'`.
 * Dane PVGIS TMY pobierane po stronie serwera (`pobierzTmy`, jak M3/E1). Błąd PVGIS → INCOMPLETE.
 * Wysokość n.p.m. — gdy user nie podał, z metadanych PVGIS (dane lokalizacji, nie zgadywanie).
 */
import { z } from "zod"
import { pobierzTmy } from "@/lib/adapters/pvgis/tmy"
import { KATEGORIE_TERENU } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import { obliczTabeleNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import { calculateZlotySrodek } from "@/lib/core/modules/pv/zloty-srodek/calculator"
import { CENA_BALASTU_PODPOWIEDZ_ZL_KG } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZlotySrodekToolInput = z.object({
  szerokoscGeograficzna: z.number().min(-90).max(90),
  dlugoscGeograficzna: z.number().min(-180).max(180),
  azymutDeg: z.number().describe("Kierunek paneli: S=180 [°]"),
  strefaWiatrowa: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("Strefa wiatrowa z mapy NA.1 PN-EN 1991-1-4 — tylko jeśli user podał"),
  kategoriaTerenu: z.enum(KATEGORIE_TERENU as unknown as [string, ...string[]]).describe("0, I, II, III, IV (Tablica NA.3) — tylko jeśli user podał lub opisał teren jednoznacznie"),
  wysokoscKonstrukcjiM: z.number().describe("Wysokość górnej krawędzi stelaża nad gruntem [m]"),
  powierzchniaPaneliM2: z.number().describe("Powierzchnia paneli na stelażu [m²]"),
  wspolczynnikPhi: z.number().min(0).max(1).describe("Zabudowa pod stelażem: 0 = pusto, 1 = zapełnione do krawędzi"),
  wysokoscNpmM: z.number().optional().describe("Wysokość terenu n.p.m. [m]; brak → z PVGIS"),
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
})

export const ZlotySrodekToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  rekomendacjaDeg: z.number().nullable(),
  optimumEnergiiDeg: z.number().nullable(),
  cisnienieSzczytowePa: z.number().nullable(),
  punkty: z.array(Punkt).describe("0–30° co 5°, optimum energii, kąt porównywany, 90°"),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})
export type ZlotySrodekToolOutputT = z.infer<typeof ZlotySrodekToolOutput>

const PUSTY = { rekomendacjaDeg: null, optimumEnergiiDeg: null, cisnienieSzczytowePa: null, punkty: [] }

export function utworzZlotySrodekTool(
  fetchImpl: typeof fetch = fetch,
): AiToolDefinition<ZlotySrodekToolInputT, ZlotySrodekToolOutputT> {
  return {
    name: "policz_zloty_srodek_kata_wiatr_balast",
    description:
      "Porównuje kąty pochylenia stelaża naziemnego 0–90°: energia roczna (PVGIS), siła wiatru odrywająca " +
      "stelaż wg PN-EN 1991-1-4 (tylko 0–30° i pion 90°), balast w kg i jego koszt, śnieg μ1. Wskazuje " +
      "najlepszy kąt (wartość energii minus koszt balastu), gdy user podał moc, PR, cenę kWh i liczbę lat. " +
      "Balast projektowy wg PN-EN 1990 (EQU, γQ = 1,5, γG,inf = 0,9) — tylko przeciw oderwaniu; przesuwu i " +
      "wywracania nie sprawdza — zawsze to przekaż. Użyj, gdy user pyta o kąt " +
      "a wiatr, balast, bloczki betonowe albo kompromis produkcja–bezpieczeństwo.",
    inputSchema: ZlotySrodekToolInput,
    outputSchema: ZlotySrodekToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/zloty-srodek",
    handler: async (input) => {
      const tmy = await pobierzTmy(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl)
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
      const katy = [...new Set([0, 5, 10, 15, 20, 25, 30, r.optimumEnergiiDeg, ...(r.wybranyDeg === null ? [] : [r.wybranyDeg]), 90])].sort(
        (a, b) => a - b,
      )
      return {
        status: wynik.status,
        rekomendacjaDeg: r.rekomendacjaDeg,
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
