/**
 * Stan formularza Porównywarki paneli PV (D81) i jego zamiana na wejście silnika. Mieszkał w `page.tsx`; wyniesiony, bo
 * korzystają z niego też zestawy porównań, ranking katalogu i porównanie miejsc (A2). To warstwa UI (teksty z pól
 * formularza), nie rdzeń obliczeniowy — rdzeń (`lib/core`) niczego stąd nie importuje.
 */
import { znajdzPanelKatalogu, type PozycjaKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import type { BosId } from "@/lib/core/dane/cennik-bos"
import { profilDobowyZPor } from "@/lib/core/modules/pv/porownywarka-paneli/bilans-godzinowy"
import type { OsprzetScenariuszaInput } from "@/lib/core/modules/pv/porownywarka-paneli/osprzet-zestawu"
import { PRZYKLADOWE_OKNA_TANIE_G12 } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import type { EkspozycjaTerenu, StrefaSniegowa } from "@/lib/core/modules/pv/eurokod-1/snieg"
import type { KategoriaTerenu, StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import type { BilansGodzinowyInput, DaneElektryczne, DanePanelu, KryteriaWybor, ObciazeniePaneluKarta, OknoStrefy, PorownywarkaInput, WarunkiObciazen, WycenaKwh, WymiaryMiejsca } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { domyslnyWyborKryteriow } from "@/lib/core/modules/pv/porownywarka-paneli/kryteria"
import type { ZapisTmy } from "@/lib/lokalizacja/dane-tmy"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import type { LokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { przeliczPola, przeliczPoleTekst } from "@/lib/waluta/przelicz"

export type PanelSeed = {
  id: string
  /** Catalogue entry the numbers were taken from; cleared when a datasheet number is edited by hand. */
  katalogId: string
  nazwa: string
  moc: string
  cena: string
  gamma: string
  noct: string
  spr200: string
  deg1: string
  degLin: string
  /** Size and mass from the datasheet [mm, mm, kg] — needed to count how many fit the place. */
  dlugosc: string
  szerokosc: string
  masa: string
  bifacjalny: boolean
  /**
   * Hand-typed electrical data (STC) for a panel that is not from the catalogue; used only while `katalogId` is empty.
   * Drafts saved before this field have no keys. Voc, Vmp, Isc, Imp, β and the system voltage limit are required together; the series fuse is optional.
   */
  voc?: string
  vmp?: string
  isc?: string
  imp?: string
  betaVoc?: string
  maxV?: string
  maxBezp?: string
  /** Hand-typed mechanical load rating from the datasheet [Pa] (front, back) and its kind; used only while `katalogId` is empty. Drafts saved before spec 32 have no keys. */
  obcPrzod?: string
  obcTyl?: string
  obcRodzaj?: ObciazeniePaneluKarta["rodzaj"]
}

/** Snow and wind conditions of the site for the "Loads" tab (spec 32), as form texts; drafts saved before have no key (= all empty). */
export type ObciazeniaSeed = {
  strefaSniegowa: string
  strefaWiatrowa: string
  wysokoscNpm: string
  kategoriaTerenu: string
  wysokoscKonstrukcji: string
  ekspozycjaSniegu: EkspozycjaTerenu
}

/** Battery of the hourly balance (spec 34), as form texts: usable capacity [kWh] and cycle efficiency [%]; drafts saved before have no key (= both empty). */
export type BilansSeed = {
  pojemnosc: string
  sprawnosc: string
  celZimy?: string
  /** Daily consumption profile (spec 39) as three shares [%] of the daily consumption: day 6–18, evening 18–22, night 22–6 (Polish local time). All three empty = flat; drafts saved before have no keys. */
  profilDzien?: string
  profilWieczor?: string
  profilNoc?: string
  /** Power limits (spec 40) as form texts [kW]: battery charge, battery discharge, inverter. Empty = no limit; drafts saved before have no keys. */
  limLad?: string
  limRozl?: string
  limFalownik?: string
}
export const BILANS_PUSTY: BilansSeed = { pojemnosc: "", sprawnosc: "", celZimy: "", profilDzien: "", profilWieczor: "", profilNoc: "", limLad: "", limRozl: "", limFalownik: "" }

/** Hourly-balance settings from the form texts; `null` while the capacity is empty (0 is a valid answer: no battery). Efficiency empty = not given. */
export function bilansZFormularza(b: BilansSeed | undefined): BilansGodzinowyInput | null {
  const pojemnosc = liczba(b?.pojemnosc ?? "")
  if (pojemnosc === undefined) return null
  const sprawnosc = liczba(b?.sprawnosc ?? "")
  const cel = liczba(b?.celZimy ?? "")
  const profil = profilDobowyZPor(liczba(b?.profilDzien ?? ""), liczba(b?.profilWieczor ?? ""), liczba(b?.profilNoc ?? ""))
  const lad = liczba(b?.limLad ?? "")
  const rozl = liczba(b?.limRozl ?? "")
  const falownik = liczba(b?.limFalownik ?? "")
  const limity = lad === undefined && rozl === undefined && falownik === undefined ? null : { ladowanieKw: lad ?? null, rozladowanieKw: rozl ?? null, falownikKw: falownik ?? null }
  return { pojemnoscKwh: pojemnosc, sprawnoscCyklu: sprawnosc === undefined ? null : sprawnosc / 100, celZimyPct: cel === undefined ? null : cel, profilDobowy: profil, limityMocyKw: limity }
}

export const OBCIAZENIA_PUSTE: ObciazeniaSeed = {
  strefaSniegowa: "",
  strefaWiatrowa: "",
  wysokoscNpm: "",
  kategoriaTerenu: "",
  wysokoscKonstrukcji: "",
  ekspozycjaSniegu: "normalny",
}

/** Miejsce instalacji (U19): własna nazwa, kąty (z projektu albo wpisane), liczba paneli albo wymiary miejsca. */
export type MiejsceSeed = {
  id: string
  /** Nazwa nadana przez użytkownika; pusta = nazwa domyślna „Miejsce n” w interfejsie. */
  nazwa: string
  powierzchniaId: string
  nachylenie: string
  azymut: string
  albedo: string
  liczbaPaneli: string
  wymDlugosc: string
  wymSzerokosc: string
  wymMargines: string
  montaz: WymiaryMiejsca["montaz"]
  /** Okno bez cienia 21 grudnia [godz., czas słoneczny] — tylko montaż pochylony; puste = okno domyślne. Szkice sprzed tego pola nie mają kluczy. */
  oknoOd?: string
  oknoDo?: string
}

/** One slot of the offer versions (A, B, C by position); `panelId` empty = the slot is unused. */
export type WersjaOfertySeed = { panelId: string; etykieta: string }

export type RodzajWyceny = "" | "siec" | "dzienNoc" | "reczna" | "agregat"

export type FormularzStan = {
  /** Screen mode; absent = decided by `efektywnyTryb` (a draft that already holds data stays in the full mode, an empty one starts simple). */
  tryb?: "prosty" | "pelny"
  miejsca: MiejsceSeed[]
  aktywneMiejsceId: string
  uzyjZuzycia: boolean
  /** Adds the electric heating from the "Straty ciepła budynku" screen to the monthly consumption (spec 44); absent/false = off. Never shared. */
  doliczOgrzewanie?: boolean
  /** Najniższa temperatura powietrza w miejscu [°C] do napięcia stringów zimą (A3); puste = nie podano. Szkice sprzed A3 nie mają klucza. */
  tmin?: string
  /** Test „panel ma o X% mniej mocy, niż deklaruje” (spec 38) [%]; puste = bez testu, bez wartości domyślnej. Szkice sprzed tego pola nie mają klucza. */
  zanizenieMocy?: string
  /** Snow and wind conditions for the "Loads" tab (spec 32). */
  obc?: ObciazeniaSeed
  bil?: BilansSeed
  /**
   * Inverter / MPPT controller / micro-inverter chosen from the device catalogue for the "Inverter and accessories" tab (A4); empty = none.
   * The fields below belong to that tab; drafts saved before A4 have no keys.
   */
  urzadzenieId?: string
  /** Battery voltage [V] choosing the row of the controller's nominal PV power table. */
  akumV?: string
  /** One-way length of the DC cable run from panels to the device [m]. */
  trasaM?: string
  /** Optional price of one device (the catalogue has no prices), typed in the display currency. */
  cenaUrzadzenia?: string
  /** Accessory lines the user switched off; `undefined` = the default set. */
  bosWylaczone?: BosId[]
  /** Own unit prices per accessory line (display currency), replacing the catalogue range. */
  bosCeny?: Partial<Record<BosId, string>>
  /** Chosen string layout `"<in series>x<parallel>"` per panel id, for the accessory estimate; absent = the proposed layout. */
  bosUklad?: Record<string, string>
  /** Optional text for the printed offer sheet (A4): who it is for, who prepares it and free notes. Drafts saved before have no keys. */
  ofertaDla?: string
  ofertaWykonawca?: string
  ofertaUwagi?: string
  /** Profitability tab: add the device and accessories (tab "Inverter and accessories") to the panel price in payback and winter-kWh cost; absent = off. */
  zwrotZOsprzetem?: boolean
  /** Offer versions A/B/C: the compared panel and a short label per slot (always three entries once edited); absent = the first three panels. */
  ofertaWersje?: WersjaOfertySeed[]
  /** Letter of the version marked "recommended" on the printout; empty or absent = none. */
  ofertaZalecana?: string
  panele: PanelSeed[]
  wycena: RodzajWyceny
  stawka: string
  cenaDzien: string
  cenaNoc: string
  okno1Od: string
  okno1Do: string
  okno2Od: string
  okno2Do: string
  agrMoc: string
  agrObc: string
  agrLh: string
  agrCena: string
  kryteria: KryteriaWybor
}

export const PANEL_PUSTY = (id: string): PanelSeed => ({
  id,
  katalogId: "",
  nazwa: "",
  moc: "",
  cena: "",
  gamma: "",
  noct: "",
  spr200: "",
  deg1: "",
  degLin: "",
  dlugosc: "",
  szerokosc: "",
  masa: "",
  bifacjalny: false,
  voc: "",
  vmp: "",
  isc: "",
  imp: "",
  betaVoc: "",
  maxV: "",
  maxBezp: "",
  obcPrzod: "",
  obcTyl: "",
  obcRodzaj: "testowe",
})

export const MIEJSCE_PUSTE = (id: string): MiejsceSeed => ({
  id,
  nazwa: "",
  powierzchniaId: "",
  nachylenie: "",
  azymut: "",
  albedo: "",
  liczbaPaneli: "",
  wymDlugosc: "",
  wymSzerokosc: "",
  wymMargines: "",
  montaz: "rownolegly",
  oknoOd: "",
  oknoDo: "",
})

export const STAN_POCZATKOWY: FormularzStan = {
  miejsca: [MIEJSCE_PUSTE("m1")],
  aktywneMiejsceId: "m1",
  uzyjZuzycia: true,
  tmin: "",
  zanizenieMocy: "",
  panele: [PANEL_PUSTY("p1"), PANEL_PUSTY("p2")],
  wycena: "",
  stawka: "",
  cenaDzien: "",
  cenaNoc: "",
  okno1Od: String(PRZYKLADOWE_OKNA_TANIE_G12[0].odH),
  okno1Do: String(PRZYKLADOWE_OKNA_TANIE_G12[0].doH),
  okno2Od: String(PRZYKLADOWE_OKNA_TANIE_G12[1].odH),
  okno2Do: String(PRZYKLADOWE_OKNA_TANIE_G12[1].doH),
  agrMoc: "",
  agrObc: "",
  agrLh: "",
  agrCena: "",
  kryteria: domyslnyWyborKryteriow(),
}

/** Money typed in the display currency follows the currency switch (the panel prices live in a list, so a custom converter). */
const KWOTY_PROSTE = przeliczPola<FormularzStan>("stawka", "cenaDzien", "cenaNoc", "agrCena")
export const KWOTY = (stan: FormularzStan, wspolczynnik: number): FormularzStan => ({
  ...KWOTY_PROSTE(stan, wspolczynnik),
  panele: stan.panele.map((p) => ({ ...p, cena: przeliczPoleTekst(p.cena, wspolczynnik) })),
  ...(stan.cenaUrzadzenia === undefined ? {} : { cenaUrzadzenia: przeliczPoleTekst(stan.cenaUrzadzenia, wspolczynnik) }),
  ...(stan.bosCeny === undefined ? {} : { bosCeny: Object.fromEntries(Object.entries(stan.bosCeny).map(([id, c]) => [id, przeliczPoleTekst(c, wspolczynnik)])) }),
})

/** Zapisany zestaw porównania (spec 12): pełna migawka formularza pod własną nazwą. */
export type ZestawSeed = { id: string; nazwa: string; zapisanoIso: string; stan: FormularzStan }
export type StanZestawow = { zestawy: ZestawSeed[] }
export const STAN_ZESTAWOW_POCZATKOWY: StanZestawow = { zestawy: [] }
export const KWOTY_ZESTAWOW = (stan: StanZestawow, wspolczynnik: number): StanZestawow => ({
  zestawy: stan.zestawy.map((z) => ({ ...z, stan: KWOTY(z.stan, wspolczynnik) })),
})

/** The mode the screen shows: the saved choice, otherwise the full mode for a draft that already holds data and the simple one for an empty form. */
export function efektywnyTryb(stan: Pick<FormularzStan, "tryb" | "panele" | "miejsca">): "prosty" | "pelny" {
  if (stan.tryb) return stan.tryb
  const maDane =
    stan.panele.some((p) => p.moc.trim() !== "" || p.katalogId !== "" || p.cena.trim() !== "") ||
    stan.miejsca.some((m) => [m.nachylenie, m.azymut, m.liczbaPaneli, m.wymDlugosc, m.wymSzerokosc].some((x) => x.trim() !== ""))
  return maDane ? "pelny" : "prosty"
}

export function aktywneMiejsce(stan: FormularzStan): MiejsceSeed {
  return stan.miejsca.find((m) => m.id === stan.aktywneMiejsceId) ?? stan.miejsca[0] ?? MIEJSCE_PUSTE("m1")
}

/** Kolejny wolny identyfikator `prefiks + liczba` w liście (np. p3, m2). */
export function kolejnyId(prefiks: string, istniejace: readonly { id: string }[]): string {
  return `${prefiks}${Math.max(0, ...istniejace.map((x) => Number(x.id.slice(prefiks.length)) || 0)) + 1}`
}

/**
 * Szkic zapisany przed A2 miał kąty i liczbę paneli na wierzchu formularza (jedno miejsce). Przenosi je do pierwszego miejsca
 * i usuwa stare klucze; `null` = szkic już jest w nowym kształcie.
 */
export function migrujStarySzkic(stan: FormularzStan): FormularzStan | null {
  const stary = stan as unknown as Record<string, unknown>
  const klucze = ["powierzchniaId", "nachylenie", "azymut", "albedo", "liczbaPaneli", "wymDlugosc", "wymSzerokosc", "wymMargines", "montaz"]
  if (!klucze.some((k) => k in stary)) return null
  const reszta = { ...stary }
  const przeniesione: Record<string, unknown> = {}
  for (const k of klucze) {
    if (k in reszta) przeniesione[k] = reszta[k]
    delete reszta[k]
  }
  const nowy = reszta as unknown as FormularzStan
  const pierwsze = nowy.miejsca?.[0] ?? MIEJSCE_PUSTE("m1")
  return { ...nowy, miejsca: [{ ...pierwsze, ...(przeniesione as Partial<MiejsceSeed>) }, ...(nowy.miejsca ?? []).slice(1)] }
}

/** Dane panelu (bez ceny) jako teksty pól formularza; brak wartości = puste pole. */
export function seedZDanych(d: Omit<DanePanelu, "cenaBruttoZl">, katalogId: string): Omit<PanelSeed, "id" | "cena"> {
  const tekst = (x: number | null) => (x === null ? "" : String(x))
  return {
    katalogId,
    nazwa: d.nazwa,
    moc: String(d.pmaxW),
    gamma: tekst(d.gammaPctNaC),
    noct: tekst(d.noctC),
    spr200: tekst(d.sprawnoscWzglednaPrzy200WPct),
    deg1: tekst(d.degradacjaPierwszyRokPct),
    degLin: tekst(d.degradacjaLiniowaPctNaRok),
    dlugosc: tekst(d.dlugoscMm),
    szerokosc: tekst(d.szerokoscMm),
    masa: tekst(d.masaKg),
    bifacjalny: d.bifacjalny,
  }
}

/** Liczby z karty katalogowej jako teksty pól formularza (brak na karcie = puste pole). */
export const seedZKatalogu = (k: PozycjaKatalogu): Omit<PanelSeed, "id" | "cena"> => seedZDanych(k, k.id)

/** Wymiary miejsca z pól formularza: miejsce liczy się dopiero, gdy wpisano wszystkie trzy liczby (margines nie ma wartości domyślnej; 0 jest liczbą). */
export function wymiaryZMiejsca(m: MiejsceSeed): WymiaryMiejsca | null {
  const dl = liczba(m.wymDlugosc)
  const sz = liczba(m.wymSzerokosc)
  const mar = liczba(m.wymMargines)
  if (dl === undefined || sz === undefined || mar === undefined) return null
  const wymiary: WymiaryMiejsca = { dlugoscM: dl, szerokoscM: sz, marginesM: mar, montaz: m.montaz }
  const od = liczba(m.oknoOd ?? "")
  const doH = liczba(m.oknoDo ?? "")
  // Both ends or none: half a window would silently mix a typed number with the default one.
  return m.montaz === "pochylony-na-konstrukcji" && od !== undefined && doH !== undefined ? { ...wymiary, oknoOdH: od, oknoDoH: doH } : wymiary
}

/**
 * Electrical data typed by hand for a panel outside the catalogue: all of Voc, Vmp, Isc, Imp, β and the system voltage limit,
 * otherwise `null` (nothing is completed from a "typical" panel). The series fuse is optional (`null` = the card does not give it).
 */
export function elektrykaRecznaZPanelu(p: PanelSeed): DaneElektryczne | null {
  const voc = liczba(p.voc ?? "")
  const vmp = liczba(p.vmp ?? "")
  const isc = liczba(p.isc ?? "")
  const imp = liczba(p.imp ?? "")
  const beta = liczba(p.betaVoc ?? "")
  const maxV = liczba(p.maxV ?? "")
  if (voc === undefined || vmp === undefined || isc === undefined || imp === undefined || beta === undefined || maxV === undefined) return null
  return { vocV: voc, vmpV: vmp, iscA: isc, impA: imp, betaVocPctNaC: beta, maxNapieciaSystemuV: maxV, maxBezpiecznikSzeregowyA: liczba(p.maxBezp ?? "") ?? null }
}

/**
 * Mechanical load rating typed by hand for a panel outside the catalogue: the front value is required, the back value optional
 * (`null` = the card does not give it); nothing is completed from a "typical" panel.
 */
export function obciazenieRecznePanelu(p: PanelSeed): ObciazeniePaneluKarta | null {
  const przod = liczba(p.obcPrzod ?? "")
  if (przod === undefined) return null
  return { przodPa: przod, tylPa: liczba(p.obcTyl ?? "") ?? null, rodzaj: p.obcRodzaj ?? "testowe" }
}

export function panelDoSilnika(p: PanelSeed, nazwaDomyslna: string): DanePanelu | null {
  const moc = liczba(p.moc)
  if (moc === undefined) return null
  return {
    id: p.id,
    nazwa: p.nazwa.trim() || nazwaDomyslna,
    pmaxW: moc,
    cenaBruttoZl: liczba(p.cena) ?? null,
    gammaPctNaC: liczba(p.gamma) ?? null,
    noctC: liczba(p.noct) ?? null,
    sprawnoscWzglednaPrzy200WPct: liczba(p.spr200) ?? null,
    degradacjaPierwszyRokPct: liczba(p.deg1) ?? null,
    degradacjaLiniowaPctNaRok: liczba(p.degLin) ?? null,
    dlugoscMm: liczba(p.dlugosc) ?? null,
    szerokoscMm: liczba(p.szerokosc) ?? null,
    masaKg: liczba(p.masa) ?? null,
    bifacjalny: p.bifacjalny,
    // Electrical data come only from the catalogue card; a hand-edited datasheet number clears `katalogId`, so they never outlive a changed panel.
    elektryka: p.katalogId === "" ? elektrykaRecznaZPanelu(p) : (znajdzPanelKatalogu(p.katalogId)?.elektryka ?? null),
    obciazenie: p.katalogId === "" ? obciazenieRecznePanelu(p) : (znajdzPanelKatalogu(p.katalogId)?.obciazenie ?? null),
  }
}

/** Snow and wind conditions from the form texts; `null` when nothing was typed (the tab shows only the prompt). */
export function warunkiObciazenZFormularza(o: ObciazeniaSeed | undefined, montaz: WarunkiObciazen["montaz"]): WarunkiObciazen | null {
  if (!o) return null
  const strefaS = liczba(o.strefaSniegowa)
  const strefaW = liczba(o.strefaWiatrowa)
  const warunki: WarunkiObciazen = {
    strefaSniegowa: strefaS === undefined ? null : (strefaS as StrefaSniegowa),
    strefaWiatrowa: strefaW === undefined ? null : (strefaW as StrefaWiatrowa),
    wysokoscNpmM: liczba(o.wysokoscNpm) ?? null,
    kategoriaTerenu: o.kategoriaTerenu === "" ? null : (o.kategoriaTerenu as KategoriaTerenu),
    wysokoscKonstrukcjiM: liczba(o.wysokoscKonstrukcji) ?? null,
    ekspozycjaSniegu: o.ekspozycjaSniegu,
    montaz,
  }
  const cokolwiek = warunki.strefaSniegowa !== null || warunki.strefaWiatrowa !== null || warunki.wysokoscNpmM !== null || warunki.kategoriaTerenu !== null || warunki.wysokoscKonstrukcjiM !== null
  return cokolwiek ? warunki : null
}

export function budujWejscie(a: {
  stan: FormularzStan
  miejsce: MiejsceSeed
  lokalizacja: LokalizacjaProjektu | null
  dane: ZapisTmy | null
  zuzycie: number[] | null
  t: (klucz: string, parametry?: Record<string, string | number>) => string
  /** Device and accessories for the "more panels" scenario (spec 41); see `osprzetScenariuszaZFormularza`. */
  osprzetScenariusza?: OsprzetScenariuszaInput | null
}): PorownywarkaInput {
  const { stan, miejsce: m, lokalizacja, dane, zuzycie, t } = a
  const nachylenie = liczba(m.nachylenie)
  const azymut = liczba(m.azymut)
  const albedo = liczba(m.albedo)
  const panele = stan.panele.flatMap((p, i) => panelDoSilnika(p, t("UI-PORP-PANEL-N", { n: i + 1 })) ?? [])
  const stawka = liczba(stan.stawka)
  const mocKw = liczba(stan.agrMoc)
  const obc = liczba(stan.agrObc)
  const lh = liczba(stan.agrLh)
  const cenaPaliwa = liczba(stan.agrCena)
  const cenaDzien = liczba(stan.cenaDzien)
  const cenaNoc = liczba(stan.cenaNoc)
  // A window with only one hour typed is incomplete (never guessed); both empty = no such window.
  const okno = (od: string, do_: string): OknoStrefy | null | "niekompletne" => {
    const x = liczba(od)
    const y = liczba(do_)
    return x !== undefined && y !== undefined ? { odH: x, doH: y } : x === undefined && y === undefined ? null : "niekompletne"
  }
  const okna = [okno(stan.okno1Od, stan.okno1Do), okno(stan.okno2Od, stan.okno2Do)]
  const oknaTanie = okna.filter((o): o is OknoStrefy => o !== null && o !== "niekompletne")
  const wycena: WycenaKwh | null =
    stan.wycena === "dzienNoc" && cenaDzien !== undefined && cenaNoc !== undefined && !okna.includes("niekompletne")
      ? { rodzaj: "dzienNoc", zlKwhDzien: cenaDzien, zlKwhNoc: cenaNoc, oknaTanie }
      : (stan.wycena === "siec" || stan.wycena === "reczna") && stawka !== undefined
        ? { rodzaj: stan.wycena, zlKwh: stawka }
        : stan.wycena === "agregat" && mocKw !== undefined && obc !== undefined && lh !== undefined && cenaPaliwa !== undefined
          ? { rodzaj: "agregat", mocKw, obciazeniePct: obc, zuzycieLH: lh, cenaPaliwaZlL: cenaPaliwa }
          : null
  return {
    ...(lokalizacja ? { szerokoscGeograficzna: lokalizacja.szerokosc, dlugoscGeograficzna: lokalizacja.dlugosc } : {}),
    ...(dane ? { daneGodzinowe: dane.dane.rekordy } : {}),
    miejsce: nachylenie !== undefined && azymut !== undefined ? { nachylenieDeg: nachylenie, azymutDeg: azymut, ...(albedo !== undefined ? { albedo } : {}) } : null,
    liczbaPaneli: liczba(m.liczbaPaneli) ?? null,
    wymiaryMiejsca: wymiaryZMiejsca(m),
    zapotrzebowanieMiesiaceKwh: stan.uzyjZuzycia ? zuzycie : null,
    tminC: liczba(stan.tmin ?? "") ?? null,
    testZanizeniaMocyPct: liczba(stan.zanizenieMocy ?? "") ?? null,
    obciazenia: warunkiObciazenZFormularza(stan.obc, m.montaz),
    bilansGodzinowy: bilansZFormularza(stan.bil),
    osprzetScenariusza: a.osprzetScenariusza ?? null,
    panele,
    wycena,
    kryteria: stan.kryteria,
  }
}
