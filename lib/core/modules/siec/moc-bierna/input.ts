/**
 * M14 — F3 „Moc bierna — opłata i kompensacja” (Wzorzec D). `03_M14_Dom_i_Firma_Siec.md` §7;
 * opracowanie §8.2 ✅ (taryfy OSD 2026: Energa pkt 4.3.6, Tauron/Stoen pkt 3.4.6):
 * - inductive surplus: `O_b = k · C_rk · (√((1+tg²φ)/(1+tg²φ₀)) − 1) · A` (✏️ K1 — with the root);
 * - capacitive energy, or inductive energy without active energy: `O_b = k · C_rk · E_b`;
 * - compensation: `Q_C = P · (tgφ − tgφ_cel)`, payback = battery cost ÷ annual `O_b`.
 * `C_rk` is the URE price valid on the tariff approval day (✏️ K2) — value 🔎, so it is always
 * the user's entry from the invoice, never a default. Only nN (k from the data file).
 */
export type MocBiernaInput = {
  /** Measured tgφ (average over the year). null = not entered; 0 is legal. */
  tgFi: number | null
  /** tgφ₀ from the contract; default 0,4 from the data, never below 0,2. */
  tgFi0: number
  /** Active energy drawn A [kWh/year]. 0 = not entered. */
  energiaCzynnaKwh: number
  /** C_rk [zł/kWh] from the invoice; null = not entered (🔎, no default). */
  cRkZlKwh: number | null
  /** Capacitive reactive energy E_b [kvarh/year] (overcompensation); 0 = none. */
  energiaPojemnosciowaKvarh: number
  /** Compensation: average active power in working time [kW]; 0 = not calculated. */
  mocCzynnaSredniaKw: number
  /** Target tgφ after compensation (user's choice, below tgφ₀). null = not calculated. */
  tgFiCel: number | null
  /** Cost of the capacitor bank [zł]; 0 = no payback calculation. */
  kosztBateriiZl: number
}
