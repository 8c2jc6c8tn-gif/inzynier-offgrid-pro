import type { Warning } from "@/lib/core/calc-result"
import { MAX_ROZNICA_NAPIEC_V } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 * Treść cytatów 🔴 1:1 ze źródła (docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, Ekran A1).
 */

export function napiecieOgniwaNiedodatnie(index: number, value: number): Warning {
  return {
    code: "NAPIECIE-OGNIWA-NIEDODATNIE",
    level: "critical",
    i18nKey: "NAPIECIE-OGNIWA-NIEDODATNIE",
    params: { numer: index + 1 },
    technicalMessage: `napieciaOgniwV[${index}] = ${value}, oczekiwano > 0`,
    field: "napieciaOgniwV",
  }
}

export function brakBmsZBalancerem(): Warning {
  return {
    code: "BRAK-BMS-Z-BALANSEREM",
    level: "critical",
    i18nKey: "BRAK-BMS-Z-BALANSEREM",
    technicalMessage: "bmsMaBalancer = false",
  }
}

export function roznicaNapiecOgniwZaDuza(minV: number, maxV: number, roznicaV: number): Warning {
  return {
    code: "ROZNICA-NAPIEC-OGNIW-ZA-DUZA",
    level: "critical",
    i18nKey: "ROZNICA-NAPIEC-OGNIW-ZA-DUZA",
    params: { roznica: roznicaV.toFixed(3), prog: MAX_ROZNICA_NAPIEC_V },
    technicalMessage: `min=${minV}V, max=${maxV}V, różnica=${roznicaV}V, próg=${MAX_ROZNICA_NAPIEC_V}V`,
    field: "napieciaOgniwV",
  }
}

/** Nie oznaczone 🔴 w źródle (w odróżnieniu od dwóch powyższych) — stąd poziom "warning", nie "critical". */
export function liczbaOgniwNiezgodna(
  napiecieSystemu: number,
  oczekiwana: number,
  podana: number,
): Warning {
  return {
    code: "LICZBA-OGNIW-NIEZGODNA",
    level: "warning",
    i18nKey: "LICZBA-OGNIW-NIEZGODNA",
    params: { system: napiecieSystemu, oczekiwana, podana },
    technicalMessage: `napiecieSystemu=${napiecieSystemu}, oczekiwana=${oczekiwana}, podana=${podana}`,
    field: "napieciaOgniwV",
  }
}
