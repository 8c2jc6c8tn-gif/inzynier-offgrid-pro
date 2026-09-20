import type { Warning } from "@/lib/core/calc-result"

export function mieszaniProducenci(): Warning {
  return {
    code: "MIESZANI-PRODUCENCI-MC4",
    level: "critical",
    i18nKey: "MIESZANI-PRODUCENCI-MC4",
    technicalMessage: "producentZenski !== producentMeski",
  }
}

export function producentNieznany(): Warning {
  return {
    code: "PRODUCENT-MC4-NIEZNANY",
    level: "warning",
    i18nKey: "PRODUCENT-MC4-NIEZNANY",
    technicalMessage: 'jedna ze stron złącza = "Inny / nieznany" — zgodności nie da się potwierdzić',
  }
}

export function zlaczaZgodne(producent: string): Warning {
  return {
    code: "ZLACZA-MC4-ZGODNE",
    level: "info",
    i18nKey: "ZLACZA-MC4-ZGODNE",
    params: { producent },
    technicalMessage: `producentZenski === producentMeski === ${producent}`,
  }
}
