/**
 * M14 — D2 „Która taryfa G” (dom) and F2 „Porównywarka taryf C” (firma), `03_M14_Dom_i_Firma_Siec.md`
 * §7 („Porównywarka taryf C”) and „Logika” pkt 3; opracowanie §8.7. Echo of the bill engine
 * (`rachunek-za-prad`) run once per tariff group.
 *
 * Zone hours are OSD data that the rates file does not have yet, so the user gives the split of
 * consumption per zone for each compared group (from invoices or the OSD metering portal) — the
 * app does not assume a split. Sale prices differ per group, so they are given per variant too.
 * Only ✅ tariff data is compared: a group without data is excluded, not estimated.
 * 🔎 TD22 (`dlug-techniczny.md`): zone split per group entered by the user; no invoice overrides here.
 */
import type { Grupa, Strefa } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { RachunekInput } from "../rachunek-za-prad/input"

export type WariantTaryfy = {
  grupa: Grupa
  zuzycieStrefKwh: Partial<Record<Strefa, number>>
  cenaEnergiiZlKwh: Partial<Record<Strefa, number>>
}

export type PorownanieTaryfInput = Omit<RachunekInput, "grupa" | "zuzycieStrefKwh" | "cenaEnergiiZlKwh" | "stawkiWlasne"> & {
  warianty: WariantTaryfy[]
}
