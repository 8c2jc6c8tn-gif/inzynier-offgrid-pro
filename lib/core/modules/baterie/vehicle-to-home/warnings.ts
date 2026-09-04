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

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Sprawność efektywna musi być z przedziału 0–100%.",
    technicalMessage: `sprawnoscEfektywnaPct = ${value}, oczekiwano [0, 100]`,
    field: "sprawnoscEfektywnaPct",
  }
}

export function rezerwaWiekszaNizPojemnosc(rezerwa: number, pojemnosc: number): Warning {
  return {
    code: "REZERWA-WIEKSZA-NIZ-POJEMNOSC",
    level: "critical",
    message: "Rezerwa na dojazd nie może być większa niż cała pojemność baterii.",
    technicalMessage: `rezerwaNaDojazdKwh=${rezerwa} > pojemnoscBaterEvKwh=${pojemnosc}`,
    field: "rezerwaNaDojazdKwh",
  }
}

export function tylkoV2l(): Warning {
  return {
    code: "TYLKO-V2L",
    level: "warning",
    message:
      "Auto/falownik wspierają tylko V2L (niższa moc, przykładowo do ok. 3,6 kW) — nie zasilisz nim całego domu, tylko pojedyncze urządzenia.",
    technicalMessage: "wspieraV2h=false",
  }
}
