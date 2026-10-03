import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative number. */
export function wartoscUjemnaDwb(pole: string, wartosc: number): Warning {
  return {
    code: "DWB-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "DWB-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
    field: pole,
  }
}

/** Form validation: the number of days in the month is not a whole number 28..31. */
export function dniMiesiacaPozaZakresem(dni: number): Warning {
  return {
    code: "DWB-DNI-MIESIACA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DWB-DNI-MIESIACA-POZA-ZAKRESEM",
    technicalMessage: `dniMiesiaca = ${dni}, oczekiwano liczby całkowitej 28..31`,
    field: "dniMiesiaca",
  }
}

/** Form validation: the current day is not a whole number 1..N. */
export function biezacyDzienPozaZakresem(dzien: number, dni: number): Warning {
  return {
    code: "DWB-DZIEN-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DWB-DZIEN-POZA-ZAKRESEM",
    params: { dni },
    technicalMessage: `biezacyDzien = ${dzien}, oczekiwano liczby całkowitej 1..${dni}`,
    field: "biezacyDzien",
  }
}

/** Form validation: a percentage outside 0..100. */
export function procentPozaZakresemDwb(pole: string, wartosc: number): Warning {
  return {
    code: "DWB-PROCENT-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DWB-PROCENT-POZA-ZAKRESEM",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano [0, 100]`,
    field: pole,
  }
}

/** Form validation: the category shares exceed 100% of the plan. */
export function udzialyPowyzej100(suma: number): Warning {
  return {
    code: "DWB-UDZIALY-POWYZEJ-100",
    level: "critical",
    i18nKey: "DWB-UDZIALY-POWYZEJ-100",
    params: { suma: Math.round(suma * 100) / 100 },
    technicalMessage: `suma udzialPlanuPct = ${suma}, oczekiwano <= 100`,
    field: "cele",
  }
}

/** Form validation: the same category entered twice. */
export function celPowtorzony(cel: string): Warning {
  return {
    code: "DWB-CEL-POWTORZONY",
    level: "critical",
    i18nKey: "DWB-CEL-POWTORZONY",
    technicalMessage: `cel "${cel}" występuje więcej niż raz`,
    field: "cele",
  }
}

/** Hard stop: the whole plan of the month is already used up (or exceeded). */
export function planWyczerpany(zuzycie: number, plan: number, dniZostalo: number): Warning {
  return {
    code: "DWB-PLAN-WYCZERPANY",
    level: "critical",
    i18nKey: dniZostalo > 0 ? "DWB-PLAN-WYCZERPANY" : "DWB-PLAN-PRZEKROCZONY-KONIEC",
    params: {
      zuzycie: Math.round(zuzycie * 10) / 10,
      plan: Math.round(plan * 10) / 10,
      dniZostalo,
    },
    technicalMessage: `zuzycieNarastajaceKwh = ${zuzycie} >= plan = ${plan} kWh, do końca miesiąca ${dniZostalo} dni`,
    field: "zuzycieNarastajaceKwh",
  }
}

/** Hard stop: even switching the heating off completely would not bring the pace down enough. */
export function ogrzewanieNieWystarczy(wymaganePct: number, udzialPct: number): Warning {
  return {
    code: "DWB-OGRZEWANIE-NIE-WYSTARCZY",
    level: "critical",
    i18nKey: "DWB-OGRZEWANIE-NIE-WYSTARCZY",
    params: { wymagane: Math.round(wymaganePct * 10) / 10, udzial: Math.round(udzialPct * 10) / 10 },
    technicalMessage: `wymagane ograniczenie ${wymaganePct}% > udział ogrzewania ${udzialPct}%`,
    field: "udzialOgrzewaniaPct",
  }
}

/**
 * Warning: the consumption is above the cumulative budget B_d. Equivalent to „the month-end forecast exceeds
 * the plan” (z/d·N > P ⇔ z > P·d/N), so this is the early, still recoverable stage.
 */
export function ponadBudzet(odchyleniePct: number, dzienWyczerpania: number, ograniczeniePct: number): Warning {
  return {
    code: "DWB-PONAD-BUDZET",
    level: "warning",
    i18nKey: "DWB-PONAD-BUDZET",
    params: {
      odchylenie: Math.round(odchyleniePct * 10) / 10,
      dzien: Math.floor(dzienWyczerpania),
      ograniczenie: Math.round(ograniczeniePct * 10) / 10,
    },
    technicalMessage: `zużycie ponad budżet narastający o ${odchyleniePct}%; energii starczy do dnia ${dzienWyczerpania}; ograniczenie o ${ograniczeniePct}%`,
    field: "zuzycieNarastajaceKwh",
  }
}

/** Info: how far the heating setpoint must come down (stationary approximation). */
export function ograniczOgrzewanie(k: number): Warning {
  return {
    code: "DWB-OGRANICZ-OGRZEWANIE",
    level: "info",
    i18nKey: "DWB-OGRANICZ-OGRZEWANIE",
    params: { k: Math.round(k * 10) / 10 },
    technicalMessage: `potrzebne obniżenie temperatury w pomieszczeniach o ok. ${k} K`,
    field: "udzialOgrzewaniaPct",
  }
}

/** Info: the category consumptions add up to more than the total consumption. */
export function celeWiecejNizRazem(sumaCeli: number, razem: number): Warning {
  return {
    code: "DWB-CELE-WIECEJ-NIZ-RAZEM",
    level: "warning",
    i18nKey: "DWB-CELE-WIECEJ-NIZ-RAZEM",
    params: { cele: Math.round(sumaCeli * 10) / 10, razem: Math.round(razem * 10) / 10 },
    technicalMessage: `suma zużycia celów ${sumaCeli} kWh > zużycie narastające ${razem} kWh`,
    field: "cele",
  }
}

/** Info: part of the plan is not assigned to any category. */
export function planNieWCalosciPrzydzielony(suma: number): Warning {
  return {
    code: "DWB-PLAN-NIE-W-CALOSCI-PRZYDZIELONY",
    level: "info",
    i18nKey: "DWB-PLAN-NIE-W-CALOSCI-PRZYDZIELONY",
    params: { reszta: Math.round((100 - suma) * 100) / 100 },
    technicalMessage: `suma udzialPlanuPct = ${suma} < 100 — reszta planu bez celu`,
    field: "cele",
  }
}

/** Info: heating data entered only in part, so the °C advice cannot be computed. */
export function ogrzewanieNiekompletne(): Warning {
  return {
    code: "DWB-OGRZEWANIE-NIEKOMPLETNE",
    level: "info",
    i18nKey: "DWB-OGRZEWANIE-NIEKOMPLETNE",
    technicalMessage: "podano tylko jedno z: udzialOgrzewaniaPct, roznicaTemperaturK",
    field: "roznicaTemperaturK",
  }
}
