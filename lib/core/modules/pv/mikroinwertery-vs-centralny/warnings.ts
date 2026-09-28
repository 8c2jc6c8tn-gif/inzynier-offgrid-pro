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
 * ✏️ Uzupełnienie eksperckie (nie ze źródła, potwierdzone przez właściciela projektu 25.09.2026,
 * `docs/rejestr-pokrycia.md` Ekran 21): typowy mikroinwerter jest falownikiem sieciowym —
 * w off-gridzie wymaga źródła napięcia odniesienia (sprzężenie AC z falownikiem wyspowym).
 * Od 28.09.2026 🟡 tylko, gdy user ma taki falownik (zostaje: zgodność konkretnego modelu).
 */
export function mikroinwerterWymagaSprzezeniaAc(): Warning {
  return {
    code: "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC",
    level: "warning",
    i18nKey: "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC",
    technicalMessage: "mikroinwerter = falownik nadążny (grid-following); off-grid wymaga falownika grid-forming w sprzężeniu AC",
  }
}

/**
 * ✏️ Twardy stop (decyzja właściciela projektu 28.09.2026): mikroinwertery bez falownika wyspowego
 * z obsługą sprzężenia AC — instalacja nie wystartuje. „Nie wiem” = strona bezpieczna.
 */
export function mikroinwerterBezFalownikaWyspowego(): Warning {
  return {
    code: "MIKROINWERTER-OFFGRID-BEZ-FALOWNIKA-WYSPOWEGO",
    level: "critical",
    i18nKey: "MIKROINWERTER-OFFGRID-BEZ-FALOWNIKA-WYSPOWEGO",
    technicalMessage: "falownikWyspowyAcCoupling ∈ {nie, nie-wiem} — mikroinwertery (grid-following) bez źródła napięcia odniesienia",
  }
}
