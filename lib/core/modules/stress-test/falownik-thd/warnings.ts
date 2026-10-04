import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative or non-finite number. */
export function wartoscUjemnaThd(pole: string, wartosc: number): Warning {
  return {
    code: "FTHD-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "FTHD-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano liczby >= 0`,
    field: pole,
  }
}

/** Form validation: a derating coefficient outside 0..1. */
export function wspolczynnikPozaZakresem(indeks: number, wartosc: number): Warning {
  return {
    code: "FTHD-WSPOLCZYNNIK-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "FTHD-WSPOLCZYNNIK-POZA-ZAKRESEM",
    params: { wiersz: indeks + 1 },
    technicalMessage: `tabela[${indeks}].wspolczynnik = ${wartosc}, oczekiwano [0, 1]`,
    field: "tabela",
  }
}

/** Form validation: the THD column is not strictly increasing. */
export function tabelaNieRosnaca(indeks: number): Warning {
  return {
    code: "FTHD-TABELA-NIEROSNACA",
    level: "critical",
    i18nKey: "FTHD-TABELA-NIEROSNACA",
    params: { wiersz: indeks + 1 },
    technicalMessage: `tabela[${indeks}].thdPct nie jest większe od poprzedniego wiersza`,
    field: "tabela",
  }
}

/** Outside the model: the THD lies outside the table, no extrapolation (the curve is the manufacturer's). */
export function thdPozaTabela(thd: number, min: number, max: number): Warning {
  return {
    code: "FTHD-THD-POZA-TABELA",
    level: "critical",
    i18nKey: "FTHD-THD-POZA-TABELA",
    params: { thd, min, max },
    technicalMessage: `THD = ${thd}% poza zakresem tabeli producenta [${min}, ${max}]%; bez ekstrapolacji`,
    field: "thdPct",
  }
}

/** Hard stop: the load exceeds the power the inverter can deliver at this THD. */
export function obciazeniePrzekraczaDostepna(obciazenieKw: number, dostepnaKw: number): Warning {
  return {
    code: "FTHD-OBCIAZENIE-PRZEKRACZA-DOSTEPNA",
    level: "critical",
    i18nKey: "FTHD-OBCIAZENIE-PRZEKRACZA-DOSTEPNA",
    params: {
      obciazenie: Math.round(obciazenieKw * 100) / 100,
      dostepna: Math.round(dostepnaKw * 100) / 100,
      brak: Math.round((obciazenieKw - dostepnaKw) * 100) / 100,
    },
    technicalMessage: `obciążenie ${obciazenieKw} kW > moc dostępna przy tym THD ${dostepnaKw} kW`,
    field: "mocObciazeniaKw",
  }
}
