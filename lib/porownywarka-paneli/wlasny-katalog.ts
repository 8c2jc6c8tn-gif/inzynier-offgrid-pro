/**
 * Own panel catalogue imported from a CSV file (list-of-tasks item 2, spec 42): a supplier's price list or the user's own datasheet table.
 * Nothing is completed from a "typical" panel: an empty cell stays empty (the engine then treats the parameter as unknown). A row is accepted
 * only when the engine's own panel validation (`validateInput`) accepts it, so the import adds no rules of its own about physics.
 */
import type { Warning } from "@/lib/core/calc-result"
import { validateInput } from "@/lib/core/modules/pv/porownywarka-paneli/validation"
import type { PorownywarkaInput } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { domyslnyWyborKryteriow } from "@/lib/core/modules/pv/porownywarka-paneli/kryteria"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { rozbierzCsv, wykryjSeparator, zbudujCsv, type Separator } from "./csv"
import { przeliczPoleTekst } from "@/lib/waluta/przelicz"
import { panelDoSilnika, PANEL_PUSTY, type PanelSeed } from "./stan"

/** A catalogue entry: the form texts of a panel (without the form id), with its own id in the user's catalogue. */
export type WpisWlasnegoKatalogu = Omit<PanelSeed, "id"> & { wlId: string }
export type WlasnyKatalog = { wpisy: WpisWlasnegoKatalogu[] }
export const WLASNY_KATALOG_PUSTY: WlasnyKatalog = { wpisy: [] }

export const MAKS_WIERSZY_CSV = 500
export const MAKS_ROZMIAR_CSV_B = 1_000_000

type KluczLiczbowy = "moc" | "cena" | "gamma" | "noct" | "spr200" | "deg1" | "degLin" | "dlugosc" | "szerokosc" | "masa" | "voc" | "vmp" | "isc" | "imp" | "betaVoc" | "maxV" | "maxBezp"
type KluczKolumny = KluczLiczbowy | "nazwa" | "producent" | "bifacjalny"

const czyLiczbowy = (k: KluczKolumny): k is KluczLiczbowy => k !== "nazwa" && k !== "producent" && k !== "bifacjalny"

/** Canonical header (what the template file has) and accepted alternatives, compared after `normalizuj`. */
export const KOLUMNY_CSV: readonly { klucz: KluczKolumny; naglowek: string; aliasy: readonly string[]; wymagana?: true }[] = [
  { klucz: "nazwa", naglowek: "nazwa", aliasy: ["name", "model", "nazwa panelu"], wymagana: true },
  { klucz: "producent", naglowek: "producent", aliasy: ["manufacturer", "brand", "marka"] },
  { klucz: "moc", naglowek: "moc_wp", aliasy: ["moc", "pmax", "pmax_w", "power", "power_wp", "moc [w]"], wymagana: true },
  { klucz: "cena", naglowek: "cena", aliasy: ["price", "cena brutto"] },
  { klucz: "gamma", naglowek: "wsp_temp_pmax_proc_na_c", aliasy: ["gamma", "tk_pmax", "temperature_coefficient_pmax"] },
  { klucz: "noct", naglowek: "noct_c", aliasy: ["noct", "nmot_c"] },
  { klucz: "spr200", naglowek: "sprawnosc_wzgledna_200_proc", aliasy: ["spr200", "low_light_efficiency"] },
  { klucz: "deg1", naglowek: "degradacja_1_rok_proc", aliasy: ["deg1", "first_year_degradation"] },
  { klucz: "degLin", naglowek: "degradacja_roczna_proc", aliasy: ["deglin", "annual_degradation"] },
  { klucz: "dlugosc", naglowek: "dlugosc_mm", aliasy: ["dlugosc", "length_mm", "length"] },
  { klucz: "szerokosc", naglowek: "szerokosc_mm", aliasy: ["szerokosc", "width_mm", "width"] },
  { klucz: "masa", naglowek: "masa_kg", aliasy: ["masa", "weight_kg", "mass_kg"] },
  { klucz: "bifacjalny", naglowek: "bifacjalny", aliasy: ["bifacial", "dwustronny"] },
  { klucz: "voc", naglowek: "voc_v", aliasy: ["voc"] },
  { klucz: "vmp", naglowek: "vmp_v", aliasy: ["vmp"] },
  { klucz: "isc", naglowek: "isc_a", aliasy: ["isc"] },
  { klucz: "imp", naglowek: "imp_a", aliasy: ["imp"] },
  { klucz: "betaVoc", naglowek: "beta_voc_proc_na_c", aliasy: ["beta_voc", "beta", "voc_temperature_coefficient"] },
  { klucz: "maxV", naglowek: "maks_napiecie_ukladu_v", aliasy: ["maks_napiecie", "max_system_voltage", "max_system_voltage_v"] },
  { klucz: "maxBezp", naglowek: "maks_bezpiecznik_szeregowy_a", aliasy: ["maks_bezpiecznik", "max_series_fuse", "max_series_fuse_a"] },
]

const ELEKTRYKA_KLUCZE: readonly KluczLiczbowy[] = ["voc", "vmp", "isc", "imp", "betaVoc", "maxV"]

/** Lower case, no diacritics, only letters and digits: "Wsp. temp. Pmax [%/°C]" and "wsp_temp_pmax" compare equal up to the unit part. */
const normalizuj = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")

export type KomunikatImportu = { kod: string; params?: Record<string, string | number>; /** Field the engine validation names, for the row messages from `validateInput`. */ pole?: string }

export type OdrzuconyWiersz = {
  /** Line number in the file, counting the header as 1. */
  wiersz: number
  powody: KomunikatImportu[]
}

export type WynikImportuCsv = {
  separator: Separator
  wpisy: Omit<WpisWlasnegoKatalogu, "wlId">[]
  odrzucone: OdrzuconyWiersz[]
  /** Accepted rows with a note (e.g. partial electrical data that the engine will not use). */
  uwagi: { wiersz: number; komunikat: KomunikatImportu }[]
  /** Header names that matched no known column — their values are ignored. */
  pominieteKolumny: string[]
  /** The file as a whole cannot be read (empty, no header with the required columns, too many rows). */
  bladPliku: KomunikatImportu | null
}

const PUSTY_WYNIK: WynikImportuCsv = { separator: ";", wpisy: [], odrzucone: [], uwagi: [], pominieteKolumny: [], bladPliku: null }

/** Header-only template the user fills in (no example row: an example would be a made-up panel). */
export function szablonCsv(): string {
  return zbudujCsv([KOLUMNY_CSV.map((k) => k.naglowek)], { separator: ";", przecinekDziesietny: true })
}

const PRAWDA = new Set(["tak", "t", "yes", "y", "true", "1", "da", "да"])
const FALSZ = new Set(["nie", "n", "no", "false", "0", "net", "нет"])

/** A cell as a plain number text (comma or point decimals, spaces ignored); `undefined` = not a number. Empty is handled by the caller. */
function liczbaZKomorki(s: string): string | undefined {
  const bezSpacji = s.replace(/[\s ]/g, "")
  if (!/^[+-]?\d+([.,]\d+)?$/.test(bezSpacji)) return undefined
  const n = liczba(bezSpacji)
  return n === undefined ? undefined : String(n)
}

function walidujPanel(seed: Omit<PanelSeed, "id">): Warning[] {
  const dane = panelDoSilnika({ ...seed, id: "csv" }, seed.nazwa)
  if (!dane) return []
  const wejscie = { miejsce: null, liczbaPaneli: null, panele: [dane], wycena: null, kryteria: domyslnyWyborKryteriow() } as PorownywarkaInput
  return validateInput(wejscie).errors
}

export function importujKatalogCsv(tekst: string): WynikImportuCsv {
  if (tekst.trim() === "") return { ...PUSTY_WYNIK, bladPliku: { kod: "UI-PORP-CSV-PUSTY" } }
  const wiersze = rozbierzCsv(tekst)
  const separatorUzyty = wykryjSeparator(tekst)
  const [naglowek, ...dane] = wiersze
  if (!naglowek) return { ...PUSTY_WYNIK, bladPliku: { kod: "UI-PORP-CSV-PUSTY" } }
  const indeks = new Map<KluczKolumny, number>()
  const pominiete: string[] = []
  naglowek.forEach((nazwa, i) => {
    const n = normalizuj(nazwa)
    const kolumna = KOLUMNY_CSV.find((k) => normalizuj(k.naglowek) === n || k.aliasy.some((a) => normalizuj(a) === n))
    if (kolumna && !indeks.has(kolumna.klucz)) indeks.set(kolumna.klucz, i)
    else if (nazwa.trim() !== "") pominiete.push(nazwa.trim())
  })
  const brakujaca = KOLUMNY_CSV.find((k) => k.wymagana && !indeks.has(k.klucz))
  const baza = { ...PUSTY_WYNIK, separator: separatorUzyty, pominieteKolumny: pominiete }
  if (brakujaca) return { ...baza, bladPliku: { kod: "UI-PORP-CSV-BRAK-KOLUMNY", params: { kolumna: brakujaca.naglowek } } }
  if (dane.length === 0) return { ...baza, bladPliku: { kod: "UI-PORP-CSV-BRAK-WIERSZY" } }
  if (dane.length > MAKS_WIERSZY_CSV) return { ...baza, bladPliku: { kod: "UI-PORP-CSV-ZA-DUZO-WIERSZY", params: { maks: MAKS_WIERSZY_CSV } } }

  const wpisy: WynikImportuCsv["wpisy"] = []
  const odrzucone: OdrzuconyWiersz[] = []
  const uwagi: WynikImportuCsv["uwagi"] = []
  dane.forEach((komorki, k) => {
    const nrWiersza = k + 2
    const powody: KomunikatImportu[] = []
    const wartosc = (klucz: KluczKolumny) => {
      const i = indeks.get(klucz)
      return i === undefined ? "" : (komorki[i] ?? "").trim()
    }
    const seed: Omit<PanelSeed, "id"> = { ...PANEL_PUSTY("x"), katalogId: "" }
    for (const kolumna of KOLUMNY_CSV) {
      const klucz = kolumna.klucz
      if (!czyLiczbowy(klucz)) continue
      const surowa = wartosc(klucz)
      if (surowa === "") continue
      const n = liczbaZKomorki(surowa)
      if (n === undefined) powody.push({ kod: "UI-PORP-CSV-ZLA-LICZBA", params: { kolumna: kolumna.naglowek, wartosc: surowa } })
      else seed[klucz] = n
    }
    const nazwa = wartosc("nazwa")
    const producent = wartosc("producent")
    if (nazwa === "") powody.push({ kod: "UI-PORP-CSV-BRAK-NAZWY" })
    seed.nazwa = producent !== "" && !normalizuj(nazwa).startsWith(normalizuj(producent)) ? `${producent} ${nazwa}` : nazwa
    if (seed.moc === "") {
      if (!powody.some((p) => p.params?.kolumna === "moc_wp")) powody.push({ kod: "UI-PORP-CSV-BRAK-MOCY" })
    }
    const bif = wartosc("bifacjalny").toLowerCase()
    if (bif !== "") {
      if (PRAWDA.has(bif)) seed.bifacjalny = true
      else if (!FALSZ.has(bif)) powody.push({ kod: "UI-PORP-CSV-ZLY-BIFACJALNY", params: { wartosc: wartosc("bifacjalny") } })
    }
    if (powody.length === 0) {
      for (const w of walidujPanel(seed)) powody.push({ kod: w.i18nKey ?? w.code, ...(w.params ? { params: w.params as Record<string, string | number> } : {}), ...(w.field ? { pole: w.field } : {}) })
    }
    if (powody.length > 0) {
      odrzucone.push({ wiersz: nrWiersza, powody })
      return
    }
    const podane = ELEKTRYKA_KLUCZE.filter((e) => seed[e] !== "").length
    if (podane > 0 && podane < ELEKTRYKA_KLUCZE.length) uwagi.push({ wiersz: nrWiersza, komunikat: { kod: "UI-PORP-CSV-ELEKTRYKA-NIEKOMPLETNA" } })
    wpisy.push(seed)
  })
  return { ...baza, wpisy, odrzucone, uwagi }
}

/** Form texts of a catalogue entry for a panel in the comparison (the panel keeps its own form id; no catalogue id, so its electrical data are the typed ones). */
export function panelZWpisu(w: WpisWlasnegoKatalogu): Omit<PanelSeed, "id"> {
  const { wlId: _wlId, ...reszta } = w
  void _wlId
  return { ...reszta, katalogId: "" }
}

/** Entries get ids unique within the catalogue: `w1`, `w2`, … continuing after the highest existing one. */
export function dolaczWpisy(istniejace: readonly WpisWlasnegoKatalogu[], nowe: WynikImportuCsv["wpisy"]): WpisWlasnegoKatalogu[] {
  const maks = istniejace.reduce((m, w) => Math.max(m, Number(w.wlId.replace(/^w/, "")) || 0), 0)
  return [...istniejace, ...nowe.map((w, i) => ({ ...w, wlId: `w${maks + i + 1}` }))]
}

/** Prices of the catalogue typed in the display currency follow the currency switch. */
export function kwotyWlasnegoKatalogu(k: WlasnyKatalog, wspolczynnik: number): WlasnyKatalog {
  return { wpisy: k.wpisy.map((w) => ({ ...w, cena: przeliczPoleTekst(w.cena, wspolczynnik) })) }
}
