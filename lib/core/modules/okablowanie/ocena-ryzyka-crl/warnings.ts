import type { Warning } from "@/lib/core/calc-result"

export { wartoscPozaZakresem, wartoscUjemna } from "../../ogrzewanie/obciazenie-cieplne/warnings"

/** 443.4 a)–z1): SPD mandatory without a risk assessment. */
export function skutkiKrytyczne(): Warning {
  return {
    code: "CRL-SKUTKI-KRYTYCZNE",
    level: "warning",
    i18nKey: "CRL-SKUTKI-KRYTYCZNE",
    technicalMessage: "443.4 a)–z1) — ochrona przed przepięciami przejściowymi obowiązkowa, bez oceny CRL",
  }
}

/** 443.5: CRL < 1000 → protection against transient overvoltages of atmospheric origin required. */
export function spdWymagany(crl: number): Warning {
  return {
    code: "CRL-SPD-WYMAGANY",
    level: "warning",
    i18nKey: "CRL-SPD-WYMAGANY",
    params: { crl: crl.toFixed(1) },
    technicalMessage: `CRL = ${crl} < 1000`,
  }
}

/**
 * D54: CRL ≥ 1000 — the norm does not require SPD, but a type 2 SPD is cheap next to the equipment it protects; the owner
 * prefers fitting it more often than less. Recommendation, not a norm requirement.
 */
export function spdZalecany(): Warning {
  return {
    code: "CRL-SPD-ZALECANY",
    level: "info",
    i18nKey: "CRL-SPD-ZALECANY",
    technicalMessage: "CRL >= 1000 — nie wymagany przez 443.5, zalecany (D54, tani względem chronionego sprzętu)",
  }
}

/** L_P = 0: no supply line — 443.5 gives no requirement from lines (typical off-grid). */
export function brakLinii(): Warning {
  return {
    code: "CRL-BRAK-LINII",
    level: "info",
    i18nKey: "CRL-BRAK-LINII",
    technicalMessage: "L_P = 0 — brak linii zasilających, CRL → ∞",
  }
}

/** 443.4: switching overvoltages to be considered with LV generators, inductive/capacitive loads, storage units. */
export function przepieciaLaczeniowe(): Warning {
  return {
    code: "CRL-PRZEPIECIA-LACZENIOWE",
    level: "info",
    i18nKey: "CRL-PRZEPIECIA-LACZENIOWE",
    technicalMessage: "443.4 — rozważyć ochronę przed przepięciami łączeniowymi (generatory nn, magazyny, silniki)",
  }
}

/** 443.5 covers lines feeding the installation; the PV DC side is HD 60364-7-712 (712.443) — outside this calculation. */
export function stronaDcPoza(): Warning {
  return {
    code: "CRL-STRONA-DC-POZA",
    level: "info",
    i18nKey: "CRL-STRONA-DC-POZA",
    technicalMessage: "CRL dotyczy linii zasilających; strona DC generatora PV — HD 60364-7-712, poza tym obliczeniem",
  }
}
