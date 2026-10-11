import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return { code: "PROGSOC-WARTOSC-UJEMNA", level: "critical", i18nKey: "PROGSOC-WARTOSC-UJEMNA", technicalMessage: `${field} = ${value}, oczekiwano >= 0`, field }
}

export function wartoscNiedodatnia(field: string, value: number): Warning {
  return { code: "PROGSOC-WARTOSC-NIEDODATNIA", level: "critical", i18nKey: "PROGSOC-WARTOSC-NIEDODATNIA", technicalMessage: `${field} = ${value}, oczekiwano > 0`, field }
}

export function wartoscPozaZakresem(field: string, value: number, min: number, max: number): Warning {
  return {
    code: "PROGSOC-WARTOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "PROGSOC-WARTOSC-POZA-ZAKRESEM",
    params: { min, max },
    technicalMessage: `${field} = ${value}, oczekiwano ${min}…${max}`,
    field,
  }
}

export function minNieMniejszeOdMax(min: number, max: number): Warning {
  return {
    code: "PROGSOC-MIN-NIE-MNIEJSZE-OD-MAX",
    level: "critical",
    i18nKey: "PROGSOC-MIN-NIE-MNIEJSZE-OD-MAX",
    params: { min, max },
    technicalMessage: `socMinPct = ${min} >= socMaksPct = ${max}`,
    field: "socMinPct",
  }
}

/** The battery reaches its lowest allowed charge. */
export function bateriaOsiagnieMinimum(godz: number, min: number): Warning {
  return {
    code: "PROGSOC-OSIAGNIE-MINIMUM",
    level: "warning",
    i18nKey: "PROGSOC-OSIAGNIE-MINIMUM",
    params: { godz, min },
    technicalMessage: `SoC osiąga minimum ${min}% po ${godz} h`,
  }
}

/** Part of the consumption could not be covered. */
export function niedobor(kwh: number, godziny: number): Warning {
  return {
    code: "PROGSOC-NIEDOBOR",
    level: "warning",
    i18nKey: "PROGSOC-NIEDOBOR",
    params: { kwh, godziny },
    technicalMessage: `Niedobór ${kwh} kWh w ${godziny} godz. — odbiorniki bez zasilania z baterii`,
  }
}

export function startPonizejMinimum(start: number, min: number): Warning {
  return {
    code: "PROGSOC-START-PONIZEJ-MINIMUM",
    level: "warning",
    i18nKey: "PROGSOC-START-PONIZEJ-MINIMUM",
    params: { start, min },
    technicalMessage: `SoC startowy ${start}% < minimum ${min}% — bateria nie rozładuje się dalej`,
  }
}

export function nadwyzkaPonadBateria(kwh: number): Warning {
  return {
    code: "PROGSOC-NADWYZKA",
    level: "info",
    i18nKey: "PROGSOC-NADWYZKA",
    params: { kwh },
    technicalMessage: `${kwh} kWh produkcji nie mieści się w baterii (pełna albo limit mocy ładowania)`,
  }
}

export function brakSprawnosci(): Warning {
  return {
    code: "PROGSOC-BRAK-SPRAWNOSCI",
    level: "info",
    i18nKey: "PROGSOC-BRAK-SPRAWNOSCI",
    technicalMessage: "Nie wpisano sprawności ładowania / rozładowania — liczone jako 100 %",
  }
}

export function brakWspolczynnikow(): Warning {
  return {
    code: "PROGSOC-BRAK-WSPOLCZYNNIKOW",
    level: "info",
    i18nKey: "PROGSOC-BRAK-WSPOLCZYNNIKOW",
    technicalMessage: "Nie wpisano udziału produkcji PV na kolejne doby — każda doba ma ten sam profil (100 %)",
  }
}
