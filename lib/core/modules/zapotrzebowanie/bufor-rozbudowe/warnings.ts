import type { Warning } from "@/lib/core/calc-result"

export function notPositive(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-NIEDODATNIE",
    level: "critical",
    message: 'Wartość pola "całkowite zapotrzebowanie dobowe" musi być większa od zera.',
    technicalMessage: `zapotrzebowanieCalkowiteKwh = ${value}, oczekiwano > 0`,
    field: "zapotrzebowanieCalkowiteKwh",
  }
}

export function buforInfo(buforPct: number, dodatekKwh: number): Warning {
  return {
    code: "BUFOR-INFO",
    level: "info",
    message:
      buforPct === 0
        ? "Bez bufora — system dobierany dokładnie pod dzisiejsze potrzeby, bez zapasu na przyszłość."
        : `Bufor ${buforPct}% dolicza ${dodatekKwh.toFixed(1)} kWh/dobę zapasu na przyszłą rozbudowę (nowe urządzenia, powiększenie rodziny).`,
    technicalMessage: `buforPct = ${buforPct}, dodatekKwh = ${dodatekKwh}`,
  }
}
