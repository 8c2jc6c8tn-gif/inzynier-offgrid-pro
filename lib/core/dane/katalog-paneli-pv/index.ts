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
  }
}

export const KATALOG_PANELI_PV: readonly PozycjaKatalogu[] = [485, 490, 495, 500, 505, 510].map(jaSolar)

export function znajdzPanelKatalogu(id: string): PozycjaKatalogu | undefined {
  return KATALOG_PANELI_PV.find((p) => p.id === id)
}
