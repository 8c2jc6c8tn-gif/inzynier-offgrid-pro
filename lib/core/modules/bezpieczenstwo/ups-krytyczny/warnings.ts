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

export function brakZaznaczonych(): Warning {
  return {
    code: "BRAK-ZAZNACZONYCH",
    level: "warning",
    i18nKey: "BRAK-ZAZNACZONYCH-URZADZEN",
    technicalMessage: "selected.length === 0",
  }
}

export function czasPodtrzymaniaInfo(czasPodtrzymaniaH: number): Warning {
  return {
    code: "CZAS-PODTRZYMANIA",
    level: "info",
    i18nKey: "CZAS-PODTRZYMANIA",
    params: { czas: czasPodtrzymaniaH.toFixed(2) },
    technicalMessage: `czasPodtrzymaniaH=${czasPodtrzymaniaH}`,
  }
}

export function brakPriorytetu(nazwy: string[]): Warning {
  return {
    code: "UPS-BRAK-PRIORYTETU",
    level: "info",
    params: { nazwy: nazwy.join(", ") },
    technicalMessage: `no shedding priority for: ${nazwy.join(", ")}`,
  }
}

export function progOdRazu(progMin: number): Warning {
  return {
    code: "UPS-PROG-OD-RAZU",
    level: "info",
    params: { prog: progMin },
    technicalMessage: `threshold ${progMin} min >= run time at full load — shedding starts at once`,
    field: "progOdcieciaMin",
  }
}

/** Source Ekran 6, Sekcja C (🔴) and the module's list of hard stops (Tresc_Modul_8, „zignorowany status UPS słaby”). */
export function akumulatorSlaby(): Warning {
  return {
    code: "UPS-AKUMULATOR-SLABY",
    level: "critical",
    technicalMessage: "UPS signals a weak battery — in a real failure the backup may not work at all",
    field: "akumulatorSlaby",
  }
}
