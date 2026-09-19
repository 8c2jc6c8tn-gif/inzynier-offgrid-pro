import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function wylacznikNieCertyfikowanyDoDc(): Warning {
  return {
    code: "WYLACZNIK-NIECERTYFIKOWANY-DO-DC",
    level: "critical",
    i18nKey: "WYLACZNIK-NIECERTYFIKOWANY-DO-DC",
    technicalMessage: "certyfikowanyDoDc=false",
  }
}

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    i18nKey: "AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO",
    params: { aic: aicA, pradZwarciowy: pradZwarciowyA },
    technicalMessage: `aicA=${aicA} < pradZwarciowyA=${pradZwarciowyA}`,
  }
}

export function dobranyPoprawnie(): Warning {
  return {
    code: "DOBRANY-POPRAWNIE",
    level: "info",
    i18nKey: "WYLACZNIK-DC-DOBRANY-POPRAWNIE",
    technicalMessage: "certyfikowanyDoDc=true, AIC>=pradZwarciowyA (lub nie sprawdzano)",
  }
}
