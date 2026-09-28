import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "ESP-SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "ESP-SPRAWNOSC-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscPct",
  }
}

export function bezposrednioZMagistrali(): Warning {
  return {
    code: "ESP-BEZ-PRZETWORNICY",
    level: "critical",
    i18nKey: "ESP-BEZ-PRZETWORNICY",
    technicalMessage: "sposob = bezposrednio (Tresc_Modul_9, Ekran 2, 🔴)",
    field: "sposob",
  }
}

export function napiecieWejsciaPrzekroczone(uMax: number, uWe: number): Warning {
  return {
    code: "ESP-PRZETWORNICA-ZA-NISKIE-WEJSCIE",
    level: "critical",
    i18nKey: "ESP-PRZETWORNICA-ZA-NISKIE-WEJSCIE",
    params: { umax: uMax, uwe: uWe },
    technicalMessage: `napiecieMagistraliMaxV=${uMax} > napiecieWejscioweMaxV=${uWe} (Biblia §9.2: przetwornica z odpowiednim zakresem wejściowym)`,
    field: "napiecieWejscioweMaxV",
  }
}

export function pradWyjsciowyPrzekroczony(iOut: number, iMax: number): Warning {
  return {
    code: "ESP-PRZETWORNICA-PRZECIAZONA",
    level: "warning",
    i18nKey: "ESP-PRZETWORNICA-PRZECIAZONA",
    params: { iout: iOut.toFixed(2), imax: iMax },
    technicalMessage: `pradWyjsciowyA=${iOut} > pradWyjsciowyMaxA=${iMax}`,
    field: "pradWyjsciowyMaxA",
  }
}

export function bezpiecznikIFiltr(iIn: number): Warning {
  return {
    code: "ESP-BEZPIECZNIK-FILTR",
    level: "info",
    i18nKey: "ESP-BEZPIECZNIK-FILTR",
    params: { iin: iIn.toFixed(2) },
    technicalMessage: `pradWejsciowyA=${iIn} — bezpiecznik na wejściu i filtr przy zasilaniu z PV (Biblia §9.2)`,
  }
}
