import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function wylacznikNieCertyfikowanyDoDc(): Warning {
  return {
    code: "WYLACZNIK-NIECERTYFIKOWANY-DO-DC",
    level: "critical",
    message: "Wyłącznik AC zastosowany w obwodzie DC nie zgasi łuku stałoprądowego — ryzyko pożaru.",
    technicalMessage: "certyfikowanyDoDc=false",
  }
}

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    message: `Zdolność wyłączania wyłącznika (${aicA} A) jest niższa niż prąd zwarciowy w tym punkcie (${pradZwarciowyA} A).`,
    technicalMessage: `aicA=${aicA} < pradZwarciowyA=${pradZwarciowyA}`,
  }
}

export function dobranyPoprawnie(): Warning {
  return {
    code: "DOBRANY-POPRAWNIE",
    level: "info",
    message: "Wyłącznik certyfikowany do DC, zdolność wyłączania wystarczająca.",
    technicalMessage: "certyfikowanyDoDc=true, AIC>=pradZwarciowyA (lub nie sprawdzano)",
  }
}
