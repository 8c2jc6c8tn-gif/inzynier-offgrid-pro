import type { Warning } from "@/lib/core/calc-result"

const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Source 5.27: „Pompa 5 kW nie wystarczy – potrzebujesz 8 kW lub grzałki awaryjnej”. Level by owner decision D71
 * (02.10.2026): 🔴 only when the house has no backup heat source (`maDogrzew === false`), otherwise 🟡 — with a backup
 * source, and while it is unknown (null), the deficit is a warning, not a stop.
 */
export function deficytMocy(brak: number, zapotrzebowanie: number, moc: number, maDogrzew: boolean | null): Warning {
  return {
    code: "DMP-DEFICYT",
    level: maDogrzew === false ? "critical" : "warning",
    params: { brak: r2(brak), zapotrzebowanie: r2(zapotrzebowanie), moc: r2(moc) },
    technicalMessage: `moc pompy przy θe ${moc} kW < zapotrzebowanie ${zapotrzebowanie} kW, dogrzew: ${
      maDogrzew === null ? "nieznany" : maDogrzew ? "jest" : "brak"
    }`,
    field: "mocPompyProjKw",
  }
}

/** ℹ️ Deficit with the backup-heat question unanswered — the level (🟡 vs 🔴) depends on it. */
export function dogrzewNieznany(): Warning {
  return {
    code: "DMP-DOGRZEW-NIEZNANY",
    level: "info",
    technicalMessage: "deficyt mocy, maDogrzew = null — poziom zależy od dogrzewu",
    field: "maDogrzew",
  }
}

/** ℹ️ Margin over the design load — no oversizing threshold in the source, only the number and its consequence. */
export function zapasMocy(pct: number): Warning {
  return {
    code: "DMP-ZAPAS",
    level: "info",
    params: { pct: r2(pct) },
    technicalMessage: `przewymiarowanie ${pct}% przy θe`,
    field: "mocPompyProjKw",
  }
}

/** ℹ️ The balance point lies outside the two datasheet points — the straight line is extrapolated. */
export function biwalentnyEkstrapolacja(): Warning {
  return {
    code: "DMP-BIWALENTNY-EKSTRAPOLACJA",
    level: "info",
    technicalMessage: "punkt biwalentny poza przedziałem dwóch punktów karty",
    field: "tDrugiC",
  }
}

/** Input check: θi must be above θe and the two datasheet points must differ in temperature. */
export function temperaturyPozaZakresem(field: string, opis: string): Warning {
  return {
    code: "DMP-TEMPERATURY-POZA-ZAKRESEM",
    level: "critical",
    technicalMessage: opis,
    field,
  }
}
