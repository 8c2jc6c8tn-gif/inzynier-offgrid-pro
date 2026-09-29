/**
 * M14 — guide content of the shared „Przejście” screens D9/F9 (risk register) and D10/F10
 * (procedure), `03_M14_Dom_i_Firma_Siec.md` §5, opracowanie §5.1–5.2 (expert knowledge; confidence per
 * item as in the source table). Text in `lib/i18n/ui/m14-przejscie.ts` (PL/EN/RU); `tytul`, `skutek`,
 * `pomoc`, `opis`, `firma` and `link.etykieta` here are translation keys (`t()`).
 */
export type Pewnosc = "✅" | "🔎A" | "🔎B"

export type Ryzyko = {
  id: string
  tytul: string
  skutek: string
  pomoc: string
  link?: { href: string; etykieta: string }
  pewnosc: Pewnosc
  tylkoFirma?: boolean
}

export const RYZYKA: Ryzyko[] = [
  { id: "R1", tytul: "UI-RYZ-R1-T", skutek: "UI-RYZ-R1-S", pomoc: "UI-RYZ-R1-P", link: { href: "/kalkulatory/rezygnacja-z-przylacza", etykieta: "UI-RYZ-R1-L" }, pewnosc: "✅" },
  { id: "R2", tytul: "UI-RYZ-R2-T", skutek: "UI-RYZ-R2-S", pomoc: "UI-RYZ-R2-P", link: { href: "/kalkulatory/zima-bez-sieci", etykieta: "UI-RYZ-R2-L" }, pewnosc: "✅" },
  { id: "R3", tytul: "UI-RYZ-R3-T", skutek: "UI-RYZ-R3-S", pomoc: "UI-RYZ-R3-P", link: { href: "/kalkulatory/analiza-spof", etykieta: "UI-RYZ-R3-L" }, pewnosc: "✅" },
  { id: "R4", tytul: "UI-RYZ-R4-T", skutek: "UI-RYZ-R4-S", pomoc: "UI-RYZ-R4-P", pewnosc: "✅" },
  { id: "R5", tytul: "UI-RYZ-R5-T", skutek: "UI-RYZ-R5-S", pomoc: "UI-RYZ-R5-P", link: { href: "/kalkulatory/cop-pompy-ciepla", etykieta: "UI-RYZ-R5-L" }, pewnosc: "✅" },
  { id: "R6", tytul: "UI-RYZ-R6-T", skutek: "UI-RYZ-R6-S", pomoc: "UI-RYZ-R6-P", pewnosc: "🔎B" },
  { id: "R7", tytul: "UI-RYZ-R7-T", skutek: "UI-RYZ-R7-S", pomoc: "UI-RYZ-R7-P", link: { href: "/kalkulatory/audyt-pozarowy", etykieta: "UI-RYZ-R7-L" }, pewnosc: "🔎A" },
  { id: "R8", tytul: "UI-RYZ-R8-T", skutek: "UI-RYZ-R8-S", pomoc: "UI-RYZ-R8-P", link: { href: "/kalkulatory/agregat-jako-zapas", etykieta: "UI-RYZ-R8-L" }, pewnosc: "✅" },
  { id: "R9", tytul: "UI-RYZ-R9-T", skutek: "UI-RYZ-R9-S", pomoc: "UI-RYZ-R9-P", link: { href: "/kalkulatory/depozyt-prosumencki", etykieta: "UI-RYZ-R9-L" }, pewnosc: "🔎B" },
  { id: "R10", tytul: "UI-RYZ-R10-T", skutek: "UI-RYZ-R10-S", pomoc: "UI-RYZ-R10-P", pewnosc: "🔎B" },
  { id: "RF1", tytul: "UI-RYZ-RF1-T", skutek: "UI-RYZ-RF1-S", pomoc: "UI-RYZ-RF1-P", link: { href: "/kalkulatory/scenariusze-firma", etykieta: "UI-RYZ-RF1-L" }, pewnosc: "✅", tylkoFirma: true },
  { id: "RF2", tytul: "UI-RYZ-RF2-T", skutek: "UI-RYZ-RF2-S", pomoc: "UI-RYZ-RF2-P", link: { href: "/kalkulatory/rezygnacja-z-przylacza", etykieta: "UI-RYZ-RF2-L" }, pewnosc: "🔎B", tylkoFirma: true },
  { id: "RF3", tytul: "UI-RYZ-RF3-T", skutek: "UI-RYZ-RF3-S", pomoc: "UI-RYZ-RF3-P", pewnosc: "🔎B", tylkoFirma: true },
]

export type KrokProcedury = { id: string; tytul: string; opis: string; odwracalny: boolean; firma?: string }

export const PROCEDURA: KrokProcedury[] = [
  { id: "P1", tytul: "UI-PROC-P1-T", opis: "UI-PROC-P1-O", odwracalny: true },
  { id: "P2", tytul: "UI-PROC-P2-T", opis: "UI-PROC-P2-O", odwracalny: true },
  { id: "P3", tytul: "UI-PROC-P3-T", opis: "UI-PROC-P3-O", odwracalny: true, firma: "UI-PROC-P3-F" },
  { id: "P4", tytul: "UI-PROC-P4-T", opis: "UI-PROC-P4-O", odwracalny: true },
  { id: "P5", tytul: "UI-PROC-P5-T", opis: "UI-PROC-P5-O", odwracalny: false },
  { id: "P6", tytul: "UI-PROC-P6-T", opis: "UI-PROC-P6-O", odwracalny: false },
  { id: "P7", tytul: "UI-PROC-P7-T", opis: "UI-PROC-P7-O", odwracalny: false },
]
