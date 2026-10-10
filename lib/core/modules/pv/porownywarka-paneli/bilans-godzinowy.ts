/**
 * Porównywarka paneli PV, Etap A5 (spec 34): bilans godzinowy produkcji, zużycia i magazynu energii. Zastępuje miesięczne
 * „Σ min(produkcja, zapotrzebowanie)” (spec 7.2) tam, gdzie wiemy więcej: w godzinie bez słońca zużycie musi pochodzić z baterii albo
 * z sieci/agregatu, a nadwyżka z południa nie przechodzi na wieczór, jeśli bateria jest pełna albo jej nie ma.
 *
 * Model (świadomie prosty, wszystkie uproszczenia są jawnymi założeniami wyniku):
 *  - zużycie miesiąca rozłożone równo na wszystkie godziny tego miesiąca (aplikacja ma dziś tylko zużycie miesięczne, nie dobowe);
 *  - bateria o pojemności użytecznej C: nadwyżka ładuje ją ze sprawnością cyklu η (jak w „Bilans miesięczny” sieci: η raz, przy
 *    ładowaniu), rozładowanie bez dalszych strat; bez ograniczeń mocy ładowania, rozładowania i falownika;
 *  - rok TMY liczony dwa razy po sobie, wynik z drugiego przebiegu — stan naładowania na początku stycznia pochodzi z końca grudnia,
 *    nie z pustej baterii;
 *  - brakująca energia = to, czego nie dały panele ani bateria; jest wyceniana jak „energia brakująca” (sieć, agregat, taryfa strefowa
 *    według godziny braku).
 */
import { MIESIACE_ZIMOWE_POROWNYWARKI } from "./constants"
import type { OknoStrefy } from "./input"
import { wOknieStrefy } from "./uzysk"

const LICZBA_MIESIECY = 12

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

/** Liczba rekordów w każdym miesiącu (do rozłożenia zużycia miesiąca po równo na jego godziny). */
function rekordyWMiesiacach(miesiac: Uint8Array): number[] {
  const ile = new Array<number>(LICZBA_MIESIECY).fill(0)
  for (let i = 0; i < miesiac.length; i++) ile[miesiac[i]!]!++
  return ile
}

export function bilansGodzinowy(w: WejscieBilansu): WynikBilansu {
  const n = w.produkcjaKwh.length
  const rekordy = rekordyWMiesiacach(w.miesiac)
  const eta = w.sprawnoscCyklu ?? 1
  const pojemnosc = Math.max(0, w.pojemnoscKwh)
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
      const zuzycie = rekordy[m]! > 0 ? w.zapotrzebowanieMiesiaceKwh[m]! / rekordy[m]! : 0
      const prod = w.produkcjaKwh[i]!
      const bezposrednio = Math.min(prod, zuzycie)
      const nadwyzka = prod - bezposrednio
      const potrzeba = zuzycie - bezposrednio
      let odciete = 0
      if (nadwyzka > 0) {
        const doZapasu = Math.min(nadwyzka * eta, pojemnosc - soc)
        soc += doZapasu
        // Clamped: rounding can leave a −1e−16 remainder when the battery takes everything (shown as “−0”).
        odciete = Math.max(0, nadwyzka - (eta > 0 ? doZapasu / eta : 0))
      }
      const zBaterii = Math.min(potrzeba, soc)
      soc -= zBaterii
      const brak = potrzeba - zBaterii
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

/** Górna granica doboru liczby paneli — powyżej tego dobór uznajemy za nieosiągalny (zabezpiecza pętlę i nie sugeruje absurdalnych instalacji). */
export const MAKS_PANELI_W_DOBORZE = 200

export type DoborPanelowNaZime = {
  /** Cel wpisany przez użytkownika: jaka część zużycia zimowego (XI–II) ma być pokryta z paneli [%]. */
  celPct: number
  zuzycieZimaKwh: number
  /** Energia jednego panelu zimą [kWh]. */
  zimaNaPanelKwh: number
  /** Liczba paneli, gdy liczymy samą sumę energii zimą wobec zużycia zimą (bez dopasowania godzin; zbyt optymistyczne). `null`, gdy panel nie daje zimą energii. */
  panelowSumowo: number | null
  /** Najmniejsza liczba paneli, przy której bilans godzinowy (z baterią z formularza) osiąga cel; `null` = nieosiągalne w granicy `MAKS_PANELI_W_DOBORZE`. */
  panelowGodzinowo: number | null
  /** Pokrycie zimy przy `MAKS_PANELI_W_DOBORZE` paneli [%] — pokazuje, ile najwyżej da się uzyskać, gdy cel jest nieosiągalny. */
  pokrycieMaksPct: number
}

/**
 * Ile paneli pokryje zimę: dwie liczby obok siebie — „w sumie” (energia zimą ≥ cel · zużycie zimą) i „godzina po godzinie” (bilans z baterią).
 * Bilans godzinowy rośnie z liczbą paneli (więcej produkcji nigdy nie obniża pokrycia), więc najmniejszą liczbę znajdujemy bisekcją.
 * `jednostkowaKwh` — produkcja jednego panelu w rekordach TMY.
 */
export function dobierzPaneleNaZime(jednostkowaKwh: Float64Array, w: Omit<WejscieBilansu, "produkcjaKwh">, celPct: number): DoborPanelowNaZime {
  const pokrycie = (n: number): number => {
    const produkcjaKwh = new Float64Array(jednostkowaKwh.length)
    for (let i = 0; i < produkcjaKwh.length; i++) produkcjaKwh[i] = jednostkowaKwh[i]! * n
    return podsumujBilans(bilansGodzinowy({ ...w, produkcjaKwh })).pokrycieZimaPct ?? 0
  }
  const zuzycieZimaKwh = sumaZimy(w.zapotrzebowanieMiesiaceKwh)
  let zimaNaPanelKwh = 0
  for (let i = 0; i < jednostkowaKwh.length; i++) if (MIESIACE_ZIMOWE_POROWNYWARKI.includes(w.miesiac[i]!)) zimaNaPanelKwh += jednostkowaKwh[i]!
  const panelowSumowo = zimaNaPanelKwh > 0 ? Math.ceil((celPct / 100) * zuzycieZimaKwh / zimaNaPanelKwh - 1e-9) : null
  const maks = pokrycie(MAKS_PANELI_W_DOBORZE)
  const TOL = 1e-9
  let panelowGodzinowo: number | null = null
  if (maks >= celPct - TOL) {
    let lo = 1
    let hi = MAKS_PANELI_W_DOBORZE
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (pokrycie(mid) >= celPct - TOL) hi = mid
      else lo = mid + 1
    }
    panelowGodzinowo = lo
  }
  return { celPct, zuzycieZimaKwh, zimaNaPanelKwh, panelowSumowo, panelowGodzinowo, pokrycieMaksPct: maks }
}
