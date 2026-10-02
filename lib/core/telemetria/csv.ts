import { czyWielkosc, przeliczJednostke, zbudujProbke, type ProbkaTelemetrii, type Wielkosc } from "./probka"

/** Maps one CSV column to a quantity. The profile is user-supplied: the CSV layout is not known in advance. */
export interface ProfilKolumny {
  kolumna: string
  kanal: string
  wielkosc: Wielkosc
  /** Unit used in the file; converted to canonical. */
  jednostka: string
}

export interface ProfilCsv {
  /** Name of the timestamp column. */
  kolumnaCzasu: string
  /** "iso" (ISO 8601 / parsable by Date), "epoch-s" or "epoch-ms". */
  formatCzasu: "iso" | "epoch-s" | "epoch-ms"
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

function czas(s: string, f: ProfilCsv["formatCzasu"]): number | null {
  if (f === "epoch-s") {
    const n = Number(s)
    return Number.isFinite(n) ? n * 1000 : null
  }
  if (f === "epoch-ms") {
    const n = Number(s)
    return Number.isFinite(n) ? n : null
  }
  const t = Date.parse(s)
  return Number.isNaN(t) ? null : t
}

/** Reads only the header row, so the UI can offer column mapping before import. */
export function naglowkiCsv(tekst: string): string[] {
  const sep = wykryjSeparator(tekst)
  const linia = tekst.split(/\r?\n/).find((l) => l.trim().length > 0)
  return linia ? podzielLinie(linia, sep) : []
}

export function parsujCsv(tekst: string, profil: ProfilCsv, zrodloId: string): WynikCsv {
  const sep = wykryjSeparator(tekst)
  const linie = tekst.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim().length > 0)
  const wynik: WynikCsv = { probki: [], bledy: [], naglowki: [] }
  if (linie.length === 0) return wynik
  const naglowki = podzielLinie(linie[0], sep)
  wynik.naglowki = naglowki
  const idxCzas = naglowki.indexOf(profil.kolumnaCzasu)
  const idxKolumn = profil.kolumny.map((k) => naglowki.indexOf(k.kolumna))
  if (idxCzas < 0 || idxKolumn.some((i) => i < 0)) {
    wynik.bledy.push({ wiersz: 1, powod: "zla-liczba-kolumn" })
    return wynik
  }
  for (let w = 1; w < linie.length; w++) {
    const komorki = podzielLinie(linie[w], sep)
    if (komorki.length !== naglowki.length) {
      wynik.bledy.push({ wiersz: w + 1, powod: "zla-liczba-kolumn" })
      continue
    }
    const t = czas(komorki[idxCzas], profil.formatCzasu)
    if (t === null) {
      wynik.bledy.push({ wiersz: w + 1, powod: "zly-czas", kolumna: profil.kolumnaCzasu })
      continue
    }
    profil.kolumny.forEach((k, i) => {
      if (!czyWielkosc(k.wielkosc)) return
      const n = liczba(komorki[idxKolumn[i]], sep)
      if (n === "blad") {
        wynik.bledy.push({ wiersz: w + 1, powod: "zla-liczba", kolumna: k.kolumna })
        return
      }
      const wartosc = n === null ? null : przeliczJednostke(k.wielkosc, n, k.jednostka)
      if (n !== null && wartosc === null) {
        wynik.bledy.push({ wiersz: w + 1, powod: "zla-liczba", kolumna: k.kolumna })
        return
      }
      wynik.probki.push(zbudujProbke({ zrodloId, kanal: k.kanal, czas: t, wielkosc: k.wielkosc, wartosc }))
    })
  }
  return wynik
}
