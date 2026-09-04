import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function dobryStyk(rezystancjaMOhm: number, strataCalkowitaW: number): Warning {
  return {
    code: "DOBRY-STYK",
    level: "info",
    message: `Rezystancja złączki (${rezystancjaMOhm.toFixed(2)} mΩ) mieści się w zakresie dobrego stanu (0,5-2 mΩ) — strata całkowita ${strataCalkowitaW.toFixed(1)} W.`,
    technicalMessage: `rezystancjaMOhm=${rezystancjaMOhm} <= 2`,
  }
}

export function podwyzszonaRezystancja(rezystancjaMOhm: number, strataCalkowitaW: number): Warning {
  return {
    code: "PODWYZSZONA-REZYSTANCJA",
    level: "warning",
    message: `Rezystancja złączki (${rezystancjaMOhm.toFixed(2)} mΩ) przekracza zakres dobrego stanu (0,5-2 mΩ) — strata całkowita ${strataCalkowitaW.toFixed(1)} W. Sprawdź złączkę pod kątem luzu/korozji.`,
    technicalMessage: `2 < rezystancjaMOhm=${rezystancjaMOhm} <= 20`,
  }
}

export function zlyStyk(rezystancjaMOhm: number, strataCalkowitaW: number): Warning {
  return {
    code: "ZLY-STYK",
    level: "critical",
    message: `Rezystancja złączki (${rezystancjaMOhm.toFixed(2)} mΩ) odpowiada luźnej/zaśniedziałej złączce (nawet 10× więcej niż dobry stan) — strata całkowita ${strataCalkowitaW.toFixed(1)} W i realne ryzyko przegrzania/pożaru. Wymień lub oczyść złączkę natychmiast.`,
    technicalMessage: `rezystancjaMOhm=${rezystancjaMOhm} > 20`,
  }
}
