/**
 * Country of a project (owner decision 25.11.2026): it sets the currency of the OFFICIAL amounts — grid tariffs, fees, bill
 * prices, subsidies — on the screens built on national data. Purchases keep their own currency choice (D107); the working
 * currency stays the one from Settings. Default: Poland (every project created before this field existed is Polish).
 *
 * The list covers the countries whose currency the app can convert (NBP table A, `lib/waluta/waluty.ts`), with the euro area
 * as of 2026 (Bulgaria adopted the euro on 1.01.2026 — NBP stopped publishing BGN).
 */
import type { KodWaluty } from "@/lib/waluta/waluty"

export const KRAJ_DOMYSLNY = "PL"

export const KRAJE: readonly { kod: string; waluta: KodWaluty }[] = [
  { kod: "PL", waluta: "PLN" },
  ...["AT", "BE", "BG", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"].map(
    (kod) => ({ kod, waluta: "EUR" as const }),
  ),
  { kod: "CZ", waluta: "CZK" },
  { kod: "HU", waluta: "HUF" },
  { kod: "RO", waluta: "RON" },
  { kod: "SE", waluta: "SEK" },
  { kod: "DK", waluta: "DKK" },
  { kod: "NO", waluta: "NOK" },
  { kod: "CH", waluta: "CHF" },
  { kod: "GB", waluta: "GBP" },
  { kod: "UA", waluta: "UAH" },
  { kod: "TR", waluta: "TRY" },
  { kod: "US", waluta: "USD" },
  { kod: "CA", waluta: "CAD" },
  { kod: "AU", waluta: "AUD" },
  { kod: "JP", waluta: "JPY" },
]

export function czyKodKraju(v: unknown): v is string {
  return typeof v === "string" && KRAJE.some((k) => k.kod === v)
}

export function walutaKraju(kod: string): KodWaluty {
  return KRAJE.find((k) => k.kod === kod)?.waluta ?? "PLN"
}

/**
 * Screens built on Polish tariffs, fees, laws or subsidies: the two grid tiles („Dom – sieć”, „Firma – sieć”, registry ids 15
 * and 16). They show „this screen uses Polish data” for a project abroad (`components/projekt/dotyczy-polski.tsx`).
 */
export function czyEkranDanychPolskich(ekran: string, kafle: readonly { id: number; ekrany: readonly { href: string }[] }[]): boolean {
  return kafle.some((k) => (k.id === 15 || k.id === 16) && k.ekrany.some((e) => e.href === `/kalkulatory/${ekran}`))
}
