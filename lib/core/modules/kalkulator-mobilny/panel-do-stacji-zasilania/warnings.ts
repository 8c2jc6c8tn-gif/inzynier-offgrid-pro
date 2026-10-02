import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function przekroczoneNapiecieWejscia(vocV: number, limitV: number): Warning {
  return {
    code: "PST-PRZEKROCZONE-NAPIECIE-WEJSCIA",
    level: "critical",
    i18nKey: "PST-PRZEKROCZONE-NAPIECIE-WEJSCIA",
    params: { voc: vocV.toFixed(1), limit: limitV.toFixed(0) },
    technicalMessage: `VocZimowe=${vocV} > maxNapiecieWejsciaV=${limitV}`,
  }
}

export function bliskoLimituNapiecia(vocV: number, limitV: number): Warning {
  return {
    code: "PST-BLISKO-LIMITU-NAPIECIA",
    level: "warning",
    i18nKey: "PST-BLISKO-LIMITU-NAPIECIA",
    params: { voc: vocV.toFixed(1), limit: limitV.toFixed(0) },
    technicalMessage: `VocZimowe=${vocV} > 95% × ${limitV}`,
  }
}

export function pradPowyzejLimitu(iscA: number, limitA: number): Warning {
  return {
    code: "PST-PRAD-POWYZEJ-LIMITU",
    level: "warning",
    i18nKey: "PST-PRAD-POWYZEJ-LIMITU",
    params: { isc: iscA.toFixed(1), limit: limitA.toFixed(1) },
    technicalMessage: `Isc×równolegle=${iscA} > maxPradWejsciaA=${limitA}`,
  }
}

export function polaryzacjaInfo(): Warning {
  return {
    code: "PST-SPRAWDZ-POLARYZACJE",
    level: "info",
    i18nKey: "PST-SPRAWDZ-POLARYZACJE",
    technicalMessage: "Biblia §12.54: ostrzeżenie przed odwrotnym podłączeniem",
  }
}
