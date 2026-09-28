import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  DANE_ROZLICZEN,
  czyPoWaznosci,
  oplataMocowaRyczaltZlMies,
  stawkaRoczna,
  stawkiOsd,
  wartoscWDniu,
  type Rozliczenia,
  type StawkaLiczbowa,
  type Strefa,
} from "@/lib/core/dane/rozliczenia-pl-2026"
import type { RachunekInput } from "./input"
import { STREFY_GRUPY, czyGrupaG } from "./constants"
import { validateInput } from "./validation"
import { brakDanych, stawkaNajdluzej, stawkiPoWaznosci } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type KodSkladnika =
  | "energia"
  | "handlowa"
  | "sieciowaZmienna"
  | "sieciowaStala"
  | "abonament"
  | "mocowa"
  | "jakosciowa"
  | "oze"
  | "kogeneracyjna"

/** Where the rate came from: the ✅ rates file, or the user's invoice. */
export type ZrodloStawki = "taryfa" | "faktura"

export type Skladnik = {
  kod: KodSkladnika
  /** Annual amount, netto [zł]. */
  kwotaNettoZl: number
  /** Fixed components stay while the contract and meter exist; PV/storage lower only variable ones. */
  charakter: "staly" | "zmienny"
  zrodlo: ZrodloStawki
}

export type RachunekResult = {
  skladniki: Skladnik[]
  zuzycieRoczneKwh: number
  nettoZl: number
  vatZl: number
  bruttoZl: number
  staleNettoZl: number
  zmienneNettoZl: number
  /** „Cena trzymania sieci” — K_stałe,rok brutto (`03_M14` §1). */
  cenaTrzymaniaSieciBruttoZl: number
  /** Average gross cost of 1 kWh [zł/kWh]. */
  sredniaCenaKwhBruttoZl: number
}

const FORMULA =
  "K = \\sum_z E_z (c_{en,z} + c_{sieć,z}) + E (c_{jak} + c_{OZE} + c_{kog}) + 12 (c_{st} + c_{abon} + c_{hand}) + K_{moc}; \\ " +
  "K_{brutto} = K (1 + VAT); \\ K_{stałe,rok} = 12 (c_{st} + c_{abon} + c_{hand} + c_{moc,G}) (1 + VAT)"

type Rozstrzygniecie = { wartosc: number; zrodlo: ZrodloStawki } | null

/**
 * Bill for one year (`03_M14` „Logika” pkt 1–2). Pure arithmetic of the tariff — no physics.
 * Every missing value (neither ✅ in data nor from invoice) is listed; nothing is guessed (D36).
 */
export function calculateRachunek(
  input: RachunekInput,
  dane: Rozliczenia = DANE_ROZLICZEN,
): CalcResult<RachunekResult> {
  const pusty: RachunekResult = {
    skladniki: [],
    zuzycieRoczneKwh: 0,
    nettoZl: 0,
    vatZl: 0,
    bruttoZl: 0,
    staleNettoZl: 0,
    zmienneNettoZl: 0,
    cenaTrzymaniaSieciBruttoZl: 0,
    sredniaCenaKwhBruttoZl: 0,
  }
  const strefy = STREFY_GRUPY[input.grupa]
  const zuzycie = (z: Strefa) => input.zuzycieStrefKwh[z] ?? 0
  const zuzycieRoczneKwh = strefy.reduce((s, z) => s + zuzycie(z), 0)
  const inputs: Record<string, number> = {
    zuzycieRoczneKwh,
    mocUmownaKw: input.mocUmownaKw,
    okresRozliczeniowyMies: Number(input.okresRozliczeniowy),
  }
  const base = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input)
  if (errors.length > 0) {
    return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  }

  const g = czyGrupaG(input.grupa)
  const rok = Number(input.dataRozliczenia.slice(0, 4))
  const taryfa = stawkiOsd(input.osd, input.grupa, input.dataRozliczenia, dane)
  const wlasne = input.stawkiWlasne
  const warnings: Warning[] = []
  const brak: string[] = []

  if (czyPoWaznosci(input.dataRozliczenia, dane)) warnings.push(stawkiPoWaznosci(dane.waznoscDo))

  const zFaktury = (v: number | undefined): Rozstrzygniecie => (v === undefined ? null : { wartosc: v, zrodlo: "faktura" })
  const zTaryfy = (v: number | undefined | null): Rozstrzygniecie =>
    v === undefined || v === null ? null : { wartosc: v, zrodlo: "taryfa" }
  const krajowa = (stawka: StawkaLiczbowa, kod: KodSkladnika): Rozstrzygniecie => {
    const r = stawkaRoczna(stawka, rok, input.zuzycieMiesieczneKwh)
    if (r === null) return null
    if (r.zmiennaWRoku && r.metoda === "najdluzej") warnings.push(stawkaNajdluzej(kod))
    return { wartosc: r.wartosc, zrodlo: "taryfa" }
  }
  const wymagaj = (r: Rozstrzygniecie, pole: string): Rozstrzygniecie => {
    if (r === null) brak.push(pole)
    return r
  }

  if (zuzycieRoczneKwh === 0) brak.push("zuzycie")
  if (!g && input.mocUmownaKw === 0) brak.push("mocUmowna")

  // Energy (sale) and network variable fee — per zone, only zones with consumption.
  let energia = 0
  let sieciowaZmienna = 0
  let sieciowaZmiennaZrodlo: ZrodloStawki = "taryfa"
  for (const z of strefy) {
    if (zuzycie(z) === 0) continue
    const cena = input.cenaEnergiiZlKwh[z]
    if (cena === undefined) {
      if (!brak.includes("cenaEnergii")) brak.push("cenaEnergii")
    } else energia += zuzycie(z) * cena
    const siec = zFaktury(wlasne.sieciowaZmienna?.[z]) ?? zTaryfy(taryfa?.strefy[z])
    if (siec === null) {
      if (!brak.includes("sieciowaZmienna")) brak.push("sieciowaZmienna")
    } else {
      sieciowaZmienna += zuzycie(z) * siec.wartosc
      if (siec.zrodlo === "faktura") sieciowaZmiennaZrodlo = "faktura"
    }
  }

  const handlowa = input.oplataHandlowaZlMies
  if (handlowa === null) brak.push("oplataHandlowa")

  const stala = wymagaj(zFaktury(wlasne.sieciowaStala) ?? zTaryfy(g ? taryfa?.stalaG?.[input.fazy] : taryfa?.stalaCZlKw), "sieciowaStala")
  const abonament = wymagaj(
    zFaktury(wlasne.abonamentZlMies) ?? zTaryfy(taryfa?.abonament?.[input.okresRozliczeniowy]),
    "abonament",
  )
  const kraj = dane.krajowe
  const jakosciowa = wymagaj(zFaktury(wlasne.jakosciowaZlKwh) ?? krajowa(kraj.stawkaJakosciowaNn, "jakosciowa"), "jakosciowa")
  const oze = wymagaj(zFaktury(wlasne.ozeZlKwh) ?? krajowa(kraj.oplataOze, "oze"), "oze")
  const kogen = wymagaj(zFaktury(wlasne.kogeneracyjnaZlKwh) ?? krajowa(kraj.oplataKogeneracyjna, "kogeneracyjna"), "kogeneracyjna")

  let mocowa: Rozstrzygniecie
  if (g) {
    const progi = wartoscWDniu(kraj.oplataMocowaRyczalt.okresy, input.dataRozliczenia)
    const ryczalt = progi === null ? null : oplataMocowaRyczaltZlMies(zuzycieRoczneKwh, progi)
    mocowa = wymagaj(zFaktury(wlasne.mocowaGZlMies) ?? zTaryfy(ryczalt), "mocowa")
  } else {
    if (input.energiaMocowaKwh === null) brak.push("energiaMocowa")
    mocowa = wymagaj(zFaktury(wlasne.mocowaCZlKwh) ?? krajowa(kraj.oplataMocowaPozostali, "mocowa"), "mocowa")
  }
  const vat = wartoscWDniu(kraj.vat.okresy, input.dataRozliczenia) ?? null
  if (vat === null) brak.push("vat")

  if (brak.length > 0) {
    return {
      ...base,
      value: pusty,
      status: "INCOMPLETE",
      assumptions: [],
      warnings: [...brak.map(brakDanych), ...warnings],
    }
  }

  // All values resolved below (brak is empty).
  const s = stala!
  const a = abonament!
  const j = jakosciowa!
  const o = oze!
  const k = kogen!
  const m = mocowa!
  const skladniki: Skladnik[] = [
    // Sale price is always the user's (no ✅ default — 495,16 zł/MWh is only 🔎A).
    { kod: "energia", kwotaNettoZl: energia, charakter: "zmienny", zrodlo: "faktura" },
    { kod: "handlowa", kwotaNettoZl: 12 * handlowa!, charakter: "staly", zrodlo: "faktura" },
    { kod: "sieciowaZmienna", kwotaNettoZl: sieciowaZmienna, charakter: "zmienny", zrodlo: sieciowaZmiennaZrodlo },
    {
      kod: "sieciowaStala",
      kwotaNettoZl: 12 * s.wartosc * (g ? 1 : input.mocUmownaKw),
      charakter: "staly",
      zrodlo: s.zrodlo,
    },
    { kod: "abonament", kwotaNettoZl: 12 * a.wartosc, charakter: "staly", zrodlo: a.zrodlo },
    {
      kod: "mocowa",
      // G: flat monthly fee by annual consumption threshold (quasi-fixed, counted as fixed in K_stałe);
      // C: per kWh drawn on working days 7–22 (variable).
      kwotaNettoZl: g ? 12 * m.wartosc : input.energiaMocowaKwh! * m.wartosc,
      charakter: g ? "staly" : "zmienny",
      zrodlo: m.zrodlo,
    },
    { kod: "jakosciowa", kwotaNettoZl: zuzycieRoczneKwh * j.wartosc, charakter: "zmienny", zrodlo: j.zrodlo },
    { kod: "oze", kwotaNettoZl: zuzycieRoczneKwh * o.wartosc, charakter: "zmienny", zrodlo: o.zrodlo },
    { kod: "kogeneracyjna", kwotaNettoZl: zuzycieRoczneKwh * k.wartosc, charakter: "zmienny", zrodlo: k.zrodlo },
  ]

  const nettoZl = skladniki.reduce((sum, x) => sum + x.kwotaNettoZl, 0)
  const staleNettoZl = skladniki.filter((x) => x.charakter === "staly").reduce((sum, x) => sum + x.kwotaNettoZl, 0)
  const vatZl = nettoZl * vat!
  const bruttoZl = nettoZl + vatZl

  const assumptions: Assumption[] = [
    { kod: "SIEC-ZALOZENIE-NETTO-VAT", params: { vat: Math.round(vat! * 100) } },
    { kod: "SIEC-ZALOZENIE-PRZEJSCIOWA-ZNIESIONA" },
    { kod: "SIEC-ZALOZENIE-ZRODLO-DANYCH", params: { stanNa: dane.stanNa, waznoscDo: dane.waznoscDo } },
  ]
  if (g) assumptions.push({ kod: "SIEC-ZALOZENIE-MOCOWA-G-STALA" })

  return {
    ...base,
    value: {
      skladniki,
      zuzycieRoczneKwh,
      nettoZl,
      vatZl,
      bruttoZl,
      staleNettoZl,
      zmienneNettoZl: nettoZl - staleNettoZl,
      cenaTrzymaniaSieciBruttoZl: staleNettoZl * (1 + vat!),
      sredniaCenaKwhBruttoZl: bruttoZl / zuzycieRoczneKwh,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
