import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function wymaganyEFuse(pradZwarciowyA: number, zdolnoscA: number): Warning {
  return {
    code: "WYMAGANY-E-FUSE",
    level: "critical",
    message: `Prąd zwarciowy pakietu (${pradZwarciowyA.toFixed(0)} A) przekracza zdolność łączeniową tranzystorów BMS (${zdolnoscA.toFixed(0)} A) — zwykły bezpiecznik (~10ms) jest za wolny, BMS musi mieć funkcję e-Fuse (wyłączenie natychmiastowe, <100µs).`,
    technicalMessage: `pradZwarciowyA = ${pradZwarciowyA} > zdolnoscLaczeniowaTranzystorowA = ${zdolnoscA}`,
  }
}

export function eFuseNiepotrzebny(pradZwarciowyA: number, zdolnoscA: number): Warning {
  return {
    code: "E-FUSE-NIEPOTRZEBNY",
    level: "info",
    message: `Prąd zwarciowy pakietu (${pradZwarciowyA.toFixed(0)} A) mieści się w zdolności łączeniowej tranzystorów BMS (${zdolnoscA.toFixed(0)} A).`,
    technicalMessage: `pradZwarciowyA = ${pradZwarciowyA} <= zdolnoscLaczeniowaTranzystorowA = ${zdolnoscA}`,
  }
}
