import type { Warning } from "@/lib/core/calc-result"

export function brakOchrony(): Warning {
  return {
    code: "BRAK-OCHRONY",
    level: "critical",
    message: "Brak jakiejkolwiek ochrony przed odwrotną polaryzacją na obwodzie, gdzie łatwo pomylić plus i minus.",
    technicalMessage: "typOchrony=brak",
  }
}

export function ochronaZastosowana(): Warning {
  return {
    code: "OCHRONA-ZASTOSOWANA",
    level: "info",
    message: "Ochrona przed odwrotną polaryzacją zastosowana.",
    technicalMessage: "typOchrony != brak",
  }
}
