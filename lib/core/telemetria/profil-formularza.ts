import { ProfilCsvSchema } from "./rejestr"
import type { ProfilCsv } from "./csv"

/** Form shape of the CSV mapping (all text, as typed by the user). */
export interface FormularzProfilu {
  bezNaglowka: boolean
  kolumnaCzasu: string
  formatCzasu: ProfilCsv["formatCzasu"]
  kolumnaGodziny: string
  przesuniecieMin: string
  znaczniki: string
  kolumny: { kolumna: string; kanal: string; wielkosc: string; jednostka: string }[]
}

export type WynikProfilu = { ok: true; profil: ProfilCsv } | { ok: false }

/** Without a header row a column is addressed by its 0-based position, otherwise by its header name. */
const adres = (tekst: string, bezNaglowka: boolean): string | number => {
  const t = tekst.trim()
  return bezNaglowka && /^\d+$/.test(t) ? Number(t) : t
}

/** Builds and validates a `ProfilCsv` from the form; any incomplete mapping is rejected (never guessed). */
export function zbudujProfil(f: FormularzProfilu): WynikProfilu {
  const potrzebujeGodziny = f.formatCzasu === "data-godzina"
  const znaczniki = f.znaczniki.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
  const przesuniecie = f.przesuniecieMin.trim() === "" ? undefined : Number(f.przesuniecieMin)
  const kandydat = {
    kolumnaCzasu: adres(f.kolumnaCzasu, f.bezNaglowka),
    formatCzasu: f.formatCzasu,
    ...(potrzebujeGodziny || (f.formatCzasu === "dmy" && f.kolumnaGodziny.trim() !== "")
      ? { kolumnaGodziny: adres(f.kolumnaGodziny, f.bezNaglowka) }
      : {}),
    ...(przesuniecie !== undefined ? { przesuniecieMin: przesuniecie } : {}),
    bezNaglowka: f.bezNaglowka,
    ...(znaczniki.length > 0 ? { znacznikiBraku: znaczniki } : {}),
    kolumny: f.kolumny.map((k) => ({
      kolumna: adres(k.kolumna, f.bezNaglowka),
      kanal: k.kanal.trim(),
      wielkosc: k.wielkosc,
      jednostka: k.jednostka.trim(),
    })),
  }
  const r = ProfilCsvSchema.safeParse(kandydat)
  return r.success ? { ok: true, profil: r.data as ProfilCsv } : { ok: false }
}

const tekstAdresu = (a: string | number): string => String(a)

/** Inverse of `zbudujProfil`: fills the form from a saved profile (a saved profile is untrusted storage — validated before use). */
export function profilDoFormularza(p: ProfilCsv): FormularzProfilu {
  return {
    bezNaglowka: p.bezNaglowka === true,
    kolumnaCzasu: tekstAdresu(p.kolumnaCzasu),
    formatCzasu: p.formatCzasu,
    kolumnaGodziny: p.kolumnaGodziny === undefined ? "" : tekstAdresu(p.kolumnaGodziny),
    przesuniecieMin: p.przesuniecieMin === undefined ? "" : String(p.przesuniecieMin),
    znaczniki: (p.znacznikiBraku ?? []).join(", "),
    kolumny: p.kolumny.map((k) => ({ kolumna: tekstAdresu(k.kolumna), kanal: k.kanal, wielkosc: k.wielkosc, jednostka: k.jednostka })),
  }
}
