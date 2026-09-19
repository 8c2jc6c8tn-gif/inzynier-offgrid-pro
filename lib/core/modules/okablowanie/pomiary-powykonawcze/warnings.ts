import type { Warning } from "@/lib/core/calc-result"
import { MAX_CZAS_ZADZIALANIA_RCD_S, MIN_REZYSTANCJA_IZOLACJI_MOHM } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function ciagloscNiepotwierdzona(): Warning {
  return {
    code: "CIAGLOSC-NIEPOTWIERDZONA",
    level: "critical",
    i18nKey: "CIAGLOSC-NIEPOTWIERDZONA",
    technicalMessage: "ciagloscPotwierdzona=false",
  }
}

export function rezystancjaIzolacjiZaNiska(wartoscMohm: number): Warning {
  return {
    code: "REZYSTANCJA-IZOLACJI-ZA-NISKA",
    level: "critical",
    i18nKey: "REZYSTANCJA-IZOLACJI-ZA-NISKA",
    params: { wartosc: wartoscMohm, min: MIN_REZYSTANCJA_IZOLACJI_MOHM },
    technicalMessage: `rezystancjaIzolacjiMohm=${wartoscMohm} <= ${MIN_REZYSTANCJA_IZOLACJI_MOHM}`,
  }
}

export function rezystancjaUziemieniaNiezmierzona(): Warning {
  return {
    code: "REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA",
    level: "critical",
    i18nKey: "REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA",
    technicalMessage: "rezystancjaUziemieniaOhm=0",
  }
}

export function rezystancjaUziemieniaZaWysoka(wartoscOhm: number, progOhm: number): Warning {
  return {
    code: "REZYSTANCJA-UZIEMIENIA-ZA-WYSOKA",
    level: "critical",
    i18nKey: "REZYSTANCJA-UZIEMIENIA-ZA-WYSOKA",
    params: { wartosc: wartoscOhm, prog: progOhm },
    technicalMessage: `rezystancjaUziemieniaOhm=${wartoscOhm} >= ${progOhm}`,
  }
}

export function czasRcdNiezmierzony(): Warning {
  return {
    code: "CZAS-RCD-NIEZMIERZONY",
    level: "critical",
    i18nKey: "CZAS-RCD-NIEZMIERZONY",
    technicalMessage: "czasZadzialaniaRcdS=0",
  }
}

export function czasRcdZaDlugi(czasS: number): Warning {
  return {
    code: "CZAS-RCD-ZA-DLUGI",
    level: "critical",
    i18nKey: "CZAS-RCD-ZA-DLUGI",
    params: { czas: czasS, max: MAX_CZAS_ZADZIALANIA_RCD_S },
    technicalMessage: `czasZadzialaniaRcdS=${czasS} >= ${MAX_CZAS_ZADZIALANIA_RCD_S}`,
  }
}

export function testZwarciowyNiepotwierdzony(): Warning {
  return {
    code: "TEST-ZWARCIOWY-NIEPOTWIERDZONY",
    level: "critical",
    i18nKey: "TEST-ZWARCIOWY-NIEPOTWIERDZONY",
    technicalMessage: "testZwarciowyPotwierdzony=false",
  }
}

export function termowizjaNiepotwierdzona(): Warning {
  return {
    code: "TERMOWIZJA-NIEPOTWIERDZONA",
    level: "critical",
    i18nKey: "TERMOWIZJA-NIEPOTWIERDZONA",
    technicalMessage: "termowizjaPotwierdzona=false",
  }
}

export function wszystkoOk(): Warning {
  return {
    code: "WSZYSTKO-OK",
    level: "info",
    i18nKey: "WSZYSTKO-OK",
    technicalMessage: "wszystkie sprawdzenia w progu",
  }
}
