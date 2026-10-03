import { z } from "zod"
import { WIELKOSCI_LISTA } from "./probka"

/** Persisted shapes of the source registry and saved CSV profiles (validated on read — storage is untrusted). */
export const KonfiguracjaZrodlaSchema = z.object({
  id: z.string().min(1),
  nazwa: z.string().min(1),
  typ: z.enum(["csv", "symulator", "http", "web-serial", "web-bluetooth", "mqtt-ws"]),
  ustawienia: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  demo: z.boolean(),
})

const Adres = z.union([z.string().min(1), z.number().int().nonnegative()])

export const ProfilCsvSchema = z.object({
  kolumnaCzasu: Adres,
  formatCzasu: z.enum(["iso", "epoch-s", "epoch-ms", "data-godzina", "dmy"]),
  kolumnaGodziny: Adres.optional(),
  przesuniecieMin: z.number().int().min(-720).max(840).optional(),
  bezNaglowka: z.boolean().optional(),
  znacznikiBraku: z.array(z.string()).optional(),
  kolumny: z
    .array(
      z.object({
        kolumna: Adres,
        kanal: z.string().min(1),
        wielkosc: z.enum(WIELKOSCI_LISTA as [string, ...string[]]),
        jednostka: z.string().min(1),
      }),
    )
    .min(1),
})

export const ZapisanyProfilSchema = z.object({ id: z.string().min(1), nazwa: z.string().min(1), profil: ProfilCsvSchema })

export const RejestrSchema = z.object({
  wersja: z.literal(1),
  zrodla: z.array(KonfiguracjaZrodlaSchema),
  profile: z.array(ZapisanyProfilSchema),
})

export type Rejestr = z.infer<typeof RejestrSchema>
export const pustyRejestr = (): Rejestr => ({ wersja: 1, zrodla: [], profile: [] })

/** Upserts by id, returning a new registry (pure). */
export function zapiszZrodlo(r: Rejestr, z: Rejestr["zrodla"][number]): Rejestr {
  return { ...r, zrodla: [...r.zrodla.filter((x) => x.id !== z.id), z] }
}
export function usunZrodloZRejestru(r: Rejestr, id: string): Rejestr {
  return { ...r, zrodla: r.zrodla.filter((x) => x.id !== id) }
}
export function zapiszProfil(r: Rejestr, p: Rejestr["profile"][number]): Rejestr {
  return { ...r, profile: [...r.profile.filter((x) => x.id !== p.id), p] }
}
export function usunProfil(r: Rejestr, id: string): Rejestr {
  return { ...r, profile: r.profile.filter((x) => x.id !== id) }
}
