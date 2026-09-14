import type { Warning } from "@/lib/core/calc-result"
import { MAX_CZAS_ZADZIALANIA_RCD_S, MIN_REZYSTANCJA_IZOLACJI_MOHM } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function ciagloscNiepotwierdzona(): Warning {
  return {
    code: "CIAGLOSC-NIEPOTWIERDZONA",
    level: "critical",
    message: "Ciągłość przewodów ochronnych nie potwierdzona — wszystkie muszą być połączone z GSW.",
    technicalMessage: "ciagloscPotwierdzona=false",
  }
}

export function rezystancjaIzolacjiZaNiska(wartoscMohm: number): Warning {
  return {
    code: "REZYSTANCJA-IZOLACJI-ZA-NISKA",
    level: "critical",
    message: `Rezystancja izolacji ${wartoscMohm} MΩ jest poniżej wymaganego minimum ${MIN_REZYSTANCJA_IZOLACJI_MOHM} MΩ.`,
    technicalMessage: `rezystancjaIzolacjiMohm=${wartoscMohm} <= ${MIN_REZYSTANCJA_IZOLACJI_MOHM}`,
  }
}

export function rezystancjaUziemieniaNiezmierzona(): Warning {
  return {
    code: "REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA",
    level: "critical",
    message: "Rezystancja uziemienia jeszcze nie zmierzona.",
    technicalMessage: "rezystancjaUziemieniaOhm=0",
  }
}

export function rezystancjaUziemieniaZaWysoka(wartoscOhm: number, progOhm: number): Warning {
  return {
    code: "REZYSTANCJA-UZIEMIENIA-ZA-WYSOKA",
    level: "critical",
    message: `Rezystancja uziemienia ${wartoscOhm} Ω przekracza wymagany próg ${progOhm} Ω.`,
    technicalMessage: `rezystancjaUziemieniaOhm=${wartoscOhm} >= ${progOhm}`,
  }
}

export function czasRcdNiezmierzony(): Warning {
  return {
    code: "CZAS-RCD-NIEZMIERZONY",
    level: "critical",
    message: "Czas zadziałania RCD jeszcze nie zmierzony.",
    technicalMessage: "czasZadzialaniaRcdS=0",
  }
}

export function czasRcdZaDlugi(czasS: number): Warning {
  return {
    code: "CZAS-RCD-ZA-DLUGI",
    level: "critical",
    message: `RCD zadziałał po ${czasS} s — wymagane poniżej ${MAX_CZAS_ZADZIALANIA_RCD_S} s.`,
    technicalMessage: `czasZadzialaniaRcdS=${czasS} >= ${MAX_CZAS_ZADZIALANIA_RCD_S}`,
  }
}

export function testZwarciowyNiepotwierdzony(): Warning {
  return {
    code: "TEST-ZWARCIOWY-NIEPOTWIERDZONY",
    level: "critical",
    message: "Test zwarciowy pętli nie potwierdzony — zabezpieczenie musi zadziałać przy symulowanym zwarciu.",
    technicalMessage: "testZwarciowyPotwierdzony=false",
  }
}

export function termowizjaNiepotwierdzona(): Warning {
  return {
    code: "TERMOWIZJA-NIEPOTWIERDZONA",
    level: "critical",
    message: "Termowizja połączeń nie potwierdzona — sprawdź brak gorących punktów pod obciążeniem.",
    technicalMessage: "termowizjaPotwierdzona=false",
  }
}

export function wszystkoOk(): Warning {
  return {
    code: "WSZYSTKO-OK",
    level: "info",
    message: "Wszystkie pomiary i testy powykonawcze w normie — formalny odbiór instalacji możliwy.",
    technicalMessage: "wszystkie sprawdzenia w progu",
  }
}
