import { pustyRejestr, RejestrSchema, type Rejestr } from "@/lib/core/telemetria/rejestr"
import type { StorageAdapter } from "../storage-adapter"

export const KLUCZ_REJESTRU = "telemetria-rejestr"

/** Loads the registry; corrupt or foreign data yields an empty registry plus a flag, never a crash. */
export async function wczytajRejestr(magazyn: StorageAdapter): Promise<{ rejestr: Rejestr; uszkodzony: boolean }> {
  const surowy = await magazyn.getItem<unknown>(KLUCZ_REJESTRU)
  if (surowy === null || surowy === undefined) return { rejestr: pustyRejestr(), uszkodzony: false }
  const r = RejestrSchema.safeParse(surowy)
  return r.success ? { rejestr: r.data, uszkodzony: false } : { rejestr: pustyRejestr(), uszkodzony: true }
}

export async function zapiszRejestr(magazyn: StorageAdapter, r: Rejestr): Promise<void> {
  await magazyn.setItem(KLUCZ_REJESTRU, r)
}
