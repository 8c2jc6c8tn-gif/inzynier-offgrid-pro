import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN, type Rozliczenia } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { IdScenariusza, ScenariuszePrzejsciaInput } from "./input"
import { validateInput } from "./validation"
import {
  brakScenariuszy,
  ciagloscFirmy,
  cPrzelacznik,
  dBezAgregatu,
  dNieodwracalne,
  dRyzykowne,
  dZalezniMedycznie,
  pracaRownolegla,
  saldoObciete,
  utrataRozliczen,
  warunekM7,
} from "./warnings"
import { GODZIN_W_ROKU, OPIS_SCENARIUSZA, SCENARIUSZE } from "./constants"
import { calculateBilansMiesieczny } from "../bilans-miesieczny/calculator"
import { modelMiesieczny } from "../bilans-miesieczny/warnings"
import { brakDanych } from "../rachunek-za-prad/warnings"
import { inflacjaSciezki, mnoznikCenyEnergii, mnoznikKosztowBiezacych, poziomUe } from "../sciezka-cen-energii/calculator"
import { pozaProjekcjaUe, zalozeniaUe2019 } from "../sciezka-cen-energii/warnings"
import { calculateAgregatPradotworczy } from "../../zapotrzebowanie/agregat-pradotworczy/calculator"

export const CALCULATOR_VERSION = "1.0.0"

export type WynikScenariusza = {
  id: IdScenariusza
  /** I_s − D_s [zł]. */
  inwestycjaNettoZl: number
  /** All running costs of year 1 (grid + fuel + service), nominal [zł]. */
  kosztRok1Zl: number
  /** TCO in the money of the years paid (with discount r) [zł]. */
  tcoNominalneZl: number
  /** TCO in base-year money — the ranking number (equal to nominal without inflation) [zł]. */
  tcoDzisiejszeZl: number
  /** First year in which the cumulative cost falls to or below A's; null = never within N or no A. */
  okresZwrotuLat: number | null
  niedoborRokKwh: number
  niedoborZimaKwh: number
  nadwyzkaRokKwh: number
  pokrycieWlasne: number
  /** Generator (D): hours per year and in the worst month; 0 elsewhere. */
  godzinyAgregatuRok: number
  godzinyAgregatuMaxMies: number
  paliwoRokL: number
  /** Years of storage replacement within the horizon. */
  wymianyMagazynu: number[]
  odwracalny: boolean
}

export type ScenariuszePrzejsciaResult = {
  scenariusze: WynikScenariusza[]
  /** Lowest TCO in base-year money. */
  najtanszy: IdScenariusza | null
  /** Highest own coverage; ties go to the scenario with less grid (D > C > B > A). */
  najbardziejNiezalezny: IdScenariusza | null
  mnoznikCenyRokN: number
  inflacjaProcent: number | null
}

const FORMULA =
  "TCO_s(N) = I_s - D_s + \\sum_{t=1}^{N} \\frac{K_{sieć,s}(t) + K_{paliwo,s}(t) + K_{serwis,s}(t)}{(1+r)^t} + " +
  "\\sum \\frac{I_{wym,s}}{(1+r)^{t_{wym}}} - \\frac{R_s(N)}{(1+r)^N}; \\ K_{sieć}(t) = m_E(t)\\,[K_{stałe} + c\\,E_{sieć} - v\\,E_{nadw}]"

type Rok = { nominal: number; dzis: number }

/**
 * M14 — D7/F8 „Porównanie scenariuszy A–D” (`03_M14_Dom_i_Firma_Siec.md` §4, opracowanie §4.2).
 * Echo engine: monthly balance (`bilans-miesieczny`), price path (D40–D43) and generator M2/E17 —
 * no own physics. Never one „best” verdict: the cheapest and the most independent are separate.
 * 🔎 TD23 (`dlug-techniczny.md`): generator from this screen's own fields (not the D6 draft), residual
 * value for storage only, monthly balance instead of M7.
 */
export function calculateScenariuszePrzejscia(
  input: ScenariuszePrzejsciaInput,
  dane: Rozliczenia = DANE_ROZLICZEN,
): CalcResult<ScenariuszePrzejsciaResult | null> {
  const inputs = { rokBazowy: input.rokBazowy, horyzontLat: input.horyzontLat, stopaDyskontowaProcent: input.stopaDyskontowaProcent }
  const base = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const nie = (status: "INVALID_INPUT" | "INCOMPLETE" | "OUT_OF_SCOPE", warnings: Warning[]) =>
    ({ ...base, value: null, status, assumptions: [], warnings }) satisfies CalcResult<null>

  const errors = validateInput(input)
  if (errors.length > 0) return nie("INVALID_INPUT", errors)

  const N = input.horyzontLat
  if (input.tryb.rodzaj !== "suwak") {
    const ostatni = Math.max(...dane.sciezkaUe.punkty.map((p) => p.rok))
    if (poziomUe(input.rokBazowy, dane) === null || input.rokBazowy + N > ostatni) {
      return nie("OUT_OF_SCOPE", [pozaProjekcjaUe(input.rokBazowy + N, ostatni)])
    }
  }

  const aktywne = SCENARIUSZE.filter((id) => input.scenariusze[id].inwestycjaZl !== null)
  const braki: Warning[] = []
  if (aktywne.length === 0) braki.push(brakScenariuszy())
  const zSiecia = aktywne.filter((id) => OPIS_SCENARIUSZA[id].siec)
  if (zSiecia.length > 0) {
    if (input.siec.kosztStalyRokBruttoZl === null) braki.push(brakDanych("kosztStaly"))
    if (input.siec.cenaZmiennaKwhBruttoZl === null) braki.push(brakDanych("cenaZmienna"))
    if (zSiecia.some((id) => !OPIS_SCENARIUSZA[id].wyspa) && input.siec.wartoscNadwyzkiKwhZl === null) {
      braki.push(brakDanych("wartoscNadwyzki"))
    }
  }
  if (aktywne.some((id) => input.scenariusze[id].kosztMagazynuZl > 0) && !input.zywotnoscMagazynuLat) {
    braki.push(brakDanych("zywotnoscMagazynu"))
  }
  const maD = aktywne.includes("D")
  if (maD && input.kontrola.osobyZalezneOdZasilania === null) braki.push(brakDanych("osobyZalezne"))
  if (maD && input.segment === "firma" && input.kontrola.dopuszczalnyCzasBezZasilaniaH === null) {
    braki.push(brakDanych("dopuszczalnyCzas"))
  }

  // Balances first — they decide whether the generator fields are needed at all.
  const bilanse = new Map<IdScenariusza, NonNullable<ReturnType<typeof calculateBilansMiesieczny>["value"]>>()
  let bilansNiepelny = false
  for (const id of aktywne) {
    const s = input.scenariusze[id]
    const b = calculateBilansMiesieczny({
      tryb: OPIS_SCENARIUSZA[id].wyspa ? "wyspa" : "siec",
      zuzycieMiesieczneKwh: input.zuzycieMiesieczneKwh,
      uzyskMiesiecznyKwhNaKwp: input.uzyskMiesiecznyKwhNaKwp,
      mocPvKwp: s.mocPvKwp,
      autokonsumpcjaBezposrednia: input.autokonsumpcjaBezposrednia,
      pojemnoscMagazynuKwh: id === "A" ? 0 : s.pojemnoscMagazynuKwh,
      sprawnoscMagazynu: input.sprawnoscMagazynu,
    })
    if (b.value === null) bilansNiepelny = true
    else bilanse.set(id, b.value)
  }
  if (bilansNiepelny) braki.push(brakDanych("bilans"))
  const bilansD = bilanse.get("D")
  const agregatPotrzebny = bilansD !== undefined && bilansD.niedoborRokKwh > 1e-9 && input.agregat.mocKw > 0
  if (agregatPotrzebny && (input.agregat.zuzycieLH === null || input.agregat.cenaPaliwaZlL === null)) {
    braki.push(brakDanych("agregat"))
  }
  if (braki.length > 0) return nie("INCOMPLETE", braki)

  const warnings: Warning[] = [modelMiesieczny()]
  const assumptions: Assumption[] = [{ kod: "SIEC-BILANS-ZALOZENIE-PVGIS" }]
  const pi = inflacjaSciezki(input.tryb, input.rokBazowy, dane)
  const r = input.stopaDyskontowaProcent / 100
  const mE = (t: number) => mnoznikCenyEnergii(input.tryb, input.rokBazowy, t, dane) as number
  const mK = (t: number) => mnoznikKosztowBiezacych(input.tryb, input.rokBazowy, t, dane)
  const naDzis = (t: number) => Math.pow(1 + (pi ?? 0), t)
  const dysk = (t: number) => Math.pow(1 + r, t)
  const rok = (kwota: number, t: number): Rok => ({ nominal: kwota / dysk(t), dzis: kwota / dysk(t) / naDzis(t) })

  if (input.tryb.rodzaj === "suwak") {
    assumptions.push({ kod: "SIEC-SUWAK-PONAD-INFLACJE", params: { g: input.tryb.gProcent } })
  } else {
    warnings.push(zalozeniaUe2019())
    assumptions.push({ kod: "SIEC-ZRODLO-SCIEZKI-UE", params: { stanNa: dane.sciezkaUe.stanNa } })
  }
  if (pi !== null) assumptions.push({ kod: "SIEC-INFLACJA-FISHER", params: { pi: (pi * 100).toFixed(2) } })
  assumptions.push(
    { kod: "SIEC-TCO-ZALOZENIE-DYSKONTO", params: { r: input.stopaDyskontowaProcent } },
    { kod: "SIEC-TCO-ZALOZENIE-NADWYZKA" },
    { kod: "SIEC-TCO-ZALOZENIE-REZYDUALNA" },
  )

  const stale = input.siec.kosztStalyRokBruttoZl ?? 0
  const cena = input.siec.cenaZmiennaKwhBruttoZl ?? 0
  const wartosc = input.siec.wartoscNadwyzkiKwhZl ?? 0
  const L = input.zywotnoscMagazynuLat ?? 0

  const wyniki: WynikScenariusza[] = []
  const skumulowane = new Map<IdScenariusza, number[]>()
  for (const id of aktywne) {
    const s = input.scenariusze[id]
    const b = bilanse.get(id)!
    const opis = OPIS_SCENARIUSZA[id]

    // Grid (base-year prices). Export value lowers only the variable part (assumption SIEC-TCO-ZALOZENIE-NADWYZKA).
    let sieciRok0 = 0
    if (opis.siec && !opis.wyspa) {
      const zmienny = cena * b.niedoborRokKwh - wartosc * b.nadwyzkaRokKwh
      if (zmienny < 0) warnings.push(saldoObciete(id))
      sieciRok0 = stale + Math.max(0, zmienny)
    } else if (opis.siec) {
      sieciRok0 = stale + cena * b.niedoborRokKwh
    }

    // Generator (D) — echo M2/E17 per month.
    let godzinyAgregatuRok = 0
    let godzinyAgregatuMaxMies = 0
    let paliwoRokL = 0
    let paliwoRok0Zl = 0
    if (id === "D" && input.agregat.mocKw > 0) {
      for (const m of b.miesiace) {
        if (m.niedoborKwh <= 1e-9) continue
        const a = calculateAgregatPradotworczy({
          deficytKwh: m.niedoborKwh,
          mocAgregatuKw: input.agregat.mocKw,
          sredniZuzycieLH: input.agregat.zuzycieLH ?? 0,
          cenaZaLitrZl: input.agregat.cenaPaliwaZlL ?? 0,
          maWyjscieSterujaceBms: true,
          miejsceAgregatu: null,
          podlaczenieAgregatu: null,
        }).value
        godzinyAgregatuRok += a.godzinyPracy
        godzinyAgregatuMaxMies = Math.max(godzinyAgregatuMaxMies, a.godzinyPracy)
        paliwoRokL += a.zuzyciePaliwaLitry
        paliwoRok0Zl += a.kosztZl
      }
    }

    const inwestycjaNettoZl = (s.inwestycjaZl ?? 0) - s.dotacjaZl
    let nominal = inwestycjaNettoZl
    let dzis = inwestycjaNettoZl
    const kum: number[] = []
    const wymianyMagazynu: number[] = []
    let kosztRok1Zl = 0
    for (let t = 1; t <= N; t++) {
      const koszt = sieciRok0 * mE(t) + (paliwoRok0Zl + s.serwisRokZl) * mK(t)
      if (t === 1) kosztRok1Zl = koszt
      let k = rok(koszt, t)
      if (s.kosztMagazynuZl > 0 && L > 0 && t % L === 0 && t < N) {
        wymianyMagazynu.push(t)
        const w = rok(s.kosztMagazynuZl * mK(t), t)
        k = { nominal: k.nominal + w.nominal, dzis: k.dzis + w.dzis }
      }
      nominal += k.nominal
      dzis += k.dzis
      kum.push(dzis)
    }
    if (s.kosztMagazynuZl > 0 && L > 0) {
      const ostatniaInstalacja = wymianyMagazynu.length > 0 ? wymianyMagazynu[wymianyMagazynu.length - 1] : 0
      const pozostalo = Math.max(0, (ostatniaInstalacja + L - N) / L)
      const R = rok(s.kosztMagazynuZl * mK(N) * pozostalo, N)
      nominal -= R.nominal
      dzis -= R.dzis
    }
    skumulowane.set(id, kum)

    wyniki.push({
      id,
      inwestycjaNettoZl,
      kosztRok1Zl,
      tcoNominalneZl: nominal,
      tcoDzisiejszeZl: dzis,
      okresZwrotuLat: null,
      niedoborRokKwh: b.niedoborRokKwh,
      niedoborZimaKwh: b.niedoborZimaKwh,
      nadwyzkaRokKwh: b.nadwyzkaRokKwh,
      pokrycieWlasne: b.pokrycieWlasne,
      godzinyAgregatuRok,
      godzinyAgregatuMaxMies,
      paliwoRokL,
      wymianyMagazynu,
      odwracalny: id !== "D",
    })
  }

  // Payback relative to A (cumulative, base-year money, without residual value).
  const kumA = skumulowane.get("A")
  if (kumA) {
    for (const w of wyniki) {
      if (w.id === "A") continue
      const kum = skumulowane.get(w.id)!
      const t = kum.findIndex((v, i) => v <= kumA[i] + 1e-9)
      w.okresZwrotuLat = t === -1 ? null : t + 1
    }
  }

  // Warnings and hard stops.
  if (aktywne.some((id) => !OPIS_SCENARIUSZA[id].wyspa)) warnings.push(pracaRownolegla())
  if (aktywne.includes("C")) warnings.push(cPrzelacznik())
  if (aktywne.some((id) => OPIS_SCENARIUSZA[id].wyspa)) warnings.push(utrataRozliczen(), warunekM7())
  const wD = wyniki.find((w) => w.id === "D")
  if (wD) {
    warnings.push(dNieodwracalne())
    if (wD.niedoborRokKwh > 1e-9 && input.agregat.mocKw === 0) warnings.push(dBezAgregatu(wD.niedoborRokKwh))
    if (input.kontrola.osobyZalezneOdZasilania && !input.kontrola.zapasRedundantny) warnings.push(dZalezniMedycznie())
    const prog = input.kontrola.progGodzinAgregatuMies
    if (prog !== null && wD.godzinyAgregatuMaxMies > prog) warnings.push(dRyzykowne(wD.godzinyAgregatuMaxMies, prog))
    const h = input.kontrola.dopuszczalnyCzasBezZasilaniaH
    if (input.segment === "firma" && h !== null) {
      const zuzycieRok = input.zuzycieMiesieczneKwh.reduce((a, v) => a + v, 0)
      warnings.push(ciagloscFirmy(h, (zuzycieRok / GODZIN_W_ROKU) * h, input.kontrola.zapasRedundantny))
    }
  }

  const najtanszy = wyniki.length > 0 ? wyniki.reduce((a, b) => (b.tcoDzisiejszeZl < a.tcoDzisiejszeZl ? b : a)).id : null
  const najbardziejNiezalezny =
    wyniki.length > 0 ? wyniki.reduce((a, b) => (b.pokrycieWlasne >= a.pokrycieWlasne - 1e-9 ? b : a)).id : null

  return {
    ...base,
    value: {
      scenariusze: wyniki,
      najtanszy,
      najbardziejNiezalezny,
      mnoznikCenyRokN: mE(N),
      inflacjaProcent: pi === null ? null : pi * 100,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
