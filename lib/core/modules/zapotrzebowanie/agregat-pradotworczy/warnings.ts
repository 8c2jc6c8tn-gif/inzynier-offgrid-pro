import type { Warning } from "@/lib/core/calc-result"

/**
 * `notPositive` nie przyjmuje już etykiety pola po polsku jako parametru runtime (17.2) —
 * `i18nKey` = `code`, jednoznaczny per pole dzięki `field.toUpperCase()`, z etykietą już
 * przetłumaczoną w treści klucza (ten sam wzorzec co `konfigurator-stringow`, partia 11).
 */
export function notPositive(field: string, value: number): Warning {
  const code = `${field.toUpperCase()}-NIEDODATNI`
  return {
    code,
    level: "critical",
    i18nKey: code,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function brakWyjsciaSterujacego(): Warning {
  return {
    code: "BRAK-WYJSCIA-STERUJACEGO",
    level: "warning",
    i18nKey: "BRAK-WYJSCIA-STERUJACEGO",
    technicalMessage: "maWyjscieSterujaceBms === false",
  }
}

export function maWyjscieSterujace(): Warning {
  return {
    code: "MA-WYJSCIE-STERUJACE",
    level: "info",
    i18nKey: "MA-WYJSCIE-STERUJACE",
    technicalMessage: "maWyjscieSterujaceBms === true",
  }
}
