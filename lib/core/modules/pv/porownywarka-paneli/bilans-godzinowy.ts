/**
 * Porównywarka paneli PV, Etap A5 (spec 34): bilans godzinowy produkcji, zużycia i magazynu energii. Zastępuje miesięczne
 * „Σ min(produkcja, zapotrzebowanie)” (spec 7.2) tam, gdzie wiemy więcej: w godzinie bez słońca zużycie musi pochodzić z baterii albo
 * z sieci/agregatu, a nadwyżka z południa nie przechodzi na wieczór, jeśli bateria jest pełna albo jej nie ma.
 *
 * Model (świadomie prosty, wszystkie uproszczenia są jawnymi założeniami wyniku):
 *  - ogrzewanie elektryczne (gdy podano jego miesięczne kWh i temperaturę wewnętrzną): ta część zużycia miesiąca nie idzie w profil dobowy,
 *    tylko w godziny proporcjonalnie do (T_wewn − T_zewn)⁺ z temperatury godzinowej TMY (strata ciepła rośnie z różnicą temperatur), więc
 *    zimne noce i poranki dostają więcej, a ciepłe południa mniej; suma miesiąca się nie zmienia. Bez temperatury godzinowej albo przy
 *    miesiącu bez godzin chłodniejszych niż wnętrze — równo na godziny miesiąca (jak pozostałe zużycie bez profilu);
 *  - reszta zużycia miesiąca rozłożona równo na wszystkie godziny tego miesiąca, chyba że użytkownik poda profil dobowy (24 udziały godzinowe, spec 39):
 *    wtedy zużycie miesiąca dzieli się na godziny doby wg tego profilu (każdy dzień miesiąca ma ten sam profil);
 *  - bateria o pojemności użytecznej C: nadwyżka ładuje ją ze sprawnością cyklu η (jak w „Bilans miesięczny” sieci: η raz, przy
 *    ładowaniu), rozładowanie bez dalszych strat; moc ładowania, rozładowania i falownika bez ograniczeń, chyba że użytkownik poda limity (spec 40):
 *    limit ładowania obcina energię wchodzącą do baterii (reszta zostaje odcięta), limit rozładowania — energię z baterii, limit falownika — moc oddawaną
 *    do odbiorów łącznie z paneli i baterii (brak = to, czego nie przeniósł falownik);
 *  - rok TMY liczony dwa razy po sobie, wynik z drugiego przebiegu — stan naładowania na początku stycznia pochodzi z końca grudnia,
 *    nie z pustej baterii;
 *  - brakująca energia = to, czego nie dały panele ani bateria; jest wyceniana jak „energia brakująca” (sieć, agregat, taryfa strefowa
 *    według godziny braku).
 */
import { MIESIACE_ZIMOWE_POROWNYWARKI } from "./constants"
import type { OknoStrefy } from "./input"
import { wOknieStrefy } from "./uzysk"

const LICZBA_MIESIECY = 12

/** Power limits of the equipment [kW]; `null` = not given = unlimited. One record is one hour, so kW and kWh per record are numerically equal. */
export type LimityMocy = {
  /** Max power charging the battery (energy entering the battery per hour, after the converter, before the cycle efficiency is applied to the surplus). */
  ladowanieKw: number | null
  /** Max power taken out of the battery. */
  rozladowanieKw: number | null
  /** Max power the inverter delivers to the loads (panels and battery together). */
  falownikKw: number | null
}

/** `true`, when the user gave at least one power limit (the balance then no longer assumes unlimited equipment). */
export function limityMocyPodane(l: Partial<LimityMocy> | null | undefined): boolean {
  return !!l && (l.ladowanieKw != null || l.rozladowanieKw != null || l.falownikKw != null)
}

/** Ogrzewanie elektryczne wydzielone z zapotrzebowania do rozłożenia wg temperatury godzinowej (patrz opis modelu wyżej). */
export type OgrzewanieGodzinowe = {
  /** Część zapotrzebowania miesiąca, którą stanowi ogrzewanie [kWh], styczeń pierwszy; nie więcej niż zapotrzebowanie miesiąca. */
  miesiaceKwh: readonly number[]
  /** Temperatura wewnętrzna [°C], z której liczona jest różnica do temperatury zewnętrznej. */
  temperaturaWewnetrznaC: number
  /** Temperatura zewnętrzna w kolejnych rekordach TMY [°C]; `null` = brak w danych (zapis sprzed 08.10.2026) → rozkład równy. */
  tempZewnetrznaC: Float64Array | null
}

export type WejscieBilansu = {
  /** Produkcja zestawu w kolejnych rekordach TMY [kWh/rekord]. */
  produkcjaKwh: Float64Array
  /** Miesiąc rekordu (0 = styczeń). */
  miesiac: Uint8Array
  /** Godzina doby w czasie urzędowym Polski (0–23) rekordu — do podziału braku na strefy taryfy. */
  godzinaLokalna: Uint8Array
  /** Zapotrzebowanie w miesiącach [kWh], styczeń pierwszy. */
  zapotrzebowanieMiesiaceKwh: readonly number[]
  /** Pojemność użyteczna baterii [kWh]; 0 = bez baterii. */
  pojemnoscKwh: number
  /** Sprawność cyklu baterii [0–1]; `null` = nie podano (liczone jako 1, jawne założenie). */
  sprawnoscCyklu: number | null
  /** Okna taniej strefy do podziału braku (pusta lista = brak podziału). */
  oknaTanie?: readonly OknoStrefy[]
  /**
   * Profil dobowy zużycia: 24 nieujemne wagi względne dla godzin doby 0–23 w czasie urzędowym Polski (dowolna skala, normalizowane do sumy 1);
   * `null`/brak = zużycie rozłożone równo na całą dobę. Ten sam profil dla każdego dnia roku.
   */
  profilDobowy?: readonly number[] | null
  /** Limity mocy baterii i falownika (spec 40); `null`/brak = bez ograniczeń. */
  limityMocy?: LimityMocy | null
  /** Ogrzewanie elektryczne rozłożone wg temperatury godzinowej; `null`/brak = całe zapotrzebowanie wg profilu dobowego albo równo. */
  ogrzewanie?: OgrzewanieGodzinowe | null
}

export type WynikBilansu = {
  pojemnoscKwh: number
  /** Sprawność użyta w obliczeniu [0–1]. */
  sprawnoscUzyta: number
  /** `true`, gdy nie podano sprawności i przyjęto 1. */
  sprawnoscZalozona: boolean
  /** Zużycie z paneli w tej samej godzinie, z baterii i brakujące — miesięcznie [kWh]. */
  bezposrednioMiesiaceKwh: number[]
  zBateriiMiesiaceKwh: number[]
  brakMiesiaceKwh: number[]
  /** Produkcja, która nie zmieściła się w baterii (i nie było jej komu zużyć) — miesięcznie [kWh]. */
  odcieteMiesiaceKwh: number[]
  /** Część braku z godzin taniej strefy — miesięcznie [kWh]. */
  brakTaniaMiesiaceKwh: number[]
  zuzycieMiesiaceKwh: number[]
}

/** Hours of the three parts of the day used by the profile fields (local time, `od` inclusive, `do` exclusive; the night wraps over midnight). */
export const PORY_DOBY = { dzien: { od: 6, do: 18 }, wieczor: { od: 18, do: 22 }, noc: { od: 22, do: 6 } } as const

/**
 * 24 hourly weights from the three shares typed by the user (each part's share spread evenly over its hours); `null` unless all three are given
 * and the total is positive — a partly filled profile is never completed with a guess.
 */
export function profilDobowyZPor(dzien: number | undefined, wieczor: number | undefined, noc: number | undefined): number[] | null {
  if (dzien === undefined || wieczor === undefined || noc === undefined || dzien < 0 || wieczor < 0 || noc < 0 || dzien + wieczor + noc <= 0) return null
  const wTejPorze = (h: number) => {
    if (h >= PORY_DOBY.dzien.od && h < PORY_DOBY.dzien.do) return dzien / (PORY_DOBY.dzien.do - PORY_DOBY.dzien.od)
    if (h >= PORY_DOBY.wieczor.od && h < PORY_DOBY.wieczor.do) return wieczor / (PORY_DOBY.wieczor.do - PORY_DOBY.wieczor.od)
    return noc / (24 - (PORY_DOBY.noc.od - PORY_DOBY.noc.do))
  }
  return Array.from({ length: 24 }, (_, h) => wTejPorze(h))
}


/** Liczba rekordów w każdej parze (miesiąc, godzina doby) — do rozłożenia zużycia miesiąca na godziny wg profilu dobowego. */
function rekordyWMiesiacuIGodzinie(miesiac: Uint8Array, godzina: Uint8Array): number[][] {
  const ile = Array.from({ length: LICZBA_MIESIECY }, () => new Array<number>(24).fill(0))
  for (let i = 0; i < miesiac.length; i++) ile[miesiac[i]!]![godzina[i]!]!++
  return ile
}

/** Udziały godzin doby o sumie 1 z wag względnych; `null`, gdy profilu nie podano. Suma ≤ 0 albo zła długość to błąd wywołującego (walidacja wejścia). */
export function znormalizujProfilDobowy(profil: readonly number[] | null | undefined): number[] | null {
  if (!profil) return null
  const razem = profil.reduce((a, b) => a + b, 0)
  return profil.length === 24 && razem > 0 ? profil.map((x) => x / razem) : null
}

/** Liczba rekordów w każdym miesiącu (do rozłożenia zużycia miesiąca po równo na jego godziny). */
function rekordyWMiesiacach(miesiac: Uint8Array): number[] {
  const ile = new Array<number>(LICZBA_MIESIECY).fill(0)
  for (let i = 0; i < miesiac.length; i++) ile[miesiac[i]!]!++
  return ile
}

export function bilansGodzinowy(w: WejscieBilansu): WynikBilansu {
  const n = w.produkcjaKwh.length
  const rekordy = rekordyWMiesiacach(w.miesiac)
  const profil = znormalizujProfilDobowy(w.profilDobowy)
  const rekordyGodz = profil ? rekordyWMiesiacuIGodzinie(w.miesiac, w.godzinaLokalna) : null
  const ogrz = w.ogrzewanie ?? null
  const wagaOgrz = (i: number): number => (ogrz?.tempZewnetrznaC ? Math.max(0, ogrz.temperaturaWewnetrznaC - ogrz.tempZewnetrznaC[i]!) : 0)
  const sumaWagOgrz = new Array<number>(LICZBA_MIESIECY).fill(0)
  if (ogrz) for (let i = 0; i < n; i++) sumaWagOgrz[w.miesiac[i]!]! += wagaOgrz(i)
  const eta = w.sprawnoscCyklu ?? 1
  const pojemnosc = Math.max(0, w.pojemnoscKwh)
  const limLad = w.limityMocy?.ladowanieKw ?? Infinity
  const limRozl = w.limityMocy?.rozladowanieKw ?? Infinity
  const limFalownik = w.limityMocy?.falownikKw ?? Infinity
  const tania = new Uint8Array(24)
  for (let h = 0; h < 24; h++) tania[h] = wOknieStrefy(h, w.oknaTanie ?? []) ? 1 : 0
  const zero = () => new Array<number>(LICZBA_MIESIECY).fill(0)
  let wynik = { bezposrednio: zero(), zBaterii: zero(), brak: zero(), odciete: zero(), brakTania: zero(), zuzycie: zero() }
  let soc = 0
  // Two passes over the TMY year: the first one only brings the battery to the state it has at the turn of the year.
  for (let przebieg = 0; przebieg < 2; przebieg++) {
    wynik = { bezposrednio: zero(), zBaterii: zero(), brak: zero(), odciete: zero(), brakTania: zero(), zuzycie: zero() }
    for (let i = 0; i < n; i++) {
      const m = w.miesiac[i]!
      const ogrzMiesiaca = ogrz ? Math.min(Math.max(0, ogrz.miesiaceKwh[m] ?? 0), w.zapotrzebowanieMiesiaceKwh[m]!) : 0
      const bazaMiesiaca = w.zapotrzebowanieMiesiaceKwh[m]! - ogrzMiesiaca
      let zuzycie: number
      if (profil && rekordyGodz) {
        const h = w.godzinaLokalna[i]!
        zuzycie = rekordyGodz[m]![h]! > 0 ? (bazaMiesiaca * profil[h]!) / rekordyGodz[m]![h]! : 0
      } else zuzycie = rekordy[m]! > 0 ? bazaMiesiaca / rekordy[m]! : 0
      if (ogrzMiesiaca > 0) zuzycie += sumaWagOgrz[m]! > 0 ? (ogrzMiesiaca * wagaOgrz(i)) / sumaWagOgrz[m]! : rekordy[m]! > 0 ? ogrzMiesiaca / rekordy[m]! : 0
      const prod = w.produkcjaKwh[i]!
      // The inverter limit caps what can reach the loads this hour; the rest of the consumption is a shortfall whatever the panels and battery hold.
      const obslugiwane = Math.min(zuzycie, limFalownik)
      const bezposrednio = Math.min(prod, obslugiwane)
      const nadwyzka = prod - bezposrednio
      const potrzeba = obslugiwane - bezposrednio
      let odciete = 0
      if (nadwyzka > 0) {
        const doZapasu = Math.min(nadwyzka * eta, pojemnosc - soc, limLad)
        soc += doZapasu
        // Clamped: rounding can leave a −1e−16 remainder when the battery takes everything (shown as “−0”).
        odciete = Math.max(0, nadwyzka - (eta > 0 ? doZapasu / eta : 0))
      }
      const zBaterii = Math.min(potrzeba, soc, limRozl)
      soc -= zBaterii
      const brak = zuzycie - bezposrednio - zBaterii
      wynik.bezposrednio[m]! += bezposrednio
      wynik.zBaterii[m]! += zBaterii
      wynik.brak[m]! += brak
      wynik.odciete[m]! += odciete
      wynik.zuzycie[m]! += zuzycie
      if (tania[w.godzinaLokalna[i]!]) wynik.brakTania[m]! += brak
    }
  }
  return {
    pojemnoscKwh: pojemnosc,
    sprawnoscUzyta: eta,
    sprawnoscZalozona: w.sprawnoscCyklu === null,
    bezposrednioMiesiaceKwh: wynik.bezposrednio,
    zBateriiMiesiaceKwh: wynik.zBaterii,
    brakMiesiaceKwh: wynik.brak,
    odcieteMiesiaceKwh: wynik.odciete,
    brakTaniaMiesiaceKwh: wynik.brakTania,
    zuzycieMiesiaceKwh: wynik.zuzycie,
  }
}

const suma = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0)
const sumaZimy = (xs: readonly number[]) => suma(MIESIACE_ZIMOWE_POROWNYWARKI.map((m) => xs[m]!))

/** Podsumowanie bilansu zestawu paneli, gotowe do pokazania: rok i zima (XI–II) w kWh, pokrycie zużycia i cykle baterii. */
export type PodsumowanieBilansu = {
  pojemnoscKwh: number
  sprawnoscUzyta: number
  sprawnoscZalozona: boolean
  zuzycieRokKwh: number
  zuzycieZimaKwh: number
  bezposrednioRokKwh: number
  bezposrednioZimaKwh: number
  zBateriiRokKwh: number
  zBateriiZimaKwh: number
  brakRokKwh: number
  brakZimaKwh: number
  odcieteRokKwh: number
  odcieteZimaKwh: number
  /** Jaka część zużycia pokryta jest z paneli (bezpośrednio albo przez baterię) [%]; `null` bez zużycia. */
  pokrycieRokPct: number | null
  pokrycieZimaPct: number | null
  /** Pełne równoważne cykle baterii w roku (energia z baterii / pojemność); `null` bez baterii. */
  cykleRok: number | null
  brakMiesiaceKwh: number[]
  /** Część braku z godzin taniej strefy [kWh]; do wyceny taryfy dzienno-nocnej. */
  brakTaniaRokKwh: number
  brakTaniaZimaKwh: number
}

export function podsumujBilans(b: WynikBilansu): PodsumowanieBilansu {
  const zuzRok = suma(b.zuzycieMiesiaceKwh)
  const zuzZima = sumaZimy(b.zuzycieMiesiaceKwh)
  const brakRok = suma(b.brakMiesiaceKwh)
  const brakZima = sumaZimy(b.brakMiesiaceKwh)
  const zBatRok = suma(b.zBateriiMiesiaceKwh)
  return {
    pojemnoscKwh: b.pojemnoscKwh,
    sprawnoscUzyta: b.sprawnoscUzyta,
    sprawnoscZalozona: b.sprawnoscZalozona,
    zuzycieRokKwh: zuzRok,
    zuzycieZimaKwh: zuzZima,
    bezposrednioRokKwh: suma(b.bezposrednioMiesiaceKwh),
    bezposrednioZimaKwh: sumaZimy(b.bezposrednioMiesiaceKwh),
    zBateriiRokKwh: zBatRok,
    zBateriiZimaKwh: sumaZimy(b.zBateriiMiesiaceKwh),
    brakRokKwh: brakRok,
    brakZimaKwh: brakZima,
    odcieteRokKwh: suma(b.odcieteMiesiaceKwh),
    odcieteZimaKwh: sumaZimy(b.odcieteMiesiaceKwh),
    pokrycieRokPct: zuzRok > 0 ? ((zuzRok - brakRok) / zuzRok) * 100 : null,
    pokrycieZimaPct: zuzZima > 0 ? ((zuzZima - brakZima) / zuzZima) * 100 : null,
    cykleRok: b.pojemnoscKwh > 0 ? zBatRok / b.pojemnoscKwh : null,
    brakMiesiaceKwh: b.brakMiesiaceKwh,
    brakTaniaRokKwh: suma(b.brakTaniaMiesiaceKwh),
    brakTaniaZimaKwh: sumaZimy(b.brakTaniaMiesiaceKwh),
  }
}

/**
 * „Dowolnie wiele paneli” w obliczeniu fizycznego maksimum: mnożnik produkcji tak duży, że każda godzina z jakąkolwiek produkcją pokrywa całe
 * zapotrzebowanie, a bateria ładuje się do pełna. Nie jest limitem instalacji (ten daje miejsce), tylko zastępuje nieskończoność.
 */
const PANELE_GRANICZNE = 1e9

export type DoborPanelowNaZime = {
  /** Cel wpisany przez użytkownika: jaka część zużycia zimowego (XI–II) ma być pokryta z paneli [%]. */
  celPct: number
  zuzycieZimaKwh: number
  /** Energia jednego panelu zimą [kWh]. */
  zimaNaPanelKwh: number
  /** Liczba paneli, gdy liczymy samą sumę energii zimą wobec zużycia zimą (bez dopasowania godzin; zbyt optymistyczne). `null`, gdy panel nie daje zimą energii. */
  panelowSumowo: number | null
  /** Najmniejsza liczba paneli, przy której bilans godzinowy (z baterią z formularza) osiąga cel; `null` = cel nieosiągalny przy dowolnej liczbie paneli. */
  panelowGodzinowo: number | null
  /** Fizyczne maksimum pokrycia zimy [%] przy dowolnej liczbie paneli (z baterią z formularza) — ile najwyżej da się uzyskać. */
  pokrycieMaksPct: number
  /** Ile paneli mieści się w podanym miejscu (z pakowania wymiarów); `null` = wymiarów miejsca albo panelu brak. */
  miejsceNaPaneli: number | null
  /** Pokrycie zimy przy tylu panelach, ile mieści się w miejscu [%]; `null`, gdy miejsce nieznane. */
  pokrycieNaMiejscuPct: number | null
  /** `true` = liczba z `panelowGodzinowo` mieści się w miejscu; `false` = cel nieosiągalny albo wymaga więcej paneli, niż się mieści; `null` = miejsce nieznane. */
  miesciSieNaMiejscu: boolean | null
}

/**
 * Ile paneli pokryje zimę: dwie liczby obok siebie — „w sumie” (energia zimą ≥ cel · zużycie zimą) i „godzina po godzinie” (bilans z baterią).
 * Bilans godzinowy rośnie z liczbą paneli (więcej produkcji nigdy nie obniża pokrycia), więc najmniejszą liczbę znajdujemy bisekcją.
 * Górną granicą nie jest sztywna liczba, tylko fizyka: gdy cel przekracza maksimum osiągalne przy dowolnej liczbie paneli, jest nieosiągalny.
 * Miejsce (jeśli znane) służy do porównania, nie do ucinania wyniku.
 * `jednostkowaKwh` — produkcja jednego panelu w rekordach TMY.
 */
export function dobierzPaneleNaZime(
  jednostkowaKwh: Float64Array,
  w: Omit<WejscieBilansu, "produkcjaKwh">,
  celPct: number,
  miejsceNaPaneli: number | null = null,
): DoborPanelowNaZime {
  const pokrycie = (n: number): number => {
    const produkcjaKwh = new Float64Array(jednostkowaKwh.length)
    for (let i = 0; i < produkcjaKwh.length; i++) produkcjaKwh[i] = jednostkowaKwh[i]! * n
    return podsumujBilans(bilansGodzinowy({ ...w, produkcjaKwh })).pokrycieZimaPct ?? 0
  }
  const zuzycieZimaKwh = sumaZimy(w.zapotrzebowanieMiesiaceKwh)
  let zimaNaPanelKwh = 0
  for (let i = 0; i < jednostkowaKwh.length; i++) if (MIESIACE_ZIMOWE_POROWNYWARKI.includes(w.miesiac[i]!)) zimaNaPanelKwh += jednostkowaKwh[i]!
  const panelowSumowo = zimaNaPanelKwh > 0 ? Math.ceil((celPct / 100) * zuzycieZimaKwh / zimaNaPanelKwh - 1e-9) : null
  const maks = pokrycie(PANELE_GRANICZNE)
  const TOL = 1e-9
  let panelowGodzinowo: number | null = null
  if (maks >= celPct - TOL) {
    let lo = 1
    let hi = PANELE_GRANICZNE
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (pokrycie(mid) >= celPct - TOL) hi = mid
      else lo = mid + 1
    }
    panelowGodzinowo = lo
  }
  const znaneMiejsce = miejsceNaPaneli !== null
  return {
    celPct,
    zuzycieZimaKwh,
    zimaNaPanelKwh,
    panelowSumowo,
    panelowGodzinowo,
    pokrycieMaksPct: maks,
    miejsceNaPaneli,
    pokrycieNaMiejscuPct: znaneMiejsce ? pokrycie(miejsceNaPaneli) : null,
    miesciSieNaMiejscu: znaneMiejsce ? panelowGodzinowo !== null && panelowGodzinowo <= miejsceNaPaneli : null,
  }
}
