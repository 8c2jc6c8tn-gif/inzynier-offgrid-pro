// 🔎 TD15 (dlug-techniczny.md): konwencja czasu rekordów PVGIS (początek/środek godziny) niezweryfikowana;
// wskaźnik nie uwzględnia zacienienia z Ekranu 3.
import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import {
  ALBEDO_DOMYSLNE,
  AZYMUT_MAX_DEG,
  KROK_DOKLADNY_DEG,
  KROK_GODZIN,
  KROK_ZGRUBNY_DEG,
  NACHYLENIE_MAX_DEG,
  NACHYLENIE_MIN_DEG,
  W_NA_KW,
} from "./constants"
import type { OrientacjaPowierzchniInput, RekordGodzinowy } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "H = \\sum_t \\Big[ G_{b,n}\\max(\\cos\\theta,0) + G_d\\,\\tfrac{1+\\cos\\beta}{2} + G_h\\,\\rho\\,\\tfrac{1-\\cos\\beta}{2} \\Big]\\Delta t,\\quad W = \\dfrac{H}{H_{opt}}"

const RAD = Math.PI / 180

export type OcenaPowierzchni = {
  nazwa: string
  nachylenieDeg: number
  azymutDeg: number
  /** Roczne napromieniowanie płaszczyzny [kWh/m²]. */
  napromieniowanieRoczneKwhM2: number
  /** Wskaźnik opłacalności względem optimum dla tej lokalizacji [%]. */
  wskaznikProcent: number
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
  dni: number
  dhi: number
  ghi: number
}

function przygotuj(lat: number, lon: number, dane: RekordGodzinowy[]): Godzina[] {
  return dane.map((r) => {
    const p = pozycjaSlonca(lat, lon, r.czasUtcMs)
    const z = (90 - p.wysokoscDeg) * RAD
    return {
      cosZ: Math.cos(z),
      sinZ: Math.sin(z),
      cosAz: Math.cos(p.azymutDeg * RAD),
      sinAz: Math.sin(p.azymutDeg * RAD),
      sloncePonadHoryzontem: p.wysokoscDeg > 0,
      dni: r.dni,
      dhi: r.dhi,
      ghi: r.ghi,
    }
  })
}

/**
 * Roczne napromieniowanie płaszczyzny [kWh/m²] — model izotropowy nieba: B. Y. H. Liu, R. C.
 * Jordan, "The long-term average performance of flat-plate solar-energy collectors", Solar Energy
 * 7(2), 1963; postać godzinowa jak w Duffie–Beckman, równ. 2.15.1 (z Gb,n·cos θ zamiast Gb·Rb).
 */
function napromieniowanie(godziny: Godzina[], nachylenieDeg: number, azymutDeg: number, albedo: number): number {
  const cosB = Math.cos(nachylenieDeg * RAD)
  const sinB = Math.sin(nachylenieDeg * RAD)
  const cosG = Math.cos(azymutDeg * RAD)
  const sinG = Math.sin(azymutDeg * RAD)
  const wspRozpr = (1 + cosB) / 2
  const wspOdbic = (albedo * (1 - cosB)) / 2
  let sumaWh = 0
  for (const g of godziny) {
    let bezp = 0
    if (g.sloncePonadHoryzontem) {
      // cos θ = cos z·cos β + sin z·sin β·cos(γs − γ), cos(γs − γ) rozpisane na iloczyny.
      const cosTheta = g.cosZ * cosB + g.sinZ * sinB * (g.cosAz * cosG + g.sinAz * sinG)
      if (cosTheta > 0) bezp = g.dni * cosTheta
    }
    sumaWh += (bezp + g.dhi * wspRozpr + g.ghi * wspOdbic) * KROK_GODZIN
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
 * powierzchni z godzinowych danych PVGIS TMY (model izotropowy Liu–Jordana), podzielone przez
 * napromieniowanie optymalnej orientacji WYZNACZONEJ z tych samych danych — nie przyjętej z góry
 * jako "południe ~35°" (to przybliżenie ze źródła, zależne od lokalizacji). Przykłady "94%"/"62%"
 * ze źródła to ilustracje, nie wartości do odtworzenia.
 *
 * Napromieniowanie ≠ uzysk energii: pomija temperaturę ogniw, straty odbicia przy dużych kątach
 * padania i zacienienie (Ekran 3) — wskaźnik porównuje powierzchnie między sobą, szczegółowy
 * uzysk liczy Moduł 3.
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
  // Siatka ma krok 1° — powierzchnia o orientacji między węzłami może minimalnie ją przewyższyć;
  // wtedy ona jest optimum (wskaźnik nigdy > 100%).
  napromieniowania.forEach((h, i) => {
    if (h > optimum.napromieniowanieRoczneKwhM2) {
      optimum = { nachylenieDeg: powierzchnie[i]!.nachylenieDeg, azymutDeg: powierzchnie[i]!.azymutDeg, napromieniowanieRoczneKwhM2: h }
    }
  })
  const oceny = powierzchnie.map((p, i) => ({
    nazwa: p.nazwa,
    nachylenieDeg: p.nachylenieDeg,
    azymutDeg: p.azymutDeg,
    napromieniowanieRoczneKwhM2: napromieniowania[i]!,
    wskaznikProcent:
      optimum.napromieniowanieRoczneKwhM2 > 0 ? (100 * napromieniowania[i]!) / optimum.napromieniowanieRoczneKwhM2 : 0,
  }))

  const assumptions: Assumption[] = [
    { kod: "ORIENTACJA-ZALOZENIE-MODEL-IZOTROPOWY" },
    { kod: "ORIENTACJA-ZALOZENIE-NAPROMIENIOWANIE-NIE-UZYSK" },
    { kod: "ORIENTACJA-ZALOZENIE-ALBEDO", params: { albedo } },
  ]

  return wynik("VALID", { optimum, powierzchnie: oceny }, [], assumptions)
}
