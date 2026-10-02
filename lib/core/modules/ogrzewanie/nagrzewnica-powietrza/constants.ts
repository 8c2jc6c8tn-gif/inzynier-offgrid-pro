/**
 * Resistive heating (heating element, electric boiler, IR panel) turns all electricity into heat: COP = 1 —
 * the same convention as `koszty-ogrzewania` (source: "COP=1").
 */
export const COP_GRZANIA_OPOROWEGO = 1

/** Hours per day — a day of heat demand cannot need more running hours than this at the entered output. */
export const GODZIN_NA_DOBE = 24
