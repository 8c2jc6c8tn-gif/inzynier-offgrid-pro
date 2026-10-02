import type { Warning } from "@/lib/core/calc-result"
import { PROTOKOLY } from "./constants"

/** Dictionary key of the protocol label (`UI-STALEBAT-PROTOKOL-<ID>`); unknown ids fall back to the raw id. */
function kluczProtokolu(id: string): string {
  return PROTOKOLY.some((p) => p.id === id) ? `UI-STALEBAT-PROTOKOL-${id.toUpperCase()}` : id
}

export function protokolyNiezgodne(bms: string, falownik: string): Warning {
  return {
    code: "PROTOKOLY-NIEZGODNE",
    level: "warning",
    i18nKey: "PROTOKOLY-NIEZGODNE",
    params: { bmsKey: kluczProtokolu(bms), falownikKey: kluczProtokolu(falownik) },
    technicalMessage: `protokolBms = "${bms}" !== protokolFalownika = "${falownik}"`,
  }
}

export function protokolyZgodne(protokol: string): Warning {
  return {
    code: "PROTOKOLY-ZGODNE",
    level: "info",
    i18nKey: "PROTOKOLY-ZGODNE",
    params: { protokolKey: kluczProtokolu(protokol) },
    technicalMessage: `protokolBms === protokolFalownika === "${protokol}"`,
  }
}

export function protokolNieznany(): Warning {
  return {
    code: "PROTOKOL-NIEZNANY",
    level: "warning",
    i18nKey: "PROTOKOL-NIEZNANY",
    technicalMessage: "protokolBms === 'inny' || protokolFalownika === 'inny'",
  }
}
