/**
 * Katalog paneli PV Porównywarki (D81, spec sekcja 0 pkt 3 i 20.2). Dane WYŁĄCZNIE z kart katalogowych dostarczonych
 * przez właściciela, każdy wpis ze wskazaniem źródła; brak karty = brak wpisu. Parametr, którego karta nie podaje,
 * to `null` — nie „typowa” wartość technologii. Ceny nie ma w katalogu: to pole wymagane od użytkownika (U6).
 * Katalog korzysta z kart z `docs/zrodla/karta-katalogowa-*`; kolejne dochodzą z PDF-ów od właściciela.
 */
import type { DanePanelu } from "@/lib/core/modules/pv/porownywarka-paneli/input"

export type PozycjaKatalogu = Omit<DanePanelu, "cenaBruttoZl"> & {
  /** Plik źródłowy w repo (karta albo jej transkrypcja). */
  zrodlo: string
  /** Strony karty jako obrazy serwowane przez aplikację (`public/zrodla/paneli/`) — użytkownik otwiera je z ekranu jako potwierdzenie danych. */
  kartaObrazy: readonly string[]
}

const JA_SOLAR_KARTA = "docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/00-INDEKS.md"

/**
 * JA Solar JAM60D41 LB „Deep Blue 4.0” (seria 485–510 W). Karta: γ(Pmax) −0,290 %/°C, NOCT 45±2 °C, wspólne dla serii;
 * tolerancja mocy 0~+3%; moduł dwustronny. Karta NIE podaje sprawności przy 200 W/m² ani degradacji → `null`.
 */
function jaSolar(pmaxW: number): PozycjaKatalogu {
  return {
    id: `ja-solar-jam60d41-lb-${pmaxW}`,
    nazwa: `JA Solar JAM60D41-${pmaxW}/LB`,
    pmaxW,
    gammaPctNaC: -0.29,
    noctC: 45,
    sprawnoscWzglednaPrzy200WPct: null,
    degradacjaPierwszyRokPct: null,
    degradacjaLiniowaPctNaRok: null,
    bifacjalny: true,
    zrodlo: JA_SOLAR_KARTA,
    kartaObrazy: ["/zrodla/paneli/ja-solar-jam60d41-lb.webp"],
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
    pmaxW,
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

export const KATALOG_PANELI_PV: readonly PozycjaKatalogu[] = [
  ...[485, 490, 495, 500, 505, 510].map(jaSolar),
  ...[570, 575, 580, 585, 590, 595].map(astronergyN5),
]

export function znajdzPanelKatalogu(id: string): PozycjaKatalogu | undefined {
  return KATALOG_PANELI_PV.find((p) => p.id === id)
}
