import type { Warning } from "@/lib/core/calc-result"

export function brakCertyfikatu(komponent: string): Warning {
  return {
    code: "BRAK-CERTYFIKATU",
    level: "critical",
    i18nKey: "BRAK-CERTYFIKATU",
    params: { komponent },
    technicalMessage: `komponent bez potwierdzonego certyfikatu: ${komponent}`,
  }
}
