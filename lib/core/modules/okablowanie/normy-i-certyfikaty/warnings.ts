import type { Warning } from "@/lib/core/calc-result"

export function brakCertyfikatu(komponentKey: string): Warning {
  return {
    code: "BRAK-CERTYFIKATU",
    level: "critical",
    i18nKey: "BRAK-CERTYFIKATU",
    params: { komponentKey },
    technicalMessage: `komponent bez potwierdzonego certyfikatu: ${komponentKey}`,
  }
}
