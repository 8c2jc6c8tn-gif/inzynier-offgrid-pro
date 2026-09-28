import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "SIEC-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "SIEC-WARTOSC-UJEMNA",
    params: { pole: field },
    technicalMessage: `${field} = ${value} < 0`,
    field,
  }
}

export function grupaNiezgodnaZSegmentem(grupa: string, segment: string): Warning {
  return {
    code: "SIEC-GRUPA-NIEZGODNA-Z-SEGMENTEM",
    level: "critical",
    i18nKey: "SIEC-GRUPA-NIEZGODNA-Z-SEGMENTEM",
    params: { grupa },
    technicalMessage: `grupa ${grupa} niezgodna z segmentem ${segment} (dom = G, firma = C)`,
    field: "grupa",
  }
}

export function grupaNiezgodnaZMoca(grupa: string, mocKw: number): Warning {
  return {
    code: "SIEC-GRUPA-NIEZGODNA-Z-MOCA",
    level: "critical",
    i18nKey: "SIEC-GRUPA-NIEZGODNA-Z-MOCA",
    params: { grupa, moc: mocKw },
    technicalMessage: `grupa ${grupa} przy mocy umownej ${mocKw} kW (C1x ≤ 40 kW, C2x > 40 kW)`,
    field: "grupa",
  }
}

export function strefaSpozaGrupy(strefa: string, grupa: string): Warning {
  return {
    code: "SIEC-STREFA-SPOZA-GRUPY",
    level: "critical",
    i18nKey: "SIEC-STREFA-SPOZA-GRUPY",
    params: { strefa, grupa },
    technicalMessage: `strefa ${strefa} nie występuje w grupie ${grupa}`,
    field: "zuzycieStrefKwh",
  }
}

export function energiaMocowaPonadZuzycie(mocowa: number, suma: number): Warning {
  return {
    code: "SIEC-ENERGIA-MOCOWA-PONAD-ZUZYCIE",
    level: "critical",
    i18nKey: "SIEC-ENERGIA-MOCOWA-PONAD-ZUZYCIE",
    technicalMessage: `energiaMocowaKwh = ${mocowa} > zużycie roczne ${suma}`,
    field: "energiaMocowaKwh",
  }
}

export function miesiaceNiepoprawne(n: number): Warning {
  return {
    code: "SIEC-MIESIACE-NIEPOPRAWNE",
    level: "critical",
    i18nKey: "SIEC-MIESIACE-NIEPOPRAWNE",
    technicalMessage: `zuzycieMiesieczneKwh ma ${n} pozycji zamiast 12 albo wartość ujemną`,
    field: "zuzycieMiesieczneKwh",
  }
}

/** A needed value is missing — neither in the ✅ data nor entered from the invoice (D36). */
export function brakDanych(pole: string): Warning {
  return {
    code: `SIEC-BRAK-${pole.toUpperCase()}`,
    level: "warning",
    i18nKey: `SIEC-BRAK-${pole.toUpperCase()}`,
    technicalMessage: `brak wartości: ${pole}`,
    field: pole,
  }
}

export function stawkiPoWaznosci(waznoscDo: string): Warning {
  return {
    code: "SIEC-STAWKI-PO-WAZNOSCI",
    level: "warning",
    i18nKey: "SIEC-STAWKI-PO-WAZNOSCI",
    params: { waznoscDo },
    technicalMessage: `data rozliczenia po waznoscDo = ${waznoscDo}`,
  }
}

export function stawkaNajdluzej(skladnik: string): Warning {
  return {
    code: "SIEC-STAWKA-NAJDLUZEJ",
    level: "info",
    i18nKey: "SIEC-STAWKA-NAJDLUZEJ",
    params: { skladnik },
    technicalMessage: `${skladnik}: stawka zmienna w roku, brak zużycia miesięcznego — przyjęto obowiązującą najdłużej`,
  }
}
