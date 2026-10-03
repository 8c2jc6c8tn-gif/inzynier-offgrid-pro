import { kluczSerii } from "./jakosc"
import type { ProbkaTelemetrii, Wielkosc } from "./probka"

/** Alarm levels (Biblia 13.8): info, warning (needs attention soon), critical (react now). */
export type PriorytetAlarmu = "info" | "ostrzezenie" | "krytyczny"

const WAGA: Record<PriorytetAlarmu, number> = { info: 0, ostrzezenie: 1, krytyczny: 2 }

/**
 * A user-defined alarm threshold. There are no built-in defaults: the source gives only example
 * values (e.g. SoC below 25 %), and a real limit depends on the battery and the installation.
 */
export interface ProgAlarmu {
  id: string
  wielkosc: Wielkosc
  /** Channel within the source (e.g. "bms"); undefined = any channel of that quantity. */
  kanal?: string
  kierunek: "ponizej" | "powyzej"
  wartosc: number
  priorytet: PriorytetAlarmu
}

export interface AlarmAktywny {
  progId: string
  priorytet: PriorytetAlarmu
  kanal: string
  wielkosc: Wielkosc
  /** Latest value that breached the threshold. */
  wartosc: number
  prog: number
  kierunek: ProgAlarmu["kierunek"]
  czas: number
}

/** Latest valid sample per series (source|channel|quantity). Missing and out-of-range samples never count. */
export function ostatnieWartosci(probki: ProbkaTelemetrii[]): Map<string, ProbkaTelemetrii> {
  const wynik = new Map<string, ProbkaTelemetrii>()
  for (const p of probki) {
    if (p.jakosc !== "ok" || p.wartosc === null) continue
    const k = kluczSerii(p)
    const poprzednia = wynik.get(k)
    if (!poprzednia || p.czas >= poprzednia.czas) wynik.set(k, p)
  }
  return wynik
}

/** Active alarms for the latest values, most severe first, then newest first. */
export function ocenAlarmy(probki: ProbkaTelemetrii[], progi: ProgAlarmu[]): AlarmAktywny[] {
  const ostatnie = [...ostatnieWartosci(probki).values()]
  const alarmy: AlarmAktywny[] = []
  for (const prog of progi) {
    if (!Number.isFinite(prog.wartosc)) continue
    for (const p of ostatnie) {
      if (p.wielkosc !== prog.wielkosc || (prog.kanal && p.kanal !== prog.kanal)) continue
      const wartosc = p.wartosc as number
      const przekroczony = prog.kierunek === "ponizej" ? wartosc < prog.wartosc : wartosc > prog.wartosc
      if (przekroczony) {
        alarmy.push({
          progId: prog.id,
          priorytet: prog.priorytet,
          kanal: p.kanal,
          wielkosc: p.wielkosc,
          wartosc,
          prog: prog.wartosc,
          kierunek: prog.kierunek,
          czas: p.czas,
        })
      }
    }
  }
  return alarmy.sort((a, b) => WAGA[b.priorytet] - WAGA[a.priorytet] || b.czas - a.czas)
}

/** Data is stale when the newest sample is older than the limit the user gave (or there is none). */
export function daneNieaktualne(ostatniaProbkaMs: number | null, teraz: number, maxWiekMs: number): boolean {
  return ostatniaProbkaMs === null || teraz - ostatniaProbkaMs > maxWiekMs
}

/** Samples of one series within the last `oknoMs`, ordered by time — input for the live chart. */
export function seriaDoWykresu(
  probki: ProbkaTelemetrii[],
  kanal: string,
  wielkosc: Wielkosc,
  teraz: number,
  oknoMs: number,
): { czas: number; wartosc: number }[] {
  return probki
    .filter((p) => p.kanal === kanal && p.wielkosc === wielkosc && p.jakosc === "ok" && p.wartosc !== null && p.czas >= teraz - oknoMs && p.czas <= teraz)
    .map((p) => ({ czas: p.czas, wartosc: p.wartosc as number }))
    .sort((a, b) => a.czas - b.czas)
}

/** One continuous breach of a threshold on one series (alarm history, Biblia 7.43). */
export interface EpizodAlarmu {
  progId: string
  priorytet: PriorytetAlarmu
  kanal: string
  wielkosc: Wielkosc
  kierunek: ProgAlarmu["kierunek"]
  prog: number
  /** Time of the first breaching sample. */
  odMs: number
  /** Time of the first sample back within the limit; null = still breached at the last valid sample. */
  doMs: number | null
  /** Worst value of the episode (minimum for "ponizej", maximum for "powyzej"). */
  ekstremum: number
}

/**
 * Alarm episodes found in recorded samples. Per threshold and series, valid samples are walked in
 * time order: a breach opens an episode, the first sample within the limit closes it. Missing and
 * out-of-range samples neither open nor close an episode. Newest first.
 */
export function epizodyAlarmow(probki: ProbkaTelemetrii[], progi: ProgAlarmu[]): EpizodAlarmu[] {
  const serie = new Map<string, ProbkaTelemetrii[]>()
  for (const p of probki) {
    if (p.jakosc !== "ok" || p.wartosc === null) continue
    const k = kluczSerii(p)
    const lista = serie.get(k)
    if (lista) lista.push(p)
    else serie.set(k, [p])
  }
  const epizody: EpizodAlarmu[] = []
  for (const prog of progi) {
    if (!Number.isFinite(prog.wartosc)) continue
    for (const lista of serie.values()) {
      const pierwsza = lista[0]
      if (pierwsza.wielkosc !== prog.wielkosc || (prog.kanal && pierwsza.kanal !== prog.kanal)) continue
      let otwarty: EpizodAlarmu | null = null
      for (const p of [...lista].sort((a, b) => a.czas - b.czas)) {
        const w = p.wartosc as number
        const przekroczony = prog.kierunek === "ponizej" ? w < prog.wartosc : w > prog.wartosc
        if (przekroczony) {
          if (!otwarty) {
            otwarty = {
              progId: prog.id,
              priorytet: prog.priorytet,
              kanal: p.kanal,
              wielkosc: p.wielkosc,
              kierunek: prog.kierunek,
              prog: prog.wartosc,
              odMs: p.czas,
              doMs: null,
              ekstremum: w,
            }
            epizody.push(otwarty)
          } else {
            otwarty.ekstremum = prog.kierunek === "ponizej" ? Math.min(otwarty.ekstremum, w) : Math.max(otwarty.ekstremum, w)
          }
        } else if (otwarty) {
          otwarty.doMs = p.czas
          otwarty = null
        }
      }
    }
  }
  return epizody.sort((a, b) => b.odMs - a.odMs)
}

/** Samples recorded up to and including `t` — the state of the system at that moment (replay). */
export function probkiDoChwili(probki: ProbkaTelemetrii[], t: number): ProbkaTelemetrii[] {
  return probki.filter((p) => p.czas <= t)
}
