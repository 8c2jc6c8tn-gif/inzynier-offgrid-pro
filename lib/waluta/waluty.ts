/**
 * Currencies the user can display money in. The engine and the data files (tariffs, fees) stay
 * in PLN — those are Polish legal rates; the chosen currency only changes how a result is shown
 * (convert at the display boundary). `automatyczny: false` = not published by the ECB feed, so a
 * manual rate is the only source.
 */
export const WALUTA_BAZOWA = "PLN"

export const WALUTY = [
  { kod: "PLN", automatyczny: true },
  { kod: "EUR", automatyczny: true },
  { kod: "USD", automatyczny: true },
  { kod: "GBP", automatyczny: true },
  { kod: "CHF", automatyczny: true },
  { kod: "CZK", automatyczny: true },
  { kod: "SEK", automatyczny: true },
  { kod: "NOK", automatyczny: true },
  { kod: "DKK", automatyczny: true },
  { kod: "HUF", automatyczny: true },
  { kod: "RON", automatyczny: true },
  { kod: "BGN", automatyczny: true },
  { kod: "CAD", automatyczny: true },
  { kod: "AUD", automatyczny: true },
  { kod: "JPY", automatyczny: true },
  { kod: "TRY", automatyczny: true },
  { kod: "UAH", automatyczny: false },
] as const

export type KodWaluty = (typeof WALUTY)[number]["kod"]

export function czyKodWaluty(v: string | null | undefined): v is KodWaluty {
  return !!v && WALUTY.some((w) => w.kod === v)
}
