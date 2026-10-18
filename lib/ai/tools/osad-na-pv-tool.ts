/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 7 "Śnieg i oblodzenie na PV" (dawne 6.7, 6.20) i Ekran 14 "Wieczna mgła i
 * szadź" (dawne 6.18) — wspólny silnik. `operationType: 'read'`. Od wersji 2.0.0 user NIE musi znać dni zalegania ani
 * procentu produkcji pod osadem — silnik zwraca tabelę „co jeśli” (1, 3, 5, 7 dni + przykłady źródła); własne liczby
 * są opcjonalne. Moc grzania (W/m²) musi pochodzić z karty katalogowej od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOsadNaPv } from "@/lib/core/modules/stress-test/osad-na-pv/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Grzanie = z.object({
  mocWNaM2: z.number().describe("Moc z karty katalogowej [W/m²]; 0 = nie podano"),
  godziny: z.number().describe("Ile godzin grzanie pracuje, żeby oczyścić panele; 0 = nie podano"),
})

export const OsadNaPvToolInput = z.object({
  rodzaj: z.enum(["sypki", "mokry", "lod", "szadz"]).describe("Rodzaj osadu: śnieg sypki, śnieg mokry, gołoledź/szron, szadź z mgły"),
  katDeg: z.number().nullable().describe("Kąt nachylenia paneli [°]; null = nie podano"),
  produkcjaDobaKwh: z.number().describe("Produkcja PV na dobę bez osadu [kWh]"),
  dniWlasne: z.number().nullable().describe("Opcjonalnie: ile dni osad zostanie na panelach, jeśli user to wie; null = pokaż tabelę 1/3/5/7 dni"),
  pozostalaWlasnaPct: z
    .number()
    .nullable()
    .describe("Opcjonalnie: produkcja pod osadem [% normalnej], jeśli user to wie; null = przykład źródła (śnieg/lód 0%, szadź 5%)"),
  nierownoStringi: z.boolean().describe("Stringi zasypane nierównomiernie"),
  powierzchniaM2: z.number().describe("Łączna powierzchnia paneli [m²] dla opcji liczonych w W/m²; 0 = nie podano"),
  kabel: Grzanie.describe("Kabel grzewczy na powierzchni panelu"),
  folia: Grzanie.describe("Folia węglowa/grzewcza przyklejona z tyłu panelu"),
  automat: z
    .object({
      mocW: z.number().describe("Moc łączna systemu z karty katalogowej [W]; 0 = nie podano"),
      godziny: z.number().describe("Ile godzin system pracuje, żeby oczyścić panele; 0 = nie podano"),
    })
    .describe("Automatyczny system czyszczenia"),
})
export type OsadNaPvToolInputT = z.infer<typeof OsadNaPvToolInput>

export const OsadNaPvToolOutput = z.object({
  status: z.enum(STATUSY),
  pozostalaProdukcjaPct: z.number(),
  utrataNaDobeKwh: z.number(),
  scenariusze: z.array(
    z.object({ dni: z.number(), utrataKwh: z.number(), produkcjaPodOsademKwh: z.number(), przykladZrodla: z.boolean(), wlasny: z.boolean() }),
  ),
  dniReferencji: z.number(),
  mozeZsunacSie: z.boolean().nullable(),
  opcjeAktywne: z.array(
    z.object({
      id: z.enum(["kabel", "folia", "automat"]),
      energiaKwh: z.number(),
      progOplacalnosciDni: z.number().nullable(),
      oplacaWReferencji: z.boolean(),
    }),
  ),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OsadNaPvToolOutputT = z.infer<typeof OsadNaPvToolOutput>

export const osadNaPvTool: AiToolDefinition<OsadNaPvToolInputT, OsadNaPvToolOutputT> = {
  name: "policz_strate_pv_snieg_szadz",
  description:
    "Strata produkcji PV, gdy panele pokrywa śnieg, lód, szron albo szadź z mgły: tabela „co jeśli” — ile energii " +
    "stracisz przy 1, 3, 5 i 7 dniach zalegania (user nie musi znać dni ani procentu produkcji pod osadem), czy sypki " +
    "śnieg zsunie się sam przy danym kącie (powyżej 30°), ostrzeżenia o mokrym śniegu, gołoledzi, szadzi i nierównym " +
    "zasypaniu stringów, oraz bilans energii (break-even) dla kabla grzewczego, folii grzewczej i automatycznego " +
    "czyszczenia: czy grzanie zużywa więcej, niż odzyskają oczyszczone panele. Rekomendacja: najpierw większy kąt i " +
    "ręczne zgarnianie z ziemi (miękka szczotka, nigdy po oblodzonym dachu), grzanie tylko gdy się zwraca i wtedy na " +
    "żądanie z nadwyżki PV lub agregatu, nigdy z rozładowanej baterii; przeróbki na panelu zwykle wpływają na " +
    "gwarancję producenta. Użyj, gdy user pyta, ile energii straci przez zasypane panele, czy śnieg zsunie się z " +
    "paneli, czy odśnieżać albo czy opłaca się grzanie paneli, albo co zrobi kilka dni mgły z szadzią.",
  inputSchema: OsadNaPvToolInput,
  outputSchema: OsadNaPvToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/osad-na-pv",
  handler: async (input) => {
    const wynik = calculateOsadNaPv(input)
    const v = wynik.value
    return {
      status: wynik.status,
      pozostalaProdukcjaPct: v.pozostalaProdukcjaPct,
      utrataNaDobeKwh: v.utrataNaDobeKwh,
      scenariusze: v.scenariusze,
      dniReferencji: v.dniReferencji,
      mozeZsunacSie: v.mozeZsunacSie,
      opcjeAktywne: v.opcjeAktywne.map((o) => ({
        id: o.id,
        energiaKwh: o.energiaKwh,
        progOplacalnosciDni: o.progOplacalnosciDni,
        oplacaWReferencji: o.oplacaWReferencji,
      })),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
