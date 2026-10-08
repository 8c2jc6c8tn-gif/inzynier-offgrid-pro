/**
 * Uzysk godzinowy panelu → miesiące (spec 6.2). Nasłonecznienie płaszczyzny z istniejącego silnika Muneera
 * (`lokalizacja/orientacja-powierzchni/muneer.ts`, bez zmian modelu); tu tylko model mocy panelu.
 */
import { ALBEDO_DOMYSLNE, KROK_GODZIN, W_NA_KW } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import {
  LICZBA_MIESIECY,
  natezenieGodziny,
  plaszczyzna,
  przygotujGodziny,
} from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"
import { G_SLABE_SWIATLO_W_M2, G_STC_W_M2, NOCT_G_W_M2, NOCT_T_OTOCZENIA_C, T_STC_C } from "./constants"
import type { DanePanelu, MiejsceInput } from "./input"

/** Nasłonecznienie płaszczyzny panelu w każdej godzinie roku TMY. */
export type ProfilNaslonecznienia = {
  /** G_poa [W/m²] w kolejnych rekordach TMY. */
  gPoa: Float64Array
  /** Miesiąc rekordu (0 = styczeń). */
  miesiac: Uint8Array
  /** Temperatura otoczenia [°C]; `null` gdy któryś rekord jej nie ma (zapis sprzed 08.10.2026). */
  tempC: Float64Array | null
}

export function profilNaslonecznienia(lat: number, lon: number, rekordy: RekordGodzinowy[], miejsce: MiejsceInput): ProfilNaslonecznienia {
  const godziny = przygotujGodziny(lat, lon, rekordy)
  const pl = plaszczyzna(miejsce.nachylenieDeg, miejsce.azymutDeg, miejsce.albedo ?? ALBEDO_DOMYSLNE)
  const gPoa = new Float64Array(godziny.length)
  const miesiac = new Uint8Array(godziny.length)
  godziny.forEach((g, i) => {
    gPoa[i] = natezenieGodziny(g, pl, false)
    miesiac[i] = g.miesiac
  })
  const komplet = rekordy.length > 0 && rekordy.every((r) => r.tempC !== undefined)
  return { gPoa, miesiac, tempC: komplet ? Float64Array.from(rekordy, (r) => r.tempC!) : null }
}

/** Czy karta panelu pozwala na pełny model (temperatura ogniwa z NOCT i γ). */
export function maParametryTemperaturowe(p: DanePanelu): boolean {
  return p.gammaPctNaC !== null && p.noctC !== null
}

/**
 * Sprawność względna η_rel(G): 1 od 1000 W/m² w górę; między 200 a 1000 W/m² liniowo do wartości z karty przy 200 W/m²;
 * poniżej 200 W/m² wartość z 200 W/m² (założenie `PORP-ZAL-SWIATLO-INTERPOLACJA`). Brak danych karty → 1.
 */
export function sprawnoscWzgledna(p: DanePanelu, g: number): number {
  const e200 = p.sprawnoscWzglednaPrzy200WPct
  if (e200 === null) return 1
  const w200 = e200 / 100
  if (g >= G_STC_W_M2) return 1
  if (g <= G_SLABE_SWIATLO_W_M2) return w200
  return w200 + ((1 - w200) * (g - G_SLABE_SWIATLO_W_M2)) / (G_STC_W_M2 - G_SLABE_SWIATLO_W_M2)
}

/** Które zjawiska uwzględnia uzysk — włączone tylko, gdy WSZYSTKIE porównywane panele mają dane (reguła porównywalności 6.4). */
export type ZakresModelu = { temperatura: boolean; slabeSwiatlo: boolean }

/**
 * Energia jednego panelu w miesiącach [kWh]: P_STC · G_poa / 1000, a gdy `zakres` tego wymaga — z temperaturą ogniwa
 * (NOCT, γ) i sprawnością względną przy słabym świetle.
 */
export function miesiecznaEnergiaPanelu(p: DanePanelu, profil: ProfilNaslonecznienia, zakres: ZakresModelu): number[] {
  const sumyWh = new Array<number>(LICZBA_MIESIECY).fill(0)
  const gamma = (p.gammaPctNaC ?? 0) / 100
  const przyrostNoct = ((p.noctC ?? NOCT_T_OTOCZENIA_C) - NOCT_T_OTOCZENIA_C) / NOCT_G_W_M2
  const zTemperatura = zakres.temperatura && profil.tempC !== null
  for (let i = 0; i < profil.gPoa.length; i++) {
    const g = profil.gPoa[i]!
    if (g <= 0) continue
    let moc = (p.pmaxW * g) / G_STC_W_M2
    if (zTemperatura) moc *= Math.max(0, 1 + gamma * (profil.tempC![i]! + przyrostNoct * g - T_STC_C))
    if (zakres.slabeSwiatlo) moc *= sprawnoscWzgledna(p, g)
    sumyWh[profil.miesiac[i]!]! += moc * KROK_GODZIN
  }
  return sumyWh.map((wh) => wh / W_NA_KW)
}
