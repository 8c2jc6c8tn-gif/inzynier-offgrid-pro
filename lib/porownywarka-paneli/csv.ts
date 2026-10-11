/**
 * Minimal CSV reader and writer for the panel comparer (own catalogue import, results export). Separate from the telemetry CSV reader
 * (`lib/core/telemetria/csv.ts`), which is profile-driven for time series; here the file is a small table of panels.
 * Reader: UTF-8 with or without BOM, CRLF or LF, fields in double quotes with "" as an escaped quote, the separator guessed from the header line.
 */

export type Separator = ";" | "," | "\t"

/** The separator that occurs most often in the first non-empty line outside quotes; `;` when the line has none (a single column file). */
export function wykryjSeparator(tekst: string): Separator {
  const linia = tekst.replace(/^﻿/, "").split(/\r\n|\n|\r/).find((l) => l.trim() !== "") ?? ""
  const licz: Record<Separator, number> = { ";": 0, ",": 0, "\t": 0 }
  let wCudzyslowie = false
  for (const c of linia) {
    if (c === '"') wCudzyslowie = !wCudzyslowie
    else if (!wCudzyslowie && (c === ";" || c === "," || c === "\t")) licz[c]++
  }
  const najlepszy = (Object.entries(licz) as [Separator, number][]).sort((a, b) => b[1] - a[1])[0]!
  return najlepszy[1] === 0 ? ";" : najlepszy[0]
}

/** Rows of cells; fully empty rows are dropped. A quote that never closes makes the rest of the file one cell (the caller sees too few columns). */
export function rozbierzCsv(tekst: string, separator: Separator = wykryjSeparator(tekst)): string[][] {
  const wiersze: string[][] = []
  let wiersz: string[] = []
  let pole = ""
  let wCudzyslowie = false
  const zamknijWiersz = () => {
    wiersz.push(pole)
    pole = ""
    if (wiersz.some((x) => x.trim() !== "")) wiersze.push(wiersz)
    wiersz = []
  }
  const t = tekst.replace(/^﻿/, "")
  for (let i = 0; i < t.length; i++) {
    const c = t[i]!
    if (wCudzyslowie) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          pole += '"'
          i++
        } else wCudzyslowie = false
      } else pole += c
    } else if (c === '"' && pole === "") wCudzyslowie = true
    else if (c === separator) {
      wiersz.push(pole)
      pole = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++
      zamknijWiersz()
    } else pole += c
  }
  if (pole !== "" || wiersz.length > 0) zamknijWiersz()
  return wiersze
}

export type KomorkaCsv = string | number | null

export type OpcjeZapisuCsv = { separator: Separator; przecinekDziesietny: boolean }

/**
 * Text cell safe for spreadsheets: a value starting with `=`, `+`, `-`, `@`, tab or CR would be read as a formula, so it gets a leading apostrophe.
 * Numbers never pass through here (a negative number is not a formula).
 */
const bezpiecznyTekst = (s: string) => (/^[=+\-@\t\r]/.test(s) ? `'${s}` : s)

function komorka(x: KomorkaCsv, o: OpcjeZapisuCsv): string {
  if (x === null) return ""
  let s: string
  if (typeof x === "number") {
    if (!Number.isFinite(x)) return ""
    s = String(x)
    if (o.przecinekDziesietny) s = s.replace(".", ",")
  } else s = bezpiecznyTekst(x)
  return s.includes(o.separator) || /["\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** CSV text with a BOM (so Excel opens UTF-8 diacritics correctly) and CRLF line ends. */
export function zbudujCsv(wiersze: readonly (readonly KomorkaCsv[])[], o: OpcjeZapisuCsv): string {
  return "﻿" + wiersze.map((w) => w.map((x) => komorka(x, o)).join(o.separator)).join("\r\n") + "\r\n"
}
