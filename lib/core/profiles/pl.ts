import { RegionalProfileSchema, type RegionalProfile } from "./types"

/**
 * Profil regionalny PL — docs/standards/02-model-danych.md, 2.1.
 * Nowy kraj = nowy plik w tym katalogu + walidacja schematem, bez zmian w jądrze.
 */
export const plProfile: RegionalProfile = RegionalProfileSchema.parse({
  id: "PL",
  name: "Polska",
  currency: "PLN",
  decimalSeparator: ",",
})
