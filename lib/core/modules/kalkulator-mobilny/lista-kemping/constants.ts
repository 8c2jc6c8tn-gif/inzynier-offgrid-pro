import type { ListaKempingInput } from "./input"

export type KategoriaPozycji = "konieczne" | "opcjonalne"

export type PozycjaKempingu = {
  id: string
  kategoria: KategoriaPozycji
  /** Czy pozycja dotyczy tego wyjazdu. */
  dotyczy: (p: ListaKempingInput) => boolean
  /** Ilość wynikająca z parametrów (sztuki); brak = bez ilości. */
  ilosc?: (p: ListaKempingInput) => number
  /** Kalkulator, w którym dobierzesz wielkość tej pozycji. */
  link?: string
}

/** IDs Biblia §12.35 calls the basis of safety: "Nie zapomnij o gaśnicy i mierniku". */
export const ID_GASNICA = "gasnica"
export const ID_MIERNIK = "miernik"

const zawsze = () => true

/**
 * Pozycje z Biblii §12.35 (akumulator, panel, regulator, przetwornica, kable, bezpieczniki, miernik, ładowarki;
 * bezpieczeństwo: gaśnica, taśma izolacyjna, miernik) i §12.16 (zestaw kempingowy: panel składany, regulator,
 * akumulator, przetwornica), podział "must have" / "opcjonalne" ze źródła. Wielkości (Ah, W) nie są zgadywane —
 * każda pozycja wymagająca doboru odsyła do kalkulatora. Ilości tylko z liczby osób/telefonów (1 na osobę /
 * 1 na telefon) — reguła listy ✅🤖, nie współczynnik obliczeniowy. Sezon: zima → osłona termiczna akumulatora
 * (ładowanie LiFePO4 w mrozie — M4/E12), lato → osłona przed słońcem (przegrzanie, Biblia §12.33).
 */
export const POZYCJE_KEMPINGU: PozycjaKempingu[] = [
  { id: "akumulator", kategoria: "konieczne", dotyczy: zawsze, link: "/kalkulatory/weekend" },
  { id: "panel", kategoria: "konieczne", dotyczy: (p) => p.maPanel, link: "/kalkulatory/panel-dla-urzadzenia" },
  { id: "regulator", kategoria: "konieczne", dotyczy: (p) => p.maPanel, link: "/kalkulatory/dobor-regulatora-pwm-mppt" },
  { id: "przetwornica", kategoria: "konieczne", dotyczy: (p) => p.maUrzadzenia230, link: "/kalkulatory/przetwornice" },
  { id: "kable", kategoria: "konieczne", dotyczy: zawsze, link: "/kalkulatory/kable-bezpieczniki-male" },
  { id: "bezpieczniki-zapasowe", kategoria: "konieczne", dotyczy: zawsze },
  { id: "ladowarki-usb", kategoria: "konieczne", dotyczy: (p) => p.telefony > 0, ilosc: (p) => p.telefony, link: "/kalkulatory/przetwornice" },
  { id: "lodowka", kategoria: "konieczne", dotyczy: (p) => p.maLodowke, link: "/kalkulatory/zuzycie-per-urzadzenie" },
  { id: ID_MIERNIK, kategoria: "konieczne", dotyczy: zawsze },
  { id: ID_GASNICA, kategoria: "konieczne", dotyczy: zawsze },
  { id: "tasma-izolacyjna", kategoria: "konieczne", dotyczy: zawsze },
  { id: "oslona-zima", kategoria: "konieczne", dotyczy: (p) => p.sezon === "zima", link: "/kalkulatory/cold-c-rate" },
  { id: "oslona-lato", kategoria: "opcjonalne", dotyczy: (p) => p.sezon === "lato" },
  { id: "oswietlenie-led", kategoria: "opcjonalne", dotyczy: (p) => p.maOswietlenie },
  { id: "latarki-czolowe", kategoria: "opcjonalne", dotyczy: zawsze, ilosc: (p) => p.osoby },
  { id: "rozgaleziacz-12v", kategoria: "opcjonalne", dotyczy: zawsze, link: "/kalkulatory/gniazdo-zapalniczki" },
  { id: "ladowanie-z-auta", kategoria: "opcjonalne", dotyczy: zawsze, link: "/kalkulatory/alternator-vs-panele" },
  { id: "powerbank", kategoria: "opcjonalne", dotyczy: zawsze, link: "/kalkulatory/powerbank-vs-akumulator" },
  { id: "radio", kategoria: "opcjonalne", dotyczy: (p) => p.maRadio },
]
