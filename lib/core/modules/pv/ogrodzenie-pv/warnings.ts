import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0 (liczba rzędów: całkowita)`,
    field,
  }
}

/** I_D outside the PN-B-03020 chart for the group — the chart ends there, no extrapolation. */
export function zakresId(id: number, od: number, doo: number): Warning {
  return {
    code: "OG-ID-POZA-WYKRESEM",
    level: "critical",
    i18nKey: "OG-ID-POZA-WYKRESEM",
    params: { id, od, do: doo },
    technicalMessage: `stopienZageszczeniaId = ${id}, wykres PN-B-03020 obejmuje ${od}–${doo}`,
    field: "stopienZageszczeniaId",
  }
}

export function przeswitZaMaly(przeswitMm: number, minMm: number): Warning {
  return {
    code: "OG-PRZESWIT-ZA-MALY",
    level: "critical",
    i18nKey: "OG-PRZESWIT-ZA-MALY",
    params: { przeswit: przeswitMm, min: minMm },
    technicalMessage: `przeswitMm = ${przeswitMm} < ${minMm} (kurz i rozbryzgi brudzą panele od dołu)`,
    field: "przeswitMm",
  }
}

export function wysokoscPrzekroczona(wysokoscMm: number, maxMm: number): Warning {
  return {
    code: "OG-WYSOKOSC-PRZEKROCZONA",
    level: "critical",
    i18nKey: "OG-WYSOKOSC-PRZEKROCZONA",
    params: { wysokosc: wysokoscMm, max: maxMm },
    technicalMessage: `wysokość ogrodzenia ${wysokoscMm} mm > ${maxMm} mm`,
    field: "liczbaRzedow",
  }
}

export function brakMiejscaNaPanel(maxMm: number, minMm: number): Warning {
  return {
    code: "OG-BRAK-MIEJSCA-NA-PANEL",
    level: "critical",
    i18nKey: "OG-BRAK-MIEJSCA-NA-PANEL",
    params: { max: maxMm, min: minMm },
    technicalMessage: `limit wysokości ${maxMm} mm < prześwit + jeden rząd = ${minMm} mm`,
    field: "maxWysokoscMm",
  }
}

export function scianaWolnostojaca(cp: number): Warning {
  return {
    code: "OG-SCIANA-WOLNOSTOJACA",
    level: "warning",
    i18nKey: "OG-SCIANA-WOLNOSTOJACA",
    params: { cp },
    technicalMessage: `z_g ≤ h/4 i b/h > 1 → PN-EN 1991-1-4 7.4.3 (3): ściana wolno stojąca, Tablica 7.9 (pole A, φ = 1, ℓ/h ≥ 10) cp,net = ${cp} dla wszystkich słupków (zachowawczo)`,
  }
}

export function brakProfiluSlupka(): Warning {
  return {
    code: "OG-BRAK-PROFILU-SLUPKA",
    level: "critical",
    i18nKey: "OG-BRAK-PROFILU-SLUPKA",
    technicalMessage: "żaden profil z katalogu nie przenosi momentu u podstawy słupka — zmniejsz wysokość, rozstaw albo liczbę rzędów",
  }
}

export function brakProfiluRygla(): Warning {
  return {
    code: "OG-BRAK-PROFILU-RYGLA",
    level: "critical",
    i18nKey: "OG-BRAK-PROFILU-RYGLA",
    technicalMessage: "żaden profil z katalogu nie przenosi obciążenia rygla (nośność lub ugięcie) na tej rozpiętości",
  }
}

export function przemarzanieDecyduje(przemarzanieM: number, obliczoneM: number): Warning {
  return {
    code: "OG-PRZEMARZANIE-DECYDUJE",
    level: "info",
    i18nKey: "OG-PRZEMARZANIE-DECYDUJE",
    params: { przemarzanie: przemarzanieM, obliczone: obliczoneM.toFixed(2) },
    technicalMessage: `głębokość przemarzania ${przemarzanieM} m > obliczona ${obliczoneM.toFixed(2)} m`,
  }
}

export function licowanie(przesuniecieMm: number): Warning {
  return {
    code: "OG-LICOWANIE",
    level: "info",
    i18nKey: "OG-LICOWANIE",
    params: { przesuniecie: przesuniecieMm },
    technicalMessage: `głębokość słupka − (rygiel + panel) = ${przesuniecieMm} mm (0 = wspólna płaszczyzna)`,
  }
}

export function zrodlaDoPotwierdzenia(): Warning {
  return {
    code: "OG-ZRODLA-DO-POTWIERDZENIA",
    level: "warning",
    i18nKey: "OG-ZRODLA-DO-POTWIERDZENIA",
    technicalMessage: "stal (fy, γM0, klasa przekroju, E) wg PN-EN 1993-1-1 oraz wzór Bromsa nie mają źródła w repozytorium — wartości do potwierdzenia",
  }
}
