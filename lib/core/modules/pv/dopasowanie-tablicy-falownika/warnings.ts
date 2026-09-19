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

export function oknoMpptOdwrocone(mpptMinV: number, mpptMaxV: number): Warning {
  return {
    code: "OKNO-MPPT-ODWROCONE",
    level: "critical",
    i18nKey: "OKNO-MPPT-ODWROCONE",
    technicalMessage: `mpptMinV=${mpptMinV} > mpptMaxV=${mpptMaxV}`,
  }
}

export function napiecieZimoweZaWysokie(vStringColdV: number, vMaxFalownikaV: number): Warning {
  return {
    code: "NAPIECIE-ZIMOWE-ZA-WYSOKIE",
    level: "critical",
    i18nKey: "NAPIECIE-ZIMOWE-ZA-WYSOKIE",
    params: { vStringCold: vStringColdV.toFixed(1), vMax: vMaxFalownikaV.toFixed(1) },
    technicalMessage: `vStringColdV=${vStringColdV} > vMaxFalownikaV=${vMaxFalownikaV}`,
  }
}

export function napiecieZimoweOk(vStringColdV: number, vMaxFalownikaV: number): Warning {
  return {
    code: "NAPIECIE-ZIMOWE-OK",
    level: "info",
    i18nKey: "NAPIECIE-ZIMOWE-OK",
    params: { vStringCold: vStringColdV.toFixed(1), vMax: vMaxFalownikaV.toFixed(1) },
    technicalMessage: `vStringColdV=${vStringColdV} <= vMaxFalownikaV=${vMaxFalownikaV}`,
  }
}

export function ponizejOknaMppt(vStringStcV: number, mpptMinV: number): Warning {
  return {
    code: "PONIZEJ-OKNA-MPPT",
    level: "critical",
    i18nKey: "PONIZEJ-OKNA-MPPT",
    params: { vStringStc: vStringStcV.toFixed(1), mpptMin: mpptMinV.toFixed(1) },
    technicalMessage: `vStringStcV=${vStringStcV} < mpptMinV=${mpptMinV}`,
  }
}

export function powyzejOknaMppt(vStringStcV: number, mpptMaxV: number): Warning {
  return {
    code: "POWYZEJ-OKNA-MPPT",
    level: "warning",
    i18nKey: "POWYZEJ-OKNA-MPPT",
    params: { vStringStc: vStringStcV.toFixed(1), mpptMax: mpptMaxV.toFixed(1) },
    technicalMessage: `vStringStcV=${vStringStcV} > mpptMaxV=${mpptMaxV}`,
  }
}

export function wOknieMppt(vStringStcV: number, mpptMinV: number, mpptMaxV: number): Warning {
  return {
    code: "W-OKNIE-MPPT",
    level: "info",
    i18nKey: "W-OKNIE-MPPT",
    params: { vStringStc: vStringStcV.toFixed(1), mpptMin: mpptMinV.toFixed(1), mpptMax: mpptMaxV.toFixed(1) },
    technicalMessage: `mpptMinV=${mpptMinV} <= vStringStcV=${vStringStcV} <= mpptMaxV=${mpptMaxV}`,
  }
}

export function pradPrzekroczony(iStringA: number, iMaxMpptA: number): Warning {
  return {
    code: "PRAD-PRZEKROCZONY",
    level: "critical",
    i18nKey: "PRAD-PRZEKROCZONY",
    params: { iString: iStringA.toFixed(1), iMax: iMaxMpptA.toFixed(1) },
    technicalMessage: `iStringA=${iStringA} > iMaxMpptA=${iMaxMpptA}`,
  }
}

export function pradOk(iStringA: number, iMaxMpptA: number): Warning {
  return {
    code: "PRAD-OK",
    level: "info",
    i18nKey: "PRAD-OK",
    params: { iString: iStringA.toFixed(1), iMax: iMaxMpptA.toFixed(1) },
    technicalMessage: `iStringA=${iStringA} <= iMaxMpptA=${iMaxMpptA}`,
  }
}

export function przewymiarowanieZaMale(dcAcRatio: number, minZalecany: number): Warning {
  return {
    code: "DC-AC-ZA-MALE",
    level: "warning",
    i18nKey: "DC-AC-ZA-MALE",
    params: { ratio: dcAcRatio.toFixed(2), min: minZalecany.toFixed(1) },
    technicalMessage: `dcAcRatio=${dcAcRatio} < ${minZalecany}`,
  }
}

export function przewymiarowanieZaDuze(dcAcRatio: number, maxZalecany: number): Warning {
  return {
    code: "DC-AC-ZA-DUZE",
    level: "warning",
    i18nKey: "DC-AC-ZA-DUZE",
    params: { ratio: dcAcRatio.toFixed(2), max: maxZalecany.toFixed(1) },
    technicalMessage: `dcAcRatio=${dcAcRatio} > ${maxZalecany}`,
  }
}

export function przewymiarowanieOk(dcAcRatio: number): Warning {
  return {
    code: "DC-AC-OK",
    level: "info",
    i18nKey: "DC-AC-OK",
    params: { ratio: dcAcRatio.toFixed(2) },
    technicalMessage: `1.1 <= dcAcRatio=${dcAcRatio} <= 1.3`,
  }
}
