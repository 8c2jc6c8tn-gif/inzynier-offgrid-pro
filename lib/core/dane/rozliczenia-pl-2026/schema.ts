import { z } from "zod"

/**
 * Schema of the M14 rates file `rozliczenia-pl-2026` (D36, `03_M14_Dom_i_Firma_Siec.md` §2).
 *
 * Every rate is a list of validity periods `{ odDnia, doDnia, wartosc }`, never a (year, value)
 * pair — the quality rate changed on 1.02.2026 (opracowanie §2.3), and the same trap applies to
 * every component set outside the OSD tariff. `doDnia: null` = open-ended (a legal constant).
 *
 * DANE-1 gate is enforced here, not by convention: `pewnosc` accepts only "potwierdzone" (✅).
 * 🔎A/🔎B values stay in the advisory text of the chapter and never enter this file.
 */

const DataIso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "data w formacie RRRR-MM-DD")

export const PewnoscSchema = z.literal("potwierdzone")

function okres<T extends z.ZodTypeAny>(wartosc: T) {
  return z
    .object({ odDnia: DataIso, doDnia: DataIso.nullable(), wartosc })
    .refine((o) => o.doDnia === null || o.odDnia <= o.doDnia, "odDnia po doDnia")
}

function stawka<T extends z.ZodTypeAny>(wartosc: T) {
  return z.object({
    jednostka: z.string().min(1),
    okresy: z.array(okres(wartosc)).min(1),
    zrodlo: z.string().min(1),
    stanNa: DataIso,
    pewnosc: PewnoscSchema,
  })
}

const Nieujemna = z.number().nonnegative()

export const StawkaLiczbowaSchema = stawka(Nieujemna)

/** One threshold of the flat capacity fee for households (art. 89b ust. 3 ustawy o rynku mocy). */
export const ProgMocowejSchema = z.object({
  /** Lower bound, exclusive; null = from 0 kWh. */
  powyzejKwh: Nieujemna.nullable(),
  /** Upper bound; null = no upper bound. */
  doKwh: Nieujemna.nullable(),
  /** Whether `doKwh` itself belongs to this threshold ("do 1 200" — yes; "poniżej 500" — no). */
  doWlacznie: z.boolean(),
  zlMies: Nieujemna,
})

export const StrefaSchema = z.enum(["calodobowa", "dzien", "noc", "szczyt", "pozaszczyt"])
export const GrupaSchema = z.enum(["G11", "G12", "G12w", "C11", "C12a", "C12b", "C21", "C22a", "C22b"])
export const OkresRozliczeniowySchema = z.enum(["1", "2", "6", "12"])

export const StawkiGrupySchema = z.object({
  /** Variable network fee per time zone [zł/kWh]. Zones are OSD data, not an assumption. */
  strefy: z.partialRecord(StrefaSchema, Nieujemna),
  /** Fixed network fee, group G [zł/month] — single- and three-phase. */
  stalaG: z.object({ jednofazowa: Nieujemna, trojfazowa: Nieujemna }).optional(),
  /** Fixed network fee, group C [zł/kW of contracted power/month]. */
  stalaCZlKw: Nieujemna.optional(),
  /** Subscription fee [zł/month] per billing period in months. Missing = not read yet. */
  abonament: z.partialRecord(OkresRozliczeniowySchema, Nieujemna).optional(),
})

const OkresTaryfyOsdSchema = z
  .object({
    odDnia: DataIso,
    doDnia: DataIso,
    grupy: z.partialRecord(GrupaSchema, StawkiGrupySchema),
  })
  .refine((o) => o.odDnia <= o.doDnia, "odDnia po doDnia")

export const OsdIdSchema = z.enum(["tauron", "energa", "stoen", "pge", "enea", "inny"])

export const OsdSchema = z.object({
  id: OsdIdSchema,
  nazwa: z.string().min(1),
  /** Empty list = no ✅ tariff yet — only "moje dane z faktury" mode (D36). */
  okresy: z.array(OkresTaryfyOsdSchema),
  zrodlo: z.string().min(1),
  stanNa: DataIso,
  pewnosc: PewnoscSchema,
})

export const RozliczeniaSchema = z.object({
  id: z.literal("rozliczenia-pl-2026"),
  wersjaDanych: z.string().min(1),
  stanNa: DataIso,
  /** After this date the app warns "stawki mogą być nieaktualne — sprawdź fakturę". */
  waznoscDo: DataIso,
  uwaga: z.string(),
  krajowe: z.object({
    vat: StawkaLiczbowaSchema,
    oplataMocowaRyczalt: stawka(z.array(ProgMocowejSchema).min(1)),
    oplataMocowaPozostali: StawkaLiczbowaSchema,
    stawkaJakosciowaNn: StawkaLiczbowaSchema,
    oplataOze: StawkaLiczbowaSchema,
    oplataKogeneracyjna: StawkaLiczbowaSchema,
    oplataPrzejsciowa: StawkaLiczbowaSchema,
  }),
  prosument: z.object({
    wspolczynnikDepozytu: StawkaLiczbowaSchema,
    zwrotDepozytuMaksRcem: StawkaLiczbowaSchema,
    zwrotDepozytuMaksRce: StawkaLiczbowaSchema,
  }),
  mocBierna: z.object({
    krotnoscKNn: StawkaLiczbowaSchema,
    tgFi0Domyslny: StawkaLiczbowaSchema,
    tgFi0Minimalny: StawkaLiczbowaSchema,
  }),
  inflacja: z.object({
    sredniaGus15Lat: StawkaLiczbowaSchema,
    celNbp: StawkaLiczbowaSchema,
  }),
  sciezkaUe: z.object({
    jednostka: z.string().min(1),
    punkty: z.array(z.object({ rok: z.number().int(), wartosc: z.number().positive() })).min(2),
    zrodlo: z.string().min(1),
    stanNa: DataIso,
    pewnosc: PewnoscSchema,
  }),
  osd: z.array(OsdSchema).min(1),
})

export type Rozliczenia = z.infer<typeof RozliczeniaSchema>
export type StawkaLiczbowa = z.infer<typeof StawkaLiczbowaSchema>
export type ProgMocowej = z.infer<typeof ProgMocowejSchema>
export type Strefa = z.infer<typeof StrefaSchema>
export type Grupa = z.infer<typeof GrupaSchema>
export type OkresRozliczeniowy = z.infer<typeof OkresRozliczeniowySchema>
export type StawkiGrupy = z.infer<typeof StawkiGrupySchema>
export type OsdId = z.infer<typeof OsdIdSchema>
export type Osd = z.infer<typeof OsdSchema>
