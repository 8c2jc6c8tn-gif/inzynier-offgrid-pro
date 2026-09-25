import type { Warning } from "@/lib/core/calc-result"

export function rekomendacjaMikroinwertery(): Warning {
  return {
    code: "REKOMENDACJA-MIKROINWERTERY",
    level: "info",
    i18nKey: "REKOMENDACJA-MIKROINWERTERY",
    technicalMessage: "regularneZacienienie=true — reguła źródła (Ekran 21, Sekcja C)",
  }
}

export function rekomendacjaCentralny(): Warning {
  return {
    code: "REKOMENDACJA-INWERTER-CENTRALNY",
    level: "info",
    i18nKey: "REKOMENDACJA-INWERTER-CENTRALNY",
    technicalMessage: "regularneZacienienie=false — przewaga mikroinwerterów (cień) nie dotyczy; tabela: koszt centralnego niższy",
  }
}

/**
 * ✏️ Uzupełnienie eksperckie (nie ze źródła, 🔎 do potwierdzenia przez właściciela projektu,
 * `docs/rejestr-pokrycia.md` Ekran 21): typowy mikroinwerter jest falownikiem sieciowym —
 * w off-gridzie wymaga źródła napięcia odniesienia (sprzężenie AC z falownikiem wyspowym).
 */
export function mikroinwerterWymagaSprzezeniaAc(): Warning {
  return {
    code: "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC",
    level: "warning",
    i18nKey: "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC",
    technicalMessage: "mikroinwerter = falownik nadążny (grid-following); off-grid wymaga falownika grid-forming w sprzężeniu AC",
  }
}
