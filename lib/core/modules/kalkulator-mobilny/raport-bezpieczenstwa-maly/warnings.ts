import type { Warning } from "@/lib/core/calc-result"
import type { IdPunktuRaportu } from "./constants"

/** 🔴 Biblia §12.22: „Brak bezpiecznika przy akumulatorze! To niebezpieczne – zwarcie może spowodować pożar.” */
export function brakBezpiecznikaAkumulatora(): Warning {
  return {
    code: "RB-BRAK-BEZPIECZNIKA-AKUMULATORA",
    level: "critical",
    i18nKey: "RB-BRAK-BEZPIECZNIKA-AKUMULATORA",
    technicalMessage: "bezpiecznik-akumulatora = blad — zwarcie przewodu przy akumulatorze bez zabezpieczenia",
    field: "bezpiecznik-akumulatora",
  }
}

const NAPRAWA: Record<Exclude<IdPunktuRaportu, "bezpiecznik-akumulatora">, string> = {
  "dobor-bezpiecznikow": "RB-NAPRAWA-DOBOR-BEZPIECZNIKOW",
  "przekroje-przewodow": "RB-NAPRAWA-PRZEKROJE-PRZEWODOW",
  "ochrona-rozladowania": "RB-NAPRAWA-OCHRONA-ROZLADOWANIA",
  "wentylacja-akumulatora": "RB-NAPRAWA-WENTYLACJA-AKUMULATORA",
  polaczenia: "RB-NAPRAWA-POLACZENIA",
}

/** A failed checkpoint with its repair step (Biblia §12.22: „Wskazuje błędy i zagrożenia. Podaje kroki naprawcze.”). */
export function doNaprawy(id: Exclude<IdPunktuRaportu, "bezpiecznik-akumulatora">): Warning {
  return {
    code: NAPRAWA[id],
    level: "warning",
    i18nKey: NAPRAWA[id],
    technicalMessage: `${id} = blad`,
    field: id,
  }
}

export function niesprawdzone(n: number): Warning {
  return {
    code: "RB-NIESPRAWDZONE",
    level: "info",
    i18nKey: "RB-NIESPRAWDZONE",
    params: { n },
    technicalMessage: `${n} punktów bez odpowiedzi — liczą się jako niebezpieczne`,
  }
}
