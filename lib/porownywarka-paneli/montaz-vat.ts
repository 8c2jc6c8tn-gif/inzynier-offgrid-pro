/**
 * Installation line of the printed offer (spec 53): the net price of mounting and connecting, a VAT rate and the resulting VAT and
 * gross amount. Both numbers are typed by the user — the app knows neither the labour price nor the rate that applies to the job,
 * so an empty rate gives the net amount only. The amount is NOT added to the panel and accessory prices of the comparison table
 * (the app does not know whether those were typed net or gross).
 */
export type MontazZVat = {
  nettoKwota: number
  /** `null` = no rate typed: only the net amount is shown. */
  vatPct: number | null
  vatKwota: number | null
  bruttoKwota: number | null
}

export type WynikMontazu = { rodzaj: "brak" } | { rodzaj: "blad" } | { rodzaj: "ok"; montaz: MontazZVat }

/** Money to whole grosz, half away from zero (what an invoice does). */
const grosz = (x: number): number => Math.round((x + Number.EPSILON) * 100) / 100

const liczba = (s: string | undefined): number | null | "blad" => {
  const t = (s ?? "").trim().replace(",", ".")
  if (t === "") return null
  const x = Number(t)
  return Number.isFinite(x) ? x : "blad"
}

/** `brak` — nothing typed (the section is left out); `blad` — a number is not valid (the section is left out, the screen says why). */
export function policzMontaz(nettoTekst: string | undefined, vatTekst: string | undefined): WynikMontazu {
  const netto = liczba(nettoTekst)
  const vat = liczba(vatTekst)
  if (netto === "blad" || vat === "blad") return { rodzaj: "blad" }
  if (netto === null) return { rodzaj: "brak" }
  if (netto < 0 || (vat !== null && (vat < 0 || vat > 100))) return { rodzaj: "blad" }
  const nettoKwota = grosz(netto)
  if (vat === null) return { rodzaj: "ok", montaz: { nettoKwota, vatPct: null, vatKwota: null, bruttoKwota: null } }
  const vatKwota = grosz((nettoKwota * vat) / 100)
  return { rodzaj: "ok", montaz: { nettoKwota, vatPct: vat, vatKwota, bruttoKwota: grosz(nettoKwota + vatKwota) } }
}
