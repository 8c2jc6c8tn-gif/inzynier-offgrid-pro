import type { Warning } from "@/lib/core/calc-result"

/**
 * Generator safety block shared by M2/E17 "Agregat prądotwórczy" and M7/E8 "Agregat w mrozie"
 * (D45, rejestr-decyzji.md). Practice-based checks, not a norm: HD 60364-5-551 (generating sets)
 * is not in the repo (docs/normy-brakujace.md) — detailed switch rules live in M14/D11 (D44, 🔎).
 */

/** Where the generator runs. null = not answered yet. */
export type MiejsceAgregatu = "na-zewnatrz" | "pomieszczenie-wydzielone" | "wewnatrz-budynku"

/** How the generator feeds the loads. null = not answered yet. */
export type PodlaczenieAgregatu =
  | "przez-przelacznik"
  | "bez-przelacznika"
  | "wejscie-ac-falownika"
  | "tylko-odbiorniki"

export type BezpieczenstwoAgregatuInput = {
  miejsceAgregatu: MiejsceAgregatu | null
  podlaczenieAgregatu: PodlaczenieAgregatu | null
}

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(field ? { field } : {}) }
}

/** 🔴 Hard stop: combustion generator inside the building — carbon monoxide poisoning. */
export function agregatWBudynku(): Warning {
  return ostrzezenie("AGREGAT-W-BUDYNKU-CZAD", "critical", "miejsceAgregatu=wewnatrz-budynku (D45, CO)", "miejsceAgregatu")
}

/** 🟡 Dedicated room: allowed only with ducted exhaust, extract + supply ventilation, CO detector. */
export function agregatPomieszczenieWydzielone(): Warning {
  return ostrzezenie(
    "AGREGAT-POMIESZCZENIE-WYDZIELONE",
    "warning",
    "miejsceAgregatu=pomieszczenie-wydzielone (D45; detailed rules 🔎 HD 60364-5-551)",
    "miejsceAgregatu",
  )
}

/** ℹ️ Outdoors: keep exhaust away from windows, doors and air intakes. */
export function agregatNaZewnatrz(): Warning {
  return ostrzezenie("AGREGAT-NA-ZEWNATRZ", "info", "miejsceAgregatu=na-zewnatrz (D45)", "miejsceAgregatu")
}

/** 🔴 Hard stop: generator feeds the fixed installation without a changeover switch. */
export function agregatBezPrzelacznika(): Warning {
  return ostrzezenie(
    "AGREGAT-BEZ-PRZELACZNIKA",
    "critical",
    "podlaczenieAgregatu=bez-przelacznika (D45, backfeed / parallel with inverter)",
    "podlaczenieAgregatu",
  )
}

/** ℹ️ Changeover switch I–0–II with mechanical interlock, phases and N. */
export function agregatPrzezPrzelacznik(): Warning {
  return ostrzezenie(
    "AGREGAT-PRZEZ-PRZELACZNIK",
    "info",
    "podlaczenieAgregatu=przez-przelacznik (D44/D45, M14/D11)",
    "podlaczenieAgregatu",
  )
}

/** ℹ️ Inverter/charger AC input: the inverter transfers; a grid connection still needs a switch. */
export function agregatWejscieFalownika(): Warning {
  return ostrzezenie(
    "AGREGAT-WEJSCIE-FALOWNIKA",
    "info",
    "podlaczenieAgregatu=wejscie-ac-falownika (D45)",
    "podlaczenieAgregatu",
  )
}

/** ℹ️ Loads plugged straight into the generator sockets — never into a wall socket. */
export function agregatTylkoOdbiorniki(): Warning {
  return ostrzezenie("AGREGAT-TYLKO-ODBIORNIKI", "info", "podlaczenieAgregatu=tylko-odbiorniki (D45)", "podlaczenieAgregatu")
}

/** ℹ️ Always: hot exhaust/muffler and fuel vapour — refuel only when stopped and cooled. */
export function agregatGoraceCzesciOpary(): Warning {
  return ostrzezenie("AGREGAT-GORACE-CZESCI-OPARY", "info", "always shown (D45)")
}

/** ℹ️ Always: fuel store kept separate from the generator. */
export function agregatPaliwoOsobno(): Warning {
  return ostrzezenie("AGREGAT-PALIWO-OSOBNO", "info", "always shown (D45)")
}

/** ℹ️ Always: extinguisher at hand, no water on fuel or live equipment. */
export function agregatSrodkiGasnicze(): Warning {
  return ostrzezenie("AGREGAT-SRODKI-GASNICZE", "info", "always shown (D45)")
}

const OCENA_MIEJSCA: Record<MiejsceAgregatu, () => Warning> = {
  "na-zewnatrz": agregatNaZewnatrz,
  "pomieszczenie-wydzielone": agregatPomieszczenieWydzielone,
  "wewnatrz-budynku": agregatWBudynku,
}

const OCENA_PODLACZENIA: Record<PodlaczenieAgregatu, () => Warning> = {
  "przez-przelacznik": agregatPrzezPrzelacznik,
  "bez-przelacznika": agregatBezPrzelacznika,
  "wejscie-ac-falownika": agregatWejscieFalownika,
  "tylko-odbiorniki": agregatTylkoOdbiorniki,
}

/** Location/connection verdicts (only for answered fields) followed by the three always-on notes. */
export function ocenBezpieczenstwoAgregatu(input: BezpieczenstwoAgregatuInput): Warning[] {
  const warnings: Warning[] = []
  // `!= null`: callers built before D45 (old drafts, AI tools) may pass undefined.
  if (input.miejsceAgregatu != null) warnings.push(OCENA_MIEJSCA[input.miejsceAgregatu]())
  if (input.podlaczenieAgregatu != null) warnings.push(OCENA_PODLACZENIA[input.podlaczenieAgregatu]())
  warnings.push(agregatGoraceCzesciOpary(), agregatPaliwoOsobno(), agregatSrodkiGasnicze())
  return warnings
}

/** True when the user answered at least one safety question (enough for a verdict on its own). */
export function maOdpowiedzBezpieczenstwa(input: BezpieczenstwoAgregatuInput): boolean {
  return input.miejsceAgregatu != null || input.podlaczenieAgregatu != null
}
