import type { Warning } from "@/lib/core/calc-result"

/** 🟡 Biblia §12.25: "AGM w kamperze szybko padnie, jeśli rozładujesz go do zera" — DoD above the M4/E30 reference. */
export function agmZaGlebokoRozladowany(dodPct: number, referencyjnyPct: number): Warning {
  return {
    code: "AKK-AGM-ZA-GLEBOKO",
    level: "warning",
    i18nKey: "AKK-AGM-ZA-GLEBOKO",
    params: { dod: dodPct, ref: referencyjnyPct },
    technicalMessage: `agmDodPct=${dodPct} > ${referencyjnyPct} (M4/E30)`,
    field: "agmDodPct",
  }
}

/** 🟡 The battery bank exceeds the vehicle's spare payload. */
export function przekroczonaMasa(technologia: "agm" | "lfp", masaKg: number, zapasKg: number): Warning {
  const code = technologia === "agm" ? "AKK-PRZEKROCZONA-MASA-AGM" : "AKK-PRZEKROCZONA-MASA-LFP"
  return {
    code,
    level: "warning",
    i18nKey: code,
    params: { masa: Math.round(masaKg), zapas: zapasKg },
    technicalMessage: `${technologia}: masa=${masaKg.toFixed(1)} kg > zapasMasyKg=${zapasKg}`,
    field: "zapasMasyKg",
  }
}
