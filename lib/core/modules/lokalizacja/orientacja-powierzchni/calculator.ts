import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import {
  ALBEDO_DOMYSLNE,
  AZYMUT_MAX_DEG,
  KROK_DOKLADNY_DEG,
  KROK_ZGRUBNY_DEG,
  NACHYLENIE_MAX_DEG,
  NACHYLENIE_MIN_DEG,
} from "./constants"
import type { OrientacjaPowierzchniInput } from "./input"
import { napromieniowanie, przygotujGodziny, type Godzina } from "./muneer"
import { validateInput } from "./validation"

export { fMuneera, katHoryzontuDeg } from "./muneer"

export const CALCULATOR_VERSION = "2.1.0"

const FORMULA =
  "H = \\sum_t \\Big[ G_{b,n}\\max(\\cos\\theta,0) + G_{dT}^{Muneer} + G_h\\,\\rho\\,\\tfrac{1-\\cos\\beta}{2} \\Big]\\Delta t,\\; G_{dT} = G_d\\big[F(\\beta)(1-K_b) + K_b\\tfrac{\\cos\\theta}{\\sin h}\\big],\\; W = \\dfrac{H}{H_{opt}}"

export type OcenaPowierzchni = {
  nazwa: string
  nachylenieDeg: number
  azymutDeg: number
  /** Roczne napromieniowanie płaszczyzny [kWh/m²]. */
  napromieniowanieRoczneKwhM2: number
  /** Wskaźnik opłacalności względem optimum dla tej lokalizacji [%] — z zacienieniem, gdy podano horyzont. */
  wskaznikProcent: number
  /** Napromieniowanie tej samej orientacji bez przeszkód [kWh/m²]. */
  napromieniowanieBezZacienieniaKwhM2: number
  /** Strata napromieniowania przez przeszkody [%]; null — horyzont nieznany (zacienienie nieuwzględnione). */
  strataZacienieniaProcent: number | null
}

export type OrientacjaPowierzchniResult = {
  optimum: { nachylenieDeg: number; azymutDeg: number; napromieniowanieRoczneKwhM2: number }
  powierzchnie: OcenaPowierzchni[]
}

function szukajOptimum(godziny: Godzina[], albedo: number) {
  let najlepsze = { nachylenieDeg: 0, azymutDeg: 0, napromieniowanieRoczneKwhM2: -1 }
  const sprawdz = (b: number, g: number) => {
    const h = napromieniowanie(godziny, b, g, albedo)
    if (h > najlepsze.napromieniowanieRoczneKwhM2) najlepsze = { nachylenieDeg: b, azymutDeg: g, napromieniowanieRoczneKwhM2: h }
  }
  for (let b = NACHYLENIE_MIN_DEG; b <= NACHYLENIE_MAX_DEG; b += KROK_ZGRUBNY_DEG) {
    for (let g = 0; g < AZYMUT_MAX_DEG; g += KROK_ZGRUBNY_DEG) sprawdz(b, g)
  }
  const { nachylenieDeg: b0, azymutDeg: g0 } = najlepsze
  for (let db = -KROK_ZGRUBNY_DEG; db <= KROK_ZGRUBNY_DEG; db += KROK_DOKLADNY_DEG) {
    const b = b0 + db
    if (b < NACHYLENIE_MIN_DEG || b > NACHYLENIE_MAX_DEG) continue
    for (let dg = -KROK_ZGRUBNY_DEG; dg <= KROK_ZGRUBNY_DEG; dg += KROK_DOKLADNY_DEG) {
      sprawdz(b, (((g0 + dg) % AZYMUT_MAX_DEG) + AZYMUT_MAX_DEG) % AZYMUT_MAX_DEG)
    }
  }
  return najlepsze
}

/**
 * Ekran 4, Moduł 1 — "Bryła budynku i orientacja ścian" (dawne 0.4, Wzorzec D).
 *
 * Źródło (B): "system ocenia opłacalność PV dla każdej powierzchni na podstawie azymutu i kąta
 * nachylenia względem optimum (południe, ~35°)". Realizacja: roczne napromieniowanie każdej
 * powierzchni z godzinowych danych PVGIS TMY (model anizotropowy Muneera, jak w PVGIS), podzielone przez
 * napromieniowanie optymalnej orientacji WYZNACZONEJ z tych samych danych — nie przyjętej z góry
 * jako "południe ~35°" (to przybliżenie ze źródła, zależne od lokalizacji). Przykłady "94%"/"62%"
 * ze źródła to ilustracje, nie wartości do odtworzenia.
 *
 * Napromieniowanie ≠ uzysk energii: pomija temperaturę ogniw i straty odbicia przy dużych kątach
 * padania — wskaźnik porównuje powierzchnie między sobą, szczegółowy uzysk liczy Moduł 3.
 * Zacienienie przez przeszkody (Ekran 3) — tylko dla powierzchni z podanym profilem horyzontu;
 * optimum lokalizacji zawsze bez przeszkód (wskaźnik zacienionej powierzchni spada poniżej
 * wskaźnika samej orientacji).
 */
export function calculateOrientacjaPowierzchni(
  input: OrientacjaPowierzchniInput,
): CalcResult<OrientacjaPowierzchniResult> {
  const { errors } = validateInput(input)
  const albedo = input.albedo ?? ALBEDO_DOMYSLNE
  const inputs = {
    szerokoscGeograficzna: input.szerokoscGeograficzna ?? 0,
    dlugoscGeograficzna: input.dlugoscGeograficzna ?? 0,
    albedo,
    liczbaRekordow: input.daneGodzinowe?.length ?? 0,
    liczbaPowierzchni: input.powierzchnie?.length ?? 0,
  }
  const pusty: OrientacjaPowierzchniResult = {
    optimum: { nachylenieDeg: 0, azymutDeg: 0, napromieniowanieRoczneKwhM2: 0 },
    powierzchnie: [],
  }
  const wynik = (
    status: CalcResult<OrientacjaPowierzchniResult>["status"],
    value: OrientacjaPowierzchniResult,
    warnings: CalcResult<OrientacjaPowierzchniResult>["warnings"],
    assumptions: Assumption[] = [],
  ): CalcResult<OrientacjaPowierzchniResult> => ({
    value,
    unit: "%",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", pusty, errors)

  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, daneGodzinowe, powierzchnie } = input
  if (lat === undefined || lon === undefined || !daneGodzinowe?.length || !powierzchnie?.length) {
    return wynik("INCOMPLETE", pusty, [])
  }

  const godziny = przygotujGodziny(lat, lon, daneGodzinowe)
  let optimum = szukajOptimum(godziny, albedo)
  const napromieniowania = powierzchnie.map((p) => napromieniowanie(godziny, p.nachylenieDeg, p.azymutDeg, albedo))
  // Z zacienieniem: średnia po punktach powierzchni (każdy punkt ma własny horyzont); null — brak profilu.
  const zZacienieniem = powierzchnie.map((p) =>
    p.horyzontyDeg?.length
      ? p.horyzontyDeg.reduce((a, h) => a + napromieniowanie(godziny, p.nachylenieDeg, p.azymutDeg, albedo, h), 0) /
        p.horyzontyDeg.length
      : null,
  )
  // Siatka ma krok 1° — powierzchnia o orientacji między węzłami może minimalnie ją przewyższyć;
  // wtedy ona jest optimum (wskaźnik nigdy > 100%).
  napromieniowania.forEach((h, i) => {
    if (h > optimum.napromieniowanieRoczneKwhM2) {
      optimum = { nachylenieDeg: powierzchnie[i]!.nachylenieDeg, azymutDeg: powierzchnie[i]!.azymutDeg, napromieniowanieRoczneKwhM2: h }
    }
  })
  const oceny = powierzchnie.map((p, i) => {
    const bez = napromieniowania[i]!
    const z = zZacienieniem[i]!
    const h = z ?? bez
    return {
      nazwa: p.nazwa,
      nachylenieDeg: p.nachylenieDeg,
      azymutDeg: p.azymutDeg,
      napromieniowanieRoczneKwhM2: h,
      wskaznikProcent: optimum.napromieniowanieRoczneKwhM2 > 0 ? (100 * h) / optimum.napromieniowanieRoczneKwhM2 : 0,
      napromieniowanieBezZacienieniaKwhM2: bez,
      strataZacienieniaProcent: z === null ? null : bez > 0 ? (100 * (bez - z)) / bez : 0,
    }
  })

  const assumptions: Assumption[] = [
    { kod: "ORIENTACJA-ZALOZENIE-MODEL-MUNEER" },
    { kod: "ORIENTACJA-ZALOZENIE-NAPROMIENIOWANIE-NIE-UZYSK" },
    { kod: "ORIENTACJA-ZALOZENIE-ALBEDO", params: { albedo } },
  ]
  if (zZacienieniem.some((z) => z !== null)) assumptions.push({ kod: "ORIENTACJA-ZALOZENIE-ZACIENIENIE-HORYZONT" })
  const bezHoryzontu = oceny.filter((o) => o.strataZacienieniaProcent === null).map((o) => o.nazwa)
  if (bezHoryzontu.length > 0) {
    assumptions.push({ kod: "ORIENTACJA-ZALOZENIE-ZACIENIENIE-BRAK", params: { nazwy: bezHoryzontu.join(", ") } })
  }

  return wynik("VALID", { optimum, powierzchnie: oceny }, [], assumptions)
}
