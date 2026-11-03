/**
 * Side-by-side cost of a litre from a home e-petrol machine (Aircela class), two ways of powering it:
 * continuous operation on grid / fixed-price power, and operation on own PV only. Pure arithmetic, no I/O.
 * Every number is an assumption (❓) or a producer claim (📣) documented in `docs/perspektywy-projektow.md`
 * (P-001, sections 5, 5a, 5b, 5c); this is an illustration for the "Project outlook" section, not a design tool.
 */

export const GALON_L = 3.785411784

export const ZALOZENIA_EPALIWA = {
  /** Machine output: 1 US gal/day (📣 producer). */
  galonNaDobe: 1,
  /** Machine price in USD (📣 producer: 15–20 thousand). */
  urzadzenieUsd: [15000, 20000],
  /** Service life in years (❓). */
  lata: 10,
  /** Energy per US gallon in kWh (🧮 own balance: optimistic and realistic). */
  kWhNaGalon: [75, 100],
  /** Share of the year the machine runs on steady power (❓). */
  uzytkowanieCiagle: 0.9,
  /** EUR per USD (❓, not checked in the session). */
  eurZaUsd: 0.92,
  /** PLN per EUR (❓, not checked in the session). */
  zlZaEur: 4.0,
  /** PV yield in kWh/kWp·year (❓ sources in the doc, section 5b). */
  uzyskKWhNaKWp: 900,
  /** PV power as a multiple of the machine power N, and the usable share η of the PV energy (❓). */
  panele: [
    { n: 2, eta: 0.9 },
    { n: 3, eta: 0.85 },
    { n: 4, eta: 0.8 },
  ],
  /** Cost of PV energy, EUR/kWh (✅ Fraunhofer ISE range for Germany, used as an approximation). */
  lcoePvEur: [0.04, 0.065, 0.09],
} as const

export type KrajPorownania = "PL" | "NO" | "NL"
export type ScenariuszEpaliwa = "CIAGLY" | "WLASNE_PV"
export type OcenaOplacalnosci = "TAK" | "GRANICA" | "NIE"

/** Range in EUR (or litres, for `litryRocznie`). */
export type Zakres = { min: number; max: number }

/** Grid / fixed price of energy per country, EUR/kWh, for continuous operation (❓ see doc, sections 5 and 5a). */
const CENA_PRADU_CIAGLEGO: Record<KrajPorownania, number[]> = {
  // 0.20 PLN/kWh is the parameter of section 5, not a Polish tariff (those are higher).
  PL: [0.2 / ZALOZENIA_EPALIWA.zlZaEur],
  // Norgespris 0.40 NOK/kWh excl. VAT at 10.8 NOK/EUR, without grid fees.
  NO: [0.4 / 10.8],
  // Household price 0.24–0.28 EUR/kWh.
  NL: [0.24, 0.28],
}

/** Pump price per country, EUR/l: min–max (PL from the BM Reflex forecast and the e-petrol reading; NL and NO from the EU Oil Bulletin). */
export const CENA_STACJI_EUR_L: Record<KrajPorownania, Zakres> = {
  PL: { min: 6.85 / ZALOZENIA_EPALIWA.zlZaEur, max: 7.55 / ZALOZENIA_EPALIWA.zlZaEur },
  NO: { min: 2.424, max: 2.424 },
  NL: { min: 2.313, max: 2.313 },
}

export type WierszPorownania = {
  scenariusz: ScenariuszEpaliwa
  kraj: KrajPorownania
  litryRocznie: Zakres
  urzadzenieEurL: Zakres
  energiaEurL: Zakres
  razemEurL: Zakres
  stacjaEurL: Zakres
  ocena: OcenaOplacalnosci
}

function zakresZ(wartosci: number[]): Zakres {
  return { min: Math.min(...wartosci), max: Math.max(...wartosci) }
}

/** Machine cost per litre at the given utilisation (share of the full 1 gal/day output over the whole year). */
function urzadzenieNaLitr(urzadzenieUsd: number, wykorzystanie: number): number {
  const z = ZALOZENIA_EPALIWA
  const litryRocznieZPelnaMoca = z.galonNaDobe * GALON_L * 365
  return (urzadzenieUsd * z.eurZaUsd) / (z.lata * litryRocznieZPelnaMoca * wykorzystanie)
}

function ocen(razem: Zakres, stacja: Zakres): OcenaOplacalnosci {
  if (razem.max < stacja.min) return "TAK"
  if (razem.min > stacja.max) return "NIE"
  return "GRANICA"
}

/** Continuous operation on grid / fixed-price power. */
function wierszCiagly(kraj: KrajPorownania): WierszPorownania {
  const z = ZALOZENIA_EPALIWA
  const urzadzenie: number[] = []
  const energia: number[] = []
  const razem: number[] = []
  for (const usd of z.urzadzenieUsd) {
    for (const kWhGal of z.kWhNaGalon) {
      for (const cena of CENA_PRADU_CIAGLEGO[kraj]) {
        const u = urzadzenieNaLitr(usd, z.uzytkowanieCiagle)
        const e = (kWhGal / GALON_L) * cena
        urzadzenie.push(u)
        energia.push(e)
        razem.push(u + e)
      }
    }
  }
  const litry = z.galonNaDobe * GALON_L * 365 * z.uzytkowanieCiagle
  const razemZakres = zakresZ(razem)
  return {
    scenariusz: "CIAGLY",
    kraj,
    litryRocznie: { min: litry, max: litry },
    urzadzenieEurL: zakresZ(urzadzenie),
    energiaEurL: zakresZ(energia),
    razemEurL: razemZakres,
    stacjaEurL: CENA_STACJI_EUR_L[kraj],
    ocena: ocen(razemZakres, CENA_STACJI_EUR_L[kraj]),
  }
}

/** Operation on own PV only: the machine works only in the sun, so its cost is spread over fewer litres. */
function wierszWlasnePv(kraj: KrajPorownania): WierszPorownania {
  const z = ZALOZENIA_EPALIWA
  const urzadzenie: number[] = []
  const energia: number[] = []
  const razem: number[] = []
  const litry: number[] = []
  for (const { n, eta } of z.panele) {
    const wykorzystanie = (n * z.uzyskKWhNaKWp * eta) / 8760
    litry.push(z.galonNaDobe * GALON_L * 365 * wykorzystanie)
    for (const usd of z.urzadzenieUsd) {
      for (const kWhGal of z.kWhNaGalon) {
        for (const lcoe of z.lcoePvEur) {
          const u = urzadzenieNaLitr(usd, wykorzystanie)
          const e = ((kWhGal / GALON_L) * lcoe) / eta
          urzadzenie.push(u)
          energia.push(e)
          razem.push(u + e)
        }
      }
    }
  }
  const razemZakres = zakresZ(razem)
  return {
    scenariusz: "WLASNE_PV",
    kraj,
    litryRocznie: zakresZ(litry),
    urzadzenieEurL: zakresZ(urzadzenie),
    energiaEurL: zakresZ(energia),
    razemEurL: razemZakres,
    stacjaEurL: CENA_STACJI_EUR_L[kraj],
    ocena: ocen(razemZakres, CENA_STACJI_EUR_L[kraj]),
  }
}

const KRAJE: KrajPorownania[] = ["PL", "NO", "NL"]

/** All six rows of the comparison table: both scenarios × PL, NO, NL. */
export function porownanieEpaliwa(): WierszPorownania[] {
  return [...KRAJE.map(wierszCiagly), ...KRAJE.map(wierszWlasnePv)]
}
