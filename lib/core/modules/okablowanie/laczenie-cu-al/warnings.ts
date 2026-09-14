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

export function korozjaGalwanicznaCuAl(): Warning {
  return {
    code: "KOROZJA-GALWANICZNA-CU-AL",
    level: "critical",
    message: "Bezpośrednie połączenie miedź-aluminium bez bariery koroduje i grzeje się — użyj złączki bimetalicznej i pasty antykorozyjnej.",
    technicalMessage: "Cu+Al, maZlaczkeBimetaliczna=false",
  }
}

export function paraOk(etykieta: string): Warning {
  return {
    code: "PARA-METALI-OK",
    level: "info",
    message: `${etykieta} — połączenie bezpieczne w tych warunkach.`,
    technicalMessage: "para metali zweryfikowana",
  }
}

export function wymagaPodkladkiISmaru(): Warning {
  return {
    code: "WYMAGA-PODKLADKI-I-SMARU",
    level: "warning",
    message: "Stal ocynkowana + miedź bez podkładki i smaru — dodaj oba, żeby ograniczyć korozję.",
    technicalMessage: "stal-ocynkowana+Cu, maPodkladkeISmar=false",
  }
}

export function kontrolujOkresowo(): Warning {
  return {
    code: "KONTROLUJ-OKRESOWO",
    level: "warning",
    message: "Stal nierdzewna + aluminium w środowisku słonym — kontroluj połączenie okresowo pod kątem korozji.",
    technicalMessage: "stal-nierdzewna+Al, srodowisko=slone",
  }
}

export function paraPozaZakresem(etykieta: string): Warning {
  return {
    code: "PARA-POZA-ZAKRESEM",
    level: "critical",
    message: `Źródło nie ocenia pary "${etykieta}" w tym środowisku — sprawdź kompatybilność u producenta złączki, nie zgadujemy.`,
    technicalMessage: "para/środowisko spoza tabeli źródła",
  }
}
