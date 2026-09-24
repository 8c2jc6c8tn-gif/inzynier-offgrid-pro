/**
 * Narzędzie AI (9.3) dla Ekranu 3, Moduł 1 — "Analiza zacienienia". `operationType: 'read'`.
 *
 * W rozmowie user opisuje przeszkodę względem paneli ("dąb 9 m, 12 m na południe"), nie w
 * układzie x/y — dlatego wejście to odległość + kierunek, a handler tylko przelicza je na układ
 * lokalny kalkulatora (x — wschód, y — północ, początek w punkcie analizy). To zamiana
 * współrzędnych, nie model fizyczny — model zacienienia jest w całości w kalkulatorze.
 * Budynek: prostokąt, którego bliższa ściana jest prostopadła do kierunku od paneli.
 */
import { z } from "zod"
import { calculateAnalizaZacienienia } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import type { Przeszkoda, Punkt2D } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const RAD = Math.PI / 180

const polozenie = {
  odlegloscM: z.number().describe("Odległość w poziomie od paneli [m] — do pnia drzewa / do bliższej ściany budynku"),
  kierunekDeg: z.number().describe("Kierunek od paneli do przeszkody: N=0, E=90, S=180, W=270 [°]"),
}

const Drzewo = z.object({
  typ: z.literal("drzewo"),
  nazwa: z.string(),
  ...polozenie,
  wysokoscM: z.number().describe("Obecna wysokość drzewa [m]"),
  promienKoronyM: z.number().describe("Promień korony [m]"),
  wysokoscPrognozowanaM: z
    .number()
    .optional()
    .describe("Wysokość drzewa za latPrognozy lat [m] — tylko jeśli podał ją user; nie szacuj tempa wzrostu"),
})

const Budynek = z.object({
  typ: z.literal("budynek"),
  nazwa: z.string(),
  ...polozenie,
  szerokoscM: z.number().describe("Długość ściany zwróconej do paneli [m]"),
  glebokoscM: z.number().describe("Wymiar budynku w kierunku od paneli [m]"),
  wysokoscM: z.number().describe("Wysokość budynku (najwyższy punkt) [m]"),
})

export const AnalizaZacienieniaToolInput = z.object({
  szerokoscGeograficzna: z.number().describe("[°], np. 52.23 dla Warszawy"),
  dlugoscGeograficzna: z.number().describe("[°], np. 21.01 dla Warszawy"),
  nachyleniePowierzchniDeg: z.number().describe("Nachylenie paneli od poziomu [°]"),
  azymutPowierzchniDeg: z.number().describe("Kierunek, w który patrzą panele: N=0, E=90, S=180, W=270 [°]"),
  wysokoscPaneliM: z.number().describe("Wysokość środka pola paneli nad gruntem [m] (ten sam poziom co wysokości przeszkód)"),
  przeszkody: z.array(z.discriminatedUnion("typ", [Drzewo, Budynek])),
  latPrognozy: z.number().optional().describe("Za ile lat jest wysokoscPrognozowanaM drzew"),
})

export type AnalizaZacienieniaToolInputT = z.infer<typeof AnalizaZacienieniaToolInput>

const Scenariusz = z.object({
  strataRocznaProcent: z.number(),
  strataMiesiecznaProcent: z.array(z.number()).describe("Indeks 0 = styczeń"),
  udzialPrzeszkod: z.array(z.object({ nazwa: z.string(), procent: z.number() })),
})

export const AnalizaZacienieniaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  obecnie: Scenariusz,
  prognoza: Scenariusz.nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type AnalizaZacienieniaToolOutputT = z.infer<typeof AnalizaZacienieniaToolOutput>

type PrzeszkodaWejscia = AnalizaZacienieniaToolInputT["przeszkody"][number]

/** Odległość + kierunek od paneli → układ lokalny (x — wschód, y — północ). */
export function przeszkodaLokalna(p: PrzeszkodaWejscia): Przeszkoda {
  const u: Punkt2D = { x: Math.sin(p.kierunekDeg * RAD), y: Math.cos(p.kierunekDeg * RAD) }
  const w = (d: number, s: number): Punkt2D => ({ x: d * u.x + s * u.y, y: d * u.y - s * u.x })
  if (p.typ === "drzewo") {
    return {
      typ: "drzewo",
      nazwa: p.nazwa,
      srodek: w(p.odlegloscM, 0),
      promienKoronyM: p.promienKoronyM,
      wysokoscM: p.wysokoscM,
      wysokoscPrognozowanaM: p.wysokoscPrognozowanaM,
    }
  }
  const d0 = p.odlegloscM
  const d1 = p.odlegloscM + p.glebokoscM
  const s = p.szerokoscM / 2
  return { typ: "bryla", nazwa: p.nazwa, obrys: [w(d0, -s), w(d0, s), w(d1, s), w(d1, -s)], wysokoscM: p.wysokoscM }
}

const scenariusz = (s: { strataRocznaProcent: number; strataMiesiecznaProcent: number[]; udzialPrzeszkod: { nazwa: string; procent: number }[] }) => ({
  strataRocznaProcent: s.strataRocznaProcent,
  strataMiesiecznaProcent: s.strataMiesiecznaProcent,
  udzialPrzeszkod: s.udzialPrzeszkod,
})

export const analizaZacienieniaTool: AiToolDefinition<AnalizaZacienieniaToolInputT, AnalizaZacienieniaToolOutputT> = {
  name: "policz_zacienienie",
  description:
    "Liczy roczną i miesięczną stratę promieniowania bezpośredniego na panelach od drzew i budynków w " +
    "okolicy (przy bezchmurnym niebie), udział każdej przeszkody w stracie oraz — jeśli user poda " +
    "przyszłą wysokość drzew — prognozę. Użyj, gdy user pyta, ile zabierze cień drzewa/budynku, czy " +
    "przeszkoda zacienia panele zimą, albo jak zmieni się zacienienie, gdy drzewo urośnie.",
  inputSchema: AnalizaZacienieniaToolInput,
  outputSchema: AnalizaZacienieniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "lokalizacja/analiza-zacienienia",
  handler: async (input) => {
    const wynik = calculateAnalizaZacienienia({
      szerokoscGeograficzna: input.szerokoscGeograficzna,
      dlugoscGeograficzna: input.dlugoscGeograficzna,
      nachyleniePowierzchniDeg: input.nachyleniePowierzchniDeg,
      azymutPowierzchniDeg: input.azymutPowierzchniDeg,
      punkt: { x: 0, y: 0, z: input.wysokoscPaneliM },
      przeszkody: input.przeszkody.map(przeszkodaLokalna),
      latPrognozy: input.latPrognozy,
    })
    return {
      status: wynik.status,
      obecnie: scenariusz(wynik.value.obecnie),
      prognoza: wynik.value.prognoza && scenariusz(wynik.value.prognoza),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
