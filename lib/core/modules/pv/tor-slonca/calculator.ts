import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import {
  cosKataPadania,
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import { KROK_GODZIN, W_NA_KW } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"
import { godzinaLokalnaPl, profilNaslonecznienia } from "@/lib/core/modules/pv/porownywarka-paneli/uzysk"
import {
  DNI_LUKOW,
  DZIEN_WYBRANEGO_MIESIACA,
  GODZIN_W_DOBIE,
  KROK_MIN,
  KROK_RYSUNKU_MIN,
  MIESIECY,
  MIN_W_GODZINIE,
  PODPROBEK_NA_GODZINE,
  ROK_ODNIESIENIA,
} from "./constants"
import type { TorSloncaInput } from "./input"
import { validateInput } from "./validation"
import { bezDanychPv, bezTmy, panelTylemDoSlonca, sloncePodHoryzontem } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_h = \\dfrac{G_{POA,h}}{1000}\\, P_{kWp}\\, PR"

const MS_NA_GODZINE = 3_600_000

/** Punkt toru: godzina czasu urzędowego Polski (ułamek, np. 12,5 = 12:30) i położenie słońca. */
export type PunktToru = { godzinaH: number; azymutDeg: number; wysokoscDeg: number }

export type IdLuku = (typeof DNI_LUKOW)[number]["id"] | "wybrany"

export type LukSlonca = {
  id: IdLuku
  miesiac: number
  dzien: number
  /** Linia łuku: punkty nad horyzontem co `KROK_RYSUNKU_MIN` minut. */
  punkty: PunktToru[]
  /** Znaczniki pełnych godzin czasu urzędowego nad horyzontem. */
  znaczniki: PunktToru[]
  /** Chwile przejścia środka tarczy (pozorna wysokość z refrakcją) przez 0°; `null` = słońce nad horyzontem przez całą dobę albo pod nim. */
  wschodH: number | null
  zachodH: number | null
  /** Godzina największej wysokości słońca (górowanie) i ta wysokość; `null`, gdy słońce nie wschodzi. */
  gorowanieH: number | null
  maksWysokoscDeg: number
  dlugoscDniaH: number
}

/** Energia z jednej godziny doby czasu urzędowego (godzina `godzinaH` oznacza przedział [godzinaH, godzinaH + 1)). */
export type GodzinaEnergii = {
  godzinaH: number
  /** Średni dzień miesiąca z TMY [kWh]; `null` bez danych pogodowych. */
  typowaKwh: number | null
  /** Przy czystym niebie, tylko promieniowanie bezpośrednie, w dniu wybranego łuku [kWh]. */
  czysteNiebo: number
}

export type TorSloncaResult = {
  luki: LukSlonca[]
  /** Zakres azymutów łuków [°] — do skali osi (przy nocy/dniu polarnym łuk może obejmować całe 0–360°). */
  zakresAzymutuDeg: { od: number; do: number } | null
  /** Pełna doba energii PV; `null`, gdy brak nachylenia, azymutu, mocy lub PR. */
  energia: {
    godziny: GodzinaEnergii[]
    typowaDobaKwh: number | null
    czysteNiebo: number
    /** Godzina czasu urzędowego z największą energią typowego dnia; `null` bez TMY albo przy zerowej energii. */
    szczytTypowyH: number | null
    /** Średnia dobowa energia typowego dnia w miesiącach [kWh/dobę], styczeń pierwszy; `null` bez TMY. */
    miesiacamiKwhNaDobe: number[] | null
  } | null
}

const zaokragl = (x: number, n = 3) => Math.round(x * 10 ** n) / 10 ** n

/** Przesunięcie czasu urzędowego Polski względem UTC [godz.] w danym dniu (1 zimą, 2 latem; zmiana następuje o 01:00 UTC, więc południe jest jednoznaczne). */
function przesuniecieUrzedoweH(miesiac: number, dzien: number): number {
  return (godzinaLokalnaPl(Date.UTC(ROK_ODNIESIENIA, miesiac - 1, dzien, 12)) - 12 + GODZIN_W_DOBIE) % GODZIN_W_DOBIE
}

/** Położenie słońca w chwili `godzinaH` (czas urzędowy Polski) dnia roku odniesienia — dla suwaka godziny i znacznika „teraz”. */
export function pozycjaLokalna(lat: number, lon: number, miesiac: number, dzien: number, godzinaH: number): { azymutDeg: number; wysokoscDeg: number } {
  const utcMs = Date.UTC(ROK_ODNIESIENIA, miesiac - 1, dzien) + (godzinaH - przesuniecieUrzedoweH(miesiac, dzien)) * MS_NA_GODZINE
  const p = pozycjaSlonca(lat, lon, utcMs)
  return { azymutDeg: p.azymutDeg, wysokoscDeg: p.wysokoscDeg }
}

function lukDnia(lat: number, lon: number, id: IdLuku, miesiac: number, dzien: number): LukSlonca {
  const poczatekUtc = Date.UTC(ROK_ODNIESIENIA, miesiac - 1, dzien) - przesuniecieUrzedoweH(miesiac, dzien) * MS_NA_GODZINE
  const punkty: PunktToru[] = []
  const znaczniki: PunktToru[] = []
  let pierwszyNad = -1
  let ostatniNad = -1
  let liczbaNad = 0
  let maks = { wysokoscDeg: -90, minuta: 0 }
  const minutDoby = GODZIN_W_DOBIE * MIN_W_GODZINIE
  for (let minuta = 0; minuta < minutDoby; minuta += KROK_MIN) {
    const p = pozycjaSlonca(lat, lon, poczatekUtc + minuta * 60_000)
    if (p.wysokoscDeg > maks.wysokoscDeg) maks = { wysokoscDeg: p.wysokoscDeg, minuta }
    if (p.wysokoscDeg <= 0) continue
    liczbaNad++
    if (pierwszyNad < 0) pierwszyNad = minuta
    ostatniNad = minuta
    const punkt = { godzinaH: minuta / MIN_W_GODZINIE, azymutDeg: zaokragl(p.azymutDeg, 2), wysokoscDeg: zaokragl(p.wysokoscDeg, 2) }
    if (minuta % KROK_RYSUNKU_MIN === 0) punkty.push(punkt)
    if (minuta % MIN_W_GODZINIE === 0) znaczniki.push(punkt)
  }
  const sloneceWschodzi = liczbaNad > 0
  return {
    id,
    miesiac,
    dzien,
    punkty,
    znaczniki,
    wschodH: sloneceWschodzi && pierwszyNad > 0 ? pierwszyNad / MIN_W_GODZINIE : null,
    zachodH: sloneceWschodzi && ostatniNad < minutDoby - KROK_MIN ? (ostatniNad + KROK_MIN) / MIN_W_GODZINIE : null,
    gorowanieH: sloneceWschodzi ? maks.minuta / MIN_W_GODZINIE : null,
    maksWysokoscDeg: zaokragl(Math.max(maks.wysokoscDeg, 0), 2),
    dlugoscDniaH: (liczbaNad * KROK_MIN) / MIN_W_GODZINIE,
  }
}

/** Energia dnia przy czystym niebie, tylko składowa bezpośrednia, godzina po godzinie [kWh] (średnia z kilku podgodzin). */
function energiaCzysteNiebo(lat: number, lon: number, miesiac: number, dzien: number, nachylenieDeg: number, azymutPanelDeg: number, mocKwp: number, pr: number): number[] {
  const poczatekUtc = Date.UTC(ROK_ODNIESIENIA, miesiac - 1, dzien) - przesuniecieUrzedoweH(miesiac, dzien) * MS_NA_GODZINE
  return Array.from({ length: GODZIN_W_DOBIE }, (_, h) => {
    let suma = 0
    for (let i = 0; i < PODPROBEK_NA_GODZINE; i++) {
      const p = pozycjaSlonca(lat, lon, poczatekUtc + (h + (i + 0.5) / PODPROBEK_NA_GODZINE) * MS_NA_GODZINE)
      if (p.wysokoscDeg <= 0) continue
      const cos = cosKataPadania(p.wysokoscDeg, p.azymutDeg, nachylenieDeg, azymutPanelDeg)
      if (cos > 0) suma += promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) * cos
    }
    return (suma / PODPROBEK_NA_GODZINE) * mocKwp * pr
  })
}

/** Średni dzień każdego miesiąca z TMY: energia w każdej godzinie czasu urzędowego [kWh], `[miesiąc][godzina]`. */
function energiaTypowa(lat: number, lon: number, input: TorSloncaInput, nachylenieDeg: number, azymutPanelDeg: number, mocKwp: number, pr: number): number[][] {
  const rekordy = input.daneGodzinowe!
  const profil = profilNaslonecznienia(lat, lon, rekordy, { nachylenieDeg, azymutDeg: azymutPanelDeg, ...(input.albedo !== undefined ? { albedo: input.albedo } : {}) })
  const suma = Array.from({ length: MIESIECY }, () => new Array<number>(GODZIN_W_DOBIE).fill(0))
  const ile = Array.from({ length: MIESIECY }, () => new Array<number>(GODZIN_W_DOBIE).fill(0))
  for (let i = 0; i < rekordy.length; i++) {
    const m = profil.miesiac[i]!
    const h = profil.godzinaLokalna[i]!
    suma[m]![h]! += profil.gPoa[i]!
    ile[m]![h]!++
  }
  return suma.map((wiersz, m) => wiersz.map((s, h) => (ile[m]![h]! > 0 ? ((s / ile[m]![h]!) * KROK_GODZIN * mocKwp * pr) / W_NA_KW : 0)))
}

export function calculateTorSlonca(input: TorSloncaInput): CalcResult<TorSloncaResult | null> {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const wynik = (status: Status, value: TorSloncaResult | null, warnings: Warning[] = [], assumptions: Assumption[] = []): CalcResult<TorSloncaResult | null> => ({
    ...baza,
    value,
    status,
    assumptions,
    warnings,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, miesiac, nachylenieDeg: beta, azymutDeg: az, mocKwp, pr } = input
  if (lat === null || lon === null || miesiac === null) return wynik("INCOMPLETE", null)

  const luki: LukSlonca[] = [
    ...DNI_LUKOW.map((d) => lukDnia(lat, lon, d.id, d.miesiac, d.dzien)),
    lukDnia(lat, lon, "wybrany", miesiac, DZIEN_WYBRANEGO_MIESIACA),
  ]
  const wybrany = luki[luki.length - 1]!
  const wszystkie = luki.flatMap((l) => l.punkty.map((p) => p.azymutDeg))
  const zakres = wszystkie.length > 0 ? { od: Math.min(...wszystkie), do: Math.max(...wszystkie) } : null

  const warnings: Warning[] = []
  const zalozenia: Assumption[] = [{ kod: "TORS-ZAL-POZYCJA", params: { rok: ROK_ODNIESIENIA } }, { kod: "TORS-ZAL-WSCHOD" }]
  if (wybrany.dlugoscDniaH === 0) warnings.push(sloncePodHoryzontem())

  let energia: TorSloncaResult["energia"] = null
  if (beta !== null && az !== null && mocKwp !== null && pr !== null) {
    const czyste = energiaCzysteNiebo(lat, lon, miesiac, DZIEN_WYBRANEGO_MIESIACA, beta, az, mocKwp, pr)
    const typowa = input.daneGodzinowe?.length ? energiaTypowa(lat, lon, input, beta, az, mocKwp, pr) : null
    const typowaDnia = typowa ? typowa[miesiac - 1]! : null
    const sumaTypowa = typowaDnia ? typowaDnia.reduce((a, b) => a + b, 0) : null
    let szczyt: number | null = null
    if (typowaDnia && sumaTypowa! > 0) szczyt = typowaDnia.indexOf(Math.max(...typowaDnia))
    const sumaCzysta = czyste.reduce((a, b) => a + b, 0)
    energia = {
      godziny: czyste.map((c, h) => ({ godzinaH: h, typowaKwh: typowaDnia ? typowaDnia[h]! : null, czysteNiebo: c })),
      typowaDobaKwh: sumaTypowa,
      czysteNiebo: sumaCzysta,
      szczytTypowyH: szczyt,
      miesiacamiKwhNaDobe: typowa ? typowa.map((w) => w.reduce((a, b) => a + b, 0)) : null,
    }
    zalozenia.push({ kod: "TORS-ZAL-PR" }, { kod: "TORS-ZAL-CZYSTE-NIEBO" })
    if (typowa) zalozenia.push({ kod: "TORS-ZAL-DZIEN-TYPOWY" })
    else warnings.push(bezTmy())
    if (sumaCzysta === 0 && wybrany.dlugoscDniaH > 0) warnings.push(panelTylemDoSlonca())
  } else {
    warnings.push(bezDanychPv())
  }

  const status: Status = warnings.some((w) => w.level === "warning" || w.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID"
  return wynik(status, { luki, zakresAzymutuDeg: zakres, energia }, warnings, zalozenia)
}
