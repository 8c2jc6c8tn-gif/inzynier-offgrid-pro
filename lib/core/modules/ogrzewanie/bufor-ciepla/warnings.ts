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

export function buforZaMaly(pojemnoscBuforaL: number, zalecanaPojemnoscL: number): Warning {
  return {
    code: "BUFOR-ZA-MALY",
    level: "warning",
    message: `Posiadany bufor (${pojemnoscBuforaL.toFixed(0)} l) jest mniejszy od zalecanej pojemności (${zalecanaPojemnoscL.toFixed(0)} l) — za mały bufor to częste starty pompy i większe zużycie prądu.`,
    technicalMessage: `pojemnoscBuforaL=${pojemnoscBuforaL} < zalecanaPojemnoscL=${zalecanaPojemnoscL}`,
  }
}

export function buforWystarczajacy(pojemnoscBuforaL: number, zalecanaPojemnoscL: number): Warning {
  return {
    code: "BUFOR-WYSTARCZAJACY",
    level: "info",
    message: `Posiadany bufor (${pojemnoscBuforaL.toFixed(0)} l) mieści zalecaną pojemność (${zalecanaPojemnoscL.toFixed(0)} l).`,
    technicalMessage: `pojemnoscBuforaL=${pojemnoscBuforaL} >= zalecanaPojemnoscL=${zalecanaPojemnoscL}`,
  }
}
