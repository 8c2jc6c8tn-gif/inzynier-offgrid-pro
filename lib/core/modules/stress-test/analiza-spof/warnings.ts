import type { Warning } from "@/lib/core/calc-result"
import type { TypKomponentu } from "./input"

/** Klucz komunikatu per typ — zalecenia z sekcji C źródła (BMS, bezpiecznik główny, pompa ciepła); reszta ogólny. */
const KLUCZ: Partial<Record<TypKomponentu, string>> = {
  "bezpiecznik-glowny": "SPOF-BEZPIECZNIK-GLOWNY",
  "pompa-ciepla": "SPOF-POMPA-CIEPLA",
}

export function bmsBezObejscia(nazwa: string, indeks: number): Warning {
  return {
    code: "SPOF-BMS",
    level: "critical",
    i18nKey: "SPOF-BMS",
    params: { nazwa },
    technicalMessage: `komponenty[${indeks}]: typ=bms, maRedundancje=false (Tresc_Modul_7, Ekran 10, 🔴)`,
    field: `komponenty.${indeks}`,
  }
}

export function pojedynczyPunktAwarii(typ: TypKomponentu, nazwa: string, indeks: number): Warning {
  const klucz = KLUCZ[typ] ?? "SPOF-KOMPONENT"
  return {
    code: klucz,
    level: "warning",
    i18nKey: klucz,
    params: { nazwa },
    technicalMessage: `komponenty[${indeks}]: typ=${typ}, maRedundancje=false (Tresc_Modul_7, Ekran 10, B/C)`,
    field: `komponenty.${indeks}`,
  }
}
