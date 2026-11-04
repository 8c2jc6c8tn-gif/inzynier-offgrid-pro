import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import {
  FOV_SZEROKOKATNY_OSTRZEZENIE_DEG,
  MALE_POKRYCIE_PROC,
  NACHYLENIE_KAMERY_OSTRZEZENIE_DEG,
  ODCHYLENIE_OD_OSI_OSTRZEZENIE_DEG,
} from "./constants"
import type { HoryzontZeZdjeciaInput } from "./input"
import { hfovDeg as hfovZOgniskowej, kalibrujPoSlonca, ogniskowaZ35mm, ogniskowaZHfov, vfovDeg as vfovZOgniskowej, type Kamera } from "./kamera"
import { pokrycieProc, profilZLinii, type ProfilHoryzontu } from "./profil"
import { validateInput } from "./validation"
import {
  duzePrzechylenie,
  kalibracjaNiemozliwa,
  maloPokrycia,
  przeslonietePrzyGorze,
  sloncaDalekoOdOsi,
  sloncePodHoryzontem,
  szerokiKat,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "\\vec d = u\\,\\vec r + v\\,\\vec g + f\\,\\vec n,\\quad h = \\arcsin\\dfrac{v\\cos\\theta + f\\sin\\theta}{\\lVert\\vec d\\rVert}"

export type HoryzontZeZdjeciaResult = {
  kamera: {
    azymutSrodkaDeg: number
    nachylenieDeg: number
    ogniskowaPx: number
    hfovDeg: number
    vfovDeg: number
  }
  /** Sun position at the moment of the photo — only when the camera was calibrated by the sun click. */
  slonce: { azymutDeg: number; wysokoscDeg: number } | null
  /** Elevation of the skyline [°] for azimuth 0…359°, null = not covered by this photo. */
  profilDeg: ProfilHoryzontu
  pokrycieAzymutuProc: number
  maksWysokoscDeg: number
}

/**
 * Stage 2 of `docs/tor-slonca-ar-ocena.md`: photo + sun click → horizon profile.
 *
 * ai-tool: nie dotyczy — wejściem są piksele zdjęcia i kliknięcie w słońce, których asystent w rozmowie nie widzi i nie
 * może podać. Stratę energii z horyzontu opisanego punktami (azymut, wysokość) liczy narzędzie `policz_zacienienie`
 * (pole `horyzont`), na tym samym silniku zacienienia.
 *
 * @param kolumnPrzyGorzeKadru how many skyline columns touch the top edge of the frame (from the
 *   automatic detector; 0 for a hand-drawn line) — reported as a warning, it does not change the result.
 */
export function calculateHoryzontZeZdjecia(
  input: HoryzontZeZdjeciaInput,
  kolumnPrzyGorzeKadru = 0,
): CalcResult<HoryzontZeZdjeciaResult | null> {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const baza = { unit: "°", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const wynik = (status: Status, value: HoryzontZeZdjeciaResult | null, warnings: Warning[] = [], assumptions: Assumption[] = []): CalcResult<HoryzontZeZdjeciaResult | null> => ({
    ...baza,
    value,
    status,
    assumptions,
    warnings,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)

  const { szerokoscPx: w, wysokoscPx: h } = input
  if (w === null || h === null || !input.liniaHoryzontu.some((l) => l.length >= 2)) return wynik("INCOMPLETE", null)
  let ogniskowaPx: number
  if (input.hfovDeg !== null) ogniskowaPx = ogniskowaZHfov(w, input.hfovDeg)
  else if (input.ogniskowa35mmMm !== null) ogniskowaPx = ogniskowaZ35mm(w, h, input.ogniskowa35mmMm)
  else return wynik("INCOMPLETE", null)

  const warnings: Warning[] = []
  const zalozenia: Assumption[] = [{ kod: "HORZ-ZAL-KAMERA" }]
  let azymutSrodkaDeg: number
  let nachylenieDeg: number
  let slonce: HoryzontZeZdjeciaResult["slonce"] = null

  if (input.slonce) {
    const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, czasUtcMs } = input
    if (lat === null || lon === null || czasUtcMs === null) return wynik("INCOMPLETE", null)
    const p = pozycjaSlonca(lat, lon, czasUtcMs)
    if (p.wysokoscDeg <= 0) return wynik("INVALID_INPUT", null, [sloncePodHoryzontem(p.wysokoscDeg)])
    const kalibracja = kalibrujPoSlonca(w, h, ogniskowaPx, input.slonce.x, input.slonce.y, { azymutDeg: p.azymutDeg, wysokoscDeg: p.wysokoscDeg })
    if (!kalibracja) return wynik("INVALID_INPUT", null, [kalibracjaNiemozliwa()])
    azymutSrodkaDeg = kalibracja.azymutSrodkaDeg
    nachylenieDeg = kalibracja.nachylenieDeg
    slonce = { azymutDeg: p.azymutDeg, wysokoscDeg: p.wysokoscDeg }
    zalozenia.push({ kod: "HORZ-ZAL-KALIBRACJA-SLONCE" })
  } else if (input.orientacjaReczna) {
    azymutSrodkaDeg = input.orientacjaReczna.azymutSrodkaDeg
    nachylenieDeg = input.orientacjaReczna.nachylenieKameryDeg
    zalozenia.push({ kod: "HORZ-ZAL-KALIBRACJA-RECZNA" })
  } else {
    return wynik("INCOMPLETE", null)
  }

  const kamera: Kamera = { szerokoscPx: w, wysokoscPx: h, ogniskowaPx, azymutSrodkaDeg, nachylenieDeg }
  const hfov = hfovZOgniskowej(w, ogniskowaPx)
  const vfov = vfovZOgniskowej(h, ogniskowaPx)

  if (hfov > FOV_SZEROKOKATNY_OSTRZEZENIE_DEG) warnings.push(szerokiKat(hfov))
  if (Math.abs(nachylenieDeg) > NACHYLENIE_KAMERY_OSTRZEZENIE_DEG) warnings.push(duzePrzechylenie(Math.abs(nachylenieDeg)))
  if (input.slonce) {
    const u = input.slonce.x - w / 2
    const v = h / 2 - input.slonce.y
    const odOsi = (Math.atan(Math.hypot(u, v) / ogniskowaPx) * 180) / Math.PI
    if (odOsi > ODCHYLENIE_OD_OSI_OSTRZEZENIE_DEG) warnings.push(sloncaDalekoOdOsi(odOsi))
  }
  if (kolumnPrzyGorzeKadru > 0) warnings.push(przeslonietePrzyGorze(kolumnPrzyGorzeKadru))

  const profilDeg = profilZLinii(kamera, input.liniaHoryzontu)
  const pokrycie = pokrycieProc(profilDeg)
  if (pokrycie === 0) return wynik("INCOMPLETE", null, warnings, zalozenia)
  if (pokrycie < MALE_POKRYCIE_PROC) warnings.push(maloPokrycia(pokrycie))
  zalozenia.push({ kod: "HORZ-ZAL-MAKSIMUM" }, { kod: "HORZ-ZAL-JEDEN-PUNKT" })

  const maks = Math.max(...profilDeg.filter((v): v is number => v !== null))
  const status: Status = warnings.some((x) => x.level === "warning" || x.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID"
  return wynik(
    status,
    {
      kamera: { azymutSrodkaDeg, nachylenieDeg, ogniskowaPx, hfovDeg: hfov, vfovDeg: vfov },
      slonce,
      profilDeg,
      pokrycieAzymutuProc: pokrycie,
      maksWysokoscDeg: maks,
    },
    warnings,
    zalozenia,
  )
}
