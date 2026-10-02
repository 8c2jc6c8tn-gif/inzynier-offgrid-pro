import type { Warning } from "@/lib/core/calc-result"

const r2 = (x: number) => Math.round(x * 100) / 100

/** 🟡 After the change the design heat demand exceeds the pump's rated power. */
export function pompaZaMala(zapotrzebowanie: number, moc: number): Warning {
  return {
    code: "WPC-POMPA-ZA-MALA",
    level: "warning",
    params: { zapotrzebowanie: r2(zapotrzebowanie), moc: r2(moc) },
    technicalMessage: `zapotrzebowanie po zmianie ${zapotrzebowanie} kW > moc pompy ${moc} kW`,
    field: "mocPompyKw",
  }
}

/** 🟡 The limited power does not cover the design demand (source: „Zbyt duże ograniczenie to chłodny dom”). */
export function ograniczenieDeficyt(moc: number, zapotrzebowanie: number, brak: number): Warning {
  return {
    code: "WPC-OGRANICZENIE-DEFICYT",
    level: "warning",
    params: { moc: r2(moc), zapotrzebowanie: r2(zapotrzebowanie), brak: r2(brak) },
    technicalMessage: `moc po ograniczeniu ${moc} kW < zapotrzebowanie ${zapotrzebowanie} kW`,
    field: "ograniczeniePct",
  }
}

/** 🟡 The pump's electrical draw exceeds the inverter power (source 5.98: „uniknąć przeciążenia falownika”). */
export function falownikPrzeciazony(pobor: number, moc: number, falownik: number): Warning {
  return {
    code: "WPC-FALOWNIK-PRZECIAZONY",
    level: "warning",
    params: { pobor: r2(pobor), moc: r2(moc), falownik: r2(falownik) },
    technicalMessage: `pobór ${pobor} kW przy mocy cieplnej ${moc} kW > falownik ${falownik} kW`,
    field: "mocFalownikaKw",
  }
}

/** 🟡 A borehole variant covers less than the pump power (same W/m index as Screen 5.42). */
export function odwiertyZaMalo(wariant: string, moc: number, pompa: number): Warning {
  return {
    code: "WPC-ODWIERTY-ZA-MALO",
    level: "warning",
    params: { wariant, moc: r2(moc), pompa: r2(pompa) },
    technicalMessage: `wariant ${wariant}: ${moc} kW < pompa ${pompa} kW`,
    field: wariant === "A" ? "glebokoscAM" : "glebokoscBM",
  }
}

/** ℹ️ Load at or above the pump power — the compressor runs continuously, no cycling. */
export function buforPracaCiagla(): Warning {
  return {
    code: "WPC-BUFOR-PRACA-CIAGLA",
    level: "info",
    technicalMessage: "obciążenie >= moc pompy: praca ciągła, brak startów do policzenia",
    field: "obciazenieKw",
  }
}
