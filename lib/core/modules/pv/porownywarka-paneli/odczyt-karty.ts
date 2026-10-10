/**
 * Porównywarka paneli PV (spec 33, Etap B): odczyt karty katalogowej albo naklejki ze zdjęcia/PDF. Tu jest tylko część domenowa —
 * kształt odczytu i kontrole spójności liczb; samo wywołanie modelu jest w `lib/ai/odczyt-karty/` (rdzeń nie zna AI, standard 9.1).
 *
 * Zasady (standard 9.4, 9.5): odczyt to dane do zatwierdzenia przez człowieka, nigdy wartości wpisane po cichu; kontrole spójności
 * ostrzegają, nie poprawiają liczb sami; pole nieczytelne albo nieobecne na karcie zostaje `null` (nic nie jest zgadywane ani liczone).
 */
import { ELEKTRYKA_ZGODNOSC_VMP_IMP_TOL } from "./constants"

/** Jak pewny jest odczyt pola, wg samego modelu (wysoka = cyfry wyraźne; niska = zamazane, małe albo niejednoznaczne). */
export type PewnoscOdczytu = "wysoka" | "srednia" | "niska"

/** Pole liczbowe odczytu. `wartosc === null` ⇔ `widoczne === false`. */
export type OdczytLiczby = { wartosc: number | null; widoczne: boolean; pewnosc: PewnoscOdczytu }

export type OdczytKarty = {
  /** Co model rozpoznał jako dokument (producent, seria, model), jak je przeczytał; `null` = nie rozpoznano. */
  rozpoznany: string | null
  /** Czy rozpoznany panel odpowiada temu, co użytkownik wpisał jako „o jaki panel chodzi”. */
  zgodnoscZPodpowiedzia: "tak" | "nie" | "nie-wiadomo"
  /** Z której kolumny tabeli (klasy mocy) odczytano liczby; `null`, gdy na dokumencie jest jedna moc. */
  kolumnaMocy: string | null
  nazwa: { wartosc: string | null; widoczne: boolean; pewnosc: PewnoscOdczytu }
  pmaxW: OdczytLiczby
  vocV: OdczytLiczby
  vmpV: OdczytLiczby
  iscA: OdczytLiczby
  impA: OdczytLiczby
  betaVocPctNaC: OdczytLiczby
  gammaPctNaC: OdczytLiczby
  noctC: OdczytLiczby
  maxNapieciaSystemuV: OdczytLiczby
  maxBezpiecznikSzeregowyA: OdczytLiczby
  dlugoscMm: OdczytLiczby
  szerokoscMm: OdczytLiczby
  masaKg: OdczytLiczby
  degradacjaPierwszyRokPct: OdczytLiczby
  degradacjaLiniowaPctNaRok: OdczytLiczby
  obciazeniePrzodPa: OdczytLiczby
  obciazenieTylPa: OdczytLiczby
  bifacjalny: { wartosc: boolean | null; widoczne: boolean; pewnosc: PewnoscOdczytu }
  /** Rodzaj liczby obciążenia z karty; `null`, gdy karta nie mówi, czy to testowe, czy obliczeniowe (wtedy ekran proponuje „testowe”). */
  obciazenieRodzaj: { wartosc: "testowe" | "obliczeniowe" | null; widoczne: boolean; pewnosc: PewnoscOdczytu }
  /** Krótkie uwagi modelu: czego nie dało się odczytać, o czym użytkownik powinien wiedzieć (bez ocen zgodności i bezpieczeństwa). */
  uwagi: string[]
}

/** Klucze pól odczytu, które mają wartość do zatwierdzenia (bez metadanych `rozpoznany`, `zgodnoscZPodpowiedzia`, `kolumnaMocy`, `uwagi`). */
export const POLA_ODCZYTU = [
  "nazwa",
  "pmaxW",
  "vocV",
  "vmpV",
  "iscA",
  "impA",
  "betaVocPctNaC",
  "gammaPctNaC",
  "noctC",
  "maxNapieciaSystemuV",
  "maxBezpiecznikSzeregowyA",
  "dlugoscMm",
  "szerokoscMm",
  "masaKg",
  "degradacjaPierwszyRokPct",
  "degradacjaLiniowaPctNaRok",
  "obciazeniePrzodPa",
  "obciazenieTylPa",
  "bifacjalny",
  "obciazenieRodzaj",
] as const
export type PoleOdczytu = (typeof POLA_ODCZYTU)[number]

/** Granice zdrowego rozsądku dla sprawności modułu [%] — wykrywają pomyłkę w cyfrze (np. rozmiar 1134 wpisany jako 11340), to nie norma ani wymóg. */
export const SPRAWNOSC_MODULU_ROZSADNA_PCT = { min: 10, max: 30 } as const

const WATY_NA_M2_STC = 1000
const MM2_NA_M2 = 1e6

export type KodSpojnosciOdczytu =
  | "ODCZYT-VMP-IMP-NIE-PASUJE"
  | "ODCZYT-VOC-NIE-WIEKSZE-OD-VMP"
  | "ODCZYT-ISC-NIE-WIEKSZE-OD-IMP"
  | "ODCZYT-SPRAWNOSC-NIEPRAWDOPODOBNA"
  | "ODCZYT-WSPOLCZYNNIK-DODATNI"

export type UwagaSpojnosci = {
  kod: KodSpojnosciOdczytu
  /** Pola, których dotyczy uwaga — wyróżniane w tabeli odczytu. */
  pola: PoleOdczytu[]
  params: Record<string, number>
}

const liczba = (o: OdczytLiczby): number | null => (o.widoczne && o.wartosc !== null && Number.isFinite(o.wartosc) ? o.wartosc : null)

/**
 * Kontrole spójności odczytu (spec 13): Vmp·Imp ≈ Pmax (ta sama tolerancja co w silniku), Voc > Vmp, Isc > Imp, sprawnością z wymiarów
 * i mocy w rozsądnych granicach, β i γ ujemne. Rozbieżność = uwaga do użytkownika, nie automatyczna poprawka.
 */
export function sprawdzSpojnoscOdczytu(o: OdczytKarty): UwagaSpojnosci[] {
  const uwagi: UwagaSpojnosci[] = []
  const pmax = liczba(o.pmaxW)
  const voc = liczba(o.vocV)
  const vmp = liczba(o.vmpV)
  const isc = liczba(o.iscA)
  const imp = liczba(o.impA)
  if (pmax !== null && pmax > 0 && vmp !== null && imp !== null && Math.abs((vmp * imp) / pmax - 1) > ELEKTRYKA_ZGODNOSC_VMP_IMP_TOL) {
    uwagi.push({ kod: "ODCZYT-VMP-IMP-NIE-PASUJE", pola: ["vmpV", "impA", "pmaxW"], params: { vmpImp: Math.round(vmp * imp), pmax } })
  }
  if (voc !== null && vmp !== null && !(voc > vmp)) uwagi.push({ kod: "ODCZYT-VOC-NIE-WIEKSZE-OD-VMP", pola: ["vocV", "vmpV"], params: { voc, vmp } })
  if (isc !== null && imp !== null && !(isc > imp)) uwagi.push({ kod: "ODCZYT-ISC-NIE-WIEKSZE-OD-IMP", pola: ["iscA", "impA"], params: { isc, imp } })
  const dl = liczba(o.dlugoscMm)
  const szer = liczba(o.szerokoscMm)
  if (pmax !== null && dl !== null && szer !== null && dl > 0 && szer > 0) {
    const sprawnosc = (pmax / ((dl * szer) / MM2_NA_M2) / WATY_NA_M2_STC) * 100
    if (sprawnosc < SPRAWNOSC_MODULU_ROZSADNA_PCT.min || sprawnosc > SPRAWNOSC_MODULU_ROZSADNA_PCT.max) {
      uwagi.push({ kod: "ODCZYT-SPRAWNOSC-NIEPRAWDOPODOBNA", pola: ["pmaxW", "dlugoscMm", "szerokoscMm"], params: { sprawnosc: Math.round(sprawnosc * 10) / 10 } })
    }
  }
  for (const pole of ["betaVocPctNaC", "gammaPctNaC"] as const) {
    const v = liczba(o[pole])
    if (v !== null && v >= 0) uwagi.push({ kod: "ODCZYT-WSPOLCZYNNIK-DODATNI", pola: [pole], params: { wartosc: v } })
  }
  return uwagi
}

/** Pola o niepewnym odczycie: model oznaczył je jako „niska” albo „średnia” pewność (wyróżniane w tabeli, zatwierdzane z uwagą). */
export function polaNiepewne(o: OdczytKarty): PoleOdczytu[] {
  return POLA_ODCZYTU.filter((p) => o[p].widoczne && o[p].pewnosc !== "wysoka")
}
