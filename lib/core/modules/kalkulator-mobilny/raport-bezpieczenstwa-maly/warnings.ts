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

/**
 * 🔴 D68 (owner decision 01.10.2026): a fuse rated above the ampacity of the cable it protects lets the cable
 * overheat and ignite before the fuse opens (Biblia §12.22 „poprawność doboru bezpieczników”).
 */
export function bezpiecznikWiekszyNizPrzewod(): Warning {
  return {
    code: "RB-BEZPIECZNIK-WIEKSZY-NIZ-PRZEWOD",
    level: "critical",
    i18nKey: "RB-BEZPIECZNIK-WIEKSZY-NIZ-PRZEWOD",
    technicalMessage: "bezpiecznik-a-przewod = blad — prąd bezpiecznika > obciążalność chronionego przewodu",
    field: "bezpiecznik-a-przewod",
  }
}

type PunktZNaprawa = Exclude<IdPunktuRaportu, "bezpiecznik-akumulatora" | "bezpiecznik-a-przewod">

const NAPRAWA: Record<PunktZNaprawa, string> = {
  "dobor-bezpiecznikow": "RB-NAPRAWA-DOBOR-BEZPIECZNIKOW",
  "przekroje-przewodow": "RB-NAPRAWA-PRZEKROJE-PRZEWODOW",
  "ochrona-rozladowania": "RB-NAPRAWA-OCHRONA-ROZLADOWANIA",
  "wentylacja-akumulatora": "RB-NAPRAWA-WENTYLACJA-AKUMULATORA",
  polaczenia: "RB-NAPRAWA-POLACZENIA",
}

/** A failed checkpoint with its repair step (Biblia §12.22: „Wskazuje błędy i zagrożenia. Podaje kroki naprawcze.”). */
export function doNaprawy(id: PunktZNaprawa): Warning {
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
