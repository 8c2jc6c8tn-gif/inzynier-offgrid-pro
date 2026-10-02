import { czyWielkosc, przeliczJednostke, zbudujProbke, type ProbkaTelemetrii, type Wielkosc } from "./probka"

/** Maps one CSV column to a quantity. The profile is user-supplied: the CSV layout is not known in advance. */
export interface ProfilKolumny {
  /** Header name, or a 0-based position (required when the file has no header row). */
  kolumna: string | number
  kanal: string
  wielkosc: Wielkosc
  /** Unit used in the file; converted to canonical. */
  jednostka: string
}

export interface ProfilCsv {
  /** Timestamp column: header name, or 0-based position. */
  kolumnaCzasu: string | number
  /**
   * "iso" (YYYY-MM-DD[T ]HH:MM[:SS], optional zone), "epoch-s", "epoch-ms",
   * "data-godzina" (date column + `kolumnaGodziny`, e.g. 2026-01-31 + 14:00),
   * "dmy" (DD.MM.YYYY[ HH:MM[:SS]], also with `kolumnaGodziny`).
   */
  formatCzasu: "iso" | "epoch-s" | "epoch-ms" | "data-godzina" | "dmy"
  /** Separate time-of-day column for "data-godzina" / "dmy". */
  kolumnaGodziny?: string | number
  /**
   * Fixed offset of the file's clock from UTC, in minutes (e.g. 60 for CET, 120 for CEST), applied when the
   * timestamp carries no zone. Default 0 = UTC. Never guessed: a wrong value shifts every sample.
   */
  przesuniecieMin?: number
  /** True when the file has no header row; every column is then addressed by position. */
  bezNaglowka?: boolean
  /** Cell values meaning "no measurement" (e.g. "-999", "///"); they become explicit no-data, not numbers. */
  znacznikiBraku?: string[]
  kolumny: ProfilKolumny[]
}

export interface BladCsv {
  wiersz: number
  powod: "zla-liczba-kolumn" | "zly-czas" | "zla-liczba"
  kolumna?: string
}

export interface WynikCsv {
  probki: ProbkaTelemetrii[]
  bledy: BladCsv[]
  naglowki: string[]
}

export type WynikWykryciaProfilu = { ok: true; profil: ProfilCsv } | { ok: false }

export function wykryjSeparator(tekst: string): "," | ";" | "\t" {
  const linia = tekst.split(/\r?\n/).find((l) => l.trim().length > 0) ?? ""
  const licz = (s: string) => linia.split(s).length - 1
  const srednikow = licz(";")
  const tabow = licz("\t")
  const przecinkow = licz(",")
  if (srednikow >= przecinkow && srednikow >= tabow && srednikow > 0) return ";"
  if (tabow > przecinkow && tabow > 0) return "\t"
  return ","
}

/** Splits one line honouring double quotes. */
function podzielLinie(linia: string, sep: string): string[] {
  const wynik: string[] = []
  let biezace = ""
  let wCudzyslowie = false
  for (let i = 0; i < linia.length; i++) {
    const z = linia[i]
    if (z === '"') {
      if (wCudzyslowie && linia[i + 1] === '"') {
        biezace += '"'
        i++
      } else wCudzyslowie = !wCudzyslowie
    } else if (z === sep && !wCudzyslowie) {
      wynik.push(biezace)
      biezace = ""
    } else biezace += z
  }
  wynik.push(biezace)
  return wynik.map((s) => s.trim())
}

/** Accepts a decimal comma when the separator is not a comma. Empty cell = no data (null). */
function liczba(s: string, sep: string): number | null | "blad" {
  if (s === "") return null
  const t = sep === "," ? s : s.replace(",", ".")
  const n = Number(t)
  return Number.isFinite(n) ? n : "blad"
}

function czas(s: string, g: string | null, p: ProfilCsv): number | null {
  const f = p.formatCzasu
  if (f === "epoch-s" || f === "epoch-ms") {
    const n = Number(s)
    return Number.isFinite(n) ? (f === "epoch-s" ? n * 1000 : n) : null
  }
  let rok: number, mies: number, dzien: number
  let godz = 0, min = 0, sek = 0
  let strefaWTekscie = false
  if (f === "dmy") {
    const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(s)
    if (!m) return null
    ;[dzien, mies, rok] = [Number(m[1]), Number(m[2]), Number(m[3])]
    if (m[4] !== undefined) [godz, min, sek] = [Number(m[4]), Number(m[5]), Number(m[6] ?? 0)]
  } else {
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/.exec(s)
    if (!m) return null
    ;[rok, mies, dzien] = [Number(m[1]), Number(m[2]), Number(m[3])]
    if (m[4] !== undefined) [godz, min, sek] = [Number(m[4]), Number(m[5]), Number(m[6] ?? 0)]
    if (m[7]) {
      strefaWTekscie = true
      const sign = m[7].startsWith("-") ? -1 : 1
      const d = m[7] === "Z" ? "0000" : m[7].slice(1).replace(":", "")
      const off = sign * (Number(d.slice(0, 2)) * 60 + Number(d.slice(2)))
      godz -= off / 60
    }
  }
  if (g !== null && (f === "data-godzina" || f === "dmy")) {
    const h = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(g)
    if (!h) return null
    ;[godz, min, sek] = [Number(h[1]), Number(h[2]), Number(h[3] ?? 0)]
  }
  if (mies < 1 || mies > 12 || dzien < 1 || dzien > 31 || godz > 48 || min > 59 || sek > 59) return null
  const t = Date.UTC(rok, mies - 1, dzien, 0, 0, 0) + ((godz * 60 + min) * 60 + sek) * 1000
  return strefaWTekscie ? t : t - (p.przesuniecieMin ?? 0) * 60_000
}

/** Reads only the header row, so the UI can offer column mapping before import. */
export function naglowkiCsv(tekst: string): string[] {
  const sep = wykryjSeparator(tekst)
  const linia = tekst.split(/\r?\n/).find((l) => l.trim().length > 0)
  return linia ? podzielLinie(linia, sep) : []
}

export function parsujCsv(tekst: string, profil: ProfilCsv, zrodloId: string): WynikCsv {
  const sep = wykryjSeparator(tekst)
  const linie = tekst.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim().length > 0)
  const wynik: WynikCsv = { probki: [], bledy: [], naglowki: [] }
  if (linie.length === 0) return wynik
  const bez = profil.bezNaglowka === true
  const naglowki = bez ? [] : podzielLinie(linie[0], sep)
  wynik.naglowki = naglowki
  const adres = (k: string | number): number => (typeof k === "number" ? k : naglowki.indexOf(k))
  const idxCzas = adres(profil.kolumnaCzasu)
  const idxGodz = profil.kolumnaGodziny === undefined ? -1 : adres(profil.kolumnaGodziny)
  const idxKolumn = profil.kolumny.map((k) => adres(k.kolumna))
  const zleAdresy = idxCzas < 0 || (profil.kolumnaGodziny !== undefined && idxGodz < 0) || idxKolumn.some((i) => i < 0)
  if (zleAdresy) {
    wynik.bledy.push({ wiersz: 1, powod: "zla-liczba-kolumn" })
    return wynik
  }
  const braki = new Set(profil.znacznikiBraku ?? [])
  const oczekiwane = bez ? Math.max(idxCzas, idxGodz, ...idxKolumn) + 1 : naglowki.length
  for (let w = bez ? 0 : 1; w < linie.length; w++) {
    const komorki = podzielLinie(linie[w], sep)
    const zlaDlugosc = bez ? komorki.length < oczekiwane : komorki.length !== oczekiwane
    if (zlaDlugosc) {
      wynik.bledy.push({ wiersz: w + 1, powod: "zla-liczba-kolumn" })
      continue
    }
    const t = czas(komorki[idxCzas], idxGodz >= 0 ? komorki[idxGodz] : null, profil)
    if (t === null) {
      wynik.bledy.push({ wiersz: w + 1, powod: "zly-czas", kolumna: String(profil.kolumnaCzasu) })
      continue
    }
    profil.kolumny.forEach((k, i) => {
      if (!czyWielkosc(k.wielkosc)) return
      const surowa = komorki[idxKolumn[i]]
      const n = braki.has(surowa) ? null : liczba(surowa, sep)
      if (n === "blad") {
        wynik.bledy.push({ wiersz: w + 1, powod: "zla-liczba", kolumna: String(k.kolumna) })
        return
      }
      const wartosc = n === null ? null : przeliczJednostke(k.wielkosc, n, k.jednostka)
      if (n !== null && wartosc === null) {
        wynik.bledy.push({ wiersz: w + 1, powod: "zla-liczba", kolumna: String(k.kolumna) })
        return
      }
      wynik.probki.push(zbudujProbke({ zrodloId, kanal: k.kanal, czas: t, wielkosc: k.wielkosc, wartosc }))
    })
  }
  return wynik
}
