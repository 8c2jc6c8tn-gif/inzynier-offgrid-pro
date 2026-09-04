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

export function brakWyjsciaSterujacego(): Warning {
  return {
    code: "BRAK-WYJSCIA-STERUJACEGO",
    level: "warning",
    message: "Agregat musi być uruchamiany ręcznie lub przez autostart — upewnij się, że BMS ma wyjście sterujące.",
    technicalMessage: "maWyjscieSterujaceBms === false",
  }
}

export function maWyjscieSterujace(): Warning {
  return {
    code: "MA-WYJSCIE-STERUJACE",
    level: "info",
    message: "BMS ma wyjście sterujące — agregat może załączać się automatycznie.",
    technicalMessage: "maWyjscieSterujaceBms === true",
  }
}
