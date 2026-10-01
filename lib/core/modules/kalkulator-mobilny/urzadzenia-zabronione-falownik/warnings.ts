import type { Warning } from "@/lib/core/calc-result"

/** 🔴 Biblia §12.52: "Suszarka 1800W podłączona do falownika 1000W spali go przy starcie." */
export function urzadzenieZabronione(nazwa: string, mocW: number, rozruchW: number, mocFalownikaW: number, szczytW: number): Warning {
  return {
    code: "UZF-URZADZENIE-ZABRONIONE",
    level: "critical",
    i18nKey: "UZF-URZADZENIE-ZABRONIONE",
    params: { nazwa, moc: mocW, rozruch: Math.ceil(rozruchW), falownik: mocFalownikaW, szczyt: szczytW },
    technicalMessage: `${nazwa}: P=${mocW} W, start=${rozruchW} W vs ${mocFalownikaW}/${szczytW} W`,
  }
}

/** 🟡 The device starts only thanks to the inverter's overload capacity, or its start multiple is unknown. */
export function urzadzenieRyzykowne(nazwa: string, nieznanyRozruch: boolean): Warning {
  return {
    code: nieznanyRozruch ? "UZF-ROZRUCH-NIEZNANY" : "UZF-START-NA-PRZECIAZENIU",
    level: "warning",
    i18nKey: nieznanyRozruch ? "UZF-ROZRUCH-NIEZNANY" : "UZF-START-NA-PRZECIAZENIU",
    params: { nazwa },
    technicalMessage: `${nazwa}: ${nieznanyRozruch ? "krotnoscRozruchu = 0" : "P×k > P_ciągła"}`,
  }
}
