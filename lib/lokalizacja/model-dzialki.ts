/**
 * Model działki — Seed Ekranu 2 (Skaner działki) współdzielony z Ekranami 3 i 4 Modułu 1
 * (docs/standards/05-baza-danych-offline.md, 5.1 — zapisujemy Seed, nigdy Wynik; rejestr-decyzji.md D22).
 *
 * Ekran 2 zapisuje ten model (`usePersistedDraft`, klucz `KLUCZ_MODELU_DZIALKI`), Ekrany 3 i 4 go
 * tylko czytają i przeliczają na własne wejścia funkcjami z tego pliku. Czyste funkcje, bez
 * Reacta i bez sieci — testowalne; UI nie liczy geometrii samo.
 */
import { MIN_PUNKTOW_WIELOKATA } from "@/lib/core/modules/lokalizacja/skaner-dzialki/constants"
import type { SkanerDzialkiResult } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import { normalnaNewella, rzutujNaUkladLokalny } from "@/lib/core/modules/lokalizacja/skaner-dzialki/geometria"
import type { Kalibracja, PolacGps, PunktGps, SkanerDzialkiInput } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"
import type { AnalizaZacienieniaInput, Punkt3D, PrzeszkodaDrzewo } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/input"
import { profilHoryzontuDeg, punktWewnatrzPrzeszkody } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/przeszkody"
import type { Powierzchnia } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

/** Klucz draftu Ekranu 2 (`usePersistedDraft`) — ten sam czytają Ekrany 3 i 4. */
export const KLUCZ_MODELU_DZIALKI = "skaner-dzialki"

/**
 * Siatka punktów na powierzchnię: n × n — mapa cieplna Ekranu 3 i profile horyzontu Ekranu 4
 * (ta sama siatka, żeby oba ekrany uśredniały te same punkty). Wybór rozdzielczości, nie fizyka.
 */
export const SIATKA_PROBKOWANIA = 4

export type OpisDzialki = {
  teryt: string
  numer: string
  obreb: string
  gmina: string
  powiat: string
  wojewodztwo: string
}

/** Przeszkoda w formularzu — liczby jako tekst pola (jak w każdym formularzu kalkulatora). */
export type PrzeszkodaSeed = {
  nazwa: string
  punkt: PunktGps
  wysokoscM: string
  promienM: string
}

export type KalibracjaSeed = {
  zbior: "dzialka" | "budynek"
  /** Numery punktów widoczne dla użytkownika (od 1). */
  punktA: string
  punktB: string
  znanaDlugoscM: string
}

export type ModelDzialki = {
  tryb: "online" | "offline"
  dzialka: PunktGps[]
  /** Opis z ULDK — tylko gdy granica przyszła z trybu online. */
  opisDzialki: OpisDzialki | null
  budynek: PunktGps[]
  /** Identyfikator budynku z ULDK — tylko gdy obrys przyszedł z trybu online. */
  idBudynku: string | null
  polacie: PolacGps[]
  przeszkody: PrzeszkodaSeed[]
  kalibracja: KalibracjaSeed
}

export const MODEL_PUSTY: ModelDzialki = {
  tryb: "offline",
  dzialka: [],
  opisDzialki: null,
  budynek: [],
  idBudynku: null,
  polacie: [],
  przeszkody: [],
  kalibracja: { zbior: "budynek", punktA: "", punktB: "", znanaDlugoscM: "" },
}

/**
 * Seed Ekranu 3 — własny zapis, model działki pozostaje tylko do odczytu. Prognoza wzrostu drzew
 * (źródło: "wprowadzana ręcznie przez użytkownika") po nazwie przeszkody.
 */
export type PrognozaSeed = {
  /** Nazwa przeszkody → prognozowana wysokość [m] (tekst pola). */
  wysokosci: Record<string, string>
  /** Horyzont prognozy [lata] — etykieta scenariusza, nie parametr modelu. */
  lat: string
  /** Nazwa przeszkody → drzewo liściaste (TD19). Opcjonalne — zapisy sprzed 24.09.2026 go nie mają. */
  lisciaste?: Record<string, boolean>
  /** Miesiące bez liści (0 = styczeń), wpisane przez użytkownika dla jego okolicy. */
  miesiaceBezlisci?: number[]
}

/** Pole liczbowe formularza → liczba albo `undefined` (puste/niepoprawne). */
export function liczba(tekst: string): number | undefined {
  if (tekst.trim() === "") return undefined
  const n = Number(tekst.replace(",", "."))
  return Number.isFinite(n) ? n : undefined
}

function kalibracja(k: KalibracjaSeed): Kalibracja | undefined {
  const a = liczba(k.punktA)
  const b = liczba(k.punktB)
  const d = liczba(k.znanaDlugoscM)
  if (a === undefined || b === undefined || d === undefined) return undefined
  return { zbior: k.zbior, indeksA: a - 1, indeksB: b - 1, znanaDlugoscM: d }
}

/**
 * Seed → wejście Skanera działki. Przeszkody z niepełnymi polami (np. jeszcze niewpisana
 * wysokość) nie idą do obliczeń — formularz pokazuje je jako niekompletne, a nie jako 0 m.
 */
export function wejscieSkanera(m: ModelDzialki): SkanerDzialkiInput {
  const przeszkody = m.przeszkody.flatMap((p) => {
    const wysokoscM = liczba(p.wysokoscM)
    const promienM = liczba(p.promienM)
    return wysokoscM === undefined || promienM === undefined ? [] : [{ nazwa: p.nazwa, punkt: p.punkt, wysokoscM, promienM }]
  })
  return {
    punktyDzialki: m.dzialka.length > 0 ? m.dzialka : undefined,
    punktyBudynku: m.budynek.length > 0 ? m.budynek : undefined,
    polacie: m.polacie.length > 0 ? m.polacie : undefined,
    przeszkody: przeszkody.length > 0 ? przeszkody : undefined,
    kalibracja: kalibracja(m.kalibracja),
  }
}

/** Przeszkoda bez kompletnych danych liczbowych (pominięta w obliczeniach). */
export function przeszkodaNiekompletna(p: PrzeszkodaSeed): boolean {
  return liczba(p.wysokoscM) === undefined || liczba(p.promienM) === undefined
}

export type PolacLokalna = {
  nazwa: string
  /** Wierzchołki w układzie lokalnym Skanera (x — wschód, y — północ), z — nad średnim gruntem budynku [m]. */
  punkty: Punkt3D[]
  nachylenieDeg: number
  /** null — połać płaska. */
  azymutDeg: number | null
  poleRzeczywisteM2: number
}

/**
 * Średnia wysokość GPS narożników budynku — ten sam poziom odniesienia, od którego Skaner liczy
 * wysokość kalenicy. null, gdy żaden narożnik nie ma wysokości.
 */
export function poziomGruntu(m: ModelDzialki): number | null {
  const z = m.budynek.map((p) => p.wysokoscM).filter((v): v is number => v !== undefined && Number.isFinite(v))
  return z.length > 0 ? z.reduce((a, v) => a + v, 0) / z.length : null
}

/**
 * Połacie w układzie lokalnym Skanera (ta sama skala kalibracji, ten sam punkt odniesienia),
 * z wysokością nad gruntem — wejście widoku 3D i punktów analizy Ekranu 3. Kolejność i nazwy
 * jak w `wynik.polacie` (Skaner zachowuje kolejność wejścia).
 */
export function polacieLokalne(m: ModelDzialki, wynik: SkanerDzialkiResult): PolacLokalna[] {
  const odniesienie = wynik.odniesienie
  const grunt = poziomGruntu(m)
  if (!odniesienie || grunt === null) return []
  const s = wynik.skalaKalibracji ?? 1
  return m.polacie.flatMap((pl, i) => {
    const w = wynik.polacie[i]
    if (!w || w.nazwa !== pl.nazwa) return []
    const punkty = pl.punkty.map((p) => {
      const l = rzutujNaUkladLokalny(p, odniesienie)
      return { x: l.x * s, y: l.y * s, z: (p.wysokoscM ?? grunt) - grunt }
    })
    return [{ nazwa: pl.nazwa, punkty, nachylenieDeg: w.nachylenieDeg, azymutDeg: w.azymutDeg, poleRzeczywisteM2: w.poleRzeczywisteM2 }]
  })
}

/**
 * Pole paneli na dachu płaskim wg obrysu budynku (np. obrys z ULDK, który nie ma wysokości):
 * wysokość dachu nad gruntem i orientacja paneli podane ręcznie. Punkty siatki leżą na obrysie
 * na tej wysokości, a nachylenie/azymut to płaszczyzna PANELI (nie dachu). null — brak obrysu.
 */
export function dachWedlugObrysu(
  wynik: SkanerDzialkiResult,
  wysokoscM: number,
  nachyleniePaneliDeg: number,
  azymutPaneliDeg: number,
): PolacLokalna | null {
  const b = wynik.budynek
  if (!b) return null
  return {
    nazwa: "Dach wg obrysu budynku",
    punkty: b.punkty.map((p) => ({ x: p.x, y: p.y, z: wysokoscM })),
    nachylenieDeg: nachyleniePaneliDeg,
    azymutDeg: azymutPaneliDeg,
    poleRzeczywisteM2: b.powierzchniaM2,
  }
}

function wewnatrz(p: { x: number; y: number }, wielokat: { x: number; y: number }[]): boolean {
  let w = false
  for (let i = 0, j = wielokat.length - 1; i < wielokat.length; j = i++) {
    const a = wielokat[i]!
    const b = wielokat[j]!
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) w = !w
  }
  return w
}

/**
 * Punkty próbkowania mapy cieplnej na połaci: siatka `n × n` w rzucie poziomym, tylko punkty
 * wewnątrz obrysu, wysokość z płaszczyzny połaci (normalna Newella przez środek ciężkości).
 * Zawsze co najmniej środek ciężkości. Połać pionowa (nz = 0) — tylko środek.
 */
export function punktyProbkowania(polac: PolacLokalna, n: number): Punkt3D[] {
  const pk = polac.punkty
  const c = {
    x: pk.reduce((a, p) => a + p.x, 0) / pk.length,
    y: pk.reduce((a, p) => a + p.y, 0) / pk.length,
    z: pk.reduce((a, p) => a + p.z, 0) / pk.length,
  }
  const nrm = normalnaNewella(pk)
  if (Math.abs(nrm.nz) < 1e-9) return [c]
  const zNaPlaszczyznie = (x: number, y: number) => c.z - (nrm.nx * (x - c.x) + nrm.ny * (y - c.y)) / nrm.nz
  const xs = pk.map((p) => p.x)
  const ys = pk.map((p) => p.y)
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const wynik: Punkt3D[] = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Środki komórek siatki — nigdy dokładnie na krawędzi obrysu.
      const x = x0 + ((i + 0.5) / n) * (x1 - x0)
      const y = y0 + ((j + 0.5) / n) * (y1 - y0)
      if (wewnatrz({ x, y }, pk)) wynik.push({ x, y, z: zNaPlaszczyznie(x, y) })
    }
  }
  return wynik.length > 0 ? wynik : [c]
}

/**
 * Przeszkody Skanera (walec: środek, promień, wysokość) → drzewa Ekranu 3, z prognozą z Ekranu 3.
 * 🔎 TD17 — sąsiedni budynek też trafia tu jako walec; kalkulator E3 obsługuje bryłę o obrysie
 * wielokąta (`PrzeszkodaBryla`), ale Skaner (E2) nie zbiera jeszcze obrysów przeszkód.
 */
export function przeszkodyZacienienia(wynik: SkanerDzialkiResult, prognoza: PrognozaSeed): PrzeszkodaDrzewo[] {
  return wynik.przeszkody.map((p) => {
    const wysokoscPrognozowanaM = liczba(prognoza.wysokosci[p.nazwa] ?? "")
    return {
      typ: "drzewo",
      nazwa: p.nazwa,
      srodek: { x: p.x, y: p.y },
      promienKoronyM: p.promienM,
      wysokoscM: p.wysokoscM,
      ...(wysokoscPrognozowanaM !== undefined ? { wysokoscPrognozowanaM } : {}),
      ...(prognoza.lisciaste?.[p.nazwa] ? { lisciaste: true } : {}),
    }
  })
}

/** Wejście Ekranu 3 dla jednego punktu połaci. Połać płaska: azymut nie wpływa na cos θ przy β = 0. */
export function wejscieZacienienia(
  wynik: SkanerDzialkiResult,
  prognoza: PrognozaSeed,
  polac: PolacLokalna,
  punkt: Punkt3D,
): AnalizaZacienieniaInput {
  return {
    szerokoscGeograficzna: wynik.odniesienie?.szerokosc,
    dlugoscGeograficzna: wynik.odniesienie?.dlugosc,
    punkt,
    nachyleniePowierzchniDeg: polac.nachylenieDeg,
    azymutPowierzchniDeg: polac.azymutDeg ?? 180,
    przeszkody: przeszkodyZacienienia(wynik, prognoza),
    latPrognozy: liczba(prognoza.lat),
    ...(prognoza.miesiaceBezlisci?.length ? { miesiaceBezlisci: prognoza.miesiaceBezlisci } : {}),
  }
}

export type PowierzchniaZModelu = Powierzchnia & {
  /** Stały identyfikator do zapisu ręcznej korekty (Ekran 4). */
  id: string
  zrodlo: "polac" | "elewacja"
  /** Elewacja: łączna długość ścian o zbliżonym azymucie [m]; połać: pole rzeczywiste [m²]. */
  wymiar: number
}

/**
 * Tolerancja łączenia ścian w jedną elewację [°] — wybór prezentacji, nie parametr fizyczny:
 * obrys z ULDK ma dziesiątki krótkich odcinków (np. 70 dla jednego budynku), lista 70 "ścian"
 * byłaby nieczytelna. Ściany różniące się o mniej niż tyle stopni od sąsiedniej w posortowanej
 * liście tworzą jedną elewację o azymucie średnim ważonym długością.
 */
export const TOLERANCJA_ELEWACJI_DEG = 15

const KIERUNKI = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const
export function kierunek(azymutDeg: number): (typeof KIERUNKI)[number] {
  return KIERUNKI[Math.round((((azymutDeg % 360) + 360) % 360) / 45) % 8]!
}

/** Średnia kątowa ważona (wektorowo — poprawna przez 0°/360°). */
function sredniaKatowa(katy: { deg: number; waga: number }[]): number {
  let sx = 0
  let sy = 0
  for (const k of katy) {
    sx += Math.sin((k.deg * Math.PI) / 180) * k.waga
    sy += Math.cos((k.deg * Math.PI) / 180) * k.waga
  }
  return ((((Math.atan2(sx, sy) * 180) / Math.PI) % 360) + 360) % 360
}

/** Ściany budynku → elewacje (grupy o zbliżonym azymucie), od najdłuższej. */
export function elewacje(wynik: SkanerDzialkiResult): PowierzchniaZModelu[] {
  const sciany = [...(wynik.budynek?.sciany ?? [])].sort((a, b) => a.azymutDeg - b.azymutDeg)
  if (sciany.length === 0) return []
  const grupy: (typeof sciany)[] = []
  for (const s of sciany) {
    const ostatnia = grupy[grupy.length - 1]
    if (ostatnia && s.azymutDeg - ostatnia[ostatnia.length - 1]!.azymutDeg < TOLERANCJA_ELEWACJI_DEG) ostatnia.push(s)
    else grupy.push([s])
  }
  // Domknięcie przez 360°: pierwsza i ostatnia grupa to jedna elewacja, jeśli się stykają.
  if (grupy.length > 1) {
    const pierwsza = grupy[0]!
    const ostatnia = grupy[grupy.length - 1]!
    if (pierwsza[0]!.azymutDeg + 360 - ostatnia[ostatnia.length - 1]!.azymutDeg < TOLERANCJA_ELEWACJI_DEG) {
      grupy[0] = [...ostatnia, ...pierwsza]
      grupy.pop()
    }
  }
  return grupy
    .map((g) => {
      const azymutDeg = Math.round(sredniaKatowa(g.map((s) => ({ deg: s.azymutDeg, waga: s.dlugoscM }))))
      const wymiar = g.reduce((a, s) => a + s.dlugoscM, 0)
      return { azymutDeg: azymutDeg % 360, wymiar }
    })
    .sort((a, b) => b.wymiar - a.wymiar)
    .map((e, i) => ({
      id: `elewacja-${i}`,
      nazwa: `Elewacja ${kierunek(e.azymutDeg)}`,
      zrodlo: "elewacja" as const,
      nachylenieDeg: 90,
      azymutDeg: e.azymutDeg,
      wymiar: e.wymiar,
    }))
}

function idPolaci(indeks: number, nazwa: string): string {
  return `polac-${indeks}-${nazwa}`
}

/**
 * Profile horyzontu przeszkód (obecna wysokość) z punktów siatki każdej połaci — wejście
 * zacienienia Ekranu 4 (TD15 punkt 2), klucz = id powierzchni z `powierzchnieZModelu`. Tylko
 * połacie: mają wysokość punktów z pomiaru; elewacje i powierzchnie ręczne jej nie mają, więc
 * nie dostają profilu (kalkulator raportuje je jako bez zacienienia). Punkty wewnątrz przeszkody
 * pominięte (jak walidacja Ekranu 3); połać bez żadnego punktu — bez profilu.
 * 🔎 TD19 — profil nie rozróżnia drzew liściastych: Ekran 4 liczy je nieprzezroczyste cały rok (ostrożnie).
 */
export function horyzontyPolaci(m: ModelDzialki, wynik: SkanerDzialkiResult): Record<string, number[][]> {
  const przeszkody = przeszkodyZacienienia(wynik, { wysokosci: {}, lat: "" })
  const uzyte = new Set<number>()
  const wyniki: Record<string, number[][]> = {}
  for (const polac of polacieLokalne(m, wynik)) {
    const i = wynik.polacie.findIndex((p, j) => !uzyte.has(j) && p.nazwa === polac.nazwa)
    if (i < 0) continue
    uzyte.add(i)
    const profile = punktyProbkowania(polac, SIATKA_PROBKOWANIA)
      .filter((pt) => !przeszkody.some((o) => punktWewnatrzPrzeszkody(pt, o)))
      .map((pt) => profilHoryzontuDeg(pt, przeszkody))
    if (profile.length > 0) wyniki[idPolaci(i, polac.nazwa)] = profile
  }
  return wyniki
}

/** Powierzchnie do oceny na Ekranie 4: połacie (z płaskimi jako azymut 180°) + elewacje. */
export function powierzchnieZModelu(wynik: SkanerDzialkiResult): PowierzchniaZModelu[] {
  const polacie = wynik.polacie.map((p, i) => ({
    id: idPolaci(i, p.nazwa),
    nazwa: p.nazwa,
    zrodlo: "polac" as const,
    nachylenieDeg: Math.round(p.nachylenieDeg),
    azymutDeg: p.azymutDeg === null ? 180 : Math.round(p.azymutDeg) % 360,
    wymiar: p.poleRzeczywisteM2,
  }))
  return [...polacie, ...elewacje(wynik)]
}

/** Czy model ma dość danych, żeby Ekran 3/4 w ogóle z niego korzystał. */
export function modelMaDzialkeLubBudynek(m: ModelDzialki): boolean {
  return m.dzialka.length >= MIN_PUNKTOW_WIELOKATA || m.budynek.length >= MIN_PUNKTOW_WIELOKATA
}

/** Seed Ekranu 4 — ręczna korekta orientacji ("gdy budynek nie jest idealnie prostopadły") i powierzchnie dopisane. */
export type KorektaSeed = { nachylenieDeg: string; azymutDeg: string }
export type PowierzchniaRecznaSeed = { nazwa: string; nachylenieDeg: string; azymutDeg: string }

export type PowierzchniaDoOceny = Omit<PowierzchniaZModelu, "zrodlo"> & {
  zrodlo: PowierzchniaZModelu["zrodlo"] | "reczna"
  /** Orientacja różni się od wyznaczonej przez Skaner (korekta ręczna). */
  skorygowana: boolean
}

/**
 * Powierzchnie z modelu z nałożoną korektą (puste pole korekty = wartość ze Skanera) + dopisane
 * ręcznie (tylko kompletne). Wymiar dopisanej powierzchni nieznany — 0.
 */
export function powierzchnieDoOceny(
  zModelu: PowierzchniaZModelu[],
  korekty: Record<string, KorektaSeed>,
  reczne: PowierzchniaRecznaSeed[],
): PowierzchniaDoOceny[] {
  const zKorekta = zModelu.map((p) => {
    const k = korekty[p.id]
    const nachylenieDeg = (k && liczba(k.nachylenieDeg)) ?? p.nachylenieDeg
    const azymutDeg = (k && liczba(k.azymutDeg)) ?? p.azymutDeg
    return { ...p, nachylenieDeg, azymutDeg, skorygowana: nachylenieDeg !== p.nachylenieDeg || azymutDeg !== p.azymutDeg }
  })
  const dopisane = reczne.flatMap((r, i) => {
    const nachylenieDeg = liczba(r.nachylenieDeg)
    const azymutDeg = liczba(r.azymutDeg)
    if (nachylenieDeg === undefined || azymutDeg === undefined) return []
    const nazwa = r.nazwa.trim() || `Powierzchnia ${i + 1}`
    return [{ id: `reczna-${i}`, nazwa, zrodlo: "reczna" as const, nachylenieDeg, azymutDeg, wymiar: 0, skorygowana: false }]
  })
  return [...zKorekta, ...dopisane]
}
