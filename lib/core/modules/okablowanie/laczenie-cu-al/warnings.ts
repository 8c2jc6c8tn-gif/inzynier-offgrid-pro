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

export function korozjaGalwanicznaCuAl(): Warning {
  return {
    code: "KOROZJA-GALWANICZNA-CU-AL",
    level: "critical",
    i18nKey: "KOROZJA-GALWANICZNA-CU-AL",
    technicalMessage: "Cu+Al, maZlaczkeBimetaliczna=false",
  }
}

export function paraOk(material1Key: string, material2Key: string): Warning {
  return {
    code: "PARA-METALI-OK",
    level: "info",
    i18nKey: "PARA-METALI-OK",
    params: { material1Key, material2Key },
    technicalMessage: "para metali zweryfikowana",
  }
}

export function wymagaPodkladkiISmaru(): Warning {
  return {
    code: "WYMAGA-PODKLADKI-I-SMARU",
    level: "warning",
    i18nKey: "WYMAGA-PODKLADKI-I-SMARU",
    technicalMessage: "stal-ocynkowana+Cu, maPodkladkeISmar=false",
  }
}

export function kontrolujOkresowo(): Warning {
  return {
    code: "KONTROLUJ-OKRESOWO",
    level: "warning",
    i18nKey: "KONTROLUJ-OKRESOWO",
    technicalMessage: "stal-nierdzewna+Al, srodowisko=slone",
  }
}

export function paraPozaZakresem(material1Key: string, material2Key: string): Warning {
  return {
    code: "PARA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "PARA-POZA-ZAKRESEM",
    params: { material1Key, material2Key },
    technicalMessage: "para/środowisko spoza tabeli źródła",
  }
}
