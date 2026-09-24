import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { masaPowietrza, pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import {
  ALBEDO_DOMYSLNE,
  AZYMUT_MAX_DEG,
  KROK_DOKLADNY_DEG,
  KROK_GODZIN,
  KROK_ZGRUBNY_DEG,
  DNI_ROKU,
  MIMOSROD_AMPL,
  MUNEER_N_A,
  MUNEER_N_B,
  MUNEER_N_C,
  MUNEER_N_ZACIENIONA,
  MUNEER_NISKIE_SLONCE_B,
  MUNEER_PROG_NISKIE_SLONCE_RAD,
  NACHYLENIE_MAX_DEG,
  NACHYLENIE_MIN_DEG,
  PEREZ_KT_A,
  PEREZ_KT_B,
  PEREZ_KT_C,
  PEREZ_KT_D,
  PEREZ_KT_E,
  PROG_ZACHMURZENIA_KT,
  STALA_SLONECZNA_W_M2,
  W_NA_KW,
} from "./constants"
import type { OrientacjaPowierzchniInput, RekordGodzinowy } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "2.1.0"

const FORMULA =
  "H = \\sum_t \\Big[ G_{b,n}\\max(\\cos\\theta,0) + G_{dT}^{Muneer} + G_h\\,\\rho\\,\\tfrac{1-\\cos\\beta}{2} \\Big]\\Delta t,\\; G_{dT} = G_d\\big[F(\\beta)(1-K_b) + K_b\\tfrac{\\cos\\theta}{\\sin h}\\big],\\; W = \\dfrac{H}{H_{opt}}"

const RAD = Math.PI / 180

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

/** Wielkości zależne tylko od słońca, liczone raz na rekord (nie raz na orientację). */
type Godzina = {
  cosZ: number
  sinZ: number
  cosAz: number
  sinAz: number
  sloncePonadHoryzontem: boolean
  /** Azymut i wysokość słońca [°] — porównanie z profilem horyzontu przeszkód. */
  azymutDeg: number
  wysokoscDeg: number
  /** Wysokość słońca [rad] — dla korekty niskiego słońca (równ. 30). */
  wysokoscRad: number
  /** Wskaźnik anizotropii Kb = G_b,h / G_0,h (promieniowanie bezpośrednie poziome / pozaziemskie poziome). */
  kb: number
  /** Niebo zachmurzone wg kt' < 0,3 (równ. 31) — wtedy równ. 28 niezależnie od nasłonecznienia. */
  zachmurzone: boolean
  dni: number
  dhi: number
  ghi: number
}

/** Dzień roku 1…365/366 (UTC). */
function dzienRoku(czasUtcMs: number): number {
  const d = new Date(czasUtcMs)
  return Math.floor((czasUtcMs - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86_400_000) + 1
}

function przygotuj(lat: number, lon: number, dane: RekordGodzinowy[]): Godzina[] {
  return dane.map((r) => {
    const p = pozycjaSlonca(lat, lon, r.czasUtcMs)
    const z = (90 - p.wysokoscDeg) * RAD
    const nad = p.wysokoscDeg > 0
    const sinH = Math.sin(p.wysokoscDeg * RAD)
    // Promieniowanie pozaziemskie na płaszczyznę poziomą (Duffie–Beckman 1.4.1a × sin h).
    const g0h = nad
      ? STALA_SLONECZNA_W_M2 * (1 + MIMOSROD_AMPL * Math.cos((2 * Math.PI * dzienRoku(r.czasUtcMs)) / DNI_ROKU)) * sinH
      : 0
    const kb = g0h > 0 ? Math.min(1, (r.dni * sinH) / g0h) : 0
    const kt = g0h > 0 ? r.ghi / g0h : 0
    const am = masaPowietrza(p.wysokoscDeg)
    const ktPrim = Number.isFinite(am)
      ? kt / (PEREZ_KT_A + PEREZ_KT_B * Math.exp(-PEREZ_KT_C / (PEREZ_KT_D + PEREZ_KT_E / am)))
      : 0
    return {
      cosZ: Math.cos(z),
      sinZ: Math.sin(z),
      cosAz: Math.cos(p.azymutDeg * RAD),
      sinAz: Math.sin(p.azymutDeg * RAD),
      sloncePonadHoryzontem: nad,
      azymutDeg: p.azymutDeg,
      wysokoscDeg: p.wysokoscDeg,
      wysokoscRad: p.wysokoscDeg * RAD,
      kb,
      zachmurzone: ktPrim < PROG_ZACHMURZENIA_KT,
      dni: r.dni,
      dhi: r.dhi,
      ghi: r.ghi,
    }
  })
}

/** F(β) = (1 + cos β)/2 + N·(sin β − β·cos β − π·sin²(β/2)) — Muneer, EUR 26075 równ. 28–29. */
export function fMuneera(nachylenieDeg: number, n: number): number {
  const beta = nachylenieDeg * RAD
  return (1 + Math.cos(beta)) / 2 + n * (Math.sin(beta) - beta * Math.cos(beta) - Math.PI * Math.sin(beta / 2) ** 2)
}

/** Kąt horyzontu przeszkód w azymucie `azymutDeg` — interpolacja liniowa między próbkami profilu (równe kroki od 0°). */
export function katHoryzontuDeg(profil: number[], azymutDeg: number): number {
  const krok = AZYMUT_MAX_DEG / profil.length
  const pozycja = ((((azymutDeg % AZYMUT_MAX_DEG) + AZYMUT_MAX_DEG) % AZYMUT_MAX_DEG) / krok) % profil.length
  const i = Math.floor(pozycja)
  const a = profil[i]!
  const b = profil[(i + 1) % profil.length]!
  return a + (b - a) * (pozycja - i)
}

/**
 * Roczne napromieniowanie płaszczyzny [kWh/m²]: bezpośrednie G_b,n·cos θ + rozproszone wg modelu
 * anizotropowego T. Muneera (1990) w postaci PVGIS (EUR 26075, równ. 28–31; stałe w constants.ts)
 * + odbite od gruntu ρ·G_h·(1 − cos β)/2.
 *
 * F(β) = (1 + cos β)/2 + N·(sin β − β·cos β − π·sin²(β/2)):
 * - zacieniona (cos θ ≤ 0) albo niebo zachmurzone: G_dT = G_d·F(β) z N = 0,25227 (równ. 28),
 * - nasłoneczniona: G_dT = G_d·[F(β)·(1 − Kb) + Kb·cos θ / sin h], N = 0,00263 − 0,712·Kb − 0,6883·Kb²
 *   (równ. 29); przy h < 0,1 rad człon Kb·sin β·cos(γs − γ) / (0,1 − 0,008·h) (równ. 30).
 * Zastąpił model izotropowy Liu–Jordana (v1.0.0) — decyzja właściciela 24.09.2026 (TD16, wariant a).
 *
 * Profil horyzontu (TD15 punkt 2): gdy słońce jest niżej niż przeszkoda w swoim azymucie, powierzchnia
 * jest zacieniona w sensie EUR 26075 — bez bezpośredniego, rozproszone wg równ. 28 (jak przy cos θ ≤ 0).
 * Przesłonięcie części nieboskłonu przez przeszkody (rozproszone izotropowe) nie jest modelowane.
 */
function napromieniowanie(
  godziny: Godzina[],
  nachylenieDeg: number,
  azymutDeg: number,
  albedo: number,
  horyzont?: number[],
): number {
  const cosB = Math.cos(nachylenieDeg * RAD)
  const sinB = Math.sin(nachylenieDeg * RAD)
  const cosG = Math.cos(azymutDeg * RAD)
  const sinG = Math.sin(azymutDeg * RAD)
  const fZacieniona = fMuneera(nachylenieDeg, MUNEER_N_ZACIENIONA)
  const wspOdbic = (albedo * (1 - cosB)) / 2
  let sumaWh = 0
  for (const g of godziny) {
    let bezp = 0
    let rozpr = g.dhi * fZacieniona
    const zaPrzeszkoda = horyzont !== undefined && g.sloncePonadHoryzontem && g.wysokoscDeg < katHoryzontuDeg(horyzont, g.azymutDeg)
    if (g.sloncePonadHoryzontem && !zaPrzeszkoda) {
      // cos(γs − γ) rozpisane na iloczyny; cos θ = cos z·cos β + sin z·sin β·cos(γs − γ).
      const cosRoznicyAz = g.cosAz * cosG + g.sinAz * sinG
      const cosTheta = g.cosZ * cosB + g.sinZ * sinB * cosRoznicyAz
      if (cosTheta > 0) {
        bezp = g.dni * cosTheta
        if (!g.zachmurzone) {
          const n = MUNEER_N_A + MUNEER_N_B * g.kb + MUNEER_N_C * g.kb * g.kb
          const f = fMuneera(nachylenieDeg, n)
          const okoloSloneczny =
            g.wysokoscRad >= MUNEER_PROG_NISKIE_SLONCE_RAD
              ? cosTheta / g.cosZ
              : (sinB * cosRoznicyAz) / (MUNEER_PROG_NISKIE_SLONCE_RAD - MUNEER_NISKIE_SLONCE_B * g.wysokoscRad)
          rozpr = g.dhi * (f * (1 - g.kb) + g.kb * okoloSloneczny)
        }
      }
    }
    sumaWh += (bezp + rozpr + g.ghi * wspOdbic) * KROK_GODZIN
  }
  return sumaWh / W_NA_KW
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

  const godziny = przygotuj(lat, lon, daneGodzinowe)
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
