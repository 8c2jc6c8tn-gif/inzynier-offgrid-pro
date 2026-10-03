import type { Material, Srodowisko } from "./input"

/** Al potrzebuje ~1,6× większego przekroju niż Cu dla tego samego prądu — 1:1 ze źródła. */
export const WSPOLCZYNNIK_PRZEKROJU_AL_WZGLEDEM_CU = 1.6

export type WerdyktPary = "zalecane" | "wymaga-dodatku" | "zabronione"

export const ETYKIETY_MATERIALOW: Record<Material, string> = {
  Cu: "Miedź (Cu)",
  Al: "Aluminium (Al)",
  "stal-ocynkowana": "Stal ocynkowana",
  "stal-nierdzewna": "Stal nierdzewna",
  mosiadz: "Mosiądz",
}

/** Klucze tłumaczeń nazw materiałów — silnik podaje je w `params` (`material1Key`), nie gotowy tekst PL. */
export const KLUCZE_MATERIALOW: Record<Material, string> = {
  Cu: "MATERIAL-CU",
  Al: "MATERIAL-AL",
  "stal-ocynkowana": "MATERIAL-STAL-OCYNKOWANA",
  "stal-nierdzewna": "MATERIAL-STAL-NIERDZEWNA",
  mosiadz: "MATERIAL-MOSIADZ",
}

export const ETYKIETY_SRODOWISK: Record<Srodowisko, string> = {
  suche: "Suche",
  wilgotne: "Wilgotne",
  slone: "Słone (nadmorskie)",
}

/** Normalizuje parę materiałów do klucza niezależnego od kolejności wyboru. */
export function kluczPary(a: Material, b: Material): string {
  return [a, b].sort().join("+")
}
