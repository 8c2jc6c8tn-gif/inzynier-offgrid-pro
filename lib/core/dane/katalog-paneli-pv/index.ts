/**
 * Katalog paneli PV Porównywarki (D81, spec sekcja 0 pkt 3 i 20.2). Dane WYŁĄCZNIE z kart katalogowych dostarczonych
 * przez właściciela, każdy wpis ze wskazaniem źródła; brak karty = brak wpisu. Parametr, którego karta nie podaje,
 * to `null` — nie „typowa” wartość technologii. Ceny nie ma w katalogu: to pole wymagane od użytkownika (U6).
 * Katalog korzysta z kart z `docs/zrodla/karta-katalogowa-*`; kolejne dochodzą z PDF-ów od właściciela.
 */
import type { DanePanelu } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { elektrykaPanelu } from "./elektryka"
import { obciazenieWpisu } from "./obciazenia"

export type PozycjaKatalogu = Omit<DanePanelu, "cenaBruttoZl"> & {
  /** Producent i seria/model do wyboru kaskadowego na ekranie (producent → seria → moc). */
  producent: string
  seria: string
  /** Rynek/edycja karty, gdy ten wpis pochodzi z karty innego rynku niż pozostałe moce serii (np. „CN”, „EN/CEC”); pokazywany przy mocy. */
  rynek?: string
  /** Plik źródłowy w repo (karta albo jej transkrypcja). */
  zrodlo: string
  /** Strony karty jako obrazy serwowane przez aplikację (`public/zrodla/paneli/`) — użytkownik otwiera je z ekranu jako potwierdzenie danych. */
  kartaObrazy: readonly string[]
  /** Karta bez obrazów w repo (odczyt ze strony producenta): adres, pod którym użytkownik sam ją otworzy. */
  zrodloUrl?: string
  /** Ten wpis to odpowiednik (klon, inna edycja/rynek) panelu z katalogu: jego dane pochodzą z innej edycji karty. */
  odpowiednik?: { seria: string; edycja: string }
  /** NOCT wpisany z karty odpowiednika (decyzja właściciela 09.10.2026), bo karta tego wpisu go nie podaje. */
  noctZOdpowiednika?: { seria: string; edycja: string }
}

const JA_SOLAR_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/00-INDEKS.md"

/**
 * JA Solar JAM60D41 LB „Deep Blue 4.0” (seria 485–510 W). Karta: γ(Pmax) −0,290 %/°C, NOCT 45±2 °C, wspólne dla serii;
 * tolerancja mocy 0~+3%; moduł dwustronny. Okładka (wersja polska, uzupełnienie 08.10.2026): degradacja 1% w pierwszym roku i 0,4%/rok
 * (gwarancja liniowa 30 lat, górna granica). Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function jaSolar(pmaxW: number): PozycjaKatalogu {
  return {
    id: `ja-solar-jam60d41-lb-${pmaxW}`,
    nazwa: `JA Solar JAM60D41-${pmaxW}/LB`,
    producent: "JA Solar",
    seria: "JAM60D41 LB",
    pmaxW,
    dlugoscMm: 1953,
    szerokoscMm: 1134,
    masaKg: 27.3,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JA_SOLAR_KARTA,
    kartaObrazy: ["/zrodla/paneli/ja-solar-jam60d41-lb.webp", "/zrodla/paneli/ja-solar-jam60d41-lb-2.webp"],
  }
}

const ASTRONERGY_KARTA = "docs/zrodla/karta-katalogowa-Astronergy-N5-CHSM72N-DG-F-BH/00-INDEKS.md"

/**
 * Astronergy ASTRO N5 CHSM72N(DG)/F-BH (seria dwustronna 570–595 W). Karta: γ(Pmpp) −0,29%/°C, NMOT 41±2 °C (warunki 800 W/m², 20 °C, 1 m/s
 * — jak definicja NOCT, więc wpisane jako `noctC`), degradacja ≤1,0% w pierwszym roku i ≤0,4%/rok w latach 2–30 (gwarancja liniowa 30 lat,
 * górna granica), moduł dwustronny. Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function astronergyN5(pmaxW: number): PozycjaKatalogu {
  return {
    id: `astronergy-n5-chsm72n-${pmaxW}`,
    nazwa: `Astronergy ASTRO N5 CHSM72N(DG)/F-BH ${pmaxW} W`,
    producent: "Astronergy",
    seria: "ASTRO N5 CHSM72N(DG)/F-BH",
    pmaxW,
    dlugoscMm: 2278,
    szerokoscMm: 1134,
    masaKg: 32.1,
    gammaPctNaC: -0.29,
    noctC: 41,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: ASTRONERGY_KARTA,
    kartaObrazy: ["/zrodla/paneli/astronergy-n5-chsm72n-1.webp", "/zrodla/paneli/astronergy-n5-chsm72n-2.webp"],
  }
}

const JA_SOLAR_54_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM54D41-LB/00-INDEKS.md"

/**
 * JA Solar JAM54D41 LB „Deep Blue 4.0 Pro” (seria 440–465 W, 108 ogniw half-cut). Karta: γ(Pmax) −0,290 %/°C, NOCT 45±2 °C, wspólne dla serii;
 * degradacja ≤1% w pierwszym roku i ≤0,4%/rok (gwarancja liniowa 30 lat, górna granica); moduł dwustronny (80±10%).
 * Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function jaSolar54(pmaxW: number): PozycjaKatalogu {
  return {
    id: `ja-solar-jam54d41-lb-${pmaxW}`,
    nazwa: `JA Solar JAM54D41-${pmaxW}/LB`,
    producent: "JA Solar",
    seria: "JAM54D41 LB",
    pmaxW,
    dlugoscMm: 1762,
    szerokoscMm: 1134,
    masaKg: 22,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JA_SOLAR_54_KARTA,
    kartaObrazy: ["/zrodla/paneli/ja-solar-jam54d41-lb-1.webp", "/zrodla/paneli/ja-solar-jam54d41-lb-2.webp"],
  }
}

const HYUNDAI_KARTA = "docs/zrodla/karta-katalogowa-Hyundai-HiT-H5xxCF-BF-ZB/00-INDEKS.md"

/**
 * HD Hyundai HeteroMax HiT-H5xxCF-BF(ZB) (seria dwustronna 500–520 W, HJT, 108 ogniw half-cut). Karta: γ(Pmax) −0,24 %/°C, NMOT 44±2 °C
 * (karta nie drukuje warunków; definicja IEC 61215 = 800 W/m², 20 °C, 1 m/s, jak NOCT — wpisane jako `noctC`), degradacja 1% w pierwszym roku
 * i 0,3 p.p./rok po nim (gwarancja mocy 30 lat → 90,3%). Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function hyundaiHit(pmaxW: number): PozycjaKatalogu {
  return {
    id: `hyundai-hit-h5xxcf-bf-zb-${pmaxW}`,
    nazwa: `HD Hyundai HiT-H${pmaxW}CF-BF(ZB)`,
    producent: "HD Hyundai",
    seria: "HiT-H5xxCF-BF(ZB)",
    pmaxW,
    dlugoscMm: 1961,
    szerokoscMm: 1134,
    masaKg: 27.6,
    gammaPctNaC: -0.24,
    noctC: 44,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.3,
    bifacjalny: true,
    zrodlo: HYUNDAI_KARTA,
    kartaObrazy: ["/zrodla/paneli/hyundai-hit-h5xxcf-bf-zb-1.webp", "/zrodla/paneli/hyundai-hit-h5xxcf-bf-zb-2.webp"],
  }
}

const JA_SOLAR_54D40_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM54D40-LR/00-INDEKS.md"

/** Moc przy 200 W/m², 25 °C z karty JAM54D40 LR [W] (pełne waty, kolumna „200 W/m²”), klucz = Pmax w STC. */
const JA_54D40_MOC_200: Readonly<Record<number, number>> = { 450: 87, 455: 88, 460: 89, 465: 90, 470: 91, 475: 92 }

/**
 * JA Solar JAM54D40 LR „Deep Blue 4.0 Pro” (seria JEDNOSTRONNA 450–475 W, 108 ogniw half-cut). Karta: γ(Pmax) −0,290 %/°C, NOCT 45±2 °C
 * (800 W/m², 20 °C, 1 m/s), degradacja ≤1% w pierwszym roku i ≤0,4%/rok (gwarancja liniowa 30 lat, górna granica). Karta podaje moc przy
 * 200 W/m² i 25 °C → sprawność względna = P200 / (0,2 · Pmax_STC), zaokrąglona do 0,1 (moc w pełnych watach: ±0,5 p.p.).
 */
function jaSolar54d40(pmaxW: number): PozycjaKatalogu {
  const p200 = JA_54D40_MOC_200[pmaxW]!
  return {
    id: `ja-solar-jam54d40-lr-${pmaxW}`,
    nazwa: `JA Solar JAM54D40-${pmaxW}/LR`,
    producent: "JA Solar",
    seria: "JAM54D40 LR",
    pmaxW,
    dlugoscMm: 1762,
    szerokoscMm: 1134,
    masaKg: 22,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: Math.round((p200 / (0.2 * pmaxW)) * 1000) / 10,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: false,
    zrodlo: JA_SOLAR_54D40_KARTA,
    kartaObrazy: ["/zrodla/paneli/ja-solar-jam54d40-lr-1.webp", "/zrodla/paneli/ja-solar-jam54d40-lr-2.webp"],
  }
}

const JA_SOLAR_60D40_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM60D40-LB/00-INDEKS.md"

/**
 * JA Solar JAM60D40 LB „Deep Blue 4.0” (seria dwustronna 485–510 W; te same liczby co JAM60D41 LB; karta w wersji polskiej i angielskiej „Black Frame”). Karta: γ(Pmax) −0,290 %/°C,
 * NOCT 45±2 °C, degradacja ≤1% w pierwszym roku i ≤0,4%/rok (gwarancja liniowa 30 lat, górna granica), bifacjalność 80±5%.
 * Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function jaSolar60d40(pmaxW: number): PozycjaKatalogu {
  return {
    id: `ja-solar-jam60d40-lb-${pmaxW}`,
    nazwa: `JA Solar JAM60D40-${pmaxW}/LB`,
    producent: "JA Solar",
    seria: "JAM60D40 LB",
    pmaxW,
    dlugoscMm: 1953,
    szerokoscMm: 1134,
    masaKg: 27.3,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JA_SOLAR_60D40_KARTA,
    kartaObrazy: [
      "/zrodla/paneli/ja-solar-jam60d40-lb-1.webp",
      "/zrodla/paneli/ja-solar-jam60d40-lb-2.webp",
      "/zrodla/paneli/ja-solar-jam60d40-lb-3.webp",
      "/zrodla/paneli/ja-solar-jam60d40-lb-4.webp",
    ],
  }
}

const JA_SOLAR_66D46_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM66D46-LB/00-INDEKS.md"
const JA_SOLAR_66D46_NOWSZA_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM66D46-LB-695-720/00-INDEKS.md"

/**
 * JA Solar JAM66D46 LB „Deep Blue 4.0 Pro” (seria dwustronna 690–720 W: karta 690–715 W oraz nowsza 695–720 W, 132 ogniwa half-cut, 2384×1303 mm). Karta: γ(Pmax) −0,290 %/°C,
 * NOCT 45±2 °C, degradacja ≤1% w pierwszym roku i ≤0,4%/rok (gwarancja liniowa 30 lat, górna granica; gwarancja produktowa 12 lat),
 * bifacjalność 80±10%. Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function jaSolar66d46(pmaxW: number): PozycjaKatalogu {
  return {
    id: `ja-solar-jam66d46-lb-${pmaxW}`,
    nazwa: `JA Solar JAM66D46-${pmaxW}/LB`,
    producent: "JA Solar",
    seria: "JAM66D46 LB",
    pmaxW,
    dlugoscMm: 2384,
    szerokoscMm: 1303,
    masaKg: 38.2,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: pmaxW === 720 ? JA_SOLAR_66D46_NOWSZA_KARTA : JA_SOLAR_66D46_KARTA,
    // 690 W: tylko starsza karta; 720 W: tylko nowsza; 695–715 W są na obu (te same liczby)
    kartaObrazy: [
      ...(pmaxW === 720 ? [] : ["/zrodla/paneli/ja-solar-jam66d46-lb-1.webp", "/zrodla/paneli/ja-solar-jam66d46-lb-2.webp"]),
      ...(pmaxW === 690 ? [] : ["/zrodla/paneli/ja-solar-jam66d46-lb-695-720-1.webp", "/zrodla/paneli/ja-solar-jam66d46-lb-695-720-2.webp"]),
    ],
  }
}

const JA_SOLAR_72D40_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM72D40-MB/00-INDEKS.md"

/**
 * JA Solar JAM72D40 MB „Deep Blue 4.0 Pro” (seria dwustronna 580–605 W, 144 ogniwa half-cut, 2278×1134 mm). Karta: γ(Pmax) −0,290 %/°C,
 * NOCT 45±2 °C, degradacja ≤1% w pierwszym roku i ≤0,4%/rok (gwarancja liniowa 30 lat, górna granica; gwarancja produktowa 12 lat),
 * bifacjalność 80±5%. Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function jaSolar72d40(pmaxW: number): PozycjaKatalogu {
  return {
    id: `ja-solar-jam72d40-mb-${pmaxW}`,
    nazwa: `JA Solar JAM72D40-${pmaxW}/MB`,
    producent: "JA Solar",
    seria: "JAM72D40 MB",
    pmaxW,
    dlugoscMm: 2278,
    szerokoscMm: 1134,
    masaKg: 31.8,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JA_SOLAR_72D40_KARTA,
    kartaObrazy: ["/zrodla/paneli/ja-solar-jam72d40-mb-1.webp", "/zrodla/paneli/ja-solar-jam72d40-mb-2.webp"],
  }
}

const JINKO_KARTA = "docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-48HL4M-BDV/00-INDEKS.md"

/**
 * Jinko Tiger Neo 48HL4M-BDV (seria dwustronna 445–470 W, 96 ogniw half-cut). Karta: γ(Pmax) −0,29 %/°C, degradacja ≤1% w pierwszym roku
 * i ≤0,40%/rok (gwarancja liniowa 30 lat, górna granica; gwarancja produktowa 15 lat). Karta NIE podaje NOCT/NMOT ani sprawności przy 200 W/m²
 * → `null` (brak wartości typowej).
 */
function jinkoTigerNeo(pmaxW: number): PozycjaKatalogu {
  return {
    id: `jinko-tiger-neo-48hl4m-bdv-${pmaxW}`,
    nazwa: `Jinko Tiger Neo 48HL4M-BDV ${pmaxW} W`,
    producent: "Jinko",
    seria: "Tiger Neo 48HL4M-BDV",
    pmaxW,
    dlugoscMm: 1762,
    szerokoscMm: 1134,
    masaKg: 24.0,
    gammaPctNaC: -0.29,
    noctC: null,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JINKO_KARTA,
    kartaObrazy: ["/zrodla/paneli/jinko-tiger-neo-48hl4m-bdv-1.webp", "/zrodla/paneli/jinko-tiger-neo-48hl4m-bdv-2.webp"],
  }
}

const JINKO_66_ODPOWIEDNIK = { seria: "Jinko Tiger Neo 66HL4M-BDV 590–610 W", edycja: "JKM590-610N-66HL4M-BDV-F1-EN (CEC)" } as const
const JINKO_72_ODPOWIEDNIK = { seria: "Jinko Tiger Neo 72HL4-BDV 550–570 W", edycja: "JKM550-570N-72HL4-BDV-F1-CN (karta na rynek chiński)" } as const

const JINKO_66_KARTA = "docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-66HL4M-BDV/00-INDEKS.md"

/**
 * Jinko Tiger Neo 66HL4M-BDV (seria dwustronna 605–630 W, 132 ogniwa half-cut, 2382×1134 mm). Karta: γ(Pmax) −0,29 %/°C, degradacja ≤1%
 * w pierwszym roku i ≤0,40%/rok (gwarancja liniowa 30 lat, górna granica; gwarancja produktowa 12 lat). Karta NIE podaje sprawności przy
 * 200 W/m² → `null`. Karta NIE podaje też NOCT; **NOCT 45 °C jest z odpowiednika 590–610 W (karta EN/CEC: „45±2”)** — decyzja właściciela
 * 09.10.2026, oznaczona w `noctZOdpowiednika`.
 */
function jinkoTigerNeo66(pmaxW: number): PozycjaKatalogu {
  return {
    id: `jinko-tiger-neo-66hl4m-bdv-${pmaxW}`,
    nazwa: `Jinko Tiger Neo 66HL4M-BDV ${pmaxW} W`,
    producent: "Jinko",
    seria: "Tiger Neo 66HL4M-BDV",
    pmaxW,
    dlugoscMm: 2382,
    szerokoscMm: 1134,
    masaKg: 32.4,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JINKO_66_KARTA,
    kartaObrazy: ["/zrodla/paneli/jinko-tiger-neo-66hl4m-bdv-1.webp", "/zrodla/paneli/jinko-tiger-neo-66hl4m-bdv-2.webp"],
    noctZOdpowiednika: JINKO_66_ODPOWIEDNIK,
  }
}

const JINKO_66_590_KARTA = "docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-66HL4M-BDV-590-610/00-INDEKS.md"

/**
 * Jinko Tiger Neo 66HL4M-BDV, edycja 590–610 W (JKM590-610N-66HL4M-BDV-F1-EN, CEC, 29.11.2023) — ODPOWIEDNIK serii 605–630 W (ten sam
 * moduł 2382×1134 mm, 132 ogniwa, 32,4 kg, γ −0,29). Dodane są tylko moce, których nie ma w serii 605–630 W (590, 595, 600 W; 605 i 610 W
 * już są — bez dubli). Karta: γ(Pmax) −0,29 %/°C, NOCT 45±2 °C, dwustronny. Gwarancje i degradacja na karcie bez czytelnych etykiet
 * (12 / 30 / 0,40%, pierwszy rok niepodany) → degradacja `null`, nie z innej karty. Brak sprawności przy 200 W/m² → `null`.
 */
function jinkoTigerNeo66Edycja590(pmaxW: number): PozycjaKatalogu {
  return {
    id: `jinko-tiger-neo-66hl4m-bdv-${pmaxW}`,
    nazwa: `Jinko Tiger Neo 66HL4M-BDV ${pmaxW} W`,
    producent: "Jinko",
    seria: "Tiger Neo 66HL4M-BDV",
    rynek: "EN/CEC",
    pmaxW,
    dlugoscMm: 2382,
    szerokoscMm: 1134,
    masaKg: 32.4,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: null,
    degradacjaLiniowaPctNaRok: null,
    bifacjalny: true,
    zrodlo: JINKO_66_590_KARTA,
    kartaObrazy: [],
    zrodloUrl: "https://www.solarproof.com.au/datasheets/panel_datasheet_Datasheet-JKM590-610N-66HL4M-BDV-29.11.23.pdf",
    odpowiednik: { seria: "Jinko Tiger Neo 66HL4M-BDV 605–630 W", edycja: JINKO_66_ODPOWIEDNIK.edycja },
  }
}

const JINKO_72_KARTA = "docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-72HL4-BDV/00-INDEKS.md"

/**
 * Jinko Tiger Neo 72HL4-BDV (seria dwustronna 575–600 W, 144 ogniwa half-cut, 2278×1134 mm). Karta: γ(Pmax) −0,29 %/°C, degradacja ≤1%
 * w pierwszym roku i ≤0,40%/rok (gwarancja liniowa 30 lat, górna granica; gwarancja produktowa 12 lat). Karta NIE podaje sprawności przy
 * 200 W/m² → `null`. Karta NIE podaje też NOCT; **NOCT 45 °C jest z odpowiednika 550–570 W (karta CN: „45±2”)** — decyzja właściciela
 * 09.10.2026, oznaczona w `noctZOdpowiednika`.
 */
function jinkoTigerNeo72(pmaxW: number): PozycjaKatalogu {
  return {
    id: `jinko-tiger-neo-72hl4-bdv-${pmaxW}`,
    nazwa: `Jinko Tiger Neo 72HL4-BDV ${pmaxW} W`,
    producent: "Jinko",
    seria: "Tiger Neo 72HL4-BDV",
    pmaxW,
    dlugoscMm: 2278,
    szerokoscMm: 1134,
    masaKg: 31.0,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JINKO_72_KARTA,
    kartaObrazy: ["/zrodla/paneli/jinko-tiger-neo-72hl4-bdv-1.webp", "/zrodla/paneli/jinko-tiger-neo-72hl4-bdv-2.webp"],
    noctZOdpowiednika: JINKO_72_ODPOWIEDNIK,
  }
}

const JINKO_72_CN_KARTA = "docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-72HL4-BDV-550-570-CN/00-INDEKS.md"

/**
 * Jinko Tiger Neo 72HL4-BDV, edycja 550–570 W (JKM550-570N-72HL4-BDV-F1-CN, karta na rynek chiński) — ODPOWIEDNIK serii 575–600 W (ten sam
 * format 2278×1134 mm, 144 ogniwa half-cut; masa na tej karcie 32,0 kg, a nie 31,0 kg). Moce 550–570 W nie nakładają się na 575–600 W (bez
 * dubli). Karta: γ(Pmax) **−0,30 %/°C** (seria 575–600 W ma −0,29), NOCT 45±2 °C (800 W/m², 20 °C, 1 m/s), dwustronny, dual glass.
 * Degradacja w pierwszym roku na karcie nieczytelna → degradacja `null`. Brak sprawności przy 200 W/m² → `null`.
 */
function jinkoTigerNeo72Cn(pmaxW: number): PozycjaKatalogu {
  return {
    id: `jinko-tiger-neo-72hl4-bdv-${pmaxW}`,
    nazwa: `Jinko Tiger Neo 72HL4-BDV ${pmaxW} W (karta CN)`,
    producent: "Jinko",
    seria: "Tiger Neo 72HL4-BDV",
    rynek: "CN",
    pmaxW,
    dlugoscMm: 2278,
    szerokoscMm: 1134,
    masaKg: 32.0,
    gammaPctNaC: -0.3,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: null,
    degradacjaLiniowaPctNaRok: null,
    bifacjalny: true,
    zrodlo: JINKO_72_CN_KARTA,
    kartaObrazy: [],
    zrodloUrl: "https://www.jinkosolar.com/uploads/JKM550-570N-72HL4-BDV-F1-CN.pdf",
    odpowiednik: { seria: "Jinko Tiger Neo 72HL4-BDV 575–600 W", edycja: JINKO_72_ODPOWIEDNIK.edycja },
  }
}

const LONGI_KARTA = "docs/zrodla/karta-katalogowa-LONGi-Hi-MO-X10-LR7-54HVH/00-INDEKS.md"

/**
 * LONGi Hi-MO X10 Explorer LR7-54HVH (seria JEDNOSTRONNA BC, 475–490 W, 108 ogniw, 1800×1134 mm). Karta: γ(Pmax) −0,260 %/°C, NOCT 45±2 °C
 * (800 W/m², 20 °C, 1 m/s), degradacja <1% w pierwszym roku (granica górna 1,0%; spójne z 88,85% po 30 latach) i 0,35%/rok w latach 2–30.
 * Karta NIE podaje sprawności przy 200 W/m² → `null`. Stopka karty ma oznaczenie „Draft”.
 */
function longiHimoX10(pmaxW: number): PozycjaKatalogu {
  return {
    id: `longi-himo-x10-lr7-54hvh-${pmaxW}`,
    nazwa: `LONGi Hi-MO X10 LR7-54HVH-${pmaxW}M`,
    producent: "LONGi",
    seria: "Hi-MO X10 LR7-54HVH",
    pmaxW,
    dlugoscMm: 1800,
    szerokoscMm: 1134,
    masaKg: 21.6,
    gammaPctNaC: -0.26,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.35,
    bifacjalny: false,
    zrodlo: LONGI_KARTA,
    kartaObrazy: ["/zrodla/paneli/longi-himo-x10-lr7-54hvh-1.webp", "/zrodla/paneli/longi-himo-x10-lr7-54hvh-2.webp"],
  }
}

const LONGI_60_KARTA = "docs/zrodla/karta-katalogowa-LONGi-Hi-MO-X10-LR7-60HVH/00-INDEKS.md"

/**
 * LONGi Hi-MO X10 Scientist LR7-60HVH (seria JEDNOSTRONNA BC, 535–560 W, 120 ogniw, 1990×1134 mm). Karta: γ(Pmax) −0,260 %/°C, NOCT 45±2 °C
 * (800 W/m², 20 °C, 1 m/s), degradacja <1% w pierwszym roku (granica górna 1,0%; spójne z 88,85% po 30 latach) i 0,35%/rok w latach 2–30.
 * Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function longiHimoX10Scientist(pmaxW: number): PozycjaKatalogu {
  return {
    id: `longi-himo-x10-lr7-60hvh-${pmaxW}`,
    nazwa: `LONGi Hi-MO X10 LR7-60HVH-${pmaxW}M`,
    producent: "LONGi",
    seria: "Hi-MO X10 LR7-60HVH",
    pmaxW,
    dlugoscMm: 1990,
    szerokoscMm: 1134,
    masaKg: 25,
    gammaPctNaC: -0.26,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.35,
    bifacjalny: false,
    zrodlo: LONGI_60_KARTA,
    kartaObrazy: ["/zrodla/paneli/longi-himo-x10-lr7-60hvh-1.webp", "/zrodla/paneli/longi-himo-x10-lr7-60hvh-2.webp"],
  }
}

const TRINA_KARTA = "docs/zrodla/karta-katalogowa-Trina-Vertex-S-plus-TSM-NEG9R-28/00-INDEKS.md"
const TRINA_NOWSZA_KARTA = "docs/zrodla/karta-katalogowa-Trina-Vertex-S-plus-TSM-NEG9R-28-450-475/00-INDEKS.md"

/**
 * Trina Solar Vertex S+ TSM-NEG9R.28 (podwójne szkło, n-type i-TOPCon, 430–475 W: karta 430–460 W i nowsza 450–475 W, 144 ogniwa, 1762×1134 mm). Karta: γ(Pmax) −0,29 %/°C,
 * NOCT 43 (±2) °C (800 W/m², 20 °C, 1 m/s), degradacja ≤1% w pierwszym roku i ≤0,4%/rok (87,4% po 30 latach; gwarancja produktowa 25 lat).
 * Karta nie podaje bifacjalności (brak współczynnika i tabeli zysku od tyłu) → `bifacjalny: false` (wyłącznie flaga ostrzeżenia, nie wpływa na uzysk)
 * oraz sprawności przy 200 W/m² → `null`.
 */
function trinaVertexSPlus(pmaxW: number): PozycjaKatalogu {
  return {
    id: `trina-vertex-s-plus-neg9r28-${pmaxW}`,
    nazwa: `Trina Vertex S+ TSM-${pmaxW}-NEG9R.28`,
    producent: "Trina",
    seria: "Vertex S+ TSM-NEG9R.28",
    pmaxW,
    dlugoscMm: 1762,
    szerokoscMm: 1134,
    masaKg: 21.0,
    gammaPctNaC: -0.29,
    noctC: 43,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: false,
    zrodlo: pmaxW >= 465 ? TRINA_NOWSZA_KARTA : TRINA_KARTA,
    // 430–445 W: tylko starsza karta (2024_C); 465–475 W: tylko nowsza (2026_A); 450–460 W są na obu (te same liczby)
    kartaObrazy: [
      ...(pmaxW >= 465 ? [] : ["/zrodla/paneli/trina-vertex-s-plus-neg9r28-1.webp", "/zrodla/paneli/trina-vertex-s-plus-neg9r28-2.webp"]),
      ...(pmaxW <= 445 ? [] : ["/zrodla/paneli/trina-vertex-s-plus-neg9r28-450-475-1.webp", "/zrodla/paneli/trina-vertex-s-plus-neg9r28-450-475-2.webp"]),
    ],
  }
}

const JA_SOLAR_54D40_LB_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM54D40-LB/00-INDEKS.md"

/**
 * JA Solar JAM54D40 LB „Deep Blue 4.0 Pro” (seria DWUSTRONNA 435–460 W, 108 ogniw half-cut; inny model niż jednostronny JAM54D40 LR). Karta:
 * γ(Pmax) −0,290 %/°C, NOCT 45±2 °C, degradacja ≤1% w pierwszym roku i ≤0,4%/rok (gwarancja liniowa 30 lat, górna granica), bifacjalność 80±5%.
 * Karta NIE podaje sprawności przy 200 W/m² → `null`.
 */
function jaSolar54d40Lb(pmaxW: number): PozycjaKatalogu {
  return {
    id: `ja-solar-jam54d40-lb-${pmaxW}`,
    nazwa: `JA Solar JAM54D40-${pmaxW}/LB`,
    producent: "JA Solar",
    seria: "JAM54D40 LB",
    pmaxW,
    dlugoscMm: 1762,
    szerokoscMm: 1134,
    masaKg: 22,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: 1.0,
    degradacjaLiniowaPctNaRok: 0.4,
    bifacjalny: true,
    zrodlo: JA_SOLAR_54D40_LB_KARTA,
    kartaObrazy: ["/zrodla/paneli/ja-solar-jam54d40-lb-1.webp", "/zrodla/paneli/ja-solar-jam54d40-lb-2.webp"],
  }
}

const KATALOG_BEZ_ELEKTRYKI: readonly PozycjaKatalogu[] = [
  ...[485, 490, 495, 500, 505, 510].map(jaSolar),
  ...[485, 490, 495, 500, 505, 510].map(jaSolar60d40),
  ...[570, 575, 580, 585, 590, 595].map(astronergyN5),
  ...[440, 445, 450, 455, 460, 465].map(jaSolar54),
  ...[450, 455, 460, 465, 470, 475].map(jaSolar54d40),
  ...[435, 440, 445, 450, 455, 460].map(jaSolar54d40Lb),
  ...[690, 695, 700, 705, 710, 715, 720].map(jaSolar66d46),
  ...[580, 585, 590, 595, 600, 605].map(jaSolar72d40),
  ...[445, 450, 455, 460, 465, 470].map(jinkoTigerNeo),
  ...[590, 595, 600].map(jinkoTigerNeo66Edycja590),
  ...[605, 610, 615, 620, 625, 630].map(jinkoTigerNeo66),
  ...[550, 555, 560, 565, 570].map(jinkoTigerNeo72Cn),
  ...[575, 580, 585, 590, 595, 600].map(jinkoTigerNeo72),
  ...[475, 480, 485, 490].map(longiHimoX10),
  ...[535, 540, 545, 550, 555, 560].map(longiHimoX10Scientist),
  ...[430, 435, 440, 445, 450, 455, 460, 465, 470, 475].map(trinaVertexSPlus),
  ...[500, 505, 510, 515, 520].map(hyundaiHit),
]

/** Katalog z danymi elektrycznymi z tabel STC kart (A3) i obciążeniem mechanicznym z kart (spec 32) dołączonymi po identyfikatorze wpisu. */
export const KATALOG_PANELI_PV: readonly PozycjaKatalogu[] = KATALOG_BEZ_ELEKTRYKI.map((p) => ({ ...p, elektryka: elektrykaPanelu(p.id), obciazenie: obciazenieWpisu(p.id, p.odpowiednik !== undefined) }))

export function znajdzPanelKatalogu(id: string): PozycjaKatalogu | undefined {
  return KATALOG_PANELI_PV.find((p) => p.id === id)
}
