import type { Warning } from "@/lib/core/calc-result"
import { MIN_AIC_LIFEPO4_A } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 */

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    message:
      "Zdolność wyłączania (AIC) tego bezpiecznika jest niższa niż prąd zwarciowy pakietu — " +
      "bezpiecznik rozerwie się, tworząc łuk plazmowy, zamiast bezpiecznie przerwać obwód.",
    technicalMessage: `aicBezpiecznikaA = ${aicA} < pradZwarciowyA = ${pradZwarciowyA}`,
    field: "aicBezpiecznikaA",
  }
}

export function aicPonizejZalecanegoMinimum(aicA: number): Warning {
  return {
    code: "AIC-PONIZEJ-ZALECANEGO-MINIMUM",
    level: "warning",
    message: `Dla systemów LiFePO4 zalecane jest AIC min. ${MIN_AIC_LIFEPO4_A.toLocaleString("pl-PL")} A — ten bezpiecznik jest poniżej tej wartości, mimo że wytrzyma obliczony prąd zwarciowy tego pakietu.`,
    technicalMessage: `aicBezpiecznikaA = ${aicA} < MIN_AIC_LIFEPO4_A = ${MIN_AIC_LIFEPO4_A}`,
    field: "aicBezpiecznikaA",
  }
}
