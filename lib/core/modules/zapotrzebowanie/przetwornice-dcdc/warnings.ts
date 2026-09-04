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

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Sprawność przetwornicy musi być z przedziału 0–100%.",
    technicalMessage: `sprawnoscPrzetwornicyPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscPrzetwornicyPct",
  }
}

export function strataNaKonwersji(strataPct: number, strataW: number): Warning {
  return {
    code: "STRATA-NA-KONWERSJI",
    level: "info",
    message: `Każda zmiana napięcia kosztuje trochę energii — przetwornica traci ${strataPct.toFixed(0)}% (${strataW.toFixed(1)} W) na samej konwersji.`,
    technicalMessage: `strataPct = ${strataPct}, strataW = ${strataW}`,
  }
}

export function zasilanieBezposrednieInfo(): Warning {
  return {
    code: "ZASILANIE-BEZPOSREDNIE",
    level: "info",
    message: "Urządzenie zasilane bezpośrednio z magistrali — brak strat na konwersji napięcia.",
    technicalMessage: "zasilanieBezposrednie === true",
  }
}
