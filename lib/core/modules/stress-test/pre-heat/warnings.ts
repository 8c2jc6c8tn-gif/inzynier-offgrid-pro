import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function copNiedodatni(value: number): Warning {
  return {
    code: "PREHEAT-COP-NIEDODATNI",
    level: "critical",
    i18nKey: "PREHEAT-COP-NIEDODATNI",
    technicalMessage: `cop = ${value}, oczekiwano > 0`,
    field: "cop",
  }
}

export function grzanieNocaZBaterii(): Warning {
  return {
    code: "PREHEAT-GRZANIE-NOCA-Z-BATERII",
    level: "critical",
    i18nKey: "PREHEAT-GRZANIE-NOCA-Z-BATERII",
    technicalMessage: "zrodloEnergii = bateria-noc (Tresc_Modul_7, Ekran 18, 🔴)",
    field: "zrodloEnergii",
  }
}

export function brakNadwyzkiPv(potrzebne: number, nadwyzka: number): Warning {
  return {
    code: "PREHEAT-ZA-MALA-NADWYZKA",
    level: "warning",
    i18nKey: "PREHEAT-ZA-MALA-NADWYZKA",
    params: { potrzebne: potrzebne.toFixed(1), nadwyzka: nadwyzka.toFixed(1) },
    technicalMessage: `energiaElektrycznaKwh=${potrzebne} > nadwyzkaPvKwh=${nadwyzka}`,
    field: "nadwyzkaPvKwh",
  }
}
