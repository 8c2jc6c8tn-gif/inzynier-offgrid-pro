import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { calculateAgregatPaliwo } from "@/lib/core/modules/kalkulator-mobilny/agregat-paliwo/calculator"
import { ELEKTRYKA_ZGODNOSC_VMP_IMP_TOL, HORYZONT_LAT, MIESIACE_ZIMOWE_POROWNYWARKI, SCIANA_AZYMUT_DEG, SCIANA_NACHYLENIE_DEG, type KryteriumId } from "./constants"
import type { DanePanelu, PorownywarkaInput, WycenaKwh } from "./input"
import { bilansGodzinowy, dobierzPaneleNaZime, podsumujBilans, type DoborPanelowNaZime, type PodsumowanieBilansu } from "./bilans-godzinowy"
import { ocenElektryke, type WynikElektryki } from "./elektryka"
import { najwyzszeWykorzystaniePct, obciazeniaMiejsca, ocenPanelObciazenia, type ObciazeniaMiejsca, type ObciazeniaPanelu } from "./obciazenia"
import { ocenKryteria, type KryteriumWynik } from "./kryteria"
import { oknoMiejsca, pojemnoscMiejsca, pojemnoscPochylona, wspolczynnikOknaMiejsca, wymiaryUzytkowe, type Pojemnosc, type RozmieszczeniePochylone } from "./pakowanie"
import {
  godzinowaEnergiaPanelu,
  maParametryTemperaturowe,
  miesiecznaEnergiaWgStref,
  profilNaslonecznienia,
  type ZakresModelu,
} from "./uzysk"
import { validateInput } from "./validation"
import {
  bifacjalnyPominietyPorp,
  brakCenyPorp,
  brakKryteriowPorp,
  brakTemperaturyGodzinowejPorp,
  brakWymiarowPaneluPorp,
  elektrykaBrakDanychPorp,
  elektrykaNiespojnaPorp,
  elektrykaBrakTminPorp,
  liczbaPrzekraczaMiejscePorp,
  modelUproszczonyPorp,
  obciazenieBrakNosnosciPorp,
  obciazeniePrzekraczaNosnoscPorp,
  oknoOdstepuBezSloncaPorp,
  panelSieNieMiesciPorp,
  panelWykluczonyPorp,
} from "./warnings"

export const CALCULATOR_VERSION = "1.5.0"

const FORMULA =
  "E_m = N \\sum_{t \\in m} \\frac{P_{STC}\\,G_{POA}(t)}{1000}\\,[1 + \\gamma (T_c(t) - 25)]\\,\\eta_{rel}(G_{POA}),\\quad T_c = T_a + \\frac{NOCT - 20}{800}\\,G_{POA}"

/** Bilans godzinowy zestawu paneli i koszt brakującej energii wg wyceny (stawka płaska, agregat albo strefy taryfy po godzinie braku); `null` bez wyceny. */
export type BilansGodzinowyPanelu = PodsumowanieBilansu & {
  kosztBrakuRokZl: number | null
  kosztBrakuZimaZl: number | null
  /** Ile paneli pokryje cel zimowy (A5, „ile paneli pokryje zimę”); `null`, gdy użytkownik nie wpisał celu. */
  doborNaZime: DoborPanelowNaZime | null
}

export type WynikPanelu = {
  id: string
  nazwa: string
  /** Liczba sztuk, dla której policzono wyniki (podana przez użytkownika albo z pakowania wymiarów miejsca). */
  liczbaPaneli: number
  zrodloLiczby: "podana" | "z-wymiarow"
  /** Ile sztuk mieści się w podanych wymiarach miejsca; `null` = wymiarów miejsca albo panelu brak (nie sprawdzono). */
  mieszcaSie: number | null
  /** Montaż pochylony: układ rzędów, z którego wynika liczba sztuk (`null` przy montażu równoległym albo gdy liczbę wpisano). */
  rozmieszczenie: RozmieszczeniePochylone | null
  mocKwp: number
  /** Masa N paneli [kg]; `null`, gdy karta nie podaje masy. */
  masaRazemKg: number | null
  /** Masa panelu na m² jego powierzchni [kg/m²] (obciążenie konstrukcji od paneli, bez stelaża i balastu); `null` bez masy albo wymiarów. */
  masaNaM2Kg: number | null
  /** Elektryka bez falownika (A3); `null` = brak danych elektrycznych panelu albo nie podano najniższej temperatury. */
  elektryka: WynikElektryki | null
  /** Obciążenie paneli śniegiem i wiatrem wg Eurokodu zestawione z nośnością z karty (spec 32); `null` = nie wpisano warunków miejsca. */
  obciazenia: ObciazeniaPanelu | null
  /** Energia N paneli w miesiącach [kWh], styczeń pierwszy. */
  miesiaceKwh: number[]
  zimaKwh: number
  /** Część energii zimowej z godzin taniej strefy [kWh]; `null`, gdy wycena nie jest dzienno-nocna. */
  zimaTaniaKwh: number | null
  rokKwh: number
  /** Energia wykorzystana = Σ min(produkcja, zapotrzebowanie) w miesiącach [kWh]; `null` bez zapotrzebowania (tryb „suchy”). */
  uzytecznaRokKwh: number | null
  uzytecznaZimaKwh: number | null
  /** Produkcja ponad zapotrzebowanie w roku [kWh] i jej ułamek produkcji — to nie „strata”, tylko energia do zagospodarowania (U16). */
  nadwyzkaRokKwh: number | null
  nadwyzkaUlamek: number | null
  /** Bilans godzinowy z baterią (A5, spec 34); `null` = nie wpisano baterii albo brak zapotrzebowania. */
  bilansGodzinowy: BilansGodzinowyPanelu | null
  /** Cena N paneli [zł]; `null` bez ceny. */
  cenaRazemZl: number | null
  cenaZaWpZl: number | null
  /** Wartość energii w zł (zima / rok) wg wyceny kWh; `null` bez ceny kWh. Tryb „suchy”: produkcja × stawka, bez oceny użyteczności. */
  wartoscZimaZl: number | null
  wartoscRokZl: number | null
  /** Koszt zimowej kWh w horyzoncie 25 lat [zł/kWh]; `null` bez ceny. */
  kosztZimowejKwhZl: number | null
  /** Prosty okres zwrotu [lata] = cena razem / wartość roczna; `null` bez ceny albo stawki. */
  okresZwrotuLat: number | null
  /** Moc po 25 latach wg degradacji z karty [% mocy początkowej] (górna granica); `null` bez obu liczb degradacji. */
  moc25LatPct: number | null
}

/** Scenariusz „tańszy panel = więcej paneli” (U10, spec 7.4): oszczędność z tańszego panelu przeliczona na dokupione sztuki. */
export type ScenariuszWiecejPaneli = {
  drozszyId: string
  tanszyId: string
  /** Różnica kosztu paneli (cena × liczba sztuk) [zł]. */
  oszczednoscZl: number
  cenaSztukiTanszegoZl: number
  dodatkowePanele: number
  /** Z dodatkowych: ile w tym samym miejscu, ile na ścianie południowej (U11); przy nieznanych wymiarach miejsca wszystkie „w miejscu”. */
  wTymSamymMiejscu: number
  naScianie: number
  /** `false` = wymiarów miejsca albo panelu brak, więc nie sprawdzono, czy dodatkowe panele się zmieszczą. */
  miejsceSprawdzone: boolean
  /** Energia dodatkowych paneli [kWh/rok, kWh zimą]. */
  dodatkoweRokKwh: number
  dodatkoweZimaKwh: number
  /** (tańszy + dodatkowe) − droższy: produkcja [kWh]. */
  przewagaRokKwh: number
  przewagaZimaKwh: number
  /** To samo wartościowo wg wyceny kWh (po ocenie użyteczności, gdy znane zapotrzebowanie); `null` bez ceny kWh. */
  przewagaRokZl: number | null
  przewagaZimaZl: number | null
}

export type RoznicaZimowa = {
  liderId: string
  drugiId: string
  roznicaKwh: number
  /** Wartość różnicy w zł rocznie wg wyceny kWh; `null` bez stawki. */
  roznicaZl: number | null
}

/** Panel pominięty w porównaniu, bo karta nie podaje γ albo NOCT, a pozostałe panele je mają (temperatura jest liczona). */
export type WykluczonyPanel = { id: string; nazwa: string; brakuje: ("gamma" | "noct")[] }

export type PorownywarkaResult = {
  zakresModelu: ZakresModelu
  panele: WynikPanelu[]
  /** Panele wykluczone z liczenia („brak danych”, w interfejsie szare); puste, gdy nikogo nie wykluczono. */
  wykluczone: WykluczonyPanel[]
  kryteria: KryteriumWynik[]
  /** Gwiazdki 0–10 per panel (kolejność wejścia); `null`, gdy mniej niż 2 panele albo żadne kryterium nie jest policzone. */
  gwiazdki: (number | null)[]
  roznicaZimowa: RoznicaZimowa | null
  /** Śnieg i wiatr w miejscu wg Eurokodu (wspólne dla paneli); `null` = nie wpisano warunków albo nie ma kąta paneli. */
  obciazeniaMiejsca: ObciazeniaMiejsca | null
  /** Użyta stawka 1 kWh [zł]; `null` = tryb „suchy” albo wycena dzienno-nocna. */
  stawkaZlKwh: number | null
  /** Ceny wyceny dzienno-nocnej [zł/kWh]; `null` w pozostałych trybach. */
  wycenaStrefowa: { zlKwhDzien: number; zlKwhNoc: number } | null
  /** `true` = wycena liczona od energii wykorzystanej (znane zapotrzebowanie), `false` = tryb „suchy”. */
  zUzytecznoscia: boolean
  /** Dla każdego tańszego panelu w zestawie: ile paneli dokupisz za różnicę względem najdroższego. */
  scenariusze: ScenariuszWiecejPaneli[]
}

const PUSTY: PorownywarkaResult = {
  zakresModelu: { temperatura: false, slabeSwiatlo: false },
  panele: [],
  wykluczone: [],
  kryteria: [],
  gwiazdki: [],
  roznicaZimowa: null,
  obciazeniaMiejsca: null,
  stawkaZlKwh: null,
  wycenaStrefowa: null,
  zUzytecznoscia: false,
  scenariusze: [],
}

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Stawka 1 kWh [zł]; agregat przez istniejący kalkulator „Agregat przenośny” (koszt kWh = koszt paliwa / energia). */
export function stawkaKwh(w: WycenaKwh | null): number | null {
  if (w === null || w.rodzaj === "dzienNoc") return null
  if (w.rodzaj !== "agregat") return w.zlKwh > 0 ? w.zlKwh : null
  const r = calculateAgregatPaliwo({
    mocAgregatuKw: w.mocKw,
    obciazeniePct: w.obciazeniePct,
    zuzycieLH: w.zuzycieLH,
    godzinNaDobe: 1,
    cenaZlL: w.cenaPaliwaZlL,
    kosztPorownawczyZlKwh: 0,
    miejsceAgregatu: null,
    podlaczenieAgregatu: null,
  })
  return r.status === "INVALID_INPUT" || r.status === "INCOMPLETE" ? null : r.value.kosztKwhZl
}

/** Moc po `HORYZONT_LAT` latach [% początkowej]: 100 − d1 − (lata − 1)·d_lin; potrzebne obie liczby z karty. */
function moc25(p: DanePanelu): number | null {
  if (p.degradacjaPierwszyRokPct === null || p.degradacjaLiniowaPctNaRok === null) return null
  return Math.max(0, 100 - p.degradacjaPierwszyRokPct - (HORYZONT_LAT - 1) * p.degradacjaLiniowaPctNaRok)
}

/** Suma współczynników mocy w latach 1…HORYZONT_LAT (degradacja z karty; bez niej 1 na rok). */
function sumaWspolczynnikowLat(p: DanePanelu): number {
  let s = 0
  for (let rok = 1; rok <= HORYZONT_LAT; rok++) {
    const spadek =
      p.degradacjaPierwszyRokPct !== null && p.degradacjaLiniowaPctNaRok !== null
        ? p.degradacjaPierwszyRokPct + (rok - 1) * p.degradacjaLiniowaPctNaRok
        : 0
    s += Math.max(0, 1 - spadek / 100)
  }
  return s
}

/**
 * Porównywarka paneli PV (D81, Etap A1): uzysk miesięczny każdego panelu na jednym miejscu (G_poa z silnika Muneera,
 * temperatura ogniwa z NOCT i γ, sprawność przy słabym świetle), wycena kWh, koszt zimowej kWh i gwiazdki względne.
 * Nie zgaduje danych katalogowych: brak parametru wyłącza dane zjawisko dla WSZYSTKICH paneli (porównywalność), a nie
 * jest zastępowany „typową” wartością. Zima = XI–II (U1). Bez strat systemowych (te same dla wszystkich).
 * A2: liczba sztuk albo podana (ta sama dla wszystkich), albo z pakowania wymiarów miejsca (osobno dla każdego panelu);
 * energia wykorzystana vs nadwyżka przy znanym zapotrzebowaniu (7.2); scenariusz „tańszy = więcej paneli” (7.4, U11).
 */
export function calculatePorownywarkaPaneli(input: PorownywarkaInput): CalcResult<PorownywarkaResult> {
  const temperaturaWDanych = !!input.daneGodzinowe?.length && input.daneGodzinowe.every((r) => r.tempC !== undefined)
  const zParametrami = input.panele.filter(maParametryTemperaturowe)
  // Decision of the owner (09.10.2026): when the weather data has temperature and at least one panel has γ and NOCT, a panel
  // without them is excluded („brak danych”) instead of switching the temperature off for everyone. Nobody has them → simple model.
  if (!temperaturaWDanych || zParametrami.length === 0 || zParametrami.length === input.panele.length || validateInput(input).errors.length > 0) {
    return policzPorownanie(input)
  }
  const wykluczone: WykluczonyPanel[] = input.panele
    .filter((p) => !maParametryTemperaturowe(p))
    .map((p) => ({ id: p.id, nazwa: p.nazwa, brakuje: [...(p.gammaPctNaC === null ? ["gamma" as const] : []), ...(p.noctC === null ? ["noct" as const] : [])] }))
  const wynik = policzPorownanie({ ...input, panele: zParametrami })
  if (wynik.status === "INVALID_INPUT") return wynik
  const opisy = wykluczone.map((w) => `${w.nazwa} (${w.brakuje.map((b) => (b === "gamma" ? "γ" : "NOCT")).join(", ")})`).join("; ")
  return { ...wynik, value: { ...wynik.value, wykluczone }, warnings: [panelWykluczonyPorp(opisy), ...wynik.warnings] }
}

function policzPorownanie(input: PorownywarkaInput): CalcResult<PorownywarkaResult> {
  const { errors } = validateInput(input)
  const inputs: Record<string, number> = { liczbaPanelowPorownywanych: input.panele.length }
  if (input.liczbaPaneli !== null) inputs.liczbaPaneli = input.liczbaPaneli
  if (input.miejsce) {
    inputs.nachylenieDeg = input.miejsce.nachylenieDeg
    inputs.azymutDeg = input.miejsce.azymutDeg
  }
  const baza = { unit: "kWh", formula: FORMULA, formulaKey: "UI-FORMULA-PV-POROWNYWARKA-PANELI", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, daneGodzinowe, miejsce, liczbaPaneli } = input
  const wymiary = input.wymiaryMiejsca ?? null
  const zapotrzebowanie = input.zapotrzebowanieMiesiaceKwh ?? null
  if (lat === undefined || lon === undefined || !daneGodzinowe?.length || miejsce === null || input.panele.length === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }
  // Number of panels: typed (the same for all) or packed from the place's size (per panel). Neither = nothing to compute.
  const zWymiarow = liczbaPaneli === null
  const wspolneBrakLiczby: Warning[] = []
  if (zWymiarow) {
    if (wymiary === null) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
    for (const p of input.panele) if (p.dlugoscMm === null || p.szerokoscMm === null) wspolneBrakLiczby.push(brakWymiarowPaneluPorp(p.nazwa))
    if (wspolneBrakLiczby.length > 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: wspolneBrakLiczby }
  }
  // Tilted mount: rows are spaced so that there is no shadow in the design window on 21 Dec (module „odstęp rzędów”).
  const pochylone = wymiary !== null && wymiary.montaz === "pochylony-na-konstrukcji"
  const fOkna = pochylone ? wspolczynnikOknaMiejsca(wymiary, lat, lon, miejsce.azymutDeg) : null
  if (pochylone && fOkna === null && zWymiarow) {
    const okno = oknoMiejsca(wymiary)
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [oknoOdstepuBezSloncaPorp(okno.odH, okno.doH)] }
  }
  const pojemnosci = new Map<string, Pojemnosc | null>(
    input.panele.map((p) => [
      p.id,
      wymiary === null
        ? null
        : pochylone
          ? fOkna === null
            ? null
            : pojemnoscPochylona(wymiary, p, miejsce.nachylenieDeg, fOkna)
          : pojemnoscMiejsca(wymiary, p),
    ]),
  )

  const warnings: Warning[] = []
  const profil = profilNaslonecznienia(lat, lon, daneGodzinowe, miejsce)
  const brakTemperatury = profil.tempC === null
  const bezTemperatury = input.panele.filter((p) => !maParametryTemperaturowe(p))
  const zakresModelu: ZakresModelu = {
    temperatura: !brakTemperatury && bezTemperatury.length === 0,
    slabeSwiatlo: input.panele.every((p) => p.sprawnoscWzglednaPrzy200WPct !== null),
  }
  if (brakTemperatury) warnings.push(brakTemperaturyGodzinowejPorp())
  if (bezTemperatury.length > 0) warnings.push(modelUproszczonyPorp(bezTemperatury.map((p) => p.nazwa).join(", ")))
  for (const p of input.panele) if (p.bifacjalny) warnings.push(bifacjalnyPominietyPorp(p.nazwa))
  for (const p of input.panele) {
    if (!p.elektryka) warnings.push(elektrykaBrakDanychPorp(p.nazwa))
    else if (Math.abs((p.elektryka.vmpV * p.elektryka.impA) / p.pmaxW - 1) > ELEKTRYKA_ZGODNOSC_VMP_IMP_TOL) {
      warnings.push(elektrykaNiespojnaPorp(p.nazwa, p.elektryka.vmpV * p.elektryka.impA, p.pmaxW))
    }
  }
  if ((input.tminC === null || input.tminC === undefined) && input.panele.some((p) => p.elektryka)) warnings.push(elektrykaBrakTminPorp())

  const stawka = stawkaKwh(input.wycena)
  const strefy = input.wycena?.rodzaj === "dzienNoc" ? input.wycena : null
  const okna = strefy?.oknaTanie ?? []
  /** Wartość energii [zł]: stawka płaska albo energia z taniej strefy po cenie nocnej, reszta po dziennej. */
  const wartosc = (kwh: number, taniaKwh: number): number | null =>
    strefy ? (kwh - taniaKwh) * strefy.zlKwhDzien + taniaKwh * strefy.zlKwhNoc : stawka === null ? null : kwh * stawka
  const zima = (xs: number[]) => suma(MIESIACE_ZIMOWE_POROWNYWARKI.map((m) => xs[m]!))

  /**
   * Podsumowanie konfiguracji (miesięczna produkcja i jej część z taniej strefy). Ze znanym zapotrzebowaniem do wyceny wchodzi
   * tylko energia wykorzystana Σ min(produkcja, zapotrzebowanie) — nadwyżka nie jest „oszczędnością” (7.2); energię taniej strefy
   * skaluję tak samo jak produkcję danego miesiąca (założenie `PORP-ZAL-UZYTECZNA-PROPORCJA-STREF`).
   */
  const podsumuj = (mies: number[], tania: number[]) => {
    const uzyt = zapotrzebowanie ? mies.map((e, m) => Math.min(e, zapotrzebowanie[m]!)) : mies
    const taniaUzyt = zapotrzebowanie ? tania.map((tn, m) => (mies[m]! > 0 ? (tn * uzyt[m]!) / mies[m]! : 0)) : tania
    const rok = suma(mies)
    const uzytRok = suma(uzyt)
    return {
      rokKwh: rok,
      zimaKwh: zima(mies),
      zimaTaniaKwh: zima(tania),
      rokTaniaKwh: suma(tania),
      uzytecznaRokKwh: zapotrzebowanie ? uzytRok : null,
      uzytecznaZimaKwh: zapotrzebowanie ? zima(uzyt) : null,
      nadwyzkaRokKwh: zapotrzebowanie ? rok - uzytRok : null,
      nadwyzkaUlamek: zapotrzebowanie && rok > 0 ? (rok - uzytRok) / rok : null,
      wartoscRokZl: wartosc(uzytRok, suma(taniaUzyt)),
      wartoscZimaZl: wartosc(zima(uzyt), zima(taniaUzyt)),
    }
  }

  const obcMiejsca = input.obciazenia ? obciazeniaMiejsca(input.obciazenia, miejsce.nachylenieDeg) : null
  const energiaJednego = new Map<string, { wszystkie: number[]; tania: number[] }>()
  const panele: WynikPanelu[] = input.panele.map((p) => {
    const energia = miesiecznaEnergiaWgStref(p, profil, zakresModelu, okna)
    energiaJednego.set(p.id, energia)
    const pojemnosc = pojemnosci.get(p.id) ?? null
    const n = zWymiarow ? pojemnosc!.liczba : liczbaPaneli!
    if (zWymiarow && n === 0) warnings.push(panelSieNieMiesciPorp(p.nazwa))
    if (!zWymiarow && pojemnosc !== null && n > pojemnosc.liczba) warnings.push(liczbaPrzekraczaMiejscePorp(p.nazwa, n, pojemnosc.liczba))
    const miesiaceKwh = energia.wszystkie.map((e) => e * n)
    const ps = podsumuj(miesiaceKwh, energia.tania.map((e) => e * n))
    const cenaRazemZl = p.cenaBruttoZl === null ? null : p.cenaBruttoZl * n
    if (p.cenaBruttoZl === null) warnings.push(brakCenyPorp(p.nazwa))
    let bilans: BilansGodzinowyPanelu | null = null
    if (input.bilansGodzinowy && zapotrzebowanie) {
      const jednostkowaKwh = godzinowaEnergiaPanelu(p, profil, zakresModelu)
      const produkcjaKwh = jednostkowaKwh.map((x) => x * n)
      const wspolne = {
        miesiac: profil.miesiac,
        godzinaLokalna: profil.godzinaLokalna,
        zapotrzebowanieMiesiaceKwh: zapotrzebowanie,
        pojemnoscKwh: input.bilansGodzinowy.pojemnoscKwh,
        sprawnoscCyklu: input.bilansGodzinowy.sprawnoscCyklu,
        oknaTanie: okna,
      }
      const ps5 = podsumujBilans(bilansGodzinowy({ produkcjaKwh, ...wspolne }))
      const cel = input.bilansGodzinowy.celZimyPct ?? null
      bilans = {
        ...ps5,
        kosztBrakuRokZl: wartosc(ps5.brakRokKwh, ps5.brakTaniaRokKwh),
        kosztBrakuZimaZl: wartosc(ps5.brakZimaKwh, ps5.brakTaniaZimaKwh),
        doborNaZime: cel === null ? null : dobierzPaneleNaZime(jednostkowaKwh, wspolne, cel, pojemnosc?.liczba ?? null),
      }
    }
    const obciazenia = obcMiejsca ? ocenPanelObciazenia(p, obcMiejsca) : null
    if (obciazenia) {
      const maks = najwyzszeWykorzystaniePct(obciazenia)
      if (maks === null) warnings.push(obciazenieBrakNosnosciPorp(p.nazwa))
      else if (maks > 100) warnings.push(obciazeniePrzekraczaNosnoscPorp(p.nazwa, maks))
    }
    return {
      id: p.id,
      nazwa: p.nazwa,
      liczbaPaneli: n,
      zrodloLiczby: zWymiarow ? "z-wymiarow" : "podana",
      mieszcaSie: pojemnosc?.liczba ?? null,
      rozmieszczenie: pojemnosc?.pochylone ?? null,
      mocKwp: (n * p.pmaxW) / 1000,
      masaRazemKg: p.masaKg === null ? null : p.masaKg * n,
      masaNaM2Kg: p.masaKg === null || p.dlugoscMm === null || p.szerokoscMm === null ? null : p.masaKg / ((p.dlugoscMm / 1000) * (p.szerokoscMm / 1000)),
      elektryka: ocenElektryke(p, n, input.tminC),
      obciazenia,
      miesiaceKwh,
      zimaKwh: ps.zimaKwh,
      zimaTaniaKwh: strefy ? ps.zimaTaniaKwh : null,
      rokKwh: ps.rokKwh,
      uzytecznaRokKwh: ps.uzytecznaRokKwh,
      uzytecznaZimaKwh: ps.uzytecznaZimaKwh,
      nadwyzkaRokKwh: ps.nadwyzkaRokKwh,
      nadwyzkaUlamek: ps.nadwyzkaUlamek,
      bilansGodzinowy: bilans,
      cenaRazemZl,
      cenaZaWpZl: p.cenaBruttoZl === null ? null : p.cenaBruttoZl / p.pmaxW,
      wartoscZimaZl: ps.wartoscZimaZl,
      wartoscRokZl: ps.wartoscRokZl,
      kosztZimowejKwhZl:
        cenaRazemZl === null || ps.zimaKwh <= 0 ? null : cenaRazemZl / (ps.zimaKwh * sumaWspolczynnikowLat(p)),
      okresZwrotuLat: cenaRazemZl === null || ps.wartoscRokZl === null || ps.wartoscRokZl <= 0 ? null : cenaRazemZl / ps.wartoscRokZl,
      moc25LatPct: moc25(p),
    }
  })

  const scenariusze = policzScenariusze({
    wejscie: input,
    panele,
    pojemnosci,
    energiaJednego,
    podsumuj,
    energiaSciany: () => {
      const profilSciany = profilNaslonecznienia(lat, lon, daneGodzinowe, { ...miejsce, nachylenieDeg: SCIANA_NACHYLENIE_DEG, azymutDeg: SCIANA_AZYMUT_DEG })
      return (p: DanePanelu) => miesiecznaEnergiaWgStref(p, profilSciany, zakresModelu, okna)
    },
  })

  const wart: Partial<Record<KryteriumId, (number | null)[]>> = {
    uzyskZimowy: panele.map((p) => p.zimaKwh),
    uzyskRoczny: panele.map((p) => p.rokKwh),
    kosztZimowejKwh: panele.map((p) => p.kosztZimowejKwhZl),
    cenaZaWp: panele.map((p) => p.cenaZaWpZl),
    degradacjaGwarancja: panele.map((p) => p.moc25LatPct),
    slabeSwiatlo: input.panele.map((p) => p.sprawnoscWzglednaPrzy200WPct),
    temperatura: input.panele.map((p) => (p.gammaPctNaC === null ? null : Math.abs(p.gammaPctNaC))),
  }
  const { kryteria, gwiazdki } = ocenKryteria(
    input.panele.map((p) => p.nazwa),
    wart,
    input.kryteria,
  )
  if (input.panele.length >= 2 && gwiazdki.every((g) => g === null)) warnings.push(brakKryteriowPorp())

  const posortowane = [...panele].sort((a, b) => b.zimaKwh - a.zimaKwh)
  const roznicaZimowa: RoznicaZimowa | null =
    posortowane.length >= 2
      ? {
          liderId: posortowane[0]!.id,
          drugiId: posortowane[1]!.id,
          roznicaKwh: posortowane[0]!.zimaKwh - posortowane[1]!.zimaKwh,
          roznicaZl:
            posortowane[0]!.wartoscZimaZl === null || posortowane[1]!.wartoscZimaZl === null
              ? null
              : posortowane[0]!.wartoscZimaZl - posortowane[1]!.wartoscZimaZl,
        }
      : null

  const uzyt = wymiary !== null ? wymiaryUzytkowe(wymiary) : null
  const assumptions: Assumption[] = [
    { kod: "PORP-ZAL-MODEL-NASLONECZNIENIA" },
    { kod: "PORP-ZAL-ZIMA-XI-II" },
    { kod: "PORP-ZAL-BEZ-STRAT-SYSTEMOWYCH" },
    zWymiarow
      ? { kod: "PORP-ZAL-LICZBA-Z-WYMIAROW", params: { dlugosc: wymiary!.dlugoscM, szerokosc: wymiary!.szerokoscM, margines: wymiary!.marginesM } }
      : { kod: "PORP-ZAL-TA-SAMA-LICZBA-PANELI", params: { n: liczbaPaneli! } },
    { kod: "PORP-ZAL-SKALA-WZGLEDNA" },
    { kod: "PORP-ZAL-BEZ-BOS" },
    { kod: "PORP-ZAL-HORYZONT-LAT", params: { lata: HORYZONT_LAT } },
  ]
  if (pochylone && fOkna !== null && wymiary !== null) {
    const okno = oknoMiejsca(wymiary)
    assumptions.push({ kod: "PORP-ZAL-ODSTEP-RZEDOW", params: { odH: okno.odH, doH: okno.doH } })
    if (okno.domyslne) assumptions.push({ kod: "PORP-ZAL-OKNO-DOMYSLNE" })
  } else if (zWymiarow || uzyt !== null) assumptions.push({ kod: "PORP-ZAL-PAKOWANIE-BEZ-SZCZELIN" })
  if (zakresModelu.temperatura) assumptions.push({ kod: "PORP-ZAL-TEMPERATURA-OGNIWA" })
  if (zakresModelu.slabeSwiatlo) assumptions.push({ kod: "PORP-ZAL-SWIATLO-INTERPOLACJA" })
  if (input.panele.some((p) => p.degradacjaPierwszyRokPct !== null && p.degradacjaLiniowaPctNaRok !== null)) {
    assumptions.push({ kod: "PORP-ZAL-DEGRADACJA-GWARANCYJNA" })
  }
  if (zapotrzebowanie) {
    assumptions.push({ kod: "PORP-ZAL-UZYTECZNA-MIESIECZNIE" })
    if (strefy) assumptions.push({ kod: "PORP-ZAL-UZYTECZNA-PROPORCJA-STREF" })
  } else if (stawka !== null || strefy) assumptions.push({ kod: "PORP-ZAL-WYCENA-BEZ-UZYTECZNOSCI" })
  if (strefy) assumptions.push({ kod: "PORP-ZAL-STREFY-CZAS-PL" })
  if (scenariusze.length > 0) {
    assumptions.push({ kod: "PORP-ZAL-SCENARIUSZ-BEZ-BOS" })
    if (scenariusze.some((sc) => !sc.miejsceSprawdzone)) assumptions.push({ kod: "PORP-ZAL-SCENARIUSZ-MIEJSCE-NIEZNANE" })
    if (scenariusze.some((sc) => sc.naScianie > 0)) assumptions.push({ kod: "PORP-ZAL-SCIANA-POLUDNIOWA" })
  }
  if (miejsce.albedo === undefined) assumptions.push({ kod: "PORP-ZAL-ALBEDO-DOMYSLNE" })
  const bilansB = panele.find((p) => p.bilansGodzinowy !== null)?.bilansGodzinowy ?? null
  if (bilansB) {
    assumptions.push({ kod: "PORP-ZAL-BIL-PROFIL-PLASKI" }, { kod: "PORP-ZAL-BIL-BEZ-LIMITOW-MOCY" }, { kod: "PORP-ZAL-BIL-DWA-PRZEBIEGI" })
    if (bilansB.doborNaZime) assumptions.push({ kod: "PORP-ZAL-DOBOR-ZIMY" })
    if (bilansB.sprawnoscZalozona && bilansB.pojemnoscKwh > 0) assumptions.push({ kod: "PORP-ZAL-BIL-CYKL-100" })
    else if (bilansB.pojemnoscKwh > 0) assumptions.push({ kod: "PORP-ZAL-BIL-CYKL", params: { sprawnosc: Math.round(bilansB.sprawnoscUzyta * 100) } })
  }
  if (obcMiejsca) {
    if (obcMiejsca.snieg) assumptions.push({ kod: "PORP-ZAL-OBC-SNIEG" })
    if (obcMiejsca.wiatr) assumptions.push({ kod: "PORP-ZAL-OBC-WIATR" })
    assumptions.push({ kod: "PORP-ZAL-OBC-KOMBINACJA" }, { kod: "PORP-ZAL-OBC-NOSNOSC" })
  }

  return {
    ...baza,
    value: {
      zakresModelu,
      panele,
      wykluczone: [],
      kryteria,
      gwiazdki,
      roznicaZimowa,
      obciazeniaMiejsca: obcMiejsca,
      stawkaZlKwh: stawka,
      wycenaStrefowa: strefy ? { zlKwhDzien: strefy.zlKwhDzien, zlKwhNoc: strefy.zlKwhNoc } : null,
      zUzytecznoscia: zapotrzebowanie !== null,
      scenariusze,
    },
    status: warnings.some((w) => w.level === "warning" || w.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}

/**
 * Scenariusz 7.4 (U10, U11): dla każdego panelu tańszego (w sumie za sztuki) od najdroższego — za różnicę kosztu dokupujemy
 * sztuki tańszego i liczymy, ile energii dodają (w zimie osobno) w porównaniu z tym, co daje droższy. Dodatkowe sztuki idą
 * najpierw w wolne miejsce (gdy znamy wymiary miejsca i panelu), reszta na ścianę południową (pion, 90°/180°). Koszt dodatkowej
 * sztuki = cena panelu (bez BOS: cennik czeka na akceptację właściciela — założenie `PORP-ZAL-SCENARIUSZ-BEZ-BOS`).
 */
function policzScenariusze(a: {
  wejscie: PorownywarkaInput
  panele: WynikPanelu[]
  pojemnosci: Map<string, Pojemnosc | null>
  energiaJednego: Map<string, { wszystkie: number[]; tania: number[] }>
  podsumuj: (mies: number[], tania: number[]) => { rokKwh: number; zimaKwh: number; wartoscRokZl: number | null; wartoscZimaZl: number | null }
  energiaSciany: () => (p: DanePanelu) => { wszystkie: number[]; tania: number[] }
}): ScenariuszWiecejPaneli[] {
  const cenaSztuki = new Map(a.wejscie.panele.map((p) => [p.id, p.cenaBruttoZl] as const))
  const zCena = a.panele.filter((p) => p.cenaRazemZl !== null && (cenaSztuki.get(p.id) ?? 0) > 0)
  if (zCena.length < 2) return []
  const najdrozszy = zCena.reduce((x, y) => (y.cenaRazemZl! > x.cenaRazemZl! ? y : x))
  const wynik: ScenariuszWiecejPaneli[] = []
  let sciana: ((p: DanePanelu) => { wszystkie: number[]; tania: number[] }) | null = null
  const drogi = a.podsumuj(najdrozszy.miesiaceKwh, a.energiaJednego.get(najdrozszy.id)!.tania.map((e) => e * najdrozszy.liczbaPaneli))
  for (const b of zCena) {
    if (b.cenaRazemZl! >= najdrozszy.cenaRazemZl!) continue
    const panelB = a.wejscie.panele.find((p) => p.id === b.id)!
    const cena = cenaSztuki.get(b.id)!
    const oszczednosc = najdrozszy.cenaRazemZl! - b.cenaRazemZl!
    const dodatkowe = Math.floor(oszczednosc / cena)
    const pojemnosc = a.pojemnosci.get(b.id) ?? null
    const wolne = pojemnosc === null ? null : Math.max(0, pojemnosc.liczba - b.liczbaPaneli)
    const wMiejscu = wolne === null ? dodatkowe : Math.min(dodatkowe, wolne)
    const naScianie = dodatkowe - wMiejscu
    const jeden = a.energiaJednego.get(b.id)!
    let scianaJeden = { wszystkie: new Array<number>(12).fill(0), tania: new Array<number>(12).fill(0) }
    if (naScianie > 0) {
      sciana ??= a.energiaSciany()
      scianaJeden = sciana(panelB)
    }
    const mies = b.miesiaceKwh.map((e, m) => e + wMiejscu * jeden.wszystkie[m]! + naScianie * scianaJeden.wszystkie[m]!)
    const tania = jeden.tania.map((e, m) => (e * b.liczbaPaneli) + wMiejscu * e + naScianie * scianaJeden.tania[m]!)
    const razem = a.podsumuj(mies, tania)
    const dodatkoweMies = mies.map((e, m) => e - b.miesiaceKwh[m]!)
    wynik.push({
      drozszyId: najdrozszy.id,
      tanszyId: b.id,
      oszczednoscZl: oszczednosc,
      cenaSztukiTanszegoZl: cena,
      dodatkowePanele: dodatkowe,
      wTymSamymMiejscu: wMiejscu,
      naScianie,
      miejsceSprawdzone: wolne !== null,
      dodatkoweRokKwh: suma(dodatkoweMies),
      dodatkoweZimaKwh: suma(MIESIACE_ZIMOWE_POROWNYWARKI.map((m) => dodatkoweMies[m]!)),
      przewagaRokKwh: razem.rokKwh - drogi.rokKwh,
      przewagaZimaKwh: razem.zimaKwh - drogi.zimaKwh,
      przewagaRokZl: razem.wartoscRokZl === null || drogi.wartoscRokZl === null ? null : razem.wartoscRokZl - drogi.wartoscRokZl,
      przewagaZimaZl: razem.wartoscZimaZl === null || drogi.wartoscZimaZl === null ? null : razem.wartoscZimaZl - drogi.wartoscZimaZl,
    })
  }
  return wynik
}
