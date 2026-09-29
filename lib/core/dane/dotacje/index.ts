/**
 * M14 — D13 „Dotacje (stan na dzień)” / F12 „Dotacje i podatki”, `03_M14_Dom_i_Firma_Siec.md` §9,
 * opracowanie §7 (Część K GOD BOOK — informacja, nie porada). Guide data, not calculator defaults:
 * 🔎 entries are allowed here only because they are shown as information with their confidence mark.
 * After `waznoscDo` an item is marked „nabór zakończony” automatically (`stanNaboru`).
 * `regulamin` stays null until the owner supplies the source (W6: NFOŚiGW server has a broken TLS chain —
 * never bypass it).
 */
export type PewnoscDotacji = "potwierdzone" | "🔎A" | "🔎B"

export type Dotacja = {
  id: string
  nazwa: string
  dotyczy: ("dom" | "firma")[]
  /** Who can apply and what we know — guide text. */
  opis: string[]
  /** Call start / end (YYYY-MM-DD); null = no call dates (e.g. a tax relief). */
  naborOd: string | null
  waznoscDo: string | null
  pewnosc: PewnoscDotacji
  /** Link to the rules; null = not read from the primary source yet. */
  regulamin: string | null
  stanNa: string
}

export const DOTACJE: Dotacja[] = [
  {
    id: "pme",
    nazwa: "Przydomowe Magazyny Energii (NFOŚiGW, następca „Mój Prąd”)",
    dotyczy: ["dom"],
    opis: [
      "Dla osób fizycznych — prosumentów przyłączonych do sieci.",
      "Część 2: nabór 4.09.2026–31.08.2027, budżet ok. 1 mld zł z Funduszu Modernizacyjnego.",
      "Do 30% kosztów kwalifikowanych; najwyżej 16 000 zł na magazyn (do 19 000 zł na punkt poboru łącznie).",
      "Magazyn co najmniej 10 kWh; koszty kwalifikowane od 1.11.2025.",
      "Dotacja jest powiązana z byciem prosumentem — odłączenie w okresie trwałości może oznaczać jej zwrot (sprawdź regulamin).",
    ],
    naborOd: "2026-09-04",
    waznoscDo: "2027-08-31",
    pewnosc: "🔎B",
    regulamin: null,
    stanNa: "2026-09-28",
  },
  {
    id: "ulga-termo",
    nazwa: "Ulga termomodernizacyjna (PIT)",
    dotyczy: ["dom"],
    opis: [
      "Dla podatników PIT — właścicieli i współwłaścicieli domu jednorodzinnego.",
      "Lista wydatków jest w rozporządzeniu; czy obejmuje magazyn energii — do odczytu z przepisu.",
    ],
    naborOd: null,
    waznoscDo: null,
    pewnosc: "🔎B",
    regulamin: null,
    stanNa: "2026-09-28",
  },
  {
    id: "fepk-02-03",
    nazwa: "Fundusze Europejskie dla Podkarpacia — nabór FEPK.02.03-IZ.00-002/26",
    dotyczy: ["firma"],
    opis: ["Program regionalny dla przedsiębiorców z Podkarpacia.", "Nabór trwał 3–31.03.2026."],
    naborOd: "2026-03-03",
    waznoscDo: "2026-03-31",
    pewnosc: "potwierdzone",
    regulamin: null,
    stanNa: "2026-09-28",
  },
]

export type StanNaboru = "trwa" | "zakonczony" | "przyszly" | "bez-terminu"

/** Call status on a given day (YYYY-MM-DD, string comparison of ISO dates). */
export function stanNaboru(d: Dotacja, dzis: string): StanNaboru {
  if (d.waznoscDo === null) return "bez-terminu"
  if (dzis > d.waznoscDo) return "zakonczony"
  if (d.naborOd !== null && dzis < d.naborOd) return "przyszly"
  return "trwa"
}
