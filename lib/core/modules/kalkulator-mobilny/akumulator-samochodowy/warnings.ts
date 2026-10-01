import type { Warning } from "@/lib/core/calc-result"

/** Source (Biblia §12.14 warning, Tresc E16 D): a starter battery is not built for deep, slow discharge. */
export function rozruchowyNieDoGlebokiego(): Warning {
  return {
    code: "AS-ROZRUCHOWY-NIE-DO-GLEBOKIEGO",
    level: "warning",
    i18nKey: "AS-ROZRUCHOWY-NIE-DO-GLEBOKIEGO",
    technicalMessage: "typ = rozruchowy — cienkie płyty pod krótki impuls rozruchu, głębokie rozładowanie skraca życie",
    field: "typ",
  }
}

/** 🔴 Tresc E16: planned discharge of a starter battery beyond its usable part — the engine may not start. */
export function rozruchowyPonadUzyteczna(planowanyH: number, czasH: number): Warning {
  return {
    code: "AS-ROZRUCHOWY-PONAD-UZYTECZNA",
    level: "critical",
    i18nKey: "AS-ROZRUCHOWY-PONAD-UZYTECZNA",
    params: { planowany: planowanyH, czas: Number(czasH.toFixed(1)) },
    technicalMessage: `planowanyCzasH = ${planowanyH} > czas do granicy użytecznej ${czasH.toFixed(2)} h (rozruchowy)`,
    field: "planowanyCzasH",
  }
}

/** Deep-cycle battery (AGM/flooded): plan exceeds the share of capacity the user allowed. */
export function ponadUzyteczna(planowanyH: number, czasH: number): Warning {
  return {
    code: "AS-PONAD-UZYTECZNA",
    level: "warning",
    i18nKey: "AS-PONAD-UZYTECZNA",
    params: { planowany: planowanyH, czas: Number(czasH.toFixed(1)) },
    technicalMessage: `planowanyCzasH = ${planowanyH} > czas do granicy użytecznej ${czasH.toFixed(2)} h`,
    field: "planowanyCzasH",
  }
}
