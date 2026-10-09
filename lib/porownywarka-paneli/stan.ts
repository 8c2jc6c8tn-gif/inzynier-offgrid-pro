/**
 * Stan formularza Porównywarki paneli PV (D81) i jego zamiana na wejście silnika. Mieszkał w `page.tsx`; wyniesiony, bo
 * korzystają z niego też zestawy porównań, ranking katalogu i porównanie miejsc (A2). To warstwa UI (teksty z pól
 * formularza), nie rdzeń obliczeniowy — rdzeń (`lib/core`) niczego stąd nie importuje.
 */
import { znajdzPanelKatalogu, type PozycjaKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { PRZYKLADOWE_OKNA_TANIE_G12 } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import type { DanePanelu, KryteriaWybor, OknoStrefy, PorownywarkaInput, WycenaKwh, WymiaryMiejsca } from "@/lib/core/modules/pv/porownywarka-paneli/input"
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

export type RodzajWyceny = "" | "siec" | "dzienNoc" | "reczna" | "agregat"

export type FormularzStan = {
  miejsca: MiejsceSeed[]
  aktywneMiejsceId: string
  uzyjZuzycia: boolean
  /** Najniższa temperatura powietrza w miejscu [°C] do napięcia stringów zimą (A3); puste = nie podano. Szkice sprzed A3 nie mają klucza. */
  tmin?: string
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
})

/** Zapisany zestaw porównania (spec 12): pełna migawka formularza pod własną nazwą. */
export type ZestawSeed = { id: string; nazwa: string; zapisanoIso: string; stan: FormularzStan }
export type StanZestawow = { zestawy: ZestawSeed[] }
export const STAN_ZESTAWOW_POCZATKOWY: StanZestawow = { zestawy: [] }
export const KWOTY_ZESTAWOW = (stan: StanZestawow, wspolczynnik: number): StanZestawow => ({
  zestawy: stan.zestawy.map((z) => ({ ...z, stan: KWOTY(z.stan, wspolczynnik) })),
})

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
    elektryka: p.katalogId === "" ? null : (znajdzPanelKatalogu(p.katalogId)?.elektryka ?? null),
  }
}

export function budujWejscie(a: {
  stan: FormularzStan
  miejsce: MiejsceSeed
  lokalizacja: LokalizacjaProjektu | null
  dane: ZapisTmy | null
  zuzycie: number[] | null
  t: (klucz: string, parametry?: Record<string, string | number>) => string
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
    panele,
    wycena,
    kryteria: stan.kryteria,
  }
}
