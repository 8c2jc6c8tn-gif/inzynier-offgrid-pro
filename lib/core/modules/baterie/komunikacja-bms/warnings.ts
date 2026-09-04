import type { Warning } from "@/lib/core/calc-result"
import { PROTOKOLY } from "./constants"

function etykieta(id: string): string {
  return PROTOKOLY.find((p) => p.id === id)?.label ?? id
}

export function protokolyNiezgodne(bms: string, falownik: string): Warning {
  return {
    code: "PROTOKOLY-NIEZGODNE",
    level: "warning",
    message: `BMS mówi ${etykieta(bms)}, a falownik ${etykieta(falownik)} — falownik nie odczyta SoC bezpośrednio. Potrzebny konwerter protokołu między nimi.`,
    technicalMessage: `protokolBms = "${bms}" !== protokolFalownika = "${falownik}"`,
  }
}

export function protokolyZgodne(protokol: string): Warning {
  return {
    code: "PROTOKOLY-ZGODNE",
    level: "info",
    message: `BMS i falownik mówią tym samym protokołem (${etykieta(protokol)}) — komunikacja bezpośrednia, bez konwertera.`,
    technicalMessage: `protokolBms === protokolFalownika === "${protokol}"`,
  }
}

export function protokolNieznany(): Warning {
  return {
    code: "PROTOKOL-NIEZNANY",
    level: "warning",
    message: "Co najmniej jedno z urządzeń ma nieznany/niesklasyfikowany protokół — sprawdź dokumentację obu urządzeń, zgodności nie da się ocenić automatycznie.",
    technicalMessage: "protokolBms === 'inny' || protokolFalownika === 'inny'",
  }
}
