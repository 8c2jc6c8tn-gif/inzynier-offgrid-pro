/**
 * How a screen field follows the project (owner decision 23.11.2026: „the field is filled from the project at once; a value
 * typed on the screen is the screen's own, the project does not change until the user saves it”). Pure functions — the hook
 * (`use-persisted-draft.ts`) only stores their results.
 *
 * Every linked field carries a marker kept next to the screen's draft:
 *  - `projekt` — the field shows the project value and follows it (a value saved later from another screen arrives here too);
 *  - `wlasna`  — the user typed their own value; the project never overwrites it (↺ brings the project value back);
 *  - no marker — the field was never touched: it is filled from the project when the project has a value.
 * Clearing a field removes its marker, so on the next visit it is filled from the project again.
 */
import { takaSamaLiczba, wartoscDoZapisu, type WartosciProjektu, type WielkoscId } from "./wielkosci"

export type Znacznik = "projekt" | "wlasna"
export type Znaczniki = Partial<Record<string, Znacznik>>
/** Screen field → project quantity. Only fields that mean exactly the quantity (same meaning, same unit). */
export type MapaPol<T> = Partial<Record<Extract<keyof T, string>, WielkoscId>>

type Rekord = Record<string, unknown>

const tekst = (x: unknown): string => (typeof x === "number" ? String(x) : typeof x === "string" ? x : "")

/** The project value written into a field of the same type as the field's initial value (number fields stay numbers). */
function doPola(v: string, poczatkowa: unknown): string | number {
  return typeof poczatkowa === "number" ? Number(v) : v
}

/** Fill the draft from the project (on load and whenever a project value changes). Returns the same objects when nothing changed. */
export function synchronizuj<T>(
  stan: T,
  poczatkowy: T,
  znaczniki: Znaczniki,
  mapa: MapaPol<T>,
  wartosci: WartosciProjektu,
): { stan: T; znaczniki: Znaczniki } {
  const s = stan as Rekord
  const p = poczatkowy as Rekord
  let nowyStan: Rekord | null = null
  let noweZn: Znaczniki | null = null
  for (const [pole, id] of Object.entries(mapa) as [string, WielkoscId][]) {
    const wp = wartosci[id]?.v
    const biezaca = s[pole]
    const zn = znaczniki[pole]
    let cel: Znacznik | undefined = zn
    let wpisz = false
    if (zn === "wlasna") {
      // own value: never overwritten
    } else if (wp === undefined) {
      if (zn === undefined && tekst(biezaca) !== "" && tekst(biezaca) !== tekst(p[pole])) cel = "wlasna"
    } else if (zn === "projekt") {
      wpisz = !takaSamaLiczba(tekst(biezaca), wp)
    } else if (tekst(biezaca) === "" || tekst(biezaca) === tekst(p[pole])) {
      wpisz = !takaSamaLiczba(tekst(biezaca), wp)
      cel = "projekt"
    } else {
      // a value typed before the project knew this quantity (or before projects existed)
      cel = takaSamaLiczba(tekst(biezaca), wp) ? "projekt" : "wlasna"
    }
    if (wpisz && wp !== undefined) (nowyStan ??= { ...s })[pole] = doPola(wp, p[pole])
    if (cel !== zn) {
      noweZn ??= { ...znaczniki }
      if (cel === undefined) delete noweZn[pole]
      else noweZn[pole] = cel
    }
  }
  return { stan: (nowyStan ?? stan) as T, znaczniki: noweZn ?? znaczniki }
}

/** Markers after the user (or the screen) changed the draft from `przed` to `po`. */
export function poEdycji<T>(przed: T, po: T, znaczniki: Znaczniki, mapa: MapaPol<T>, wartosci: WartosciProjektu | null): Znaczniki {
  const a = przed as Rekord
  const b = po as Rekord
  let nowe: Znaczniki | null = null
  for (const [pole, id] of Object.entries(mapa) as [string, WielkoscId][]) {
    if (a[pole] === b[pole]) continue
    const v = tekst(b[pole])
    const wp = wartosci?.[id]?.v
    const cel: Znacznik | undefined = v === "" ? undefined : wp !== undefined && takaSamaLiczba(v, wp) ? "projekt" : "wlasna"
    if (cel === znaczniki[pole]) continue
    nowe ??= { ...znaczniki }
    if (cel === undefined) delete nowe[pole]
    else nowe[pole] = cel
  }
  return nowe ?? znaczniki
}

/** What the field shows next to itself. */
export type StatusPola =
  | { rodzaj: "pusta" }
  | { rodzaj: "projekt"; zrodlo: string }
  | { rodzaj: "wlasna"; wProjekcie: string }
  | { rodzaj: "nowa" }

export function statusPola(wartoscPola: unknown, znacznik: Znacznik | undefined, wp: { v: string; zrodlo: string } | undefined): StatusPola {
  const v = tekst(wartoscPola)
  if (v === "") return { rodzaj: "pusta" }
  if (wp && takaSamaLiczba(v, wp.v)) return { rodzaj: "projekt", zrodlo: wp.zrodlo }
  if (znacznik !== "wlasna") return { rodzaj: "pusta" }
  return wp ? { rodzaj: "wlasna", wProjekcie: wp.v } : { rodzaj: "nowa" }
}

/** A value that could be saved into the project (shown by the quiet bar). */
export type Kandydat = { wielkosc: WielkoscId; wartosc: string; wProjekcie: string | null; pole: string | null }

/** Fields with the user's own value that differs from the project (or that the project does not have yet). */
export function kandydaciZPol<T>(stan: T, znaczniki: Znaczniki, mapa: MapaPol<T>, wartosci: WartosciProjektu): Kandydat[] {
  const s = stan as Rekord
  const wynik: Kandydat[] = []
  const widziane = new Set<WielkoscId>()
  for (const [pole, id] of Object.entries(mapa) as [string, WielkoscId][]) {
    if (znaczniki[pole] !== "wlasna" || widziane.has(id)) continue
    const v = wartoscDoZapisu(id, tekst(s[pole]))
    const wp = wartosci[id]?.v ?? null
    if (v === null || (wp !== null && takaSamaLiczba(v, wp))) continue
    widziane.add(id)
    wynik.push({ wielkosc: id, wartosc: v, wProjekcie: wp, pole })
  }
  return wynik
}

/** Results of a screen that differ from the project (or that the project does not have yet). */
export function kandydaciZWynikow(wyniki: Partial<Record<WielkoscId, number | string | null | undefined>>, wartosci: WartosciProjektu): Kandydat[] {
  const wynik: Kandydat[] = []
  for (const [id, x] of Object.entries(wyniki) as [WielkoscId, number | string | null | undefined][]) {
    if (x === null || x === undefined) continue
    const v = wartoscDoZapisu(id, x)
    const wp = wartosci[id]?.v ?? null
    if (v === null || (wp !== null && takaSamaLiczba(v, wp))) continue
    wynik.push({ wielkosc: id, wartosc: v, wProjekcie: wp, pole: null })
  }
  return wynik
}
