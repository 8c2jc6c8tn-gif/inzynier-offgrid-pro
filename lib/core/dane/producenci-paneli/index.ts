/**
 * Opisy producentów paneli (D81, spec sekcja 15, Etap C, wymóg U8): wyłącznie fakty znalezione w sieci, każdy ze źródłem (adres)
 * i datą odczytu; status całego wpisu „do akceptacji” do czasu przeglądu przez właściciela. Aplikacja niczego tu nie ocenia
 * własnym osądem: „dobre panele” znaczy tylko „wymieniony na liście niezależnego testu X w roku Y”. Brak informacji to jawny
 * brak (tekst „nie sprawdzano” na ekranie), nigdy domysł. Opisy nie dają punktów w gwiazdkach (kryterium „wiarygodność” zostaje bez automatycznej oceny).
 *
 * Źródła czytane 10.10.2026. Strony sprzedawców i artykuły sponsorowane są oznaczone osobnym rodzajem faktu.
 */

/** Data przeglądu źródeł (ISO). */
export const DATA_PRZEGLADU_PRODUCENTOW = "2026-10-10"

export type KodKraju = "CN" | "KR" | "CH" | "DE" | "GB" | "ES" | "IT" | "TR"

export type ZrodloFaktu = { url: string; tytul: string }

export type FaktProducenta =
  | { rodzaj: "zalozona"; rok: number; miejsce: string | null; zrodlo: ZrodloFaktu }
  | { rodzaj: "siedziba"; miasto: string; zrodlo: ZrodloFaktu }
  /** Siedziba międzynarodowa, gdy producent podaje osobno siedzibę globalną i międzynarodową. */
  | { rodzaj: "siedziba-miedzynarodowa"; miasto: string; zrodlo: ZrodloFaktu }
  | { rodzaj: "gielda"; gielda: string; symbol: string; odRok: number; zrodlo: ZrodloFaktu }
  | { rodzaj: "grupa"; grupa: string; zrodlo: ZrodloFaktu }
  | { rodzaj: "wysylki"; rok: number; mw: number; zrodlo: ZrodloFaktu }
  /** Kraje europejskie, w których producent wymienia siedzibę regionalną albo organizację sprzedaży (kody ISO). */
  | { rodzaj: "biura-europa"; kraje: readonly KodKraju[]; zrodlo: ZrodloFaktu }
  /** Lata, w których producent jest na liście „Top Performer” raportu niezależnego laboratorium Kiwa PVEL (PV Module Reliability Scorecard). */
  | { rodzaj: "pvel"; lata: readonly number[]; zrodlo: ZrodloFaktu }
  /** Producent na liście najlepszych w teście RETC „PV Module Index” 2025 (niezależne laboratorium). */
  | { rodzaj: "retc"; zrodlo: ZrodloFaktu }
  /** Hurtownia w Polsce, której oferta (strona hurtowni) wymienia markę. To nie jest oficjalny dystrybutor ani serwis producenta. */
  | { rodzaj: "hurtownia-pl"; hurtownia: string; zrodlo: ZrodloFaktu }
  /** Artykuł sponsorowany (data w tekście) opisujący dystrybutora marki w Polsce — słabsze źródło niż strona hurtowni. */
  | { rodzaj: "dystrybutor-pl-sponsorowany"; dystrybutor: string; data: string; zrodlo: ZrodloFaktu }
  /** Strona producenta (biura i fabryki) nie wymienia Polski; to brak wzmianki, nie dowód braku obecności. */
  | { rodzaj: "brak-polski-na-stronie"; zrodlo: ZrodloFaktu }
  /** Informacja ze strony sprzedawcy, której nie potwierdza lista niezależnego testu odczytana osobno. */
  | { rodzaj: "pvel-wg-sprzedawcy-niepotwierdzone"; zrodlo: ZrodloFaktu }
  /** Informacja źródła o sprzecznych danych (np. dwie różne siedziby na tej samej stronie). */
  | { rodzaj: "zrodlo-niespojne"; co: "siedziba"; zrodlo: ZrodloFaktu }

export type OpisProducenta = {
  /** Nazwa jak w katalogu paneli (`producent`). */
  producent: string
  kraj: KodKraju
  fakty: readonly FaktProducenta[]
  /** Fakty, których nie udało się ustalić z odczytanych źródeł (jawnie, np. rok założenia marki). */
  nieustalono: readonly "rok-zalozenia"[]
}

const PVEL_TABELA: ZrodloFaktu = { url: "https://scorecard.pvel.com/manufacturers/", tytul: "Kiwa PVEL — PV Module Reliability Scorecard, tabela producentów (Historical Scorecard)" }
const RETC_2025: ZrodloFaktu = {
  url: "https://pv-magazine-usa.com/2025/06/11/top-solar-modules-in-reliability-quality-and-performance-testing/",
  tytul: "pv magazine USA, 11.06.2025 — RETC 2025 PV Module Index",
}
const MANITU: ZrodloFaktu = { url: "https://manitusolar.pl/", tytul: "Manitu Solar — hurtownia fotowoltaiczna (oferta modułów)" }
const NATEC_2020: ZrodloFaktu = {
  url: "https://www.gramwzielone.pl/energia-sloneczna/103237/czolowy-dystrybutor-modulow-i-falownikow-pv-wchodzi-do-polski",
  tytul: "Gramwzielone.pl, 22.06.2020 — artykuł sponsorowany o wejściu Natec do Polski",
}
const wiki = (nazwa: string, tytul: string): ZrodloFaktu => ({ url: `https://en.wikipedia.org/wiki/${nazwa}`, tytul })

const zakres = (...r: Array<number | [number, number]>): number[] => r.flatMap((x) => (typeof x === "number" ? [x] : Array.from({ length: x[1] - x[0] + 1 }, (_, i) => x[0] + i)))

export const OPISY_PRODUCENTOW: readonly OpisProducenta[] = [
  {
    producent: "JA Solar",
    kraj: "CN",
    nieustalono: [],
    fakty: [
      { rodzaj: "zalozona", rok: 2005, miejsce: null, zrodlo: wiki("JA_Solar", "Wikipedia — JA Solar") },
      { rodzaj: "zrodlo-niespojne", co: "siedziba", zrodlo: wiki("JA_Solar", "Wikipedia — JA Solar") },
      { rodzaj: "pvel", lata: zakres(2014, [2016, 2016], [2018, 2026]), zrodlo: PVEL_TABELA },
      { rodzaj: "retc", zrodlo: RETC_2025 },
      { rodzaj: "hurtownia-pl", hurtownia: "Manitu Solar", zrodlo: MANITU },
      { rodzaj: "dystrybutor-pl-sponsorowany", dystrybutor: "Natec", data: "22.06.2020", zrodlo: NATEC_2020 },
    ],
  },
  {
    producent: "Jinko",
    kraj: "CN",
    nieustalono: [],
    fakty: [
      { rodzaj: "zalozona", rok: 2006, miejsce: "Shangrao (Jiangxi)", zrodlo: wiki("JinkoSolar", "Wikipedia — JinkoSolar") },
      { rodzaj: "siedziba", miasto: "Szanghaj", zrodlo: wiki("JinkoSolar", "Wikipedia — JinkoSolar") },
      { rodzaj: "gielda", gielda: "NYSE", symbol: "JKS", odRok: 2010, zrodlo: wiki("JinkoSolar", "Wikipedia — JinkoSolar") },
      { rodzaj: "wysylki", rok: 2024, mw: 99596, zrodlo: wiki("JinkoSolar", "Wikipedia — JinkoSolar") },
      { rodzaj: "pvel", lata: zakres(2014, [2016, 2026]), zrodlo: PVEL_TABELA },
      { rodzaj: "retc", zrodlo: RETC_2025 },
      { rodzaj: "dystrybutor-pl-sponsorowany", dystrybutor: "Natec", data: "22.06.2020", zrodlo: NATEC_2020 },
    ],
  },
  {
    producent: "LONGi",
    kraj: "CN",
    nieustalono: [],
    fakty: [
      { rodzaj: "zalozona", rok: 2000, miejsce: "Xi'an", zrodlo: wiki("LONGi", "Wikipedia — LONGi") },
      { rodzaj: "siedziba", miasto: "Xi'an", zrodlo: wiki("LONGi", "Wikipedia — LONGi") },
      { rodzaj: "gielda", gielda: "Shanghai Stock Exchange", symbol: "601012", odRok: 2012, zrodlo: wiki("LONGi", "Wikipedia — LONGi") },
      { rodzaj: "pvel", lata: zakres([2017, 2022], [2024, 2026]), zrodlo: PVEL_TABELA },
      { rodzaj: "retc", zrodlo: RETC_2025 },
      { rodzaj: "hurtownia-pl", hurtownia: "Manitu Solar", zrodlo: MANITU },
      { rodzaj: "dystrybutor-pl-sponsorowany", dystrybutor: "Natec", data: "22.06.2020", zrodlo: NATEC_2020 },
    ],
  },
  {
    producent: "Trina",
    kraj: "CN",
    nieustalono: [],
    fakty: [
      { rodzaj: "zalozona", rok: 1997, miejsce: null, zrodlo: { url: "https://www.trinasolar.com/eu/about-us", tytul: "Trina Solar (Europa) — O nas" } },
      { rodzaj: "siedziba", miasto: "Changzhou", zrodlo: { url: "https://www.trinasolar.com/eu/about-us", tytul: "Trina Solar (Europa) — O nas" } },
      { rodzaj: "siedziba-miedzynarodowa", miasto: "Szanghaj", zrodlo: { url: "https://www.trinasolar.com/eu/about-us", tytul: "Trina Solar (Europa) — O nas" } },
      { rodzaj: "biura-europa", kraje: ["CH", "DE", "GB", "ES", "IT", "TR"], zrodlo: { url: "https://www.trinasolar.com/eu/about-us", tytul: "Trina Solar (Europa) — O nas" } },
      { rodzaj: "brak-polski-na-stronie", zrodlo: { url: "https://www.trinasolar.com/eu/about-us", tytul: "Trina Solar (Europa) — O nas" } },
      { rodzaj: "gielda", gielda: "STAR Market (Shanghai)", symbol: "688599", odRok: 2020, zrodlo: wiki("Trina_Solar", "Wikipedia — Trina Solar") },
      { rodzaj: "pvel", lata: zakres(2014, [2016, 2026]), zrodlo: PVEL_TABELA },
      { rodzaj: "retc", zrodlo: RETC_2025 },
      { rodzaj: "hurtownia-pl", hurtownia: "Manitu Solar", zrodlo: MANITU },
    ],
  },
  {
    producent: "Astronergy",
    kraj: "CN",
    nieustalono: ["rok-zalozenia"],
    fakty: [
      { rodzaj: "siedziba", miasto: "Hangzhou", zrodlo: wiki("Astronergy", "Wikipedia — Astronergy") },
      { rodzaj: "pvel", lata: zakres(2014, [2017, 2018], [2020, 2026]), zrodlo: PVEL_TABELA },
      { rodzaj: "retc", zrodlo: RETC_2025 },
    ],
  },
  {
    producent: "HD Hyundai",
    kraj: "KR",
    nieustalono: [],
    fakty: [
      { rodzaj: "zalozona", rok: 2004, miejsce: null, zrodlo: { url: "https://www.vpsolar.com/en/hd-hyundai-energy-solutions-innovative-modules/", tytul: "VP Solar (sprzedawca), 19.11.2024 — HD Hyundai Energy Solutions" } },
      { rodzaj: "grupa", grupa: "HD Hyundai Group", zrodlo: { url: "https://www.vpsolar.com/en/hd-hyundai-energy-solutions-innovative-modules/", tytul: "VP Solar (sprzedawca), 19.11.2024 — HD Hyundai Energy Solutions" } },
      { rodzaj: "pvel-wg-sprzedawcy-niepotwierdzone", zrodlo: { url: "https://www.vpsolar.com/en/hd-hyundai-energy-solutions-innovative-modules/", tytul: "VP Solar (sprzedawca), 19.11.2024 — HD Hyundai Energy Solutions" } },
    ],
  },
]

export function opisProducenta(producent: string): OpisProducenta | undefined {
  return OPISY_PRODUCENTOW.find((o) => o.producent === producent)
}

/** Zapis lat jako zakresy: [2014, 2016, 2017, 2018] → „2014, 2016–2018”. */
export function lataJakoZakresy(lata: readonly number[]): string {
  const posortowane = [...lata].sort((a, b) => a - b)
  const grupy: string[] = []
  for (let i = 0; i < posortowane.length; ) {
    let j = i
    while (j + 1 < posortowane.length && posortowane[j + 1] === posortowane[j]! + 1) j++
    grupy.push(j - i >= 1 ? `${posortowane[i]}–${posortowane[j]}` : String(posortowane[i]))
    i = j + 1
  }
  return grupy.join(", ")
}
