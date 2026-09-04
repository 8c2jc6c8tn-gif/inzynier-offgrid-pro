import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function tanszaNizNowa(kosztZaKwh: number, cenaNowejZaKwh: number): Warning {
  return {
    code: "TANSZA-NIZ-NOWA",
    level: "info",
    message: `Koszt 1 kWh użytecznej z tej baterii (${kosztZaKwh.toFixed(0)} zł/kWh) jest niższy niż nowej LiFePO4 (${cenaNowejZaKwh.toFixed(0)} zł/kWh) — ale nowa ma 100% SoH i dłuższą żywotność.`,
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} < cenaNowejLiFePO4ZlZaKwh = ${cenaNowejZaKwh}`,
  }
}

export function drozszaNizNowa(kosztZaKwh: number, cenaNowejZaKwh: number): Warning {
  return {
    code: "DROZSZA-NIZ-NOWA",
    level: "warning",
    message: `Koszt 1 kWh użytecznej z tej baterii (${kosztZaKwh.toFixed(0)} zł/kWh) jest wyższy niż nowej LiFePO4 (${cenaNowejZaKwh.toFixed(0)} zł/kWh) — przy tej cenie zakupu nowa bateria się bardziej opłaca.`,
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} >= cenaNowejLiFePO4ZlZaKwh = ${cenaNowejZaKwh}`,
  }
}
