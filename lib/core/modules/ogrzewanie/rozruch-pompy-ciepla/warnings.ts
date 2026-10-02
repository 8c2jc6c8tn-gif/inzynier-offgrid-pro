import type { Warning } from "@/lib/core/calc-result"

const r2 = (x: number) => Math.round(x * 100) / 100

/** 🟡 The start (plus other loads) exceeds the source's surge/maximum power (source alert: „nie udźwignie”). */
export function startPonadSzczyt(start: number, szczyt: number, softstart: boolean): Warning {
  const code = softstart ? "ROZ-SOFTSTART-PONAD-SZCZYT" : "ROZ-START-PONAD-SZCZYT"
  return {
    code,
    level: "warning",
    params: { start: r2(start), szczyt: r2(szczyt) },
    technicalMessage: `${softstart ? "softstart" : "rozruch"} ${start} kVA > szczyt ${szczyt} kW`,
    field: softstart ? "pradSoftstartA" : "pradRozruchuA",
  }
}

/** ℹ️ Without a soft starter the start does not fit, with it it does — the source's advice („Zastosuj softstart”). */
export function softstartWystarczy(start: number, szczyt: number): Warning {
  return {
    code: "ROZ-SOFTSTART-WYSTARCZY",
    level: "info",
    params: { start: r2(start), szczyt: r2(szczyt) },
    technicalMessage: `softstart ${start} kVA <= szczyt ${szczyt} kW`,
    field: "pradSoftstartA",
  }
}

/** 🟡 Running draw plus other loads exceeds the continuous/rated power. */
export function pracaPonadMoc(praca: number, moc: number): Warning {
  return {
    code: "ROZ-PRACA-PONAD-MOC",
    level: "warning",
    params: { praca: r2(praca), moc: r2(moc) },
    technicalMessage: `praca ${praca} kW > moc ciągła ${moc} kW`,
    field: "mocCiaglaKw",
  }
}
