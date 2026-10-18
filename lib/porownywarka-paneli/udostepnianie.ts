/**
 * Sharing a comparison outside the device (spec 43) without any server or account: the form state travels in a link fragment (`#udostepnij=…`,
 * never sent to a server) or in a `.json` file. What is shared is the form (places, panels, prices, settings), NOT the weather data, the project
 * location, the company profile or the client's name: the recipient's results are computed for the recipient's own project location.
 *
 * The received text comes from outside, so it is never trusted: it is size-limited before and after decompression, parsed as data only and
 * rebuilt field by field from the form's template (`oczyscStan`) — unknown keys are dropped, wrong types fall back to the empty field, enumerations
 * and catalogue ids are checked. The recipient always gets the comparison as a NEW saved set, never over the form they are working on.
 */
import { TYPY_DACHU, type TypDachu } from "@/lib/core/modules/pv/eurokod-1/wiatr-dachy"
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import { CENNIK_BOS, type BosId } from "@/lib/core/dane/cennik-bos"
import { znajdzUrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { MAKS_PANELI_W_ZESTAWIE } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import { domyslnyWyborKryteriow } from "@/lib/core/modules/pv/porownywarka-paneli/kryteria"
import { wspolczynnikPrzeliczenia } from "@/lib/waluta/przelicz"
import { BILANS_PUSTY, KWOTY, MIEJSCE_PUSTE, OBCIAZENIA_PUSTE, PANEL_PUSTY, STAN_POCZATKOWY, type FormularzStan, type MiejsceSeed, type PanelSeed } from "./stan"

export const WERSJA_PACZKI = 1
/** Fragment key in a shared link: `…/porownywarka-paneli#udostepnij=<code>`. */
export const KLUCZ_LINKU = "udostepnij"
export const MAKS_DLUGOSC_LINKU = 8000
const MAKS_ROZMIAR_JSON_B = 200_000
const MAKS_TEKST = 300
const MAKS_MIEJSC = 10

export type PaczkaPorownania = {
  wersja: typeof WERSJA_PACZKI
  /** Currency the typed amounts are in, with its rate (units per 1 PLN): the recipient converts to their own display currency. */
  waluta: { kod: string; kurs: number }
  stan: FormularzStan
}

export type BladPaczki = "pusty" | "format" | "wersja" | "za-duzy" | "uszkodzony"
export type WynikOdczytuPaczki = { ok: true; paczka: PaczkaPorownania } | { ok: false; blad: BladPaczki }

const zwykly = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v)
const tekst = (v: unknown, domyslny: string): string => (typeof v === "string" ? v.slice(0, MAKS_TEKST) : domyslny)
const logiczna = (v: unknown, domyslna: boolean): boolean => (typeof v === "boolean" ? v : domyslna)
const jeden = <T extends string>(v: unknown, dozwolone: readonly T[], domyslny: T): T => (typeof v === "string" && (dozwolone as readonly string[]).includes(v) ? (v as T) : domyslny)
const BEZPIECZNY_ID = /^[A-Za-z0-9_-]{1,20}$/

/** The pieces of the form that are about the person or the printed offer and so are never shared. */
const POMIJANE_W_UDOSTEPNIANIU = ["ofertaDla", "ofertaWykonawca", "ofertaUwagi", "ofertaNumer", "ofertaWarunki", "ofertaMontazNetto", "ofertaMontazVat", "ofertaWersje", "ofertaZalecana"] as const

export function zbudujPaczke(stan: FormularzStan, waluta: { kod: string; kurs: number }): PaczkaPorownania {
  const kopia: Record<string, unknown> = { ...stan }
  for (const k of POMIJANE_W_UDOSTEPNIANIU) delete kopia[k]
  return { wersja: WERSJA_PACZKI, waluta: { kod: waluta.kod, kurs: waluta.kurs }, stan: kopia as FormularzStan }
}

function panel(v: unknown, i: number): PanelSeed {
  const w = zwykly(v) ? v : {}
  const wzor = PANEL_PUSTY(`p${i + 1}`)
  const katalogId = tekst(w.katalogId, "")
  const wynik: Record<string, unknown> = {}
  for (const [k, domyslny] of Object.entries(wzor)) {
    wynik[k] = typeof domyslny === "boolean" ? logiczna(w[k], domyslny) : tekst(w[k], domyslny as string)
  }
  const id = typeof w.id === "string" && BEZPIECZNY_ID.test(w.id) ? w.id : wzor.id
  return { ...(wynik as PanelSeed), id, katalogId: KATALOG_PANELI_PV.some((p) => p.id === katalogId) ? katalogId : "", obcRodzaj: jeden<"testowe" | "obliczeniowe">(w.obcRodzaj, ["testowe", "obliczeniowe"], "testowe") }
}

function miejsce(v: unknown, i: number): MiejsceSeed {
  const w = zwykly(v) ? v : {}
  const wzor = MIEJSCE_PUSTE(`m${i + 1}`)
  const wynik: Record<string, unknown> = {}
  for (const [k, domyslny] of Object.entries(wzor)) wynik[k] = tekst(w[k], domyslny as string)
  const id = typeof w.id === "string" && BEZPIECZNY_ID.test(w.id) ? w.id : wzor.id
  return { ...(wynik as MiejsceSeed), id, montaz: jeden(w.montaz, ["rownolegly", "pochylony-na-konstrukcji"], "rownolegly") }
}

const IDY_BOS: readonly BosId[] = CENNIK_BOS.map((p) => p.id)

function slownikTekstow(v: unknown, kluczDozwolony: (k: string) => boolean, wartoscDozwolona: (w: string) => boolean, maks: number): Record<string, string> | undefined {
  if (!zwykly(v)) return undefined
  const wynik: Record<string, string> = {}
  for (const [k, w] of Object.entries(v).slice(0, maks)) if (kluczDozwolony(k) && typeof w === "string" && wartoscDozwolona(w)) wynik[k] = w.slice(0, MAKS_TEKST)
  return wynik
}

/**
 * A form state rebuilt from outside data: every field comes from the template of the form with the received value only where its type fits.
 * `null` when the data is not an object at all.
 */
export function oczyscStan(surowy: unknown): FormularzStan | null {
  if (!zwykly(surowy)) return null
  const s = surowy
  const miejscaSurowe = Array.isArray(s.miejsca) ? s.miejsca.slice(0, MAKS_MIEJSC) : []
  const miejsca = (miejscaSurowe.length > 0 ? miejscaSurowe : [null]).map(miejsce)
  const paneleSurowe = Array.isArray(s.panele) ? s.panele.slice(0, MAKS_PANELI_W_ZESTAWIE) : []
  const panele = (paneleSurowe.length > 0 ? paneleSurowe : [null]).map(panel)
  // Ids must be unique inside a list: the form finds its places and panels by id.
  const unikalne = <T extends { id: string }>(lista: T[], prefiks: string): T[] => lista.map((x, i) => (lista.findIndex((y) => y.id === x.id) === i ? x : { ...x, id: `${prefiks}${lista.length + i + 1}` }))
  const miejscaU = unikalne(miejsca, "m")
  const paneleU = unikalne(panele, "p")
  const k = zwykly(s.kryteria) ? s.kryteria : {}
  const kryteria = Object.fromEntries(Object.entries(domyslnyWyborKryteriow()).map(([id, domyslny]) => [id, logiczna(k[id], domyslny)])) as FormularzStan["kryteria"]
  const b = zwykly(s.bil) ? s.bil : null
  const o = zwykly(s.obc) ? s.obc : null
  const idyPaneli = paneleU.map((p) => p.id)
  const bosWylaczone = Array.isArray(s.bosWylaczone) ? s.bosWylaczone.filter((x): x is BosId => typeof x === "string" && (IDY_BOS as readonly string[]).includes(x)) : undefined
  const bosCeny = slownikTekstow(s.bosCeny, (kl) => (IDY_BOS as readonly string[]).includes(kl), () => true, IDY_BOS.length) as FormularzStan["bosCeny"]
  const bosUklad = slownikTekstow(s.bosUklad, (kl) => idyPaneli.includes(kl), (w) => /^\d{1,3}x\d{1,3}$/.test(w), MAKS_PANELI_W_ZESTAWIE)
  const urzadzenieId = tekst(s.urzadzenieId, "")
  return {
    ...(s.tryb === "prosty" || s.tryb === "pelny" ? { tryb: s.tryb } : {}),
    miejsca: miejscaU,
    aktywneMiejsceId: miejscaU.some((m) => m.id === s.aktywneMiejsceId) ? (s.aktywneMiejsceId as string) : miejscaU[0]!.id,
    uzyjZuzycia: logiczna(s.uzyjZuzycia, STAN_POCZATKOWY.uzyjZuzycia),
    tmin: tekst(s.tmin, ""),
    zanizenieMocy: tekst(s.zanizenieMocy, ""),
    obc: {
      strefaSniegowa: tekst(o?.strefaSniegowa, OBCIAZENIA_PUSTE.strefaSniegowa),
      strefaWiatrowa: tekst(o?.strefaWiatrowa, OBCIAZENIA_PUSTE.strefaWiatrowa),
      wysokoscNpm: tekst(o?.wysokoscNpm, OBCIAZENIA_PUSTE.wysokoscNpm),
      kategoriaTerenu: tekst(o?.kategoriaTerenu, OBCIAZENIA_PUSTE.kategoriaTerenu),
      wysokoscKonstrukcji: tekst(o?.wysokoscKonstrukcji, OBCIAZENIA_PUSTE.wysokoscKonstrukcji),
      ekspozycjaSniegu: jeden(o?.ekspozycjaSniegu, ["wystawiony", "normalny", "osloniety"], OBCIAZENIA_PUSTE.ekspozycjaSniegu),
      typDachu: jeden<"" | TypDachu>(o?.typDachu, ["", ...TYPY_DACHU], ""),
    },
    bil: Object.fromEntries(Object.entries(BILANS_PUSTY).map(([kl, domyslny]) => [kl, tekst(b?.[kl], domyslny)])) as unknown as FormularzStan["bil"],
    urzadzenieId: znajdzUrzadzeniePv(urzadzenieId) ? urzadzenieId : "",
    akumV: tekst(s.akumV, ""),
    akumPojemnoscAh: tekst(s.akumPojemnoscAh, ""),
    akumMaksPradA: tekst(s.akumMaksPradA, ""),
    trasaM: tekst(s.trasaM, ""),
    cenaUrzadzenia: tekst(s.cenaUrzadzenia, ""),
    ...(bosWylaczone ? { bosWylaczone } : {}),
    ...(bosCeny ? { bosCeny } : {}),
    ...(bosUklad ? { bosUklad } : {}),
    zwrotZOsprzetem: logiczna(s.zwrotZOsprzetem, false),
    panele: paneleU,
    wycena: jeden(s.wycena, ["", "siec", "dzienNoc", "reczna", "agregat"], ""),
    stawka: tekst(s.stawka, ""),
    cenaDzien: tekst(s.cenaDzien, ""),
    cenaNoc: tekst(s.cenaNoc, ""),
    okno1Od: tekst(s.okno1Od, STAN_POCZATKOWY.okno1Od),
    okno1Do: tekst(s.okno1Do, STAN_POCZATKOWY.okno1Do),
    okno2Od: tekst(s.okno2Od, STAN_POCZATKOWY.okno2Od),
    okno2Do: tekst(s.okno2Do, STAN_POCZATKOWY.okno2Do),
    agrMoc: tekst(s.agrMoc, ""),
    agrObc: tekst(s.agrObc, ""),
    agrLh: tekst(s.agrLh, ""),
    agrCena: tekst(s.agrCena, ""),
    kryteria,
  }
}

/** A parsed package from outside: version and currency checked, the state rebuilt with `oczyscStan`. */
export function paczkaZObiektu(surowy: unknown): WynikOdczytuPaczki {
  if (!zwykly(surowy)) return { ok: false, blad: "format" }
  if (surowy.wersja !== WERSJA_PACZKI) return { ok: false, blad: "wersja" }
  const w = surowy.waluta
  if (!zwykly(w) || typeof w.kod !== "string" || !/^[A-Z]{3}$/.test(w.kod) || typeof w.kurs !== "number" || !(w.kurs > 0) || !Number.isFinite(w.kurs)) return { ok: false, blad: "format" }
  const stan = oczyscStan(surowy.stan)
  return stan ? { ok: true, paczka: { wersja: WERSJA_PACZKI, waluta: { kod: w.kod, kurs: w.kurs }, stan } } : { ok: false, blad: "format" }
}

/** Plain JSON text (the `.json` file); size-limited before parsing. */
export function odczytajPaczkeZJson(tresc: string): WynikOdczytuPaczki {
  if (tresc.trim() === "") return { ok: false, blad: "pusty" }
  if (tresc.length > MAKS_ROZMIAR_JSON_B) return { ok: false, blad: "za-duzy" }
  try {
    return paczkaZObiektu(JSON.parse(tresc))
  } catch {
    return { ok: false, blad: "uszkodzony" }
  }
}

export const paczkaDoJson = (p: PaczkaPorownania): string => JSON.stringify(p)

/** The amounts of a received comparison in the recipient's display currency (the typed texts of the other currency would be wrong figures). */
export function stanWWalucie(p: PaczkaPorownania, docelowa: { kurs: number }): FormularzStan {
  return p.waluta.kurs === docelowa.kurs ? p.stan : KWOTY(p.stan, wspolczynnikPrzeliczenia(p.waluta, docelowa))
}

// ---- Link code: "z." + base64url(deflate-raw(json)) when the browser can compress, otherwise "j." + base64url(json) ----

const naBase64Url = (bajty: Uint8Array) => {
  let s = ""
  for (const b of bajty) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
const zBase64Url = (kod: string): Uint8Array => {
  const s = atob(kod.replace(/-/g, "+").replace(/_/g, "/"))
  return Uint8Array.from(s, (c) => c.charCodeAt(0))
}

async function przepusc(bajty: Uint8Array, strumien: CompressionStream | DecompressionStream, maksWyjscie: number): Promise<Uint8Array> {
  const pisarz = strumien.writable.getWriter()
  // Both ends must run at once: awaiting the write before reading would deadlock on a full internal buffer.
  const zapis = pisarz.write(bajty as unknown as BufferSource).then(() => pisarz.close())
  // A write that fails after the reader already gave up (size limit, damaged data) must not surface as an unhandled rejection.
  zapis.catch(() => undefined)
  const czytelnik = strumien.readable.getReader()
  const kawalki: Uint8Array[] = []
  let razem = 0
  for (;;) {
    const { done, value } = await czytelnik.read()
    if (done) break
    razem += value.length
    if (razem > maksWyjscie) {
      await czytelnik.cancel().catch(() => undefined)
      throw new Error("za-duzy")
    }
    kawalki.push(value)
  }
  await zapis
  const wynik = new Uint8Array(razem)
  let pozycja = 0
  for (const k of kawalki) {
    wynik.set(k, pozycja)
    pozycja += k.length
  }
  return wynik
}

export async function zakodujDoLinku(p: PaczkaPorownania): Promise<string> {
  const bajty = new TextEncoder().encode(paczkaDoJson(p))
  if (typeof CompressionStream === "undefined") return `j.${naBase64Url(bajty)}`
  return `z.${naBase64Url(await przepusc(bajty, new CompressionStream("deflate-raw"), MAKS_ROZMIAR_JSON_B))}`
}

export async function odkodujZLinku(kod: string): Promise<WynikOdczytuPaczki> {
  const czysty = kod.trim()
  if (czysty === "") return { ok: false, blad: "pusty" }
  const m = /^([zj])\.([A-Za-z0-9_-]+)$/.exec(czysty)
  if (!m || czysty.length > MAKS_DLUGOSC_LINKU * 2) return { ok: false, blad: czysty.length > MAKS_DLUGOSC_LINKU * 2 ? "za-duzy" : "format" }
  try {
    const bajty = zBase64Url(m[2]!)
    if (m[1] === "j") return bajty.length > MAKS_ROZMIAR_JSON_B ? { ok: false, blad: "za-duzy" } : odczytajPaczkeZJson(new TextDecoder().decode(bajty))
    if (typeof DecompressionStream === "undefined") return { ok: false, blad: "format" }
    return odczytajPaczkeZJson(new TextDecoder().decode(await przepusc(bajty, new DecompressionStream("deflate-raw"), MAKS_ROZMIAR_JSON_B)))
  } catch (e) {
    return { ok: false, blad: e instanceof Error && e.message === "za-duzy" ? "za-duzy" : "uszkodzony" }
  }
}

/** The code from a pasted full link (`…#udostepnij=CODE`), a bare fragment or the code itself. */
export function kodZTekstu(wklejony: string): string {
  const t = wklejony.trim()
  const poHash = t.includes("#") ? t.slice(t.indexOf("#") + 1) : t
  const m = new RegExp(`(?:^|&)${KLUCZ_LINKU}=([^&\\s]+)`).exec(poHash)
  return m ? m[1]! : poHash
}

/** The shared code from `location.hash`, or `null` when the fragment is something else (or empty). */
export function kodZFragmentu(hash: string): string | null {
  const m = new RegExp(`(?:^#|&)${KLUCZ_LINKU}=([^&\\s]+)`).exec(hash)
  return m ? m[1]! : null
}

export const linkDoPorownania = (adresStrony: string, kod: string) => `${adresStrony.split("#")[0]}#${KLUCZ_LINKU}=${kod}`
