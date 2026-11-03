/**
 * Entries of the "Project outlook" section (`app/perspektywy`): technologies and patents with an energy and cost
 * calculation. The full calculation, the assumptions and the origin of each number live in
 * `docs/perspektywy-projektow.md` (entry P-xxx); the page shows a short version of it, texts under `UI-PERSP-*`
 * keys (`lib/i18n/ui/perspektywy.ts`). A new entry = an object here, its keys in the three languages, and a page
 * `app/perspektywy/<id>/page.tsx` that renders it (a test checks all three).
 */
export type ZrodloPerspektywy = { nazwa: string; href: string }

export type SekcjaPerspektywy = {
  /** Key of the section heading. */
  naglowek: string
  /** Keys of the paragraphs or list items of the section. */
  punkty: string[]
  /** true = bulleted list, false = paragraphs. */
  lista: boolean
}

export type WpisPerspektywy = {
  id: string
  /** Entry number in `docs/perspektywy-projektow.md`. */
  numerWDokumencie: string
  /** Date of the assessment (ISO). */
  data: string
  tytul: string
  /** Short description for the index. */
  karta: string
  /** Verdict in a few words. */
  ocena: string
  lead: string
  sekcje: SekcjaPerspektywy[]
  /** Key of the sentence above the source list. */
  zrodlaOpis: string
  zrodla: ZrodloPerspektywy[]
}

export const WPISY_PERSPEKTYW: WpisPerspektywy[] = [
  {
    id: "aircela",
    numerWDokumencie: "P-001",
    data: "2026-11-03",
    tytul: "UI-PERSP-AIRCELA-TYTUL",
    karta: "UI-PERSP-AIRCELA-KARTA",
    ocena: "UI-PERSP-AIRCELA-OCENA",
    lead: "UI-PERSP-AIRCELA-LEAD",
    sekcje: [
      {
        naglowek: "UI-PERSP-H-JAK",
        punkty: ["UI-PERSP-AIRCELA-JAK-1", "UI-PERSP-AIRCELA-JAK-2", "UI-PERSP-AIRCELA-JAK-3", "UI-PERSP-AIRCELA-JAK-4"],
        lista: true,
      },
      {
        naglowek: "UI-PERSP-H-DEKLARACJE",
        punkty: ["UI-PERSP-AIRCELA-DEKL-1", "UI-PERSP-AIRCELA-DEKL-2", "UI-PERSP-AIRCELA-DEKL-3"],
        lista: true,
      },
      {
        naglowek: "UI-PERSP-H-BILANS",
        punkty: [
          "UI-PERSP-AIRCELA-BILANS-1",
          "UI-PERSP-AIRCELA-BILANS-2",
          "UI-PERSP-AIRCELA-BILANS-3",
          "UI-PERSP-AIRCELA-BILANS-4",
        ],
        lista: true,
      },
      {
        naglowek: "UI-PERSP-H-RYNKI",
        punkty: [
          "UI-PERSP-AIRCELA-RYNKI-WSTEP",
          "UI-PERSP-AIRCELA-RYNKI-PL",
          "UI-PERSP-AIRCELA-RYNKI-NO",
          "UI-PERSP-AIRCELA-RYNKI-NL",
          "UI-PERSP-AIRCELA-RYNKI-WNIOSEK",
        ],
        lista: false,
      },
      {
        naglowek: "UI-PERSP-H-OFFGRID",
        punkty: ["UI-PERSP-AIRCELA-OFFGRID-1", "UI-PERSP-AIRCELA-OFFGRID-2"],
        lista: false,
      },
    ],
    zrodlaOpis: "UI-PERSP-AIRCELA-ZRODLA-OPIS",
    zrodla: [
      { nazwa: "PopSci", href: "https://www.popsci.com/environment/aircela-gasoline-machine/" },
      {
        nazwa: "The Autopian",
        href: "https://www.theautopian.com/a-company-wants-to-sell-you-a-small-machine-to-make-gasoline-out-of-air/",
      },
      { nazwa: "Dezeen", href: "https://www.dezeen.com/2025/06/04/aircela-air-to-fuel-technology/" },
      { nazwa: "DOE AFDC", href: "https://afdc.energy.gov/fuels/properties" },
      { nazwa: "fuel-prices.eu (Netherlands)", href: "https://www.fuel-prices.eu/Netherlands/26-10-2026/" },
      { nazwa: "fuel-prices.eu (Norway)", href: "https://www.fuel-prices.eu/Norway/26-10-2026/" },
    ],
  },
]

export function znajdzWpisPerspektywy(id: string): WpisPerspektywy | undefined {
  return WPISY_PERSPEKTYW.find((w) => w.id === id)
}

/** Every `UI-PERSP-*` key an entry uses (for the translation test). */
export function kluczeWpisu(wpis: WpisPerspektywy): string[] {
  return [wpis.tytul, wpis.karta, wpis.ocena, wpis.lead, wpis.zrodlaOpis, ...wpis.sekcje.flatMap((s) => [s.naglowek, ...s.punkty])]
}
