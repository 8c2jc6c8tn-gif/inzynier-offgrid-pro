import { z } from "zod"

/**
 * Schemat profilu regionalnego — docs/standards/02-model-danych.md, 2.1.
 * Wszystko zależne od kraju/regionu żyje tutaj jako dane, nie jako `if (kraj === 'PL')`
 * rozsypane po kodzie. Start: pola minimalne faktycznie potrzebne dzisiejszym kalkulatorom.
 * Nie domyślaj/nie wymyślaj pól "na zapas" — dogrywane w miarę potrzeb kolejnych modułów
 * (docs/standards/15-wspolpraca-z-ai.md, 15.7: "nie wiem" zamiast wymyślania).
 */
export const RegionalProfileSchema = z.object({
  /** Identyfikator profilu, np. "PL". */
  id: z.string().min(1),
  name: z.string().min(1),
  /** Kod waluty ISO 4217, np. "PLN". */
  currency: z.string().length(3),
  /** Separator dziesiętny używany w prezentacji liczb. */
  decimalSeparator: z.enum([",", "."]),
})

export type RegionalProfile = z.infer<typeof RegionalProfileSchema>
