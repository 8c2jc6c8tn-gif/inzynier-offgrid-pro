/**
 * Shared Zod pieces of the M14 AI tools (rozbij_rachunek_za_prad, dobierz_taryfe) — the same enums
 * as the rates file schema, so the model cannot pass an OSD, group or zone the data does not know.
 */
import { z } from "zod"
import { GrupaSchema, OkresRozliczeniowySchema, OsdIdSchema, StrefaSchema } from "@/lib/core/dane/rozliczenia-pl-2026"

export const SiecOsdSchema = OsdIdSchema.describe(
  "OSD: tauron, energa, stoen, enea (stawki ✅ 2026 w danych), pge, inny (brak stawek — potrzebne dane z faktury)",
)
export const SiecGrupaSchema = GrupaSchema.describe("Grupa taryfowa: G11/G12/G12w (dom) albo C11/C12a/C12b/C21/C22a/C22b (firma)")
export const SiecStrefyKwhSchema = z
  .partialRecord(StrefaSchema, z.number())
  .describe("Roczne zużycie w strefach [kWh] — z faktur usera: calodobowa (G11/C11/C21), dzien/noc (G12, C12b, C22b), szczyt/pozaszczyt (G12w, C12a, C22a)")
export const SiecCenyStrefSchema = z
  .partialRecord(StrefaSchema, z.number())
  .describe("Cena energii (sprzedaż) netto per strefa [zł/kWh] — WYŁĄCZNIE od usera, z faktury; aplikacja nie ma wartości domyślnej")
export const SiecOkresSchema = OkresRozliczeniowySchema.describe("Okres rozliczeniowy w miesiącach (prosument: 1)")

export const SiecWspolneSchema = z.object({
  segment: z.enum(["dom", "firma"]).describe("dom = grupy G, firma = grupy C"),
  osd: SiecOsdSchema,
  dataRozliczenia: z.string().describe("Data rozliczenia RRRR-MM-DD (wybiera okres ważności stawek)"),
  fazy: z.enum(["jednofazowa", "trojfazowa"]).describe("Liczba faz przyłącza (tylko G)"),
  mocUmownaKw: z.number().describe("Moc umowna [kW] (tylko C; 0 dla G)"),
  okresRozliczeniowy: SiecOkresSchema,
  oplataHandlowaZlMies: z.number().nullable().describe("Opłata handlowa sprzedawcy [zł/mies. netto] z faktury; 0 jeśli brak; null gdy user nie wie"),
  energiaMocowaKwh: z
    .number()
    .nullable()
    .describe("Tylko firma: energia pobrana w dni robocze 7:00–22:00 [kWh/rok]; null gdy nie podano"),
})
