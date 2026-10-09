/**
 * Wybór panelu z katalogu „jak w wyszukiwarce samochodowej” (prośba właściciela 09.10.2026): producent → seria/model → moc.
 * Same funkcje czyste na danych katalogu; interfejs tylko je wywołuje. Kolejność producentów i serii to kolejność pierwszego wystąpienia
 * w katalogu, moce rosnąco.
 */
import { KATALOG_PANELI_PV, type PozycjaKatalogu } from "./index"

const unikalne = (xs: string[]) => [...new Set(xs)]

export const producenciKatalogu = (): string[] => unikalne(KATALOG_PANELI_PV.map((p) => p.producent))

export const serieProducenta = (producent: string): string[] => unikalne(KATALOG_PANELI_PV.filter((p) => p.producent === producent).map((p) => p.seria))

/** Wpisy serii od najmniejszej mocy; przy tej samej mocy w kilku edycjach rynkowych kolejność katalogu. */
export const mocSerii = (producent: string, seria: string): PozycjaKatalogu[] =>
  KATALOG_PANELI_PV.filter((p) => p.producent === producent && p.seria === seria).sort((a, b) => a.pmaxW - b.pmaxW)

/** Etykieta mocy w wyborze: „600 W”, a dla wpisu z karty innego rynku „560 W (CN)” — tak samo przy kilku wpisach o tej samej mocy. */
export function etykietaMocy(p: PozycjaKatalogu): string {
  return p.rynek ? `${p.pmaxW} W (${p.rynek})` : `${p.pmaxW} W`
}
