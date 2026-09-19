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

export function buforZaMaly(pojemnoscBuforaL: number, zalecanaPojemnoscL: number): Warning {
  return {
    code: "BUFOR-ZA-MALY",
    level: "warning",
    i18nKey: "BUFOR-ZA-MALY",
    params: { pojemnosc: pojemnoscBuforaL.toFixed(0), zalecana: zalecanaPojemnoscL.toFixed(0) },
    technicalMessage: `pojemnoscBuforaL=${pojemnoscBuforaL} < zalecanaPojemnoscL=${zalecanaPojemnoscL}`,
  }
}

export function buforWystarczajacy(pojemnoscBuforaL: number, zalecanaPojemnoscL: number): Warning {
  return {
    code: "BUFOR-WYSTARCZAJACY",
    level: "info",
    i18nKey: "BUFOR-WYSTARCZAJACY",
    params: { pojemnosc: pojemnoscBuforaL.toFixed(0), zalecana: zalecanaPojemnoscL.toFixed(0) },
    technicalMessage: `pojemnoscBuforaL=${pojemnoscBuforaL} >= zalecanaPojemnoscL=${zalecanaPojemnoscL}`,
  }
}
