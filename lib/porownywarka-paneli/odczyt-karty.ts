/**
 * Odczyt karty/naklejki (spec 33) po stronie formularza: z odczytu robi listę pozycji do zatwierdzenia pole po polu, a z
 * zatwierdzonych pozycji — poprawkę pól panelu. Nic nie trafia do formularza bez zaznaczenia przez użytkownika (standard 9.5).
 */
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { POLA_ODCZYTU, type OdczytKarty, type PewnoscOdczytu, type PoleOdczytu } from "@/lib/core/modules/pv/porownywarka-paneli/odczyt-karty"
import type { PanelSeed } from "./stan"

export type PozycjaOdczytu = {
  pole: PoleOdczytu
  /** Wartość jako tekst pola formularza (liczba z kropką, „tak”/„nie”, „testowe”/„obliczeniowe”); edytowalna przez użytkownika. */
  tekst: string
  pewnosc: PewnoscOdczytu
  zatwierdzone: boolean
}

/** Pole odczytu → pole `PanelSeed`, do którego trafia po zatwierdzeniu. */
export const POLE_FORMULARZA: Record<PoleOdczytu, keyof PanelSeed> = {
  nazwa: "nazwa",
  pmaxW: "moc",
  vocV: "voc",
  vmpV: "vmp",
  iscA: "isc",
  impA: "imp",
  betaVocPctNaC: "betaVoc",
  gammaPctNaC: "gamma",
  noctC: "noct",
  maxNapieciaSystemuV: "maxV",
  maxBezpiecznikSzeregowyA: "maxBezp",
  dlugoscMm: "dlugosc",
  szerokoscMm: "szerokosc",
  masaKg: "masa",
  degradacjaPierwszyRokPct: "deg1",
  degradacjaLiniowaPctNaRok: "degLin",
  obciazeniePrzodPa: "obcPrzod",
  obciazenieTylPa: "obcTyl",
  bifacjalny: "bifacjalny",
  obciazenieRodzaj: "obcRodzaj",
}

export const POLA_TEKSTOWE_ODCZYTU: readonly PoleOdczytu[] = ["nazwa"]
export const POLA_WYBORU_ODCZYTU: readonly PoleOdczytu[] = ["bifacjalny", "obciazenieRodzaj"]

/** Pozycje do pokazania: tylko pola widoczne na dokumencie, żadne niezatwierdzone. Pola niewidoczne zostają w formularzu bez zmian. */
export function pozycjeOdczytu(o: OdczytKarty): PozycjaOdczytu[] {
  return POLA_ODCZYTU.flatMap((pole) => {
    const p = o[pole]
    if (!p.widoczne || p.wartosc === null) return []
    const tekst = typeof p.wartosc === "boolean" ? (p.wartosc ? "tak" : "nie") : String(p.wartosc)
    return [{ pole, tekst, pewnosc: p.pewnosc, zatwierdzone: false }]
  })
}

/** Czy tekst pozycji da się wpisać do formularza (liczba dla pól liczbowych, jedna z dwóch wartości dla pól wyboru). */
export function pozycjaPoprawna(p: PozycjaOdczytu): boolean {
  if (POLA_TEKSTOWE_ODCZYTU.includes(p.pole)) return p.tekst.trim() !== ""
  if (p.pole === "bifacjalny") return p.tekst === "tak" || p.tekst === "nie"
  if (p.pole === "obciazenieRodzaj") return p.tekst === "testowe" || p.tekst === "obliczeniowe"
  return liczba(p.tekst) !== undefined
}

/**
 * Poprawka pól panelu z zatwierdzonych pozycji. Panel z odczytu to panel ręczny, więc czyści `katalogId` (dane elektryczne i
 * obciążenia biorą się wtedy z pól ręcznych); niezatwierdzone pola formularza zostają bez zmian.
 */
export function poprawkaSeedZOdczytu(pozycje: PozycjaOdczytu[]): Partial<PanelSeed> {
  const zatwierdzone = pozycje.filter((p) => p.zatwierdzone && pozycjaPoprawna(p))
  if (zatwierdzone.length === 0) return {}
  const poprawka: Record<string, string | boolean> = { katalogId: "" }
  for (const p of zatwierdzone) {
    poprawka[POLE_FORMULARZA[p.pole]] = p.pole === "bifacjalny" ? p.tekst === "tak" : p.tekst.trim()
  }
  return poprawka as Partial<PanelSeed>
}
