import type { Warning } from "@/lib/core/calc-result"

export function wartoscNiedodatnia(field: string, labelKey: string, value: number, zrodlo?: string): Warning {
  return {
    code: `KO-${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: zrodlo === undefined ? { labelKey } : { labelKey, zrodlo },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function wartoscUjemna(field: string, labelKey: string, value: number, zrodlo?: string): Warning {
  return {
    code: `KO-${field.toUpperCase()}-UJEMNY`,
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: zrodlo === undefined ? { labelKey } : { labelKey, zrodlo },
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

/** Źródło: "Koszt inwestycji to jedno, koszt paliwa to drugie. Sprawdź oba." */
export function inwestycjaIPaliwo(): Warning {
  return {
    code: "KO-INWESTYCJA-I-PALIWO",
    level: "info",
    i18nKey: "KO-INWESTYCJA-I-PALIWO",
    technicalMessage: "ranking po koszcie całkowitym (inwestycja + paliwo + serwis), nie po cenie kWh",
  }
}

export function zrodloNiekompletne(i: number, nazwa: string): Warning {
  return {
    code: `KO-ZRODLO-NIEKOMPLETNE-${i}`,
    level: "info",
    i18nKey: "KO-ZRODLO-NIEKOMPLETNE",
    params: { nazwa },
    field: `zrodla[${i}]`,
    technicalMessage: `źródło "${nazwa}" pominięte w rankingu — brak wymaganych pól`,
  }
}

export function paliwoStaleBezpieczenstwo(i: number, nazwa: string): Warning {
  return {
    code: `KO-PALIWO-STALE-${i}`,
    level: "info",
    i18nKey: "KO-PALIWO-STALE-BEZPIECZENSTWO",
    params: { nazwa },
    technicalMessage: "paliwo stałe — twarde stopy bezpieczeństwa w M8/E2 (CO, odległość, nawiew)",
  }
}

/** Źródło: "Kominek drewno: 0,15 zł/kWh (ale praca)". */
export function drewnoPraca(i: number, nazwa: string): Warning {
  return {
    code: `KO-DREWNO-PRACA-${i}`,
    level: "info",
    i18nKey: "KO-DREWNO-PRACA",
    params: { nazwa },
    technicalMessage: "koszt drewna nie obejmuje pracy (rąbanie, noszenie, palenie)",
  }
}

/** D28: nagrzewnica typu webasto w budynku — spaliny/CO i montaż poza zastosowaniem pojazdowym. */
export function nagrzewnicaSpaliny(i: number, nazwa: string): Warning {
  return {
    code: `KO-NAGRZEWNICA-SPALINY-${i}`,
    level: "warning",
    i18nKey: "KO-NAGRZEWNICA-SPALINY",
    params: { nazwa },
    technicalMessage: "spaliny/CO, szczelność wydechu przez przegrodę, montaż w budynku — konsultacja z kominiarzem",
  }
}

export function olejGestnieje(i: number, nazwa: string, temperatura: number): Warning {
  return {
    code: `KO-OLEJ-GESTNIEJE-${i}`,
    level: "warning",
    i18nKey: "KO-OLEJ-GESTNIEJE",
    params: { nazwa, temperatura },
    technicalMessage: `źródło: przy ${temperatura}°C olej napędowy gęstnieje — paliwo arktyczne`,
  }
}

export function pradOffGrid(i: number, nazwa: string): Warning {
  return {
    code: `KO-PRAD-OFFGRID-${i}`,
    level: "info",
    i18nKey: "KO-PRAD-OFFGRID",
    params: { nazwa },
    technicalMessage: "grzanie prądem zimą w off-gridzie — energia z PV najmniejsza, deficyt → M3/E4",
  }
}

export function sprawnoscPowyzej100(i: number, nazwa: string, sprawnosc: number): Warning {
  return {
    code: `KO-SPRAWNOSC-POWYZEJ-100-${i}`,
    level: "info",
    i18nKey: "KO-SPRAWNOSC-POWYZEJ-100",
    params: { nazwa, sprawnosc },
    technicalMessage: `sprawność ${sprawnosc}% > 100% — możliwa tylko względem wartości opałowej (kondensacja)`,
  }
}
